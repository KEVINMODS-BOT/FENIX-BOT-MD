let handler = async (m, { conn }) => {
    // Verifica si el mensaje es de tipo 'viewOnceMessage' (Ver una vez)
    if (m.message && m.message.viewOnceMessage) {
        let viewOnceMessage = m.message.viewOnceMessage;

        // Extrae el contenido del mensaje original
        let mediaMessage = viewOnceMessage.message.imageMessage || viewOnceMessage.message.videoMessage;

        // Si el mensaje es una imagen o un video
        if (mediaMessage) {
            let mediaType = mediaMessage.mimetype.startsWith('image') ? 'imagen' : 'video';

            // Descarga el contenido del mensaje (media)
            let buffer = await conn.downloadMediaMessage(mediaMessage);

            // Enviar el contenido al chat como un mensaje normal, para que se pueda ver más de una vez
            await conn.sendMessage(m.chat, {
                [mediaMessage.mimetype.startsWith('image') ? 'image' : 'video']: buffer,
                caption: `*Este es un mensaje de ${mediaType} que estaba en modo "Ver una vez". Ahora puedes verlo cuantas veces quieras.*`
            });

            // Confirmar que el mensaje ha sido interceptado
            conn.reply(m.chat, `*El ${mediaType} de "Ver una vez" ha sido interceptado y convertido a un mensaje normal.*`, m);
        }
    } else {
        conn.reply(m.chat, 'Este mensaje no es un contenido de "Ver una vez".', m);
    }
};

handler.help = ['antiviewonce'];
handler.tags = ['tools'];
handler.command = /^antiviewonce$/i;

export default handler;
