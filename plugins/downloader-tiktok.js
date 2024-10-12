import Starlights from '@StarlightsTeam/Scraper'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    // Obtener los datos del usuario
    let user = global.db.data.users[m.sender];

    // Verificar si el usuario tiene fuegos suficientes
    if (user.fuegos < 3) {
        return conn.reply(m.chat, '❌ No tienes suficientes fuegos para usar este comando. Necesitas al menos 3 fuegos.', m);
    }

    // Verificar si el enlace de TikTok fue proporcionado
    if (!args || !args[0]) {
        return conn.reply(m.chat, '🚩 Ingresa un enlace del vídeo de TikTok junto al comando.\n\n`Ejemplo:`\n' + `> *${usedPrefix + command}* https://vm.tiktok.com/ZMrFCX5jf/`, m);
    }

    // Verificar si el enlace es válido de TikTok
    if (!args[0].match(/tiktok/gi)) {
        return conn.reply(m.chat, `Verifica que el link sea de TikTok`, m).then(_ => m.react('✖️'));
    }

    await m.react('🕓');
    try {
        // Usar la función de Starlights para descargar el vídeo de TikTok
        let { title, author, duration, views, likes, comment, share, published, downloads, dl_url } = await Starlights.tiktokdl(args[0]);

        // Crear el texto con la información del vídeo
        let txt = '`乂  T I K T O K  -  D O W N L O A D`\n\n';
        txt += `	✩  *Título* : ${title}\n`;
        txt += `	✩  *Autor* : ${author}\n`;
        txt += `	✩  *Duración* : ${duration} segundos\n`;
        txt += `	✩  *Vistas* : ${views}\n`;
        txt += `	✩  *Likes* : ${likes}\n`;
        txt += `	✩  *Comentarios* : ${comment}\n`;
        txt += `	✩  *Compartidos* : ${share}\n`;
        txt += `	✩  *Publicado* : ${published}\n`;
        txt += `	✩  *Descargas* : ${downloads}\n\n`;
        txt += `> 🚩 *${textbot}*`;

        // Enviar el vídeo al usuario
        await conn.sendFile(m.chat, dl_url, 'tiktok.mp4', txt, m, null);
        await m.react('✅');

        // Descontar 3 fuegos del usuario
        user.fuegos -= 3;

        // Notificarle cuántos fuegos le quedan
        conn.reply(m.chat, `✅ Has descargado el video con éxito. Se te han descontado 3 fuegos. Te quedan ${user.fuegos} fuegos.`, m);
    } catch (e) {
        await m.react('✖️');
        conn.reply(m.chat, '❌ Ocurrió un error al intentar descargar el vídeo de TikTok.', m);
    }
};

handler.help = ['tiktok *<url tt>*'];
handler.tags = ['downloader'];
handler.command = /^(tiktok|ttdl|tiktokdl|tiktoknowm)$/i;
handler.register = true;

export default handler;
