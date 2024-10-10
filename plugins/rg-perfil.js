
import { createHash } from 'crypto';
import PhoneNumber from 'awesome-phonenumber';

// Mapa de prefijos de países de Latinoamérica con nombres y banderas
const countryPrefixes = {
    "54": { name: "Argentina", flag: "🇦🇷" },
    "591": { name: "Bolivia", flag: "🇧🇴" },
    "55": { name: "Brasil", flag: "🇧🇷" },
    "56": { name: "Chile", flag: "🇨🇱" },
    "57": { name: "Colombia", flag: "🇨🇴" },
    "506": { name: "Costa Rica", flag: "🇨🇷" },
    "53": { name: "Cuba", flag: "🇨🇺" },
    "593": { name: "Ecuador", flag: "🇪🇨" },
    "503": { name: "El Salvador", flag: "🇸🇻" },
    "502": { name: "Guatemala", flag: "🇬🇹" },
    "509": { name: "Haití", flag: "🇭🇹" },
    "504": { name: "Honduras", flag: "🇭🇳" },
    "52": { name: "México", flag: "🇲🇽" },
    "505": { name: "Nicaragua", flag: "🇳🇮" },
    "507": { name: "Panamá", flag: "🇵🇦" },
    "595": { name: "Paraguay", flag: "🇵🇾" },
    "51": { name: "Perú", flag: "🇵🇪" },
    "1": { name: "República Dominicana", flag: "🇩🇴" }, // República Dominicana comparte el prefijo con EE.UU y Canadá
    "598": { name: "Uruguay", flag: "🇺🇾" },
    "58": { name: "Venezuela", flag: "🇻🇪" },
};

// Función para obtener el nombre del país y la bandera según el prefijo del número
function getCountryByPrefix(phoneNumber) {
    let prefix = phoneNumber.getCountryCode();
    let country = countryPrefixes[prefix];
    return country ? `${country.flag} ${country.name}` : 'Desconocido';
}

let handler = async (m, { conn, usedPrefix }) => {
    let fkontak = {
        "key": {
            "participants": "0@s.whatsapp.net",
            "remoteJid": "status@broadcast",
            "fromMe": false,
            "id": "Halo"
        },
        "message": {
            "contactMessage": {
                "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
            }
        },
        "participant": "0@s.whatsapp.net"
    };

    let user = global.db.data.users[m.sender];
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;

    // Verificar si el usuario está registrado
    if (!user.registered) {
        conn.reply(m.chat, 'Por favor, regístrate usando el comando `.reg nombre.edad.pais` antes de usar este comando.', m);
        return;
    }

    let pp = 'https://qu.ax/KFrad.jpg';
    try {
        pp = await conn.getProfilePicture(who);
    } catch (e) {
        // Manejar errores si es necesario
    }

    let { name, limit, lastclaim, registered, regTime, age, banned, level, premiumTime } = global.db.data.users[who];
    let mentionedJid = [who];
    let username = conn.getName(who);
    let prem = global.prems.includes(who.split`@`[0]);
    let sn = createHash('md5').update(who).digest('hex');

    // Calcular el top de créditos
    let sortedUsers = Object.entries(global.db.data.users)
        .filter(([jid, user]) => user.registered)
        .sort(([, a], [, b]) => b.limit - a.limit);

    let topPosition = sortedUsers.findIndex(([jid, u]) => jid === who) + 1;

    // Calcular el rango del usuario
    let rank;
    if (limit >= 1700) rank = '💮 LEYENDA';
    else if (limit >= 1200) rank = '🃏 MAESTRO';
    else if (limit >= 700) rank = '💎 DIAMANTE';
    else if (limit >= 300) rank = '🥇 ORO';
    else if (limit >= 100) rank = '🥈 PLATA';
    else rank = '🥉 BRONCE';

    // Verificar si es usuario premium y cuánto tiempo le queda
    let premiumStatus = prem ? `Usuario VIP (Expira en ${Math.max(0, Math.floor((premiumTime - Date.now()) / (24 * 60 * 60 * 1000)))} días)` : 'Usuario Regular';

    // Obtener el país y la bandera basado en el prefijo del número de teléfono
    let phoneNumber;
    try {
        phoneNumber = new PhoneNumber('+' + who.replace('@s.whatsapp.net', ''));
    } catch (e) {
        phoneNumber = { getCountryCode: () => '', getNumber: () => 'Desconocido' };
    }
    let country = getCountryByPrefix(phoneNumber);

    // Definir estado basado en si el usuario está baneado o no
    let estado = banned ? 'BANEADO [❌]' : 'LIBRE [✅]';

    let str = `*[𝘽𝙄𝙇𝙇 - 𝘽𝙊𝙏]*
    
*PERFIL DE* @${who.split('@')[0]}

*[👤] NOMBRE →* ${name}
*[📅] EDAD →* ${age} años
*[🔗] ID →* ${phoneNumber.getNumber('international')}
*[💬] NICKNAME →* ${username}
*[🌍] NACIONALIDAD →* ${country}
*[💸] CRÉDITOS →* ${limit}
*[💵] CRÉDITOS EN EL BANCO →* ${user.banco || 0}
*[🔱] TOP →* ${topPosition} de ${sortedUsers.length}
*[🔱] RANGO →* ${rank}
*[🔒] ESTADO →* ${estado}

*[🔢] NÚMERO DE SERIE:* ${sn}

.topcreditos para ver los mejores en créditos`;

    conn.sendFile(m.chat, pp, 'pp.jpg', str, fkontak, false, { contextInfo: { mentionedJid }});
};

handler.help = ['profile [@user]'];
handler.tags = ['xp'];
handler.command = /^perfil|profile?$/i;

export default handler;

// Comando para mostrar datos del usuario
let dataHandler = async (m, { conn }) => {
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender;

    let user = global.db.data.users[who];
    if (!user) {
        return conn.reply(m.chat, 'El usuario no está registrado en la base de datos.', m);
    }

    let str = `
❰🔗❱ *ID* → ${who}
❰👤❱ *NOMBRE* → ${user.name || 'Desconocido'}
❰💬❱ *USUARIO* → @${who.split('@')[0]}
❰💰❱ *CREDITOS* → ${user.limit || 0}
❰🗓❱ *REGISTRO* → ${new Date(user.registered).toLocaleDateString() || 'Desconocido'}
❰💯❱ *ESTADO* → ${user.banned ? 'BANEADO [❌]' : 'NOBANEADO [✅]'}
    `.trim();

    conn.reply(m.chat, str, m, {
        mentions: [who]
    });
};

dataHandler.help = ['data [@user]'];
dataHandler.tags = ['info'];
dataHandler.command = /^data$/i;

export { handler, dataHandler };
