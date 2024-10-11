import fetch from 'node-fetch';

let handler = async (m, { conn, command, text, isAdmin, isBotAdmin }) => {
    let mute = command === 'mute';
    let unmute = command === 'unmute';
    let mentionedUser = m.mentionedJid ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text;

    if (!isAdmin) throw '👑 Solo los administradores pueden usar este comando.';

    if (!mentionedUser) throw mute ? '❗️ Menciona a la persona que deseas mutar.' : '❗️ Menciona a la persona que deseas desmutar.';

    if (mute) {
        if (!isBotAdmin) throw '🤖 El bot necesita ser administrador para ejecutar este comando.';

        let user = global.db.data.users[mentionedUser];
        if (user.muted) throw '😼 Este usuario ya ha sido silenciado.';

        user.muted = true;
        await conn.sendMessage(m.chat, {
            text: `✅ El usuario @${mentionedUser.split('@')[0]} ha sido silenciado.`,
            mentions: [mentionedUser]
        });
    }

    if (unmute) {
        let user = global.db.data.users[mentionedUser];
        if (!user.muted) throw '😼 Este usuario no está silenciado.';

        user.muted = false;
        await conn.sendMessage(m.chat, {
            text: `✅ El usuario @${mentionedUser.split('@')[0]} ha sido desmuteado.`,
            mentions: [mentionedUser]
        });
    }
};

// Este código eliminará automáticamente los mensajes de un usuario silenciado
handler.before = async (m, { conn, isBotAdmin }) => {
    let user = global.db.data.users[m.sender];
    
    // Verificamos si el usuario está silenciado y si es un mensaje de grupo
    if (user && user.muted && m.isGroup) {
        if (m.fromMe) return; // No borrar mensajes del bot

        if (isBotAdmin) {
            try {
                // Verificamos si el mensaje tiene el contexto necesario para ser eliminado
                if (m.message && m.message.extendedTextMessage) {
                    let delet = m.message.extendedTextMessage.contextInfo.participant;
                    let bang = m.message.extendedTextMessage.contextInfo.stanzaId;
                    return conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet }});
                } else {
                    // Si no tiene el contexto, intentamos eliminar el mensaje citado
                    return conn.sendMessage(m.chat, { delete: m.quoted.key });
                }
            } catch (e) {
                console.error("Error al intentar eliminar el mensaje: ", e);
            }
        } else {
            console.log("El bot no es administrador, no puede eliminar mensajes.");
        }
    }
};

handler.command = /^(mute|unmute)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
