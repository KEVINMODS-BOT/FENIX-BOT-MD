let handler = async (m, { conn, text, usedPrefix, command }) => {
    let mentionedJid = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : null;

    if (!mentionedJid) {
        return conn.reply(m.chat, `*[⚠️]* 𝙄𝙉𝙂𝙍𝙀𝙎𝙀 𝙀𝙇 𝙐𝙎𝙐𝘼𝙍𝙄𝙊 𝙐𝙎𝘼𝙉𝘿𝙊 *@usuario* 𝘿𝙀𝙎𝙋𝙐𝙀́𝙎 𝘿𝙀𝙇 𝘾𝙊𝙈𝘼𝙉𝘿𝙊

𝙀𝙅𝙀𝙈𝙋𝙇𝙊: ${usedPrefix}${command} @usuario razón`, m);
    }

    let reason = text.trim().split(' ').slice(1).join(' ');
    if (!reason) {
        return conn.reply(m.chat, `*[⚠️]* 𝙋𝙊𝙍𝙁𝙊𝙍𝙉𝙊 𝙎𝙋𝙀𝘾𝙄𝙁𝙄𝙌𝙐𝙀 𝙇𝘼 𝙍𝘼𝙕𝙊́𝙉 𝙏𝙊𝙊𝙋𝙎𝙀𝙊𝙍𝙉𝙄𝘿𝙊𝘿 𝙍𝙊𝙎𝙃𝘼𝘿𝙊 𝙎𝘼𝙋𝙋𝙊𝙍𝙃𝙐𝙉𝘼* 𝙃𝙀𝙋𝙊𝙉𝙊𝘼𝙕𝙄𝙊𝙍𝙉𝙊

𝙀𝙅𝙀𝙈𝙋𝙇𝙊: ${usedPrefix}${command} @usuario razón`, m);
    }

    // Agregar la advertencia al registro del usuario
    if (!global.db.data.users[mentionedJid].warnings) {
        global.db.data.users[mentionedJid].warnings = [];
    }
    
    global.db.data.users[mentionedJid].warnings.push(reason);
    const totalWarnings = global.db.data.users[mentionedJid].warnings.length;

    conn.reply(m.chat, `𝙀𝙑𝙀𝙉𝙀𝙍𝙊𝙉𝙕𝙐𝙍𝙎𝙊𝙍 𝙍𝙀𝙒𝘼𝙍𝘿𝙊𝙊 𝙐𝙎𝙊𝙍𝙀𝙈𝘼𝙏𝙊𝙍𝙈𝙀𝙉𝙏𝙊: @${mentionedJid.split('@')[0]}

*Razón:* ${reason}

*Total de advertencias:* ${totalWarnings}`, m);

    // Si el usuario tiene 3 advertencias, se elimina del grupo
    if (totalWarnings === 3) {
        // Intentar eliminar al usuario del grupo
        try {
            await conn.groupRemove(m.chat, [mentionedJid]);
            conn.reply(m.chat, `*[🚫]* El usuario @${mentionedJid.split('@')[0]} ha sido eliminado del grupo por alcanzar 3 advertencias.`, m);
        } catch (err) {
            conn.reply(m.chat, `*[⚠️]* No se pudo eliminar al usuario @${mentionedJid.split('@')[0]}. Asegúrate de que el bot tenga permisos adecuados.`, m);
        }
    }
}

handler.help = ['warn @usuario razón'];
handler.tags = ['owner'];
handler.command = /^warn$/i;
handler.rowner = true; // Solo puede ser usado por el owner del bot

export default handler;
