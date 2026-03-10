import { initDB } from './data/mongoDb';
import { initWebSocketServer } from './presentation/webSocket';

async function start() {
    try {
        // 1. Conectar a la base de datos
        await initDB();

        // 2. Iniciar el servidor de WebSockets
        initWebSocketServer();

        console.log('Battle Service inicializado correctamente');

    } catch (error) {
        console.error("Error fatal durante el inicio:", error);
        process.exit(1);
    }
}

start();