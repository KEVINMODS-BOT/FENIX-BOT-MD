import fetch from 'node-fetch';

let handler = async (m, { conn, command, args }) => {
    try {
        let user = global.db.data.users[m.sender];

        if (!user.registered) {
            conn.reply(m.chat, 'Por favor, regístrate usando el comando `.reg nombre.edad` antes de usar este comando.', m);
            return;
        }

        if (command === 'waifu') {
            let res = await fetch('https://api.waifu.pics/sfw/waifu');
            if (!res.ok) {
                conn.reply(m.chat, 'Hubo un error al obtener la waifu. Inténtalo de nuevo.', m);
                return;
            }
            let json = await res.json();
            if (!json.url) {
                conn.reply(m.chat, 'No se pudo obtener la imagen de la waifu.', m);
                return;
            }

            let waifuPrice = obtenerPrecioAleatorio();
            let waifuCode = generarCodigoUnico();

            global.db.data.waifus = global.db.data.waifus || {};
            if (global.db.data.waifus[waifuCode]) {
                conn.reply(m.chat, 'Hubo un problema al generar el código. Inténtalo de nuevo.', m);
                return;
            }

            global.db.data.waifus[waifuCode] = {
                url: json.url,
                price: waifuPrice,
                owner: null
            };

            await conn.sendFile(m.chat, json.url, 'waifu.jpg', `Aquí tienes una waifu con el código ${waifuCode}.\n\nPuedes comprarla por ${waifuPrice} créditos usando el comando \`.comprarw ${waifuCode}\``, m);

            return;
        }

        if (command === 'comprarw') {
            let waifuCode = args[0];

            if (!waifuCode) {
                conn.reply(m.chat, 'Debes proporcionar un código para comprar una waifu. Usa `.comprarw [código]`.', m);
                return;
            }

            if (!global.db.data.waifus || !global.db.data.waifus[waifuCode]) {
                conn.reply(m.chat, 'No existe ninguna waifu con ese código.', m);
                return;
            }

            let waifu = global.db.data.waifus[waifuCode];

            if (waifu.owner) {
                conn.reply(m.chat, 'Esta waifu ya ha sido comprada por alguien más.', m);
                return;
            }

            let waifuPrice = waifu.price;

            if (user.limit < waifuPrice) {
                conn.reply(m.chat, `No tienes suficientes créditos para comprar esta waifu. Necesitas ${waifuPrice} créditos.`, m);
                return;
            }

            user.limit -= waifuPrice;
            user.waifus = user.waifus || [];
            user.waifus.push(waifuCode);

            waifu.owner = m.sender;
            conn.reply(m.chat, `Has comprado la waifu con el código ${waifuCode} por ${waifuPrice} créditos. Usa el comando .miswaifus para ver tus waifus.`, m);
        }

        if (command === 'miswaifus') {
    if (!user.waifus || user.waifus.length === 0) {
        conn.reply(m.chat, 'No tienes waifus. Compra una con el comando `.waifu`.', m);
        return;
    }

    let waifuList = user.waifus.map((waifuCode, i) => {
        let waifu = global.db.data.waifus[waifuCode];
        
        // Verifica que la waifu exista en la base de datos
        if (!waifu) {
            return `${i + 1}. Código: ${waifuCode}, pero la waifu no existe en la base de datos.`;
        }
        
        return `${i + 1}. Código: ${waifuCode}, Precio original: ${waifu.price} créditos, URL: ${waifu.url}`;
    }).join('\n\n');

    conn.reply(m.chat, `Estas son tus waifus:\n\n${waifuList}`, m);
}

    } catch (e) {
        console.log(e);
        conn.reply(m.chat, 'Hubo un error al procesar tu solicitud.', m);
    }
};

function obtenerPrecioAleatorio() {
    const precios = [10, 15, 20];
    return precios[Math.floor(Math.random() * precios.length)];
}

function generarCodigoUnico() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

handler.help = ['waifu', 'comprarw [código]', 'miswaifus'];
handler.tags = ['img', 'econ'];
handler.command = /^(waifu|comprarw|miswaifus)$/i;
handler.register = true;

export default handler;
