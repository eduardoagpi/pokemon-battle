import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';
import { handleNewClientConnection } from './newConnectionHandler';
import { MatchmakingRepositoryImpl } from '../data/repository/MatchmakingRepositoryImpl';
import { MatchmakingRepository } from '../domain/repository/MatchmakingRepository';
import { BattleRepository } from '../domain/repository/BattleRepository';
import { BattleRepositoryImpl } from '../data/repository/BattleRepositoryImpl';

export interface ExtWebSocket extends WebSocket {
    isAlive: boolean;
    nickname: string;
}

import express from 'express';

export function initWebSocketServer(app?: express.Express) {
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
    }, 30000);

    socketServer.on('close', () => {
        clearInterval(heartbeatInterval)
    });


    server.listen(port, () => {
        console.log(`Battle service running on ws://localhost:${port}`);
    });

    return { server, socketServer };
}