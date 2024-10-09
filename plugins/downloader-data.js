import { createHash } from 'crypto';
import PhoneNumber from 'awesome-phonenumber';

// Mapeo de códigos de país a nombres y banderas de países latinoamericanos
const countryFlags = {
  AR: { name: 'Argentina', flag: '🇦🇷' },
  BO: { name: 'Bolivia', flag: '🇧🇴' },
  BR: { name: 'Brasil', flag: '🇧🇷' },
  CL: { name: 'Chile', flag: '🇨🇱' },
  CO: { name: 'Colombia', flag: '🇨🇴' },
  CR: { name: 'Costa Rica', flag: '🇨🇷' },
  CU: { name: 'Cuba', flag: '🇨🇺' },
  DO: { name: 'República Dominicana', flag: '🇩🇴' },
  EC: { name: 'Ecuador', flag: '🇪🇨' },
  SV: { name: 'El Salvador', flag: '🇸🇻' },
  GT: { name: 'Guatemala', flag: '🇬🇹' },
  HN: { name: 'Honduras', flag: '🇭🇳' },
  MX: { name: 'México', flag: '🇲🇽' },
  NI: { name: 'Nicaragua', flag: '🇳🇮' },
  PA: { name: 'Panamá', flag: '🇵🇦' },
  PY: { name: 'Paraguay', flag: '🇵🇾' },
  PE: { name: 'Perú', flag: '🇵🇪' },
  PR: { name: 'Puerto Rico', flag: '🇵🇷' },
  UY: { name: 'Uruguay', flag: '🇺🇾' },
  VE: { name: 'Venezuela', flag: '🇻🇪' },
  BZ: { name: 'Belice', flag: '🇧🇿' },
  GY: { name: 'Guyana', flag: '🇬🇾' },
  SR: { name: 'Surinam', flag: '🇸🇷' },
  JM: { name: 'Jamaica', flag: '🇯🇲' },
  TT: { name: 'Trinidad y Tobago', flag: '🇹🇹' },
  BB: { name: 'Barbados', flag: '🇧🇧' },
  BS: { name: 'Bahamas', flag: '🇧🇸' },
  AG: { name: 'Antigua y Barbuda', flag: '🇦🇬' },
  DM: { name: 'Dominica', flag: '🇩🇲' },
  GD: { name: 'Granada', flag: '🇬🇩' },
  KN: { name: 'San Cristóbal y Nieves', flag: '🇰🇳' },
  LC: { name: 'Santa Lucía', flag: '🇱🇨' },
  VC: { name: 'San Vicente y las Granadinas', flag: '🇻🇨' },
  HT: { name: 'Haití', flag: '🇭🇹' },
  AW: { name: 'Aruba', flag: '🇦🇼' },
  CW: { name: 'Curazao', flag: '🇨🇼' },
  SX: { name: 'Sint Maarten', flag: '🇸🇽' },
  BQ: { name: 'Caribe Neerlandés', flag: '🇧🇶' },
  GP: { name: 'Guadalupe', flag: '🇬🇵' },
  MQ: { name: 'Martinica', flag: '🇲🇶' },
  GF: { name: 'Guayana Francesa', flag: '🇬🇫' }
};

let handler = async (m, { conn, usedPrefix }) => {
  // Obtener el ID del usuario mencionado, o si se responde a un mensaje, obtener el del autor
  let userId = m.mentionedJid && m.mentionedJid[0] 
    ? m.mentionedJid[0] 
    : m.quoted 
      ? m.quoted.sender 
      : m.sender;

  // Obtener los datos del usuario de la base de datos
  let user = global.db.data.users[userId];

  // Obtener el número de teléfono
  let phoneNumber = new PhoneNumber('+' + userId.replace('@s.whatsapp.net', '')).getNumber('international');
  let countryCode = new PhoneNumber(phoneNumber).getRegionCode(); // Obtener el código del país
  let countryInfo = countryFlags[countryCode] || { name: 'Desconocido', flag: '🏳' }; // Obtener el país y la bandera
  let serialNumber = createHash('md5').update(userId).digest('hex'); // Número de serie basado en ID
  let whatsappLink = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}`; // Crear el enlace de WhatsApp
  let username = await conn.getName(userId); // Obtener el nombre de usuario

  // Si el usuario no está registrado en la base de datos, asignar valores predeterminados
  let limit = user ? user.limit || 0 : 'No tiene registro'; // Obtener créditos del usuario o mostrar "No tiene registro"
  let registerDate = user ? new Date(user.registered || Date.now()).toLocaleDateString() : 'No tiene registro'; // Fecha de registro o "No tiene registro"
  let isActive = user ? (user.banned ? 'BANEADO [❌]' : 'LIBRE [✅]') : 'No tiene registro'; // Estado de actividad o "No tiene registro"
  let age = user && user.age > 0 ? user.age : 'Desconocido'; // Edad del usuario

  // Crear el mensaje de respuesta
  let profileInfo = `
❰🔗❱ *ID* → ${whatsappLink}
❰👤❱ *NOMBRE* → ${user ? username : 'No tiene registro'}
❰📅❱ *EDAD* → ${user ? age + ' años' : 'No tiene registro'}
❰💬❱ *USUARIO* → @${userId.split('@')[0]}
❰🇨🇴❱ *PAÍS* → ${countryInfo.flag} ${countryInfo.name}
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
