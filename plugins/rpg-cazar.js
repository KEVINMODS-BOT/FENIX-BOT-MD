import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, command, args, text }) => {
    try {
        let user = global.db.data.users[m.sender];

        // Verificar si el usuario está registrado
        if (!user.registered) {
            conn.reply(m.chat, 'Por favor, regístrate usando el comando `.reg nombre.edad` antes de usar este comando.', m);
            return;
        }

        // Comando para cazar animales mitológicos
        if (command === 'magicaventur') {
            let animalesMitologicos = [
                { nombre: "Dragón", imagen: "https://example.com/dragon.jpg" },
                { nombre: "Fénix", imagen: "https://example.com/fenix.jpg" },
                { nombre: "Grifo", imagen: "https://example.com/grifo.jpg" },
                { nombre: "Unicornio", imagen: "https://example.com/unicornio.jpg" },
                { nombre: "Minotauro", imagen: "https://example.com/minotauro.jpg" },
                { nombre: "Hidra", imagen: "https://example.com/hidra.jpg" },
                { nombre: "Cíclope", imagen: "https://example.com/ciclope.jpg" },
                { nombre: "Quimera", imagen: "https://example.com/quimera.jpg" },
                { nombre: "Sirena", imagen: "https://example.com/sirena.jpg" },
                { nombre: "Pegaso", imagen: "https://example.com/pegaso.jpg" },
                { nombre: "Basilisco", imagen: "https://example.com/basilisco.jpg" },
                { nombre: "Leviatán", imagen: "https://example.com/leviatan.jpg" },
                { nombre: "Harpía", imagen: "https://example.com/harpia.jpg" },
                { nombre: "Kraken", imagen: "https://example.com/kraken.jpg" },
                { nombre: "Mantícora", imagen: "https://example.com/manticora.jpg" },
                { nombre: "Esfinge", imagen: "https://example.com/esfinge.jpg" },
                { nombre: "Cerbero", imagen: "https://example.com/cerbero.jpg" },
                { nombre: "Chupacabras", imagen: "https://example.com/chupacabras.jpg" },
                { nombre: "Yeti", imagen: "https://example.com/yeti.jpg" },
                { nombre: "Naga", imagen: "https://example.com/naga.jpg" }
            ];

            // Selección aleatoria de un animal mitológico
            let animal = animalesMitologicos[Math.floor(Math.random() * animalesMitologicos.length)];
            
            user.animalesMitologicos = user.animalesMitologicos || [];
            user.animalesMitologicos.push(animal);

            conn.sendFile(m.chat, animal.imagen, 'animal.jpg', `¡Has cazado un ${animal.nombre}!`, m);
        }

        // Comando para mostrar las sesiones disponibles (la tienda)
        if (command === 'tienda') {
            let mensaje = `
Elige una sesión para ver los ítems que puedes vender:
1. Animales Mitológicos
2. Otra Sesión (a implementar)

Responde con solo el número de la sesión (ejemplo: 1).
            `;
            conn.reply(m.chat, mensaje, m);
        }

        // Ver ítems dentro de la sesión elegida (respondiendo con un número)
        if (/^\d+$/.test(text)) {
            let sesion = text;

            if (sesion === '1') {  // Sesión 1: Animales Mitológicos
                if (!user.animalesMitologicos || user.animalesMitologicos.length === 0) {
                    conn.reply(m.chat, 'No tienes animales mitológicos para vender.', m);
                    return;
                }

                let animalList = user.animalesMitologicos.map((animal, i) => `${i + 1}. ${animal.nombre}`).join('\n');
                conn.reply(m.chat, `Estos son tus animales mitológicos atrapados:\n\n${animalList}\n\nUsa \`.vender[número]\` para vender un animal.`, m);
            } else if (sesion === '2') {
                conn.reply(m.chat, 'La sesión 2 aún no está disponible.', m);
            } else {
                conn.reply(m.chat, 'Debes especificar una sesión válida. Ejemplo: responde con "1" para la sesión de Animales Mitológicos.', m);
            }
        }

        // Comando para vender un ítem específico con formato vender[número]
        if (command.startsWith('vender') && command.length > 6) {
            let animalIndex = parseInt(command.slice(6)) - 1;

            if (!user.animalesMitologicos || user.animalesMitologicos.length === 0) {
                conn.reply(m.chat, 'No tienes animales mitológicos para vender.', m);
                return;
            }

            if (animalIndex < 0 || animalIndex >= user.animalesMitologicos.length) {
                conn.reply(m.chat, 'Elige un animal válido para vender.', m);
                return;
            }

            let precioVenta = obtenerPrecioAnimal(); // Precio aleatorio de venta

            user.limit += precioVenta;
            let animalVendido = user.animalesMitologicos.splice(animalIndex, 1)[0];

            conn.reply(m.chat, `¡Has vendido el ${animalVendido.nombre} por ${precioVenta} créditos!`, m);
        }

    } catch (e) {
        console.log(e);
        conn.reply(m.chat, 'Hubo un error al procesar tu solicitud.', m);
    }
};

// Función para obtener un precio aleatorio para vender los animales mitológicos
function obtenerPrecioAnimal() {
    const precios = [50, 100, 150, 200];
    return precios[Math.floor(Math.random() * precios.length)];
}

handler.help = ['magicaventur', 'tienda', 'vender[número]'];
handler.tags = ['adventure', 'econ'];
handler.command = /^(magicaventur|tienda|vender\d+)$/i;
handler.register = true;

export default handler;
