const free = { min: 15, max: 30 } // Rango de créditos gratis para usuarios regulares
const prem = { min: 15, max: 30 } // Rango de créditos gratis para usuarios premium
const cooldowns = {}

let handler = async (m, { conn, isPrems }) => {
  let user = global.db.data.users[m.sender]
  const tiempoEspera = 24 * 60 * 60 // 24 horas en segundos

  if (cooldowns[m.sender] && Date.now() - cooldowns[m.sender] < tiempoEspera * 1000) {
    const tiempoRestante = segundosAHMS(Math.ceil((cooldowns[m.sender] + tiempoEspera * 1000 - Date.now()) / 1000))
    conn.reply(m.chat, `🚩 Ya has realizado tu pedido gratis de hoy.\nRecuerda que solo puedes realizarlo 1 vez cada 24 horas.\n\n*Próximo Monto* : +${isPrems ? `${prem.min} - ${prem.max}` : `${free.min} - ${free.max}`} *fenixcoins 🐦‍🔥*\n*En* : ⏱ ${tiempoRestante}`, m)
    return
  }

  // Generar un valor aleatorio de créditos en el rango definido
  const creditosGanados = isPrems 
    ? Math.floor(Math.random() * (prem.max - prem.min + 1)) + prem.min 
    : Math.floor(Math.random() * (free.max - free.min + 1)) + free.min

  // Incrementar los créditos del usuario
  global.db.data.users[m.sender].limit += creditosGanados
  conn.reply(m.chat, `🚩 Felicidades 🎉, reclamaste *+${creditosGanados} *fenixcoins 🐦‍🔥*.`, m)

  // Actualizar el tiempo de cooldown
  cooldowns[m.sender] = Date.now()
}

handler.help = ['claim']
handler.tags = ['rpg']
handler.command = ['daily', 'claim']
handler.register = true

export default handler

function segundosAHMS(segundos) {
  const horas = Math.floor(segundos / 3600)
  const minutos = Math.floor((segundos % 3600) / 60)
  const segundosRestantes = segundos % 60
  return `${horas} horas, ${minutos} minutos y ${segundosRestantes} segundos`
}
