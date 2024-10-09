const handler = async (m, { conn, text, command, usedPrefix }) => {
  if (m.mentionedJid.includes(conn.user.jid)) return;

  let who;
  if (m.isGroup) {
    who = m.mentionedJid[0] ?
      m.mentionedJid[0] :
      m.quoted ?
      m.quoted.sender :
      text;
  } else who = m.chat;

  // Asegurarse de que el usuario exista en la base de datos
  const user = global.db.data.users[who] || { warn: 0 }; // Inicializa el usuario si no existe
  global.db.data.users[who] = user; // Asegúrate de que el usuario esté guardado en la base de datos

  const bot = global.db.data.settings[conn.user.jid] || {};
  const dReason = 'No especificado';
  const msgtext = text || dReason;
  const sdms = msgtext.replace(/@\d+-?\d* /g, '');

  // Mensaje de advertencia
  await m.reply(
    `*@${who.split`@`[0]}* 𝚁𝙴𝙲𝙸𝙱𝙸𝙾 𝚄𝙽𝙰 𝙰𝙳𝚅𝙴𝚁𝚃𝙴𝙽𝙲𝙸𝙰 𝙴𝙽 𝙴𝚂𝚃𝙴 𝙶𝚁𝚄𝙿𝙾!\nMotivo: ${sdms}\n*ADVERTENCIAS: ${user.warn + 1}/3*`,
    null,
    { mentions: [who] }
  );

  // Incrementar las advertencias
  user.warn += 1;

  // Si el usuario llega a 3 advertencias
  if (user.warn >= 3) {
    if (!bot.restrict) {
      return m.reply(
        '*[❗] 𝙴𝙻 𝙿𝚁𝙾𝙿𝙸𝙴𝚃𝙰𝙳𝙾 𝙳𝙴𝙻 𝙱𝙾𝚃 𝙽𝙾 𝚃𝙸𝙴𝙽𝙴 𝙷𝙰𝙱𝙸𝙻𝙸𝚃𝙰𝙳 𝙻𝙰𝚂 𝚁𝙴𝚜𝚝𝚛𝙸𝙲𝙲𝙸𝙾𝙽𝙴𝚂. 𝙲𝙾𝙽𝚃𝙰𝙲𝚃𝙴 𝙲𝙾𝙽 𝙴𝙻 𝙿𝙰𝚁𝙰 𝚀𝚄𝙴 𝙻𝙾 𝙷𝙰𝙱𝙸𝙻𝙸𝚃𝙴*',
        );
    }

    // Restablecer las advertencias después de ser expulsado
    user.warn = 0;
    await m.reply(
      `𝚃𝙴 𝙻𝙾 𝙰𝙳𝚅𝙴𝚁𝚃𝙸 𝚅𝙰𝚁𝙸𝙰𝚂 𝚅𝙴𝙲𝙴𝚂!!\n*@${
        who.split`@`[0]
      }* 𝚂𝚄𝙿𝙴𝚁𝙰𝚂𝚃𝙴 𝙻𝙰𝚂 *3* 𝙰𝙳𝚅𝙴𝚁𝚃𝙴𝙽𝙲𝙸𝙰𝚂, 𝙰𝙷𝙾𝚁𝙰 𝚂𝙴𝚁𝙰𝚂 𝙴𝙻𝙸𝙼𝙸𝙽𝙰𝙳𝙾/𝙰 👽`,
      null,
      { mentions: [who] }
    );

    // Eliminar al usuario del grupo
    await conn.groupParticipantsUpdate(m.chat, [who], 'remove');
  }

  return !1;
};

handler.command = /^(advertir|advertencia|warn|warning)$/i;
handler.admin = true;
handler.register = true;
handler.group = true;
handler.botAdmin = true;
export default handler;
