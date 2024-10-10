let handler = async (m, { conn, participants, usedPrefix, command, isROwner }) => {
	
let kickte = `🟡 Menciona al usuario que deseas eliminar.`

if (!m.mentionedJid[0] && !m.quoted) return m.reply(kickte, m.chat, { mentions: conn.parseMention(kickte)}) 
let user = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender
let owr = m.chat.split`-`[0]
await conn.groupParticipantsUpdate(m.chat, [user], 'remove')
m.reply(`*𝑭𝑬𝑵𝑰𝑿-𝑩𝑶𝑻 𝑴𝑫🐦‍🔥 ELIMINO AL USUARIO CON EXITO👁‍🗨*`)
m.reply(`Lo siento, acabas de ser eliminado del grupo.`, user)
}

handler.help = ['kick *@user*']
handler.tags = ['group']
handler.command = ['kick', 'expulsar'] 
handler.admin = true
handler.group = true
handler.botAdmin = true

export default handler
