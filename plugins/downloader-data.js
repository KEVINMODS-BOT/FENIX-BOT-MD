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

  // Obtener siempre estos datos, incluso si el usuario no está registrado
  let phoneNumber = new PhoneNumber('+' + userId.replace('@s.whatsapp.net', '')).getNumber('international'); // Obtener número de teléfono
  let serialNumber = createHash('md5').update(userId).digest('hex'); // Número de serie basado en ID
  let whatsappLink = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}`; // Crear el enlace de WhatsApp
  let username = await conn.getName(userId); // Obtener el nombre de usuario

  // Si el usuario no está registrado en la base de datos, asignar valores predeterminados
  let limit = user ? user.limit || 0 : 'No tiene registro'; // Obtener créditos del usuario o mostrar "No tiene registro"
  let registerDate = user ? new Date(user.registered || Date.now()).toLocaleDateString() : 'No tiene registro'; // Fecha de registro o "No tiene registro"
  let isActive = user ? (user.banned ? 'BANEADO [❌]' : 'LIBRE [✅]') : 'No tiene registro'; // Estado de actividad o "No tiene registro"
  
  // Validar la edad: si es un número válido y positivo, mostrarla, si no, mostrar "Desconocido"
  let age = user && user.age > 0 ? user.age : 'Desconocido';

  // Crear el mensaje de respuesta
  let profileInfo = `
❰🔗❱ *ID* → ${whatsappLink}
❰👤❱ *NOMBRE* → ${user ? username : 'No tiene registro'}
❰📅❱ *EDAD* → ${user ? age + ' años' : 'No tiene registro'}
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
