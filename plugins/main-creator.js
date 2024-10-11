

let handler = async (m, { conn, usedPrefix, isOwner }) => {
    let vcard1 = `BEGIN:VCARD\nVERSION:3.0\nN:𝑲𝑬𝑽𝑰𝑵 👨🏻‍💻;;\nFN:𝑲𝑬𝑽𝑰𝑵𝑴𝑶𝑫𝑺 👨🏻‍💻 \nORG:𝐂𝐑𝐄𝐀𝐃𝐎𝐑 𝐎𝐅𝐂 👁‍🗨\nTITLE:\nitem1.TEL;waid=5493624187763:+5493624187763\nitem1.X-ABLabel:𝑲𝑬𝑽𝑰𝑵𝑴𝑶𝑫𝑺 👨🏻‍💻\nX-WA-BIZ-DESCRIPTION:𝙳𝚄𝙳𝙰𝚂 𝙴𝚂𝙲𝚁𝙸𝙱𝙸𝚁𝙼𝙴 👇🏻\nX-WA-BIZ-NAME:𝐀𝐋𝐃𝐀𝐈𝐑 👨🏻‍💻\nEND:VCARD`;

    let vcard2 = `BEGIN:VCARD\nVERSION:3.0\nN:𝑨𝑳𝑫𝑨𝑰𝑹 👨🏻‍💻;;\nFN:𝑨𝑳𝑫𝑨𝑰𝑹 👨🏻‍💻\nORG:𝚂𝙾𝙿𝙾𝚁𝚃𝙴 🌐\nTITLE:\nitem1.TEL;waid=51925015528:+51925015528\nitem1.X-ABLabel:𝑨𝑳𝑫𝑨𝑰𝑹 👨🏻‍💻\nX-WA-BIZ-DESCRIPTION:𝚎𝚛𝚛𝚘𝚛𝚎𝚜 𝚎𝚜𝚌𝚛𝚒𝚋𝚒𝚛𝚖𝚎 👇🏻\nX-WA-BIZ-NAME:𝑨𝑳𝑫𝑨𝑰𝑹 𝑺𝑶𝑷𝑶𝑹𝑻 👨🏻‍💻\nEND:VCARD`;

    await conn.sendMessage(m.chat, {
        contacts: {
            displayName: 'Contactos',
            contacts: [
                { vcard: vcard1 },
                { vcard: vcard2 },
            ]
        }
    }, { quoted: m });
}

handler.help = ['owner']
handler.tags = ['main']
handler.command = ['owner', 'creator', 'creador', 'dueño'] 

export default handler
