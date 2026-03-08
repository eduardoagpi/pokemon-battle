import { initDB } from './data/mongoDb';
import { initWebSocketServer } from './presentation/webSocket';

async function start() {
    await initDB();
    initWebSocketServer();
}

start();