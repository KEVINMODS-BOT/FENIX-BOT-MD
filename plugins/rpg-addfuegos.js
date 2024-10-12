let handler = async (m, { conn, text, usedPrefix, command }) => {
    // Verifica que se haya mencionado a un usuario
    let mentionedJid = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : null;
    
    if (!mentionedJid) {
        return conn.reply(m.chat, `*[⚠️]* 𝙋𝙊𝙍 𝙁𝙊𝙍𝙏𝙐𝙉𝘼, 𝙀𝙍𝙊𝙍: No se mencionó a ningún usuario. Por favor, utiliza *@usuario* para mencionar al usuario deseado.\n\nEjemplo: ${usedPrefix}${command} @usuario 10`, m);
    }

    // Obtén la cantidad y verifica si es válida
    let [_, amount] = text.trim().split(' ');
    amount = parseInt(amount);

    if (isNaN(amount) || amount <= 0) {
        return conn.reply(m.chat, `*[⚠️]* 𝙋𝙊𝙍 𝙁𝙊𝙍𝙏𝙐𝙉𝘼, 𝙀𝙍𝙊𝙍: Por favor, ingrese una cantidad válida de fuegos a agregar o quitar.`, m);
    }

    let user = global.db.data.users[mentionedJid];

    if (!user) {
        return conn.reply(m.chat, `*[⚠️]* 𝙑𝙀𝙍𝙄𝙁𝙌𝙐𝙀 𝙌𝙐𝙀 𝙀𝙇 𝙐𝙎𝙐𝘼𝙍𝙄𝙊 *@${mentionedJid.split('@')[0]}* está registrado en la base de datos.`, m);
    }

    // Acciones para agregar o quitar fuegos
    if (command === 'agregarfuego') {
        user.fuegos = (user.fuegos || 0) + amount; // Inicializa si no existe
        conn.reply(m.chat, `✔️ 𝚂𝙴 𝙰 𝙰𝙽̃𝙰𝙳𝙸𝙳𝙾 *${amount} fuegos 🔥* 𝙰𝙻 𝚄𝚂𝚄𝙰𝚁𝙸𝙾 @${mentionedJid.split('@')[0]}.\n\n┏╍╍╍╍╍╍╍╍╍╍╍╍╍\n┃• *Fuegos Totales:* ${user.fuegos}\n┗╍╍╍╍╍╍╍╍╍╍╍╍╍`, m);
    } else if (command === 'quitarfuego') {
        if (user.fuegos < amount) {
            return conn.reply(m.chat, `❌ 𝙀𝙍𝙊𝙍: El usuario no tiene suficientes fuegos 🔥 para quitar. Tiene solamente ${user.fuegos}.`, m);
        }
        user.fuegos -= amount;
        conn.reply(m.chat, `✔️ 𝚂𝙴 𝙷𝙰𝙽 𝚀𝚄𝙸𝚃𝙰𝙳𝙾 *${amount} fuegos 🔥* 𝙰𝙻 𝚄𝚂𝚄𝙰𝚁𝙸𝙾 @${mentionedJid.split('@')[0]}.\n\n┏╍╍╍╍╍╍╍╍╍╍╍╍╍\n┃• *Fuegos Totales:* ${user.fuegos}\n┗╍╍╍╍╍╍╍╍╍╍╍╍╍`, m);
    }
}

handler.help = ['agregarfuego @usuario cantidad', 'quitarfuego @usuario cantidad'];
handler.tags = ['admin']; // Cambiar a 'owner' si solo el dueño debe usarlo
handler.command = /^(agregarfuego|quitarfuego)$/i;
handler.rowner = true; // Solo puede ser usado por el dueño del bot

export default handler;
