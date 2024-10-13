import fetch from 'node-fetch';

let handler = async (m, { conn, command, args }) => {
    try {
        let user = global.db.data.users[m.sender];

        // Verificar si el usuario está registrado
        if (!user.registered) {
            conn.reply(m.chat, 'Por favor, regístrate usando el comando `.reg nombre.edad` antes de usar este comando.', m);
            return;
        }

        // Comando .waifu para mostrar la waifu con un código único
        if (command === 'waifu') {
            let res = await fetch('https://api.waifu.pics/sfw/waifu');
            if (!res.ok) return;
            let json = await res.json();
            if (!json.url) return;

            let waifuPrice = obtenerPrecioAleatorio(); // Precio aleatorio de 10, 15, o 20 créditos
            let waifuCode = generarCodigoUnico(); // Generar un código único para la waifu

            // Verificar si el código ya está ocupado
            if (global.db.data.waifus && global.db.data.waifus[waifuCode]) {
                conn.reply(m.chat, 'Hubo un problema al generar el código. Inténtalo de nuevo.', m);
                return;
            }

            // Guardar la waifu con su código y precio en la base de datos global
            global.db.data.waifus = global.db.data.waifus || {};
            global.db.data.waifus[waifuCode] = {
                url: json.url,
                price: waifuPrice,
                owner: null // Aún no comprada
            };

            // Enviar la waifu con su código y precio
            await conn.sendFile(m.chat, json.url, 'waifu.jpg', `Aquí tienes una waifu con el código ${waifuCode}.\n\nPuedes comprarla por ${waifuPrice} créditos usando el comando \`.comprarw ${waifuCode}\``, m);

            return;
        }

        // Comando .comprarw seguido del código para comprar la waifu
        if (command === 'comprarw') {
            let waifuCode = args[0];

            // Verificar si el código es válido y si la waifu existe
            if (!global.db.data.waifus || !global.db.data.waifus[waifuCode]) {
                conn.reply(m.chat, 'No existe ninguna waifu con ese código.', m);
                return;
            }

            let waifu = global.db.data.waifus[waifuCode];

            // Verificar si la waifu ya ha sido comprada
            if (waifu.owner) {
                conn.reply(m.chat, 'Esta waifu ya ha sido comprada por alguien más.', m);
                return;
            }

            let waifuPrice = waifu.price;

            // Verificar si el usuario tiene suficientes créditos
            if (user.limit < waifuPrice) {
                conn.reply(m.chat, `No tienes suficientes créditos para comprar esta waifu. Necesitas ${waifuPrice} créditos.`, m);
                return;
            }

            // Restar créditos y agregar waifu al inventario del usuario
            user.limit -= waifuPrice;
            user.waifus = user.waifus || [];
            user.waifus.push(waifu.url); // Almacenar la URL de la waifu en la base de datos del usuario

            // Confirmar compra y actualizar la propiedad de la waifu
            waifu.owner = m.sender; // Marcar que el usuario actual es el dueño
            conn.reply(m.chat, `Has comprado la waifu con el código ${waifuCode} por ${waifuPrice} créditos. Usa el comando .miswaifus para ver tus waifus.`, m);
        }

    } catch (e) {
        console.log(e);
        conn.reply(m.chat, 'Hubo un error al procesar tu solicitud.', m);
    }
};

// Función para obtener un precio aleatorio de compra (10, 15, o 20 créditos)
function obtenerPrecioAleatorio() {
    const precios = [10, 15, 20];
    return precios[Math.floor(Math.random() * precios.length)];
}

// Función para generar un código único para la waifu
function generarCodigoUnico() {
    return Math.floor(1000 + Math.random() * 9000).toString(); // Código de 4 dígitos aleatorio
}

handler.help = ['waifu', 'comprarw [código]', 'miswaifus', 'venderwaifu [número]'];
handler.tags = ['img', 'econ'];
handler.command = /^(waifu|comprarw|miswaifus|venderwaifu)$/i;
handler.register = true;

export default handler;
