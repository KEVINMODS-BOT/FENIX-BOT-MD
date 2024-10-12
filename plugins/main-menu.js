let handler = async (m, { conn, db }) => {
  try {
    let name = await conn.getName(m.sender);
    let registeredUsers = Object.values(global.db.data.users).filter(user => user.registered).length;

    const menuText = `
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

╬╬════════════════╬╬
            📁  *INFO-BOT* 📁
╬╬════════════════╬╬
*➢ .owner* - Ve los contactos de los creadores
*➢ .grupos* - Ve los grupos y canales del bot
*➢ .estado* - Ve el estado del bot
*➢ .ping* - Velocidad del bot
`;

    const buttons = [
      {buttonId: '.owner', buttonText: {displayText: '👤 Creador'}, type: 1},
      {buttonId: '.grupos', buttonText: {displayText: '📢 Grupos'}, type: 1},
      {buttonId: '.estado', buttonText: {displayText: '⚙️ Estado'}, type: 1},
      {buttonId: '.ping', buttonText: {displayText: '🏓 Ping'}, type: 1},
    ];

    const buttonMessage = {
      text: menuText,
      footer: 'Fenix Bot - Elige una opción',
      buttons: buttons,
      headerType: 1
    };

    await conn.sendMessage(m.chat, buttonMessage);
  } catch (e) {
    console.error(e);
  }
};

handler.command = ['menu'];
export default handler;
