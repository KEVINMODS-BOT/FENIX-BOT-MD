import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, command, args }) => {
    try {
        let user = global.db.data.users[m.sender];

        // Verificar si el usuario está registrado
        if (!user.registered) {
            conn.reply(m.chat, 'Por favor, regístrate usando el comando `.reg nombre.edad` antes de usar este comando.', m);
            return;
        }

        // Comando para cazar animales mitológicos
        if (command === 'magicaventur') {
            let animalesMitologicos = [
                { nombre: "Dragón", imagen: "https://example.com/dragon.jpg" },
                { nombre: "Fénix", imagen: "https://example.com/fenix.jpg" },
                { nombre: "Grifo", imagen: "https://example.com/grifo.jpg" },
                { nombre: "Unicornio", imagen: "https://example.com/unicornio.jpg" },
                { nombre: "Minotauro", imagen: "https://example.com/minotauro.jpg" },
                { nombre: "Hidra", imagen: "https://example.com/hidra.jpg" },
                { nombre: "Cíclope", imagen: "https://example.com/ciclope.jpg" },
                { nombre: "Quimera", imagen: "https://example.com/quimera.jpg" },
                { nombre: "Sirena", imagen: "https://example.com/sirena.jpg" },
                { nombre: "Pegaso", imagen: "https://example.com/pegaso.jpg" },
                { nombre: "Basilisco", imagen: "https://example.com/basilisco.jpg" },
                { nombre: "Leviatán", imagen: "https://example.com/leviatan.jpg" },
                { nombre: "Harpía", imagen: "https://example.com/harpia.jpg" },
                { nombre: "Kraken", imagen: "https://example.com/kraken.jpg" },
                { nombre: "Mantícora", imagen: "https://example.com/manticora.jpg" },
                { nombre: "Esfinge", imagen: "https://example.com/esfinge.jpg" },
                { nombre: "Cerbero", imagen: "https://example.com/cerbero.jpg" },
                { nombre: "Chupacabras", imagen: "https://example.com/chupacabras.jpg" },
                { nombre: "Yeti", imagen: "https://example.com/yeti.jpg" },
                { nombre: "Naga", imagen: "https://example.com/naga.jpg" }
            ];

            // Selección aleatoria de un animal mitológico
            let animal = animalesMitologicos[Math.floor(Math.random() * animalesMitologicos.length)];

            user.animalesMitologicos = user.animalesMitologicos || [];
            user.animalesMitologicos.push(animal);

            conn.sendFile(m.chat, animal.imagen, 'animal.jpg', `¡Has cazado un ${animal.nombre}!`, m);
        }

        // Comando para mostrar los animales a la venta y los del usuario
        if (command === 'tienda') {
            let animalesEnVenta = [
                { nombre: "Dragón", precio: 500 },
                { nombre: "Fénix", precio: 300 },
                { nombre: "Grifo", precio: 400 }
            ];

            let ventaList = animalesEnVenta.map((animal, i) => `${i + 1}. ${animal.nombre} - ${animal.precio} créditos`).join('\n');
            let animalesUsuario = user.animalesMitologicos && user.animalesMitologicos.length > 0
                ? user.animalesMitologicos.map((animal, i) => `${i + 1}. ${animal.nombre}`).join('\n')
                : 'No tienes animales. Caza uno con `.magicaventur`.';

            let mensaje = `
*ANIMALES A LA VENTA:*
${ventaList}

Usa \`.comprar[número]\` para comprar un animal.

*TUS ANIMALES:*
${animalesUsuario}

Usa \`.vender[número]\` para vender uno de tus animales.
            `;

            conn.reply(m.chat, mensaje, m);
        }

        // Comando para comprar un animal de la tienda
        if (command.startsWith('comprar') && command.length > 7) {
            let compraIndex = parseInt(command.slice(7)) - 1;

            let animalesEnVenta = [
                { nombre: "Dragón", precio: 500 },
                { nombre: "Fénix", precio: 300 },
                { nombre: "Grifo", precio: 400 }
            ];

            if (compraIndex < 0 || compraIndex >= animalesEnVenta.length) {
                conn.reply(m.chat, 'Elige un animal válido para comprar.', m);
                return;
            }

            let animalComprado = animalesEnVenta[compraIndex];
            if (user.limit < animalComprado.precio) {
                conn.reply(m.chat, `No tienes suficientes créditos para comprar un ${animalComprado.nombre}. Necesitas ${animalComprado.precio} créditos.`, m);
                return;
            }

            user.limit -= animalComprado.precio;
            user.animalesMitologicos.push({ nombre: animalComprado.nombre, imagen: 'https://example.com/imagen_de_ejemplo.jpg' });

            conn.reply(m.chat, `¡Has comprado un ${animalComprado.nombre} por ${animalComprado.precio} créditos!`, m);
        }

        // Comando para vender un animal del usuario
        if (command.startsWith('vender') && command.length > 6) {
            let ventaIndex = parseInt(command.slice(6)) - 1;

            if (!user.animalesMitologicos || user.animalesMitologicos.length === 0) {
                conn.reply(m.chat, 'No tienes animales para vender.', m);
                return;
            }

            if (ventaIndex < 0 || ventaIndex >= user.animalesMitologicos.length) {
                conn.reply(m.chat, 'Elige un animal válido para vender.', m);
                return;
            }

            let precioVenta = obtenerPrecioAnimal(); // Precio aleatorio de venta
            let animalVendido = user.animalesMitologicos.splice(ventaIndex, 1)[0];

            user.limit += precioVenta;
            conn.reply(m.chat, `¡Has vendido el ${animalVendido.nombre} por ${precioVenta} créditos!`, m);
        }

    } catch (e) {
        console.log(e);
        conn.reply(m.chat, 'Hubo un error al procesar tu solicitud.', m);
    }
};

// Función para obtener un precio aleatorio para vender los animales mitológicos
function obtenerPrecioAnimal() {
    const precios = [150, 200, 250, 300];
    return precios[Math.floor(Math.random() * precios.length)];
}

handler.help = ['magicaventur', 'tienda', 'comprar[número]', 'vender[número]'];
handler.tags = ['adventure', 'econ'];
handler.command = /^(magicaventur|tienda|comprar\d+|vender\d+)$/i;
handler.register = true;

export default handler;
