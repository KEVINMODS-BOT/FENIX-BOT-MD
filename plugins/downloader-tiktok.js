import Starlights from '@StarlightsTeam/Scraper'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let user = global.db.data.users[m.sender];

    if (user.fuegos < 3) {
        return conn.reply(m.chat, '❌ No tienes suficientes fuegos para usar este comando. Necesitas al menos 3 fuegos.', m);
    }

    if (!args || !args[0]) {
        return conn.reply(m.chat, '🚩 Ingresa un enlace del vídeo de TikTok junto al comando.\n\n`Ejemplo:`\n' + `> *${usedPrefix + command}* https://vm.tiktok.com/ZMrFCX5jf/`, m);
    }

    if (!args[0].match(/tiktok/gi)) {
        return conn.reply(m.chat, `Verifica que el link sea de TikTok`, m).then(_ => m.react('✖️'));
    }

    await m.react('🕓');
    try {
        let { title, author, duration, views, likes, published, dl_url } = await Starlights.tiktokdl(args[0]);

        let txt = '`乂  T I K T O K  -  D O W N L O A D`\n\n';
        txt += `\t✩  *Título* : ${title}\n`;
        txt += `\t✩  *Autor* : ${author}\n`;
        txt += `\t✩  *Duración* : ${duration} segundos\n`;
        txt += `\t✩  *Vistas* : ${views}\n`;
        txt += `\t✩  *Likes* : ${likes}\n`;
        txt += `\t✩  *Publicado* : ${published}\n\n`;
        txt += `> *Haz gastado 3 fuegos 🔥*`;

        await conn.sendFile(m.chat, dl_url, 'tiktok.mp4', txt, m, null);
        await m.react('✅');

        user.fuegos -= 3;
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
