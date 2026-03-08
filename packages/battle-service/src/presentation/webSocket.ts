import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';
import { handleNewClientConnection } from './newConnectionHandler';
import { MatchmakingRepositoryImpl } from '../data/repository/MatchmakingRepositoryImpl';
import { MatchmakingRepository } from '../domain/repository/MatchmakingRepository';
import { BattleRepository } from '../domain/repository/BattleRepository';
import { BattleRepositoryImpl } from '../data/repository/BattleRepositoryImpl';

export interface ExtWebSocket extends WebSocket {
    isAlive: boolean;
    authId: string;
}

export function initWebSocketServer() {

    const server = http.createServer();
    const socketServer = new WebSocketServer({ server });
    const matchmakingRepository: MatchmakingRepository = new MatchmakingRepositoryImpl();
    const battleRepository: BattleRepository = new BattleRepositoryImpl();

    socketServer.on('connection', (ws, req) => handleNewClientConnection(ws, req, matchmakingRepository, battleRepository));

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