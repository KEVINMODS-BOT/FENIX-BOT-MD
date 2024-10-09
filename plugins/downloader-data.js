import { createHash } from 'crypto';
import PhoneNumber from 'awesome-phonenumber';

let handler = async (m, { conn, usedPrefix, isAdmin, isGroupAdmin }) => {
  // Verificar si el comando está siendo usado en un grupo y si el remitente es un administrador
  if (!m.isGroup) {
    return conn.reply(m.chat, 'Este comando solo puede ser utilizado en grupos.', m);
  }
  if (!isAdmin && !isGroupAdmin) {
    return conn.reply(m.chat, 'Este comando solo puede ser utilizado por administradores.', m);
  }

  // Obtener el ID del usuario ya sea por mención o por respuesta a un mensaje
  let userId = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : null;

  // Si no se menciona o responde a ningún usuario
  if (!userId) {
    return conn.reply(m.chat, `Etiqueta a un usuario o responde a su mensaje, por ejemplo: *${usedPrefix}data @usuario*`, m);
  }

  // Obtener la información del usuario
  let user = global.db.data.users[userId];
  let phoneNumber = new PhoneNumber('+' + userId.replace('@s.whatsapp.net', '')); // Obtener el número de teléfono
  let serialNumber = createHash('md5').update(userId).digest('hex'); // Número de serie basado en ID
  let whatsappLink = `https://wa.me/${phoneNumber.getNumber('significant')}`; // Crear el enlace de WhatsApp
  let username = await conn.getName(userId); // Obtener el nombre de usuario

  // Obtener el país y la bandera del número
  let country = phoneNumber.getRegionCode(); // Código del país (ejemplo: US, MX, etc.)
  let countryName = country ? phoneNumber.getRegionCode() : 'Desconocido'; // Nombre del país o "Desconocido"
  let flag = getFlagEmoji(country); // Obtener la bandera como emoji

  // Si el usuario no está registrado, asignar valores predeterminados
  let limit = user ? user.limit || 0 : 'No tiene registro'; // Créditos del usuario o "No tiene registro"
  let registerDate = user ? new Date(user.registered || Date.now()).toLocaleDateString() : 'No tiene registro'; // Fecha de registro o "No tiene registro"
  let isActive = user ? (user.banned ? 'BANEADO [❌]' : 'LIBRE [✅]') : 'No tiene registro'; // Estado de actividad o "No tiene registro"

  // Validar la edad: si es válida y positiva, mostrarla, si no, mostrar "Desconocido"
  let age = user && user.age > 0 ? user.age : 'Desconocido';

  // Crear el mensaje de respuesta
  let profileInfo = `
❰🔗❱ *ID* → ${whatsappLink}
❰👤❱ *NOMBRE* → ${user ? username : 'No tiene registro'}
❰📅❱ *EDAD* → ${user ? age + ' años' : 'No tiene registro'}
❰💬❱ *USUARIO* → @${userId.split('@')[0]}
❰🌍❱ *PAÍS* → ${flag} ${countryName}
❰💰❱ *CREDITOS* → ${limit}
❰🗓❱ *REGISTRO* → ${registerDate}
❰💯❱ *ESTADO* → ${isActive}
❰🔢❱ *NÚMERO DE SERIE* → ${serialNumber}
  `.trim();

  // Enviar la información del perfil
  await conn.reply(m.chat, profileInfo, m, {
    mentions: [userId] // Mencionar al usuario
  });
}

// Función para obtener la bandera basada en el código del país
function getFlagEmoji(countryCode) {
  if (!countryCode) return '';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

handler.help = ['data @usuario'];
handler.tags = ['info'];
handler.command = /^data$/i; // El comando será '.data'
handler.admin = true; // Solo para administradores
handler.group = true; // Solo en grupos

export default handler;
