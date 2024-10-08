import { createHash } from 'crypto';
import PhoneNumber from 'awesome-phonenumber';

// Define el ID del propietario del bot (reemplaza 'owner_number@whatsapp.net' con el número real del propietario)
const OWNER_ID = 'owner_number@whatsapp.net';

let handler = async (m, { conn, usedPrefix }) => {
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
  let isActive = user.banned ? 'BANEADO [❌]' : 'LIBRE [✅]'; // Estado de actividad
  let age = user.age || 'Desconocido'; // Edad del usuario
  let phoneNumber = new PhoneNumber('+' + userId.replace('@s.whatsapp.net', '')).getNumber('international'); // Obtener número de teléfono
  let serialNumber = createHash('md5').update(userId).digest('hex'); // Número de serie basado en ID

  // Crear el mensaje de respuesta
  let profileInfo = `
❰🔗❱ *ID* → ${userId}
❰👤❱ *NOMBRE* → ${username}
❰📅❱ *EDAD* → ${age} años
❰💬❱ *USUARIO* → @${userId.split('@')[0]}
❰💰❱ *LIMIT* → ${limit}  // Créditos se referencia con limit
❰🗓❱ *REGISTRO* → ${registerDate}
❰💯❱ *ESTADO* → ${isActive}
❰🔢❱ *NÚMERO DE SERIE* → ${serialNumber}
  `.trim();

  // Enviar la información del perfil
  await conn.reply(m.chat, profileInfo, m, {
    mentions: [userId] // Mencionar al usuario
  });
}

handler.help = ['data @usuario'];
handler.tags = ['info'];
handler.command = /^data$/i; // El comando será '.data'

export default handler;
