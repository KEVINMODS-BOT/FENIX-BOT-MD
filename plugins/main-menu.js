let handler = async (m, { conn, db }) => {

  try {

    let name = await conn.getName(m.sender)
    
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

└──┸─┸┸─┸─┸┸┸┸─┙
`;

// Aquí añades la ruta del gif que quieres enviar
    await conn.sendFile(m.chat, 'https://f.uguu.se/BphmWAlM.mp4'', 'fenix.gif', menuText, m)

  } catch (err) {
    console.error(err);
  }
};

handler.command = /^(menu|menufenix)$/i;
module.exports = handler;
