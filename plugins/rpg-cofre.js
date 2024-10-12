let handler = async (m, { conn }) => {
   
    let user = global.db.data.users[m.sender];
    let tiempoActual = new Date().getTime();
    let tiempoRestante = user.lastCofre ? (user.lastCofre + 2 * 60 * 60 * 1000) - tiempoActual : 0; 

    if (tiempoRestante > 0) {
        let segundosRestantes = Math.floor(tiempoRestante / 1000);
        let minutosRestantes = Math.floor(segundosRestantes / 60);
        let horasRestantes = Math.floor(minutosRestantes / 60);
        segundosRestantes = segundosRestantes % 60;
        minutosRestantes = minutosRestantes % 60;

        return conn.reply(m.chat, `Debes esperar ${horasRestantes}h ${minutosRestantes}m ${segundosRestantes}s antes de abrir otro cofre.`, m);
    }

  
    let fenixcoins = Math.floor(Math.random() * 11) + 10; 
    let fuegos = Math.floor(Math.random() * 16) + 15;

   
    user.limit += fenixcoins;  
    user.fuegos = (user.fuegos || 0) + fuegos;  

 
    let siguienteCofre = new Date(tiempoActual + 2 * 60 * 60 * 1000);
    let hora = siguienteCofre.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });


    let mensaje = `*COFRE RECLAMADO*\n\n*➥ [🐦‍🔥] Fenixcoins:* ${fenixcoins}\n\n*➥ [🔥] Fuegos:* ${fuegos}\n\n> Vuelve dentro de 2 horas para reclamar otro cofre`;

   
    await conn.sendFile(m.chat, 'https://qu.ax/yesav.jpg', 'cofre.jpg', mensaje, m);

  
    user.lastCofre = tiempoActual;
}

handler.help = ['cofre'];
handler.tags = ['game'];
handler.command = /^cofre$/i;
handler.register = true;

export default handler;
