import { createServer } from 'http';
import { Server } from 'socket.io';
import { logMessage, BattleEvent, MatchmakingRequest } from '@poke-albo/shared';
import { handleNewConnection } from './domain/usecase/HandleNewConnection';
import { setupSocketMessageHandler } from './presentation/sockerMessageHandler';

// 1. Creamos el servidor HTTP nativo de Node.js
const httpServer = createServer((req, res) => {
    if (req.url === '/health') {
        res.writeHead(200);
        res.end('OK');
        return;
    }
    res.writeHead(404);
    res.end();
});

// 2. Instanciamos Socket.io sobre el servidor nativo
const io = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});


const PORT = process.env.PORT || 3001;

io.on('connection', (socket) => {
    const userId = socket.handshake.auth.userId;
    handleNewConnection(userId)
    setupSocketMessageHandler(socket, io)
});

// 3. Arrancamos el servidor
httpServer.listen(PORT, () => {
    logMessage(`Battle Service running (pure Node.js) on port ${PORT}`);
});