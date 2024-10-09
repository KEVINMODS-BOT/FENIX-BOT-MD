import { createHash } from 'crypto';
import PhoneNumber from 'awesome-phonenumber';

let handler = async (m, { conn, usedPrefix }) => {
  // Asegurarse de que haya un usuario mencionado
  if (!m.mentionedJid || !m.mentionedJid[0]) {
    return conn.reply(m.chat, `Etiqueta a un usuario con el comando, por ejemplo: *${usedPrefix}data @usuario*`, m);
  }

  // Obtener el ID del usuario etiquetado
  let userId = m.mentionedJid[0];
  let user = global.db.data.users[userId];

  // Si el usuario no está registrado en la base de datos, asignar valores predeterminados
  let username = user ? await conn.getName(userId) : 'No tiene registro'; // Obtener el nombre o mostrar "No tiene registro"
  let limit = user ? user.limit || 0 : 'No tiene registro'; // Obtener créditos del usuario o mostrar "No tiene registro"
  let registerDate = user ? new Date(user.registered || Date.now()).toLocaleDateString() : 'No tiene registro'; // Fecha de registro o "No tiene registro"
  let isActive = user ? (user.banned ? 'BANEADO [❌]' : 'LIBRE [✅]') : 'No tiene registro'; // Estado de actividad o "No tiene registro"
  let age = user ? user.age || 'Desconocido' : 'No tiene registro'; // Edad del usuario o "No tiene registro"
  let phoneNumber = user ? new PhoneNumber('+' + userId.replace('@s.whatsapp.net', '')).getNumber('international') : 'No tiene registro'; // Obtener número de teléfono o "No tiene registro"
  let serialNumber = user ? createHash('md5').update(userId).digest('hex') : 'No tiene registro'; // Número de serie basado en ID o "No tiene registro"

  // Definir el enlace de WhatsApp basado en el número de teléfono, si está registrado
  let whatsappLink = user ? `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}` : 'No tiene registro'; // Crear el enlace de WhatsApp o "No tiene registro"

  // Crear el mensaje de respuesta
  let profileInfo = `
❰🔗❱ *ID* → ${whatsappLink}
❰👤❱ *NOMBRE* → ${username}
❰📅❱ *EDAD* → ${age} años
❰💬❱ *USUARIO* → @${userId.split('@')[0]}
❰💰❱ *LIMIT* → ${limit}
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
