import Starlights from '@StarlightsTeam/Scraper'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let user = global.db.data.users[m.sender];

    // Verificar si el usuario tiene al menos 1 fuego
    if (!user.fuegos || user.fuegos < 1) {
        return conn.reply(m.chat, '*`No tienes suficientes fuegos para usar este comando.`*\n\n *`Necesitas al menos 1 fuego.`*', m);
    }

    // Verificar si se proporciona el enlace de Facebook
    if (!args || !args[0]) {
        return conn.reply(m.chat, '🚩 Ingresa el enlace del vídeo de Facebook junto al comando.\n\n`Ejemplo:`\n' + `> *${usedPrefix + command}* https://www.facebook.com/official.trash.gang/videos/873759786348039/?mibextid=rS40aB7S9Ucbxw6v`, m);
    }

    await m.react('🕓');

    try {
        // Obtener el enlace de descarga del video de Facebook
        let { dl_url } = await Starlights.fbdl(args[0]);

        // Descontar 1 fuego al usuario
        user.fuegos -= 1;

        // Enviar el video descargado
        await conn.sendFile(m.chat, dl_url, 'fbdl.mp4', 'Descarga completada. Haz gastado 1 fuego 🔥', m);
        await m.react('✅');
    } catch (e) {
        // Manejo de error si ocurre un problema durante la descarga
        await m.react('✖️');
        conn.reply(m.chat, '❌ Ocurrió un error al intentar descargar el vídeo de Facebook.', m);
    }
};

handler.help = ['fb *<link fb>*'];
handler.tags = ['downloader'];
handler.command = /^(facebook|fb|facebookdl|fbdl)$/i;
handler.register = true;

export default handler;
