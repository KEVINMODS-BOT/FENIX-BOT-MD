import fetch from 'node-fetch'
import ffmpeg from "fluent-ffmpeg"

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let user = global.db.data.users[m.sender];

    // Verificar si el usuario tiene suficientes fuegos
    if (!user.fuegos || user.fuegos < 3) {
        return conn.reply(m.chat, '*No tienes suficientes fuegos para usar este comando.*\n\n*Necesitas al menos 3 fuegos.*', m);
    }

    // Verificar si el enlace es proporcionado
    if (!args || !args[0]) {
        return conn.reply(m.chat, '*Ingresa un enlace del vídeo de TikTok junto al comando.*\n\n*Ejemplo:*\n' + `*${usedPrefix + command}* https://vm.tiktok.com/ZMhAk8tLx/`, m);
    }

    // Verificar si el enlace es válido
    if (!args[0].match(/tiktok/gi)) {
        return conn.reply(m.chat, 'Verifica que el link sea de TikTok.', m).then(() => m.react('✖️'));
    }

    await m.react('🕓');

    try {
        // Descontar fuegos antes de proceder
        user.fuegos -= 3;

        await conn.reply(m.chat, "✧ Espere un momento, estoy descargando su video...", m);

        const tiktokData = await tiktokdl(args[0]);

        if (!tiktokData) {
            throw m.reply("Error api!");
        }

        const videoURL = tiktokData.data.play;
        const infonya_gan = `*➢ Publicado:* ${tiktokData.data.create_time
            }\n\n*➢ Estado:*\nLikes = ${tiktokData.data.digg_count
            }\nComentarios = ${tiktokData.data.comment_count}\nCompartidas = ${tiktokData.data.share_count
            }\nVistas = ${tiktokData.data.play_count}\nDescargas = ${tiktokData.data.download_count
            }\n\nUploader: ${tiktokData.data.author.nickname || "No info"
            }\n(${tiktokData.data.author.unique_id} - https://www.tiktok.com/@${tiktokData.data.author.unique_id
            } )\n*➢ Sonido:* ${tiktokData.data.music
            }\n\n> *-* 𝙁𝙀𝙉𝙄𝙓 - 𝘽𝙊𝙏 𝙈𝘿 🐦‍🔥\n\n*Has gastado 3 fuegos 🔥*`;

        if (videoURL) {
            await conn.sendFile(m.chat, videoURL, "tiktok.mp4", `*𝘿𝙀𝙎𝘾𝘼𝙍𝙂𝘼𝙎   𝙁𝙀𝙉𝙄𝙓* 🐦‍🔥\n\n${infonya_gan}`, m);
            setTimeout(async () => {
                await conn.sendFile(m.chat, `${tiktokData.data.music}`, "lagutt.mp3", "", m);
            }, 1500);
            await m.react('✅');
        } else {
            throw m.reply("No se pudo descargar.");
        }
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

async function tiktokdl(url) {
    let tikwm = `https://www.tikwm.com/api/?url=${url}?hd=1`;
    let response = await (await fetch(tikwm)).json();
    return response;
}

async function convertVideoToMp3(videoUrl, outputFileName) {
    return new Promise((resolve, reject) => {
        ffmpeg(videoUrl)
            .toFormat("mp3")
            .on("end", () => resolve())
            .on("error", (err) => reject(err))
            .save(outputFileName);
    });
}
