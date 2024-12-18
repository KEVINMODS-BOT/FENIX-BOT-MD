import { WAMessageStubType } from '@whiskeysockets/baileys';
import fetch from 'node-fetch';

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return !0;
  let pp = await conn.profilePictureUrl(m.messageStubParameters[0], 'image').catch(_ => 'https://qu.ax/YzpzT.jpg');
  let img = await (await fetch(`${pp}`)).buffer();
  let chat = global.db.data.chats[m.chat];

  if (chat.bienvenida && m.messageStubType == 27) {
    let bienvenida = `@${m.messageStubParameters[0].split`@`[0]} *BIENVENIDO A* ${groupMetadata.subject}\n\nResponda estas preguntas \n\n Eresnde minecraft Java ?\n En que eres bueno ?\n Eres bueno en pvp ?\n Eres de confiar ?\n sabes hacer bases rapidos ?\n\n BUENO SI RESPONDISTES TODO ESO ETIQUETA A ALDAIR Y ESPERA GRACIAS...`;
    
    await conn.sendAi(m.chat, botname, textbot, bienvenida, img, img, canal, estilo);
  }
  
  if (chat.bienvenida && m.messageStubType == 28) {
    let bye = `@${m.messageStubParameters[0].split`@`[0]} *SE FUE DEL GRUPO*`;
    
    await conn.sendAi(m.chat, botname, textbot, bye, img, img, canal, estilo);
  }
  
  if (chat.bienvenida && m.messageStubType == 32) {
    let kick = `@${m.messageStubParameters[0].split`@`[0]} *SE FUE DEL GRUPO*`;
    
    await conn.sendAi(m.chat, botname, textbot, kick, img, img, canal, estilo);
  }
}
