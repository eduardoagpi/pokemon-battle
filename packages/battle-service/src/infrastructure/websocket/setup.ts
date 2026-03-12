import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';
import { handleNewClientConnection } from './incommingConnectionHandler';
import express from 'express';
import { MatchmakingRepository } from '../../domain/repository/MatchmakingRepository';
import { MatchmakingRepositoryImpl } from '../repositories/MatchmakingRepositoryImpl';
import { BattleRepository } from '../../domain/repository/BattleRepository';
import { BattleRepositoryImpl } from '../repositories/BattleRepositoryImpl';

export interface ExtWebSocket extends WebSocket {
    isAlive: boolean;
    nickname: string;
}

const HEARTBEAT_INTERVAL_SECONDS = 10

export function setupWebSocketServer(app?: express.Express) {
    const port = process.env.BATTLE_SERVICE_PORT;
    if (!port) {
        console.error("Puerto no definido")
        process.exit(1);
    }

    const server = http.createServer(app);
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
    }, HEARTBEAT_INTERVAL_SECONDS * 1000);

    socketServer.on('close', () => {
        clearInterval(heartbeatInterval)
    });


    server.listen(port, () => {
        console.log(`Battle Service : corriendo en: ws://localhost:${port}`);
    });

    return { server, socketServer };
}