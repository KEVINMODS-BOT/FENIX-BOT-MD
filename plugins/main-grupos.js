import fetch from 'node-fetch'

let handler  = async (m, { conn, usedPrefix, command }) => {
let img = await (await fetch(`https://qu.ax/LXzyv.jpg`)).buffer()
const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)
let txt = `Bienvenido *@${m.sender.split('@')[0]}* aquí encontraras los grupos y canales de la bot ♥︎

*【 GRUPO 】*

*https://chat.whatsapp.com/HI1M164O0Z3FemZ3Wvmqro*


*【 CANALES 】*

*https://whatsapp.com/channel/0029VapwUi0Dp2QC3xO9PX42*

> 🚩 ${textbot}`
await conn.sendFile(m.chat, img, "Thumbnail.jpg", txt, m, null, rcanal)
}
handler.help = ['grupos']
handler.tags = ['main']
handler.command = /^(grupos)$/i
export default handler
