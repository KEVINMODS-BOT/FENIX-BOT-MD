let handler = async (m, { conn, text, usedPrefix }) => {
    // Comando para advertir a un usuario
    if (m.command === 'warn') {
        let warningMessage = `🟡 Menciona al usuario que deseas advertir.`; 

        // Verifica si hay un usuario mencionado o un mensaje citado
        let mentionedJid = m.mentionedJid[0] ? m.mentionedJid[0] : (m.quoted ? m.quoted.sender : null);
        
        if (!mentionedJid) {
            return conn.reply(m.chat, warningMessage, m);
        }

        // Asegúrate de que el usuario tenga un registro de advertencias
        if (!global.db.data.users[mentionedJid]) {
            global.db.data.users[mentionedJid] = { warnings: [] };
        }

        // Añade una advertencia al registro del usuario
        global.db.data.users[mentionedJid].warnings.push('Advertencia');
        const totalWarnings = global.db.data.users[mentionedJid].warnings.length;

        // Mensaje de advertencia
        conn.reply(m.chat, `*El usuario @${mentionedJid.split('@')[0]} ha recibido una advertencia.*`, m, {
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

    // Comando para eliminar todas las advertencias de un usuario
    } else if (m.command === 'unwarn') {
        let unwarnMessage = `🟡 Menciona al usuario del que deseas eliminar las advertencias.`;

        // Verifica si hay un usuario mencionado o un mensaje citado
        let mentionedJid = m.mentionedJid[0] ? m.mentionedJid[0] : (m.quoted ? m.quoted.sender : null);
        
        if (!mentionedJid) {
            return conn.reply(m.chat, unwarnMessage, m);
        }

        // Verifica si el usuario tiene advertencias
        if (!global.db.data.users[mentionedJid] || !global.db.data.users[mentionedJid].warnings.length) {
            return conn.reply(m.chat, `*El usuario @${mentionedJid.split('@')[0]} no tiene advertencias para eliminar.*`, m, {
                mentions: [mentionedJid]
            });
        }

        // Elimina todas las advertencias del usuario
        global.db.data.users[mentionedJid].warnings = [];
        conn.reply(m.chat, `*Todas las advertencias de @${mentionedJid.split('@')[0]} han sido eliminadas.*`, m, {
            mentions: [mentionedJid]
        });
    }
}

handler.help = ['warn *@user*', 'unwarn *@user*'];
handler.tags = ['group'];
handler.command = ['warn', 'unwarn'];
handler.admin = true;
handler.group = true;
handler.botAdmin = true;

export default handler;
