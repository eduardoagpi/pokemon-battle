import { initDB } from './data/mongoDb';
import { configureWebSocket } from './presentation/webSocket';

async function start() {
    await initDB();
    configureWebSocket();
}

start();