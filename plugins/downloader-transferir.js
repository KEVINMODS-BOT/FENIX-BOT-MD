let handler = async (m, { conn, text, usedPrefix, command }) => {
    let mentionedJid = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : null;

    if (!mentionedJid) {
        return conn.reply(m.chat, `*[⚠️]* 𝙄𝙉𝙂𝙍𝙀𝙎𝙀 𝙀𝙇 𝙐𝙎𝙐𝘼𝙍𝙄𝙊 𝙐𝙎𝘼𝙉𝘿𝙊 *@usuario* 𝘿𝙀𝙎𝙋𝙐𝙀́𝙎 𝘿𝙀𝙇 𝘾𝙊𝙈𝘼𝙉𝘿𝙊

𝙀𝙅𝙀𝙈𝙋𝙇𝙊: ${usedPrefix}${command} 10 @usuario`, m);
    }

    let [amount] = text.trim().split(' ');
    amount = parseInt(amount);

    if (isNaN(amount) || amount <= 0) {
        return conn.reply(m.chat, `*[⚠️]* 𝙄𝙉𝙂𝙍𝙀𝙎𝙀 𝙇𝘼 𝘾𝘼𝙉𝙏𝙄𝘿𝘼𝘿 𝘿𝙀 FENIXCOINS 𝘼 𝙏𝙍𝘼𝙉𝙎𝙁𝙀𝙍𝙄𝙍 *@${mentionedJid.split('@')[0]}*

𝙀𝙅𝙀𝙈𝙋𝙇𝙊: ${usedPrefix}${command} 10 @usuario`, m);
    }

    let sender = global.db.data.users[m.sender]; // Usuario que envía los créditos
    let receiver = global.db.data.users[mentionedJid]; // Usuario que recibe los créditos

    if (!receiver) {
        return conn.reply(m.chat, 'El usuario no está registrado o no se encontró en la base de datos.', m);
    }

    if (sender.limit < amount) {
        return conn.reply(m.chat, `No tienes suficientes *FENIXCOINS* para transferir. Tienes ${sender.limit} *FENIXCOINS*.`, m);
    }

    // Transferir créditos
    sender.limit -= amount;
    receiver.limit += amount;

    conn.reply(m.chat, `✅ *Transferencia Exitosa*

┏╍╍╍╍╍╍╍╍╍╍╍╍╍
┃• *transferidos:* ${amount} FENIXCOINS
┗╍╍╍╍╍╍╍╍╍╍╍╍╍

┏╍╍╍╍╍╍╍╍╍╍╍╍╍
┃• *tu saldo ahora:* ${sender.limit} FENIXCOINS
┗╍╍╍╍╍╍╍╍╍╍╍╍╍

@${mentionedJid.split('@')[0]} ahora tiene ${receiver.limit} FENIXCOINS.`, m, {
        mentions: [mentionedJid]
    });
}

handler.help = ['transferir cantidad @usuario'];
handler.tags = ['economy'];
handler.command = /^transferir$/i;

export default handler;
