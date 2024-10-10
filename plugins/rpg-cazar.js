let handler = async (m, { conn }) => {
    // Verifica si el usuario tiene un tiempo de espera activo
    let user = global.db.data.users[m.sender];
    let tiempoActual = new Date().getTime();
    let tiempoRestante = user.lastCaza ? (user.lastCaza + 30 * 60 * 1000) - tiempoActual : 0;

    if (tiempoRestante > 0) {
        let minutosRestantes = Math.floor(tiempoRestante / 60000);
        let segundosRestantes = Math.floor((tiempoRestante % 60000) / 1000);
        return conn.reply(m.chat, `Debes esperar ${minutosRestantes} minutos y ${segundosRestantes} segundos antes de cazar de nuevo.`, m);
    }

    // Lista de animales con sus emojis, fenixcoins y probabilidades
    const animales = [
        { emoji: '🦊', nombre: 'Zorro', fenixcoins: 2, probabilidad: 10 },
        { emoji: '🐗', nombre: 'Jabalí', fenixcoins: 3, probabilidad: 5 },
        { emoji: '🐷', nombre: 'Cerdo', fenixcoins: 1, probabilidad: 20 },
        { emoji: '🐔', nombre: 'Pollo', fenixcoins: 1, probabilidad: 20 },
        { emoji: '🦆', nombre: 'Pato', fenixcoins: 1, probabilidad: 20 },
        { emoji: '🐦', nombre: 'Pájaro', fenixcoins: 1, probabilidad: 20 },
        { emoji: '🐵', nombre: 'Mono', fenixcoins: 2, probabilidad: 10 },
        { emoji: '🐘', nombre: 'Elefante', fenixcoins: 5, probabilidad: 3 },
        { emoji: '🐮', nombre: 'Vaca', fenixcoins: 2, probabilidad: 10 },
        { emoji: '🐯', nombre: 'Tigre', fenixcoins: 4, probabilidad: 4 },
        { emoji: '🐭', nombre: 'Ratón', fenixcoins: 1, probabilidad: 20 },
        { emoji: '🐴', nombre: 'Caballo', fenixcoins: 3, probabilidad: 5 },
        { emoji: '🐧', nombre: 'Pingüino', fenixcoins: 3, probabilidad: 5 }
    ];

    // Función para seleccionar animales aleatoriamente según la probabilidad
    function seleccionarAnimal() {
        let totalProbabilidad = animales.reduce((total, animal) => total + animal.probabilidad, 0);
        let random = Math.floor(Math.random() * totalProbabilidad);
        for (let animal of animales) {
            if (random < animal.probabilidad) {
                return animal;
            }
            random -= animal.probabilidad;
        }
    }

    // Selección aleatoria de 3 animales
    let capturados = [];
    for (let i = 0; i < 3; i++) {
        capturados.push(seleccionarAnimal());
    }

    // Suma de los fenixcoins capturados
    let totalFenixcoins = capturados.reduce((total, animal) => total + animal.fenixcoins, 0);

    // Obtener el multiplicador según el rango del usuario
    let multiplicador = 1;
    let rangoMensaje = '';
    if (user.rango) {
        switch (user.rango) {
            case 'bronce':
                multiplicador = 2;
                break;
            case 'plata':
                multiplicador = 3;
                break;
            case 'oro':
                multiplicador = 4;
                break;
            case 'diamante':
                multiplicador = 5;
                break;
            case 'maestro':
                multiplicador = 6;
                break;
            case 'leyenda':
                multiplicador = 7;
                break;
            default:
                multiplicador = 1;
        }
        rangoMensaje = `\n\n𝚃𝙸𝙴𝙽𝙴 𝚄𝙽 𝚁𝙰𝙽𝙶𝙾: ${user.rango.charAt(0).toUpperCase() + user.rango.slice(1)}`;
    }

    // Aplicar el multiplicador de fenixcoins
    let fenixcoinsMultiplicados = totalFenixcoins * multiplicador;

    // Crear el mensaje de captura
    let mensajeCaptura = `Cazaste:\n\n${capturados.map(a => `${a.emoji}`).join(' + ')}\n\n`;
    mensajeCaptura += capturados.map(a => `${a.nombre} ${a.emoji} ${a.fenixcoins} fenixcoin${a.fenixcoins > 1 ? 's' : ''}`).join('\n') + rangoMensaje + `\n\n¡Has ganado ${fenixcoinsMultiplicados} fenixcoin${fenixcoinsMultiplicados > 1 ? 's' : ''}!`;

    // Sumar los fenixcoins al usuario
    user.limit += fenixcoinsMultiplicados;

    // Actualizar el tiempo de la última caza
    user.lastCaza = tiempoActual;

    // Enviar el mensaje con la captura
    await conn.reply(m.chat, mensajeCaptura, m);
}

handler.help = ['cazar'];
handler.tags = ['game'];
handler.command = /^cazar$/i;
handler.register = true;

export default handler;
