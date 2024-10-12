let modifyFuegos = async (m, { conn, args, participants }) => {
    // Verifica si se menciona a un usuario
    if (!m.mentionedJid || m.mentionedJid.length === 0) {
        return conn.reply(m.chat, 'Por favor, menciona a un usuario para agregar o quitar fuegos.', m);
    }

    // Usuario mencionado
    let user = global.db.data.users[m.mentionedJid[0]];

    // Verifica si se especifica una cantidad válida
    let cantidad = parseInt(args[1]);
    if (!cantidad || isNaN(cantidad)) {
        return conn.reply(m.chat, 'Por favor, especifica una cantidad válida de fuegos.', m);
    }

    // Definir mensajes de estilo
    let fireText = (fuegos) => `
╭━━━🔥━━━⬣
┃ *🔥 Fuegos: ${fuegos}*
┃ *👤 Usuario: @${m.mentionedJid[0].split('@')[0]}*
╰━━━🔥━━━⬣`;

    if (m.command === 'agregarfuego') {
        // Agregar fuegos
        user.fuegos = (user.fuegos || 0) + cantidad;
        await conn.reply(m.chat, fireText(cantidad), m, { mentions: [m.mentionedJid[0]] });
    } else if (m.command === 'quitarfuego') {
        if ((user.fuegos || 0) < cantidad) {
            return conn.reply(m.chat, 'El usuario no tiene suficientes fuegos para quitar esa cantidad.', m);
        }

        // Quitar fuegos
        user.fuegos -= cantidad;
        await conn.reply(m.chat, fireText(-cantidad), m, { mentions: [m.mentionedJid[0]] });
    }
};

modifyFuegos.help = ['agregarfuego @user <cantidad>', 'quitarfuego @user <cantidad>'];
modifyFuegos.tags = ['admin'];
modifyFuegos.command = /^(agregarfuego|quitarfuego)$/i;
modifyFuegos.admin = true; // Solo administradores pueden usar este comando

export default modifyFuegos;
