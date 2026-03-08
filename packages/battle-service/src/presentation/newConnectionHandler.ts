import { WebSocket } from 'ws';
import url from 'url';
import http from 'http';
import { ExtWebSocket } from './webSocket';
import { handleNewConnection } from '../domain/usecase/HandleNewConnection';
import { handleMatchMaking } from '../domain/usecase/HandleMatchMaking';
import { handleClientMessage } from './clientMessageHandler';

const clients = new Map<string, ExtWebSocket>();

export async function handleNewClientConnection(webSocket: WebSocket, req: http.IncomingMessage) {
    // 1. Extraer ID del query string
    const location = url.parse(req.url || '', true);
    const authId = location.query.auth_id as string;

    if (!authId) {
        webSocket.close(4001, "Auth ID Required");
        return;
    }

    // 2. Setup del socket extendido
    const extWs = webSocket as ExtWebSocket;
    extWs.authId = authId;
    extWs.isAlive = true;
    clients.set(authId, extWs);

    console.log(`Cliente conectado y registrado: ${authId}`);

    // 3. Configurar Heartbeat individual
    extWs.on('pong', () => { extWs.isAlive = true; });


    const result = await handleNewConnection(authId);
    if (!result.success) {
        console.error(`Error en matchmaking inicial para ${authId}:`, result.error);
        return;
    }
    handleMatchMaking(extWs, result.value);


    // Manejar mensajes desde los clientes
    extWs.on('message', async (data) => {
        handleClientMessage(data);
    });

    // 5. Cleanup al cerrar
    extWs.on('close', async () => {
        console.log(`Cliente ${authId} desconectado`);
        clients.delete(authId);
    });
}