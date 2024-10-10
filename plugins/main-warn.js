let handler = async (m, { conn, text }) => {
    // Mensaje inicial si no se menciona a un usuario
    let warningMessage = `🟡 Menciona al usuario que deseas advertir.`; 

    // Verifica si hay un usuario mencionado o un mensaje citado
    let mentionedJid = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : (m.quoted ? m.quoted.sender : null);
    
    if (!mentionedJid) {
        return conn.reply(m.chat, warningMessage, m);
    }

    // Asegúrate de que el usuario tenga un registro de advertencias y esté inicializado
    if (!global.db.data.users[mentionedJid]) {
        global.db.data.users[mentionedJid] = { warnings: [] };
    }

    // Si la propiedad warnings no existe, inicialízala como un array vacío
    if (!global.db.data.users[mentionedJid].warnings) {
        global.db.data.users[mentionedJid].warnings = [];
    }

    // Añade una advertencia al registro del usuario
    global.db.data.users[mentionedJid].warnings.push('Advertencia');
    const totalWarnings = global.db.data.users[mentionedJid].warnings.length;

    // Mensaje de advertencia con contador de advertencias
    conn.reply(m.chat, `*El usuario @${mentionedJid.split('@')[0]} ha recibido una advertencia.*\n\n*Advertencias ${totalWarnings}/3*`, m, {
        mentions: [mentionedJid]
    });

    // Si el usuario tiene 3 advertencias, se elimina del grupo
    if (totalWarnings >= 3) {
        try {
            await conn.groupParticipantsUpdate(m.chat, [mentionedJid], 'remove');
            conn.reply(m.chat, `*Usuario @${mentionedJid.split('@')[0]} eliminado del grupo por alcanzar 3 advertencias.*`, m, {
                mentions: [mentionedJid]
            });
            conn.reply(m.chat, `Lo siento, acabas de ser eliminado del grupo.`, mentionedJid);
        } catch (err) {
            console.error(err); // Registrar error para depuración
            conn.reply(m.chat, `*[⚠️]* No se pudo eliminar al usuario @${mentionedJid.split('@')[0]}. Asegúrate de que el bot tenga permisos adecuados.`, m);
        }
    }
}

handler.help = ['warn *@user*'];
handler.tags = ['group'];
handler.command = ['warn'];
handler.admin = true;
handler.group = true;
handler.botAdmin = true;

export default handler;
