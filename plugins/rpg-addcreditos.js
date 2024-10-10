let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (command === 'agregartodos') {
        let amount = parseInt(text.trim());

        if (isNaN(amount) || amount <= 0) {
            return conn.reply(m.chat, 'Por favor, ingrese una cantidad válida de *fenixcoins 🐦‍🔥* a agregar.', m);
        }

        let users = global.db.data.users;
        let totalUsers = Object.keys(users).length;

        for (let jid in users) {
            users[jid].limit += amount;
        }

        conn.reply(m.chat, `Se han agregado ${amount} *fenixcoins 🐦‍🔥* a todos los usuarios. Total de usuarios actualizados: ${totalUsers}.`, m);
    } else {
        let mentionedJid = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : null;

        if (!mentionedJid) {
            return conn.reply(m.chat, `*[⚠️]* 𝙄𝙉𝙂𝙍𝙀𝙎𝙀 𝙀𝙇 𝙐𝙎𝙐𝘼𝙍𝙄𝙊 𝙐𝙎𝘼𝙉𝘿𝙊 *@usuario* 𝘿𝙀𝙎𝙋𝙐𝙀́𝙎 𝘿𝙀𝙇 𝘾𝙊𝙈𝘼𝙉𝘿𝙊

𝙀𝙅𝙀𝙈𝙋𝙇𝙊: ${usedPrefix}${command} @usuario cantidad`, m);
        }

        let [_, limit] = text.trim().split(' ');
        limit = parseInt(limit);

        if (isNaN(limit) || limit <= 0) {
            return conn.reply(m.chat, `*[⚠️]* 𝙄𝙉𝙂𝙍𝙀𝙎𝙀 𝙇𝘼 𝘾𝘼𝙉𝙏𝙄𝘿𝘼𝘿 𝘿𝙀 *fenixcoins 🐦‍🔥* 𝙌𝙐𝙀 𝙌𝙐𝙄𝙀𝙍𝙀𝙎 𝘼𝙉̃𝘼𝘿𝙄𝙍 𝘼𝙇 𝙐𝙎𝙐𝘼𝙍𝙄𝙊 *@${mentionedJid.split('@')[0]}*

𝙀𝙅𝙀𝙈𝙋𝙇𝙊: ${usedPrefix}${command} @usuario 10`, m);
        }

        let user = global.db.data.users[mentionedJid];
        if (!user) {
            return conn.reply(m.chat, 'Usuario no encontrado o no registrado.', m);
        }

        if (command === 'agregarfenix') {
            user.limit += limit;
            conn.reply(m.chat, `𝚂𝙴 𝙰 𝙰𝙽̃𝙰𝙳𝙸𝙳𝙾 *fenixcoins 🐦‍🔥* 𝙰𝙻 𝚄𝚂𝚄𝙰𝚁𝙸𝙾 @${mentionedJid.split('@')[0]}

┏╍╍╍╍╍╍╍╍╍╍╍╍╍
┃• *agregados:* ${limit}
┗╍╍╍╍╍╍╍╍╍╍╍╍╍

┏╍╍╍╍╍╍╍╍╍╍╍╍╍
┃• *tiene:* ${user.limit}
┗╍╍╍╍╍╍╍╍╍╍╍╍╍`, m);
        } else if (command === 'quitarfenix') {
            if (user.limit < limit) {
                return conn.reply(m.chat, `El usuario no tiene suficientes *fenixcoins 🐦‍🔥* para quitar. Tiene ${user.limit} créditos.`, m);
            }
            user.limit -= limit;
            conn.reply(m.chat, `𝚂𝙴 𝙷𝙰𝙽 𝚀𝚄𝙸𝚃𝙰𝙳𝙾 *fenixcoins 🐦‍🔥* 𝙰𝙻 𝚄𝚂𝚄𝙰𝚁𝙸𝙾 @${mentionedJid.split('@')[0]}

┏╍╍╍╍╍╍╍╍╍╍╍╍╍
┃• *quitados:* ${limit}
┗╍╍╍╍╍╍╍╍╍╍╍╍╍

┏╍╍╍╍╍╍╍╍╍╍╍╍╍
┃• *tiene:* ${user.limit}
┗╍╍╍╍╍╍╍╍╍╍╍╍╍`, m);
        }
    }
}

handler.help = ['agregarfenix @usuario cantidad', 'quitarfenix @usuario cantidad', 'agregartodos cantidad'];
handler.tags = ['owner'];
handler.command = /^(agregarfenix|quitarfenix|agregartodos)$/i;
handler.rowner = true; // Solo puede ser usado por el owner del bot

export default handler;
