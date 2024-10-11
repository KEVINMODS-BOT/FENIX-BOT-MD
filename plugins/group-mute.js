import fetch from 'node-fetch';

let handler = async (message, { conn, command, text, isAdmin, isBotAdmin }) => {
    let mute = command === 'mute';
    let unmute = command === 'unmute';
    let mentionedUser = message.mentionedJid ? message.mentionedJid[0] : message.quoted ? message.quoted.sender : text;

    if (!isAdmin) throw '👑 Solo los administradores pueden usar este comando.';

    if (!mentionedUser) throw mute ? '❗️ Menciona a la persona que deseas mutar.' : '❗️ Menciona a la persona que deseas desmutar.';

    if (mute) {
        if (!isBotAdmin) throw '🤖 El bot necesita ser administrador para ejecutar este comando.';

        let user = global.db.data.users[mentionedUser];
        if (user.muted) throw '😼 Este usuario ya ha sido silenciado.';

        user.muted = true;
        await conn.sendMessage(message.chat, {
            text: `✅ El usuario @${mentionedUser.split('@')[0]} ha sido silenciado.`,
            mentions: [mentionedUser]
        });
    }

    if (unmute) {
        let user = global.db.data.users[mentionedUser];
        if (!user.muted) throw '😼 Este usuario no está silenciado.';

        user.muted = false;
        await conn.sendMessage(message.chat, {
            text: `✅ El usuario @${mentionedUser.split('@')[0]} ha sido desmuteado.`,
            mentions: [mentionedUser]
        });
    }
};

handler.before = async (message, { conn }) => {
    let user = global.db.data.users[message.sender];
    if (user && user.muted && message.isGroup) {
        if (message.fromMe) return; // No borra los mensajes del bot mismo
        if (conn.isBotAdmin) {
            await conn.sendMessage(message.chat, { delete: message.key }); // Eliminar el mensaje
        }
    }
};

handler.command = /^(mute|unmute)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
