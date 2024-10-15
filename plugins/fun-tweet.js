import fetch from "node-fetch"
import canvafy from 'canvafy'

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
if (!text) return m.reply(`✧ Ejemplo : Nombre | Usuario | Tweet`)
let nama1 = text.split("|")[0]
let nama2 = text.split("|")[1]
let katakata = text.split("|")[2]
let ppnyauser = await await conn.profilePictureUrl(m.sender, 'image').catch(_=> 'https://h.top4top.io/p_31922c8vs1.jpg')
const tweet = await new canvafy.Tweet()
  .setTheme("dim")
  .setUser({displayName: nama1, username: nama2})
  .setVerified(true)
  .setComment(katakata)
  .setAvatar(ppnyauser)
  .build();
 let kenisawa = tweet
  conn.sendMessage(m.chat, { image: kenisawa, caption: '✧ Listoo~' },{ quoted : m })     
}
handler.help = ["faketweet"].map((a) => a + "<texto>");
handler.tags = ["fun"];
handler.command = ["faketweet"];

handler.register = true

export default handler
