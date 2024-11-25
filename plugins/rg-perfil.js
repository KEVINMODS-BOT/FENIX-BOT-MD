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
    "1": { name: "República Dominicana", flag: "🇩🇴" },
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
        conn.reply(m.chat, 'Por favor, regístrate usando el comando `.reg nombre.edad` antes de usar este comando.', m);
        return;
    }

    let { name, limit, age, banned, fuegos } = global.db.data.users[who];
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

    let str = `*[𝑭𝑬𝑵𝑰𝑿-𝑩𝑶𝑻 𝑴𝑫🐦‍🔥]*
    
*PERFIL DE* @${who.split('@')[0]}

*[👤] NOMBRE →* ${name}
*[📅] EDAD →* ${age} años
*[🔗] ID →* ${phoneNumber.getNumber('international')}
*[💬] NICKNAME →* ${username}
*[🌍] NACIONALIDAD →* ${country}
*[🐦‍🔥] FENIXCOINS →* ${limit}
*[🔥] FUEGOS →* ${fuegos || 0}
*[🔱] TOP →* ${topPosition} de ${sortedUsers.length}
*[🔱] RANGO →* ${rank}
*[🔒] ESTADO →* ${estado}

*[🔢] NÚMERO DE SERIE:* ${sn}`;

    // Enviar el video en lugar de una imagen
    conn.sendMessage(
        m.chat,
        {
            video: { url: 'https://d.uguu.se/waZwgVZT.mp4' }, // Ruta al video
            caption: str // Mensaje con los datos del perfil
        },
        { quoted: fkontak, mentions: mentionedJid }
    );
};

handler.help = ['profile [@user]'];
handler.tags = ['xp'];
handler.command = /^perfil|profile?$/i;

export default handler;
