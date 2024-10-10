let unwarnHandler = async (m, { conn, text, usedPrefix }) => {
    // Mensaje inicial si no se menciona a un usuario
    let warningMessage = `🟡 Menciona al usuario del que deseas eliminar la advertencia.`; 

    // Verifica si hay un usuario mencionado o un mensaje citado
    let mentionedJid = m.mentionedJid[0] ? m.mentionedJid[0] : (m.quoted ? m.quoted.sender : null);
    
    if (!mentionedJid) {
        return conn.reply(m.chat, warningMessage, m);
    }

    // Verifica si el usuario tiene advertencias
    if (!global.db.data.users[mentionedJid] || global.db.data.users[mentionedJid].warnings.length === 0) {
        return conn.reply(m.chat, `*El usuario @${mentionedJid.split('@')[0]} no tiene advertencias para eliminar.*`, m, {
            mentions: [mentionedJid]
        });
    }

    // Elimina la última advertencia
    global.db.data.users[mentionedJid].warnings.pop(); // Elimina la última advertencia
    const remainingWarnings = global.db.data.users[mentionedJid].warnings.length;

    // Mensaje de confirmación
    conn.reply(m.chat, `*Se ha eliminado una advertencia del usuario @${mentionedJid.split('@')[0]}. Ahora tiene ${remainingWarnings} advertencias restantes.*`, m, {
        mentions: [mentionedJid]
    });
}

unwarnHandler.help = ['unwarn *@user*'];
unwarnHandler.tags = ['group'];
unwarnHandler.command = ['unwarn'];
unwarnHandler.admin = true;
unwarnHandler.group = true;
unwarnHandler.botAdmin = true;

export default unwarnHandler;
