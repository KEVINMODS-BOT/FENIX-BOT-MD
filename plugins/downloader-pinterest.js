import Starlights from '@StarlightsTeam/Scraper';

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let user = global.db.data.users[m.sender];

    // Verificar si el usuario tiene al menos 1 fuego
    if (!user.fuegos || user.fuegos < 1) {
        return conn.reply(m.chat, '*`No tienes suficientes fuegos para usar este comando.`*\n\n *`Necesitas al menos 1 fuego.`*', m);
    }

    // Verificar si se proporciona el enlace de Pinterest
    if (!args[0]) {
        return conn.reply(m.chat, `🚩 Ingrese un enlace de Pinterest\n\nEjemplo:\n> *${usedPrefix + command}* https://ar.pinterest.com/pin/588142032613788991/`, m);
    }

    await m.react('🕓');
    try {
        // Obtener los datos del video de Pinterest
        let { dl_url, quality, size, duration, url } = await Starlights.pinterestdl(args[0]);

        // Formatear el mensaje con los detalles del video
        let txt = '`乂  P I N T E R E S T  -  D L`\n\n';
        txt += `  ✩   *Calidad* : ${quality}\n`;
        txt += `  ✩   *Tamaño* : ${size}\n`;
        txt += `  ✩   *Duración* : ${duration}\n`;
        txt += `  ✩   *Url* : ${url}\n\n`;
        txt += `> 🚩 Haz gastado 1 fuego 🔥`;

        // Descontar 1 fuego al usuario
        user.fuegos -= 1;

        // Enviar el video descargado
        await conn.sendMessage(m.chat, { video: { url: dl_url }, caption: txt, mimetype: 'video/mp4', fileName: 'pinterest.mp4' }, { quoted: m });
        await m.react('✅');
    } catch (e) {
        // Manejo de error si ocurre un problema durante la descarga
        await m.react('✖️');
        conn.reply(m.chat, '❌ Ocurrió un error al intentar descargar el vídeo de Pinterest.', m);
    }
};

handler.help = ['pinterestdl *<url pin>*'];
handler.tags = ['downloader'];
handler.command = ['pinterestdl', 'pindl'];
handler.register = true;

export default handler;
