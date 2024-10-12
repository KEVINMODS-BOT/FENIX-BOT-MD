let handler = async (m, { conn, text, usedPrefix, command }) => {
    console.log(`Comando recibido: ${command}, Texto: ${text}`); // Log del comando

    let mentionedJid = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : null;

    if (!mentionedJid) {
        console.log('No se mencionó a ningún usuario.'); // Log si no hay usuario mencionado
        return conn.reply(m.chat, `*[⚠️]* 𝙄𝙉𝙂𝙍𝙀𝙎𝙀 𝙀𝙇 𝙐𝙎𝙐𝘼𝙍𝙄𝙊 𝙐𝙎𝘼𝙉𝘿𝙊 *@usuario* 𝘿𝙀𝙎𝙋𝙐́𝙀𝙏𝙎 𝘿𝙀𝙇 𝘾𝙊𝙈𝘼𝙉𝘿𝙊\n\n𝙀𝙅𝙀𝙈𝙋𝙇𝙊: ${usedPrefix}${command} @usuario cantidad`, m);
    }

    let [_, amount] = text.trim().split(' ');
    amount = parseInt(amount);

    if (isNaN(amount) || amount <= 0) {
        console.log(`Cantidad no válida: ${amount}`); // Log si la cantidad no es válida
        return conn.reply(m.chat, `*[⚠️]* 𝙄𝙉𝙂𝙍𝙀𝙎𝙀 𝙇𝘼 𝘾𝘼𝙉𝙏𝙄𝘿𝘼𝘿 𝙌𝙐𝙄𝙀𝙍𝙀𝙎 𝘼𝙉̃𝘼𝘿𝙄𝙍 𝙏𝙊𝙏𝘼𝙇𝙀𝙎 𝙏𝙊𝙍𝙏𝙊 𝘼𝙇 𝙐𝙎𝙐𝘼𝙍𝙄𝙊 *@${mentionedJid.split('@')[0]}*\n\n𝙀𝙅𝙀𝙈𝙋𝙇𝙊: ${usedPrefix}${command} @usuario 10`, m);
    }

    let user = global.db.data.users[mentionedJid];
    if (!user) {
        console.log('Usuario no encontrado o no registrado.'); // Log si el usuario no se encuentra
        return conn.reply(m.chat, 'Usuario no encontrado o no registrado.', m);
    }

    if (command === 'agregarfuego') {
        user.fuegos += amount;
        console.log(`Agregado ${amount} fuegos a @${mentionedJid.split('@')[0]}`); // Log de fuegos agregados
        conn.reply(m.chat, `𝚂𝙴 𝙰 𝙰𝙽̃𝙰𝙳𝙸𝙳𝙾 *fuegos 🔥* 𝙰𝙻 𝚄𝚂𝚄𝙰𝚁𝙸𝙾 @${mentionedJid.split('@')[0]}\n\n┏╍╍╍╍╍╍╍╍╍╍╍╍╍\n┃• *agregados:* ${amount}\n┗╍╍╍╍╍╍╍╍╍╍╍╍╍\n\n┏╍╍╍╍╍╍╍╍╍╍╍╍╍\n┃• *tiene:* ${user.fuegos}\n┗╍╍╍╍╍╍╍╍╍╍╍╍╍`, m);
    } else if (command === 'quitarfuego') {
        if (user.fuegos < amount) {
            console.log('El usuario no tiene suficientes fuegos para quitar.'); // Log si no hay suficientes fuegos
            return conn.reply(m.chat, `El usuario no tiene suficientes *fuegos 🔥* para quitar. Tiene ${user.fuegos} fuegos.`, m);
        }
        user.fuegos -= amount;
        console.log(`Quitado ${amount} fuegos a @${mentionedJid.split('@')[0]}`); // Log de fuegos quitados
        conn.reply(m.chat, `𝚂𝙴 𝙷𝙰𝙽 𝚀𝚄𝙸𝚃𝙰𝙳𝙾 *fuegos 🔥* 𝙰𝙻 𝚄𝚂𝚄𝙰𝚁𝙸𝙾 @${mentionedJid.split('@')[0]}\n\n┏╍╍╍╍╍╍╍╍╍╍╍╍╍\n┃• *quitados:* ${amount}\n┗╍╍╍╍╍╍╍╍╍╍╍╍╍\n\n┏╍╍╍╍╍╍╍╍╍╍╍╍╍\n┃• *tiene:* ${user.fuegos}\n┗╍╍╍╍╍╍╍╍╍╍╍╍╍`, m);
    }
}

handler.help = ['agregarfuego @usuario cantidad', 'quitarfuego @usuario cantidad'];
handler.tags = ['admin'];
handler.command = /^(agregarfuego|quitarfuego)$/i;
handler.rowner = true; // Solo puede ser usado por el owner del bot

export default handler;
