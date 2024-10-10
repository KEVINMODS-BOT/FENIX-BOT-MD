export async function before(m, { conn, isAdmin, isBotAdmin }) {
    if (m.isBaileys && m.fromMe) return !0;
    if (!m.isGroup) return !1;

    let chat = global.db.data.chats[m.chat];
    if (chat.antiviewonce && m.message && m.message.viewOnceMessage) {
        let viewOnceMessage = m.message.viewOnceMessage;
        let mediaMessage = viewOnceMessage.message.imageMessage || viewOnceMessage.message.videoMessage;

        if (mediaMessage) {
            let mediaType = mediaMessage.mimetype.startsWith('image') ? 'imagen' : 'video';
            let buffer = await conn.downloadMediaMessage(mediaMessage);

            await conn.sendMessage(m.chat, {
                [mediaMessage.mimetype.startsWith('image') ? 'image' : 'video']: buffer,
                caption: `*Este ${mediaType} estaba en modo "Ver una vez", pero ahora puedes verlo cuantas veces quieras.*`
            });

            await conn.reply(m.chat, `*El ${mediaType} de "Ver una vez" ha sido interceptado y convertido en un mensaje normal.*`, m);
        }
    }

    return !0;
}
