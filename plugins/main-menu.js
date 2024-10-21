let handler = async (m, { conn, db }) => {

  try {

    let name = await conn.getName(m.sender);

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
*➢ [🪼] \`CANAL:\`* https://whatsapp.com/channel/0029VapwUi0Dp2QC3xO9PX42

└──┸─┸┸─┸─┸┸┸┸─┙‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎
`.trim();

    let videoBuffer = await fetchBuffer("https://qu.ax/ooqaO.mp4");

    // Enviar video MP4 junto con el menú
    await conn.sendMessage(m.chat, { 
      video: videoBuffer, 
      caption: menuText, 
      gifPlayback: true // Esto permite que se reproduzca como un GIF
    }, { quoted: m });

  } catch (e) {
    conn.reply(m.chat, 'Lo sentimos, el menú tiene un error.', m);
    throw e;
  }

}

handler.help = ['menu'];
handler.tags = ['main'];
handler.command = ['menu', 'help', 'menú']; 
handler.register = true; 
export default handler;

async function fetchBuffer(url) {
  let res = await fetch(url);
  return await res.buffer();
}
