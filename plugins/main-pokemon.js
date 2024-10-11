import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, command, args }) => {
    try {
        let user = global.db.data.users[m.sender];

        // Verificar si el usuario está registrado
        if (!user.registered) {
            conn.reply(m.chat, 'Por favor, regístrate usando el comando `.reg nombre.edad` antes de usar este comando.', m);
            return;
        }

        // Comando .pokemon nombre
        if (command === 'pokemon') {
            let pokemonName = args.join(' ').toLowerCase();
            if (!pokemonName) {
                conn.reply(m.chat, 'Por favor, proporciona el nombre de un Pokémon. Ejemplo: `.pokemon Pikachu`', m);
                return;
            }

            let res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
            if (!res.ok) {
                conn.reply(m.chat, 'No se encontró el Pokémon. Verifica el nombre y vuelve a intentarlo.', m);
                return;
            }

            let pokemon = await res.json();
            let poderTotal = pokemon.stats.reduce((total, stat) => total + stat.base_stat, 0);
            let precioCompra = calcularPrecioCompra(poderTotal);

            let statsMessage = pokemon.stats.map(stat => 
                `*${stat.stat.name.replace('-', ' ')}:* ${stat.base_stat}`
            ).join('\n');

            conn.sendFile(m.chat, pokemon.sprites.front_default, 'pokemon.jpg', 
                `*Nombre:* ${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}\n` +
                `*Poder Total:* ${poderTotal}\n` +
                `*Precio de Compra:* ${precioCompra} Fenixcoins\n\n` +
                `Estadísticas:\n${statsMessage}\n\n` +
                `.comprarpokemon ${pokemon.name}`, m
            );
        }

        // Comando .comprarpokemon nombre
        if (command === 'comprarpokemon') {
            let pokemonName = args.join(' ').toLowerCase();
            if (!pokemonName) {
                conn.reply(m.chat, 'Por favor, proporciona el nombre de un Pokémon. Ejemplo: `.comprarpokemon Pikachu`', m);
                return;
            }

            let res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
            if (!res.ok) {
                conn.reply(m.chat, 'No se encontró el Pokémon. Verifica el nombre y vuelve a intentarlo.', m);
                return;
            }

            let pokemon = await res.json();
            let poderTotal = pokemon.stats.reduce((total, stat) => total + stat.base_stat, 0);
            let precioCompra = calcularPrecioCompra(poderTotal);

            if (user.limit < precioCompra) {
                conn.reply(m.chat, `No tienes suficientes Fenixcoins para comprar este Pokémon. Necesitas ${precioCompra} Fenixcoins.`, m);
                return;
            }

            user.limit -= precioCompra;
            user.pokemons = user.pokemons || [];
            user.pokemons.push({
                name: pokemon.name,
                power: poderTotal,
                sprite: pokemon.sprites.front_default
            });

            conn.sendFile(m.chat, pokemon.sprites.front_default, 'pokemon.jpg',
                `¡Has comprado un Pokémon!\n` +
                `*Nombre:* ${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}\n` +
                `*Poder Total:* ${poderTotal}\n` +
                `*Precio de Compra:* ${precioCompra} Fenixcoins\n\n` +
                `Usa \`.mipokemon\` para ver tus Pokémon`, m
            );
        }

        // Comando .venderpokemon
        if (command === 'venderpokemon') {
            let pokemonIndex = parseInt(args[0]) - 1;
            if (isNaN(pokemonIndex) || pokemonIndex < 0 || pokemonIndex >= (user.pokemons || []).length) {
                conn.reply(m.chat, 'Elige un Pokémon válido para vender. Usa `.mipokemon` para ver tus Pokémon.', m);
                return;
            }

            let pokemon = user.pokemons[pokemonIndex];
            let precioCompra = calcularPrecioCompra(pokemon.power);
            let precioVenta = calcularPrecioVenta(precioCompra);

            user.limit += precioVenta;
            user.pokemons.splice(pokemonIndex, 1);

            conn.reply(m.chat, `¡Venta exitosa! Has vendido a ${pokemon.name} por ${precioVenta} Fenixcoins.`, m);
        }

        // Comando .mipokemon
        if (command === 'mipokemon') {
            if (!user.pokemons || user.pokemons.length === 0) {
                conn.reply(m.chat, 'No tienes ningún Pokémon. Compra uno con el comando `.comprarpokemon nombre`.', m);
                return;
            }

            let pokemonList = user.pokemons.map((p, i) => 
                `${i + 1}. **${p.name}**\n` +
                `**Poder:** ${p.power}\n` +
                `**Foto:**\n${p.sprite}`
            ).join('\n\n');

            conn.reply(m.chat, `Estos son tus Pokémon:\n\n${pokemonList}`, m);
        }

        // Comando .regalarpokemon @user nombre
        if (command === 'regalarpokemon') {
            let targetUserJid = m.mentionedJid[0];
            let pokemonName = args.slice(1).join(' ').toLowerCase();

            if (!targetUserJid) {
                conn.reply(m.chat, 'Por favor, menciona a un usuario al que quieras regalar el Pokémon. Ejemplo: `.regalarpokemon @usuario Pikachu`', m);
                return;
            }

            if (!pokemonName) {
                conn.reply(m.chat, 'Por favor, proporciona el nombre del Pokémon que deseas regalar. Ejemplo: `.regalarpokemon @usuario Pikachu`', m);
                return;
            }

            let pokemonIndex = (user.pokemons || []).findIndex(p => p.name.toLowerCase() === pokemonName);
            if (pokemonIndex === -1) {
                conn.reply(m.chat, 'No tienes ese Pokémon en tu inventario.', m);
                return;
            }

            let pokemon = user.pokemons[pokemonIndex];
            let recipient = global.db.data.users[targetUserJid];

            if (!recipient) {
                conn.reply(m.chat, 'El usuario al que intentas regalar el Pokémon no está registrado.', m);
                return;
            }

            user.pokemons.splice(pokemonIndex, 1);
            recipient.pokemons = recipient.pokemons || [];
            recipient.pokemons.push(pokemon);

            conn.reply(m.chat, `¡Has regalado a ${pokemon.name} a ${await conn.getName(targetUserJid)}!`, m);
        }

    } catch (e) {
        console.log(e);
        conn.reply(m.chat, 'Hubo un error al procesar tu solicitud.', m);
    }
};

// Función para calcular el precio de compra basado en el rango de poder
function calcularPrecioCompra(poder) {
    if (poder >= 900) return 4000; // 4000 Fenixcoins
    if (poder >= 800) return 1800; // 1800 Fenixcoins
    if (poder >= 700) return 1200; // 1200 Fenixcoins
    if (poder >= 600) return 900;  // 900 Fenixcoins
    if (poder >= 500) return 600;  // 600 Fenixcoins
    if (poder >= 400) return 490;  // 490 Fenixcoins
    if (poder >= 300) return 290;  // 290 Fenixcoins
    if (poder >= 200) return 120;  // 120 Fenixcoins
    if (poder >= 100) return 50;   // 50 Fenixcoins
    return 0; // Sin precio si está fuera de los rangos
}

// Función para calcular el precio de venta basado en el precio de compra
function calcularPrecioVenta(precioCompra) {
    // Ajuste del precio de venta como un porcentaje del precio de compra
    let incrementoVenta = 0.20; // Incremento del 20% sobre el precio de compra
    return Math.floor(precioCompra * (1 + incrementoVenta));
}

handler.help = ['pokemon', 'comprarpokemon', 'venderpokemon [número]', 'mipokemon', 'regalarpokemon @user nombre'];
handler.tags = ['pokemon'];
handler.command = /^(pokemon|comprarpokemon|venderpokemon|mipokemon|regalarpokemon)$/i;
handler.register = true;

export default handler;
