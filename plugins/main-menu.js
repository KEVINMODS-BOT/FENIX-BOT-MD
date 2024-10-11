let handler = async (m, { conn, db }) => {
  try {
    let name = await conn.getName(m.sender)
    
    // Contar usuarios registrados
    let registeredUsers = Object.values(global.db.data.users).filter(user => user.registered).length;

    let menuText = `

\`M E N U  -  F E N I X\`

*ＢＩＥＮＶＥＮＩＤＯ*
*➢ @${name}*

┌┰┰┰─┮┭─┭─┰──┰─┓

          *INFO - BOT*

*➢ [👨🏻‍💻] \`CREADOR:\`* Kevinmodz
*➢ [💮] \`ACTUALIZACION:\`* 1.1.1
*➢ [👥] \`USUARIOS:\`* ${registeredUsers} registrados
*➢ [🪽] \`GRUPO:\`*
*➢ [🪼] \`CANAL:\`* 

└──┸─┸┸─┸─┸┸┸┸─┙
`.trim()

    let thumbnailBuffer = await fetchBuffer("https://qu.ax/GsHEY.jpg");

    await conn.sendMessage(m.chat, { 
      text: menuText, 
      contextInfo: { 
        externalAdReply: {
          title: "Haz clic para ver el canal",
          body: "Canal oficial de WhatsApp",
          mediaType: 1,
          mediaUrl: "https://whatsapp.com/channel/0029VapwUi0Dp2QC3xO9PX42",
          sourceUrl: "https://whatsapp.com/channel/0029VapwUi0Dp2QC3xO9PX42",
          thumbnail: thumbnailBuffer
        }
      }
    }, { quoted: m })

  } catch (e) {
    conn.reply(m.chat, 'Lo sentimos, el menú tiene un error.', m)
    throw e
  }
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu', 'help', 'menú'] 
handler.register = true 
export default handler

async function fetchBuffer(url) {
  let res = await fetch(url)
  return await res.buffer()
}
