let handler = async (m, { conn, usedPrefix, command, args, isOwner, isAdmin, isROwner }) => {
  let isEnable = /true|enable|(turn)?on|1/i.test(command)
  let chat = global.db.data.chats[m.chat]
  let user = global.db.data.users[m.sender]
  let bot = global.db.data.settings[conn.user.jid] || {}
  let type = (args[0] || '').toLowerCase()
  let isAll = false, isUser = false
  switch (type) {
    case 'welcome':
    case 'bv':
    case 'bienvenida':
      if (!m.isGroup) {
        if (!isOwner) {
          global.dfail('group', m, conn)
          throw false
        }
      } else if (!isAdmin) {
        global.dfail('admin', m, conn)
        throw false
      }
      chat.bienvenida = isEnable
      break

    case 'autoread':
    case 'autoleer':
      isAll = true
      if (!isROwner) {
        global.dfail('rowner', m, conn)
        throw false
      }
      global.opts['autoread'] = isEnable
      break

    case 'document':
    case 'documento':
      isUser = true
      user.useDocument = isEnable
      break

    case 'antilink':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.antiLink = isEnable
      break

    case 'antiver': case 'modover': case 'modoobservar': case 'modobservar': case 'antiviewonce':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.antiver = isEnable 
      break

    case 'nsfw':
    case 'modohorny':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.nsfw = isEnable
      break

    case 'antiarabes':
    case 'antinegros':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.onlyLatinos = isEnable
      break

    default:
      if (!/[01]/.test(command)) return m.reply(`
*MENÚ DE CONFIGURACIÓN FÉNIX* 🐦‍🔥

Siente el poder del Fénix al controlar las funciones de tu grupo y bot.

━━━━━━━━━━━━━━━
≡ OPCIONES DISPONIBLES

*📜  Tipo: welcome*
Descripción: Activa o desactiva la Bienvenida y Despedida en grupos.

*🔞  Tipo: nsfw*
Descripción: Activa o desactiva los comandos NSFW para grupos.

*🌍  Tipo: antiarabes*
Descripción: Activa o desactiva el sistema AntiÁrabes en grupos.

*🔗  Tipo: antilink*
Descripción: Activa o desactiva el AntiLink en grupos.

*📥  Tipo: autoread*
Descripción: Activa o desactiva la opción de AutoLeer mensajes para el bot.

*📄  Tipo: document*
Descripción: Activa o desactiva la descarga en Formato Documento para los usuarios.

*👁️  Tipo: antiviewonce*
Descripción: Activa o desactiva la opción de visualizar contenido enviado como "Ver una vez".

━━━━━━━━━━━━━━━
⚙️ CÓMO USARLO
Usa el comando para habilitar o deshabilitar una función:

*Ejemplo:*
.on welcome
.off antilink


*🔥 Control total con del Fénix. 🔥*
`.trim())
      throw false
  }
  m.reply(`La función *${type}* se *${isEnable ? 'activó' : 'desactivó'}* ${isAll ? 'para este bot' : isUser ? '' : 'para este chat'}`)
}

handler.help = ['enable', 'disable']
handler.tags = ['nable']
handler.command = /^(enable|disable|on|off|1|0)$/i

export default handler
