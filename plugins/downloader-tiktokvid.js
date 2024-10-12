import Starlights from '@StarlightsTeam/Scraper'

let handler = async (m, { conn, usedPrefix, command, text }) => {
    let user = global.db.data.users[m.sender];

    // Verificar si el usuario tiene suficientes fuegos
    if (!user.fuegos || user.fuegos < 2) {
        return conn.reply(m.chat, '*`No tienes suficientes fuegos para usar este comando.`*\n\n *`Necesitas al menos 2 fuegos.`*', m);
    }

    // Verificar si el texto de búsqueda está presente
    if (!text) {
        return conn.reply(m.chat, '🚩 Ingresa un texto de búsqueda junto al comando.\n\n`Ejemplo:`\n' + `> *${usedPrefix + command}* Fenix Edit`, m);
    }

    await m.react('🕓');

    try {
        // Llamar al scraper para obtener los datos del video basado en la búsqueda
        let { title, author, duration, views, likes, comments_count, share_count, download_count, published, dl_url } = await Starlights.tiktokvid(text);

        // Formatear el mensaje con los detalles del video
        let txt = '`乂  T I K T O K  -  D O W N L O A D`\n\n';
        txt += `*➢ Título* : ${title}\n`;
        txt += `*➢ Autor* : ${author}\n`;
        txt += `*➢ Duración* : ${duration} segundos\n`;
        txt += `*➢ Vistas* : ${views}\n`;
        txt += `*➢ Likes* : ${likes}\n`;
        txt += `*➢ Comentarios* : ${comments_count}\n\n`;
        txt += `> *Haz gastado 2 fuegos 🔥*`;

        // Descontar 2 fuegos al usuario
        user.fuegos -= 2;

        // Enviar el video junto con el texto formateado
        await conn.sendFile(m.chat, dl_url, `thumbnail.mp4`, txt, m);
        await m.react('✅');

    } catch (e) {
        // Manejo de error en caso de fallo en la descarga
        await m.react('✖️');
        conn.reply(m.chat, '❌ Ocurrió un error al intentar descargar el vídeo de TikTok.', m);
    }
}

handler.help = ['tiktokvid *<búsqueda>*'];
handler.tags = ['downloader'];
handler.command = ['ttvid', 'tiktokvid'];
handler.register = true;

export default handler;
