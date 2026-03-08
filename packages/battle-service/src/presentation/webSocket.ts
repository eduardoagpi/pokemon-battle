import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';
import { handleNewClientConnection } from './newConnectionHandler';

export interface ExtWebSocket extends WebSocket {
    isAlive: boolean;
    authId: string;
}

export function configureWebSocket() {

    const server = http.createServer();
    const socketServer = new WebSocketServer({ server });

    socketServer.on('connection', handleNewClientConnection);

    const heartbeatInterval = setInterval(() => {
        socketServer.clients.forEach((ws) => {
            const extWs = ws as ExtWebSocket;
            if (!extWs.isAlive) return extWs.terminate();

            extWs.isAlive = false;
            extWs.ping();
        });
    }, 30000);

    socketServer.on('close', () => clearInterval(heartbeatInterval));

    const port = 3001;
    server.listen(port, () => {
        console.log(`Battle service running on ws://localhost:${port}`);
    });
}