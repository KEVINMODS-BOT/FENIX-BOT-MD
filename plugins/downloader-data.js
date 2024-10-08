let handler = async (m, { conn, args, usedPrefix, command }) => {
    // Define el ID del propietario del bot (reemplaza 'owner_number@whatsapp.net' con el número real del propietario)
    const OWNER_ID = 'owner_number@whatsapp.net';

    // Verificar si el usuario que envía el comando es el propietario
    if (m.sender !== OWNER_ID) {
        return conn.reply(m.chat, 'Este comando solo puede ser utilizado por el propietario del bot.', m);
    }

    // Asegurarse de que haya un usuario mencionado
    if (!m.mentionedJid || !m.mentionedJid[0]) {
        return conn.reply(m.chat, `Etiqueta a un usuario con el comando, por ejemplo: *${usedPrefix}data @usuario*`, m);
    }

    // Obtener el ID del usuario etiquetado
    let userId = m.mentionedJid[0];
    let user = global.db.data.users[userId];

    // Si el usuario no está registrado en la base de datos, enviar un mensaje
    if (!user) {
        return conn.reply(m.chat, `El usuario no está registrado en la base de datos.`, m);
    }

    // Extraer la información del usuario
    let username = await conn.getName(userId); // Obtener el nombre
    let limit = user.limit || 0; // Obtener créditos del usuario
    let registerDate = new Date(user.registered || Date.now()).toLocaleDateString(); // Fecha de registro
    let isActive = user.active ? 'ACTIVO' : 'INACTIVO'; // Estado de actividad

    // Obtener el número de teléfono en formato internacional
    let phoneNumber = userId.replace('@s.whatsapp.net', '');
    let whatsappLink = `https://wa.me/${phoneNumber}`; // Crear el enlace de WhatsApp

    // Crear el mensaje de respuesta
    let profileInfo = `
❰🔗❱ *ID* → [${whatsappLink}](${whatsappLink})
❰👤❱ *NOMBRE* → ${username}
❰💬❱ *USUARIO* → @${userId.replace(/@.+/, '')}
❰📅❱ *EDAD* → ${age} años
❰💰❱ *CREDITOS* → ${limit}
❰💯❱ *ESTADO* → ${isActive}
❰🔢❱ *NÚMERO DE SERIE* → ${serialNumber}
    `.trim();

    // Enviar la información del perfil
    await conn.reply(m.chat, profileInfo, m, {
        mentions: [userId] // Mencionar al usuario
    });
};

handler.help = ['data @usuario'];
handler.tags = ['info'];
handler.command = /^data$/i; // El comando será '.data'
handler.rowner = true; // Solo puede ser usado por el owner del bot

export default handler;
