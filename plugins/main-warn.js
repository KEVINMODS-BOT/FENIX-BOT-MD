const handler = async (m, { conn, text, command, usedPrefix }) => {
  // Comprobar si el bot fue mencionado
  if (m.mentionedJid.includes(conn.user.jid)) return;

  // Determinar quién se está advirtiendo
  let who;
  if (m.isGroup) {
    who = m.mentionedJid[0] ?
      m.mentionedJid[0] :
      m.quoted ?
      m.quoted.sender :
      text;
  } else who = m.chat;

  // Asegurarse de que el usuario existe en la base de datos
  const user = global.db.data.users[who] || { warn: 0 }; // Inicializa el usuario si no existe
  global.db.data.users[who] = user; // Asegúrate de que el usuario esté guardado en la base de datos

  // Inicializar la propiedad de advertencias si no existe
  if (user.warn === undefined) {
    user.warn = 0; // Establecer advertencias a 0 si no está definido
  }

  // Mensaje de advertencia
  const msgtext = text || 'No especificado';
  const sdms = msgtext.replace(/@\d+-?\d* /g, '');
  user.warn += 1; // Incrementar advertencias

  await m.reply(
    `*@${who.split`@`[0]}* 𝚁𝙴𝙲𝙸𝙱𝙸𝙾 𝚄𝙽𝙰 𝙰𝙳𝚅𝙴𝚁𝚃𝙴𝙽𝙲𝙸𝙰 𝙴𝙽 𝙴𝚂𝚃𝙴 𝙶𝚁𝚄𝙿𝙾!\nMotivo: ${sdms}\n*ADVERTENCIAS: ${user.warn}/3*`,
    null,
    { mentions: [who] }
  );

  // Si el usuario llega a 3 advertencias
  if (user.warn >= 3) {
    await m.reply(
      `*@${
        who.split`@`[0]
      }* 𝚂𝙴 𝙻𝙴 𝙰𝙳𝚅𝙴𝚁𝚃𝙸𝙳𝙾 𝚅𝙰𝚁𝙸𝙰𝚂 𝚅𝙴𝙲𝙴𝚂! 𝚂𝙴 𝙻𝙴 𝙴𝙻𝙸𝙼𝙸𝙽𝙰𝙳𝙾 𝙳𝙴𝙻 𝙶𝚁𝚄𝙿𝙾.`,
      null,
      { mentions: [who] }
    );
    
    // Eliminar al usuario del grupo
    await conn.groupParticipantsUpdate(m.chat, [who], 'remove');
    
    user.warn = 0; // Reiniciar advertencias
  }
};

handler.command = /^(advertir|advertencia|warn|warning)$/i; // Los nombres de los comandos
handler.admin = true; // Solo administradores
handler.group = true; // Solo en grupos
handler.botAdmin = true; // El bot debe ser administrador

export default handler;
