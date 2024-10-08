import { promises } from 'fs'
import { join } from 'path'

let handler = async (m, { conn }) => {
  try {
    // Lista de URLs de videos HTTPS
    const videos = [
      "https://qu.ax/beuXG.mp4",
      "https://qu.ax/WcuJg.mp4",
      "https://qu.ax/bVTZR.mp4",
      "https://qu.ax/SMJnR.mp4",
      "https://qu.ax/AwlFy.mp4",
      "https://qu.ax/hSPHX.mp4", 
    ]

    // Selecciona un video aleatorio
    let randomVideo = videos[Math.floor(Math.random() * videos.length)]

    // Mensaje
    let message = "🥵 Aquí está tu vídeo pajero 🥵"

    // Enviar el video con el mensaje
    await conn.sendMessage(m.chat, {
      video: { url: randomVideo }, // Video aleatorio de la lista
      caption: message              // Mensaje de texto junto con el video
    }, { quoted: m })

  } catch (e) {
    conn.reply(m.chat, 'Lo sentimos, hubo un error al enviar el video.', m)
    throw e
  }
}

// Definir los comandos
handler.help = ['porno']
handler.tags = ['media']
handler.command = ['porno'] // El comando será '.video'
handler.register = true

export default handler
