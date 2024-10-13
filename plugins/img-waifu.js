import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, command, args }) => {
    try {
        let user = global.db.data.users[m.sender];
        
        // Verificar si el usuario está registrado
        if (!user.registered) {
            conn.reply(m.chat, 'Por favor, regístrate usando el comando `.reg nombre.edad` antes de usar este comando.', m);
            return;
        }

        // Comando .waifu para mostrar la waifu
        if (command === 'waifu') {
            let res = await fetch('https://api.waifu.pics/sfw/waifu');
            if (!res.ok) return;
            let json = await res.json();
            if (!json.url) return;

            let waifuPrice = obtenerPrecioAleatorio(); // Precio aleatorio de 10, 15, o 20 créditos

            // Enviar waifu y mensaje con opción de compra
            let waifuMessage = await conn.sendFile(m.chat, json.url, 'waifu.jpg', `¿Te gusta esta waifu?\n\nPuedes comprarla por ${waifuPrice} créditos.\n\nResponde a este mensaje con "comprar" para adquirirla.`, m);

            // Guardar información temporal (para recordar la waifu que el usuario quiere comprar)
            user.tempWaifu = {
                url: json.url,
                price: waifuPrice,
                messageId: waifuMessage.key.id // Guardar el ID del mensaje para verificar luego
            };

            return;
        }

        // Verificar si el usuario responde con "comprar" al mensaje adecuado
        if (m.quoted && m.text.toLowerCase() === 'comprar' && m.quoted.id === user.tempWaifu.messageId) {
            // Verificar si hay una waifu en espera para ser comprada
            if (!user.tempWaifu) {
                conn.reply(m.chat, 'No tienes ninguna waifu disponible para comprar en este momento.', m);
                return;
            }

            let waifuPrice = user.tempWaifu.price;

            // Verificar si el usuario tiene suficientes créditos
            if (user.limit < waifuPrice) {
                conn.reply(m.chat, `No tienes suficientes créditos para comprar esta waifu. Necesitas ${waifuPrice} créditos.`, m);
                return;
            }

            // Restar créditos y agregar waifu al inventario del usuario
            user.limit -= waifuPrice;
            user.waifus = user.waifus || [];
            user.waifus.push(user.tempWaifu.url); // Almacenar la URL de la waifu en la base de datos del usuario

            conn.reply(m.chat, `Has comprado la waifu por ${waifuPrice} créditos. Usa el comando .miswaifus para ver tus waifus.`, m);

            // Limpiar la waifu temporal
            delete user.tempWaifu;
        } else if (m.text.toLowerCase() === 'comprar') {
            conn.reply(m.chat, 'Debes responder al mensaje de la waifu para comprarla.', m);
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

handler.help = ['waifu', 'miswaifus', 'comprarwaifu', 'venderwaifu [número]'];
handler.tags = ['img', 'econ'];
handler.command = /^(waifu|miswaifus|comprarwaifu|venderwaifu)$/i;
handler.register = true;

export default handler;
