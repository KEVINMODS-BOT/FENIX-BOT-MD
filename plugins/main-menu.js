import ws from 'ws';
import PhoneNumber from 'awesome-phonenumber';

let handler = async (m, { conn, usedPrefix, text, args, command }) => {
    let uniqueUsers = new Map();

    let users = [...uniqueUsers.values()];
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
    let totalUsers = users.length;
    let totalusr = Object.keys(global.db.data.users).length;
    let rtotal = Object.entries(global.db.data.users).length || '0'
    let _uptime = process.uptime() * 1000;
    let uptime = clockString(_uptime);
    let username = conn.getName(m.sender);
    let name = conn.getName(m.sender)
    let api = await axios.get(`https://deliriusapi-official.vercel.app/tools/country?text=${PhoneNumber('+' + who.replace('@s.whatsapp.net', '')).getNumber('international')}`)
    let userNationalityData = api.data.result
    let userNationality = userNationalityData ? `${userNationalityData.name}` : 'Desconocido'
    let locale = 'es';
    let d = new Date(new Date + 3600000);
    let time = d.toLocaleTimeString(locale, {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    });

    let totalreg = Object.keys(global.db.data.users).length;
    let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length;

    m.react("🐢");
    let txt =  `ि ฺ࣭࣪͘ \`ʜᴏʟᴀ\` p𝖾𝗋᷼𝗌᷼♤𝗇᷼𝗂𝗍α 𝗅𝗂𝗇𝖽α (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)⁠✧⁠*⁠।
    b𝗂𝖾𝗇𝖾𝗇𝗂𝖽𝗈   𝖺   ყαҽɱσɾι Ⴆσƚ꒱㇀  🌸‛᩠⋆  ⪦┽  :
    •ㅤ༚      𝆹ㅤㅤ•ㅤ༚         𝆹ㅤㅤㅤ•ᨘ`

    txt += '.͜°˖ `ᴄʀᴇᴀᴅᴏʀ ::`' + ` Kevinmodz\n`;
    txt += '.͜°˖ `ʙᴏᴛ ::`' + ` YaemoriBot-MD\n`;
    txt += '.͜°˖ `ꜰᴇᴄʜᴀ ::`' + ` ${moment.tz('America/Bogota').format('DD/MM/YY')}\n`;
    txt += '.͜°˖ `ᴘᴀɪs ::`' + ` ${userNationality}\n`;
    txt += '.͜°˖ `ᴘʀᴇꜰɪᴊᴏ ::`' + ` 「 ${usedPrefix} 」\n`;
    txt += '.͜°˖ `ᴜꜱᴜᴀʀɪᴏꜱ ::`' + ` ${rtotal}\n`;
    txt += '.͜°˖ `ᴄᴏɴᴛᴀᴄᴛᴏ ::` #owner\n\n';
    txt += '.͜°˖ `ᴀᴄᴛɪᴠᴏ ::`' + ` ${uptime}\n`;
    txt += "✬✭✰✬";

    let listSections = [];

    listSections.push({
        title: `✎ SELECCIONA LO QUE NECESITAS`, highlight_label: `Popular YaemoriBot`,
        rows: [
            {
                header: "𓆩࿔ྀુ⃟🌹⃟𝘼𝙐𝙏𝙊 𝙑𝙀𝙍𝙄𝙁𝙄𝘾𝘼𝙍 ╎✅",
                description: `🗃 Verificacion Automática`,
                id: `#reg ${name}.18`,
            },
            {
                header: "𓆩࿔ྀુ⃟🌹⃟𝙈𝙀𝙉𝙐 𝘾𝙊𝙈𝙋𝙇𝙀𝙏𝙊 ╎ 🍿ꪳ͢",
                description: `🐢 Muestra el menú completo.`,
                id: `#allmenu`,
            },
            {
                header: "𓆩࿔ྀુ⃟🌹⃟𝙈𝙀𝙉𝙐 𝙉𝙎𝙁𝙒 ╎🔞",
                description: `🔥 Muestra el menú +18.`,
                id: `#hornymenu`,
            },
            {
                header: "𓆩࿔ྀુ⃟🌹⃟𝙂𝙄𝙏𝙃𝙐𝘽 ╎ ⭐️",
                description: `🍟 Muestra el github de la bot.`,
                id: `#sc`,
            },
            {
                header: "𓆩࿔ྀુ⃟🌹⃟𝙎𝙆𝙔 𝙐𝙇𝙏𝙍𝘼 𝙋𝙇𝙐𝙎 ╎ 💸",
                description: `⚡️ Super hosting, Sky Ultra Plus.`,
                id: `#skyplus`,
            },
        ],
    });

    let vid = "https://qu.ax/yddg.jpg";
    let img = "https://qu.ax/fprhC.jpg";
    let img2 = "https://qu.ax/uuYfC.jpg";

    await conn.sendListB(m.chat, 'Menú Principal', txt, ` 𓏲᭨ ̤̤֟✧⏤͟͞ू⃪٭ۣۜ ፝͜⁞M͢ᴇɴᴜs۫۫۫۫۫۫ ᭄፝🍟𑜟꙲𒁑⁩`, [vid, img, img2].getRandom(), listSections);
};

handler.tags = ['main'];
handler.help = ['menu'];
handler.command = ["menu", "help", "menú"];

export default handler;

function clockString(ms) {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor(ms / 60000) % 60;
  const s = Math.floor(ms / 1000) % 60;
  return [h, m, s].map((v) => v.toString().padStart(2, 0)).join(":");
}
