import Starlights from '@StarlightsTeam/Scraper'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let user = global.db.data.users[m.sender];

    // Verificar si el usuario tiene al menos 1 fuego
    if (!user.fuegos || user.fuegos < 1) {
        return conn.reply(m.chat, '*`No tienes suficientes fuegos para usar este comando.`*\n\n *`Necesitas al menos 1 fuego.`*', m);
    }

    // Verificar si el enlace de Instagram es proporcionado
    if (!args[0]) {
        return conn.reply(m.chat, '🚩 Ingresa el enlace del vídeo de Instagram junto al comando.\n\n`Ejemplo:`\n' + `> *${usedPrefix + command}* https://www.instagram.com/p/C60xXk3J-sb/?igsh=YzljYTk1ODg3Zg==`, m);
    }

    await m.react('🕓');

    try {
        // Obtener el enlace de descarga del video
        let { dl_url } = await Starlights.igdl(args[0]);

        // Descontar 1 fuego al usuario
        user.fuegos -= 1;

        // Enviar el video
        await conn.sendFile(m.chat, dl_url, 'igdl.mp4', 'Descarga completada. Haz gastado 1 fuego 🔥', m);
        await m.react('✅');
    } catch (e) {
        // Manejo de error en caso de fallo en la descarga
        await m.react('✖️');
        conn.reply(m.chat, '❌ Ocurrió un error al intentar descargar el vídeo de Instagram.', m);
    }
};

handler.help = ['instagram *<link ig>*'];
handler.tags = ['downloader'];
handler.command = /^(instagramdl|instagram|igdl|ig|instagramdl2|instagram2|igdl2|ig2|instagramdl3|instagram3|igdl3|ig3)$/i;
handler.register = true;

export default handler;
