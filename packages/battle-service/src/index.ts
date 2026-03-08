import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';
import url from 'url';

const server = http.createServer();
const wss = new WebSocketServer({ server });

wss.on('connection', (ws: WebSocket, req: http.IncomingMessage) => {
    // 1. Extraer el auth_id de la URL (Handshake)
    const location = url.parse(req.url || '', true);
    const authId = location.query.auth_id as string;

    if (!authId) {
        console.log("Conexión rechazada: Sin auth_id");
        ws.close(4001, "Auth ID Required");
        return;
    }

    console.log(`Cliente conectado: ${authId}`);

    // 2. Manejar mensajes entrantes
    ws.on('message', (data) => {
        console.log(`Mensaje de ${authId}: ${data}`);
    });

    /*
    // 3. Simular envío de precios (aquí conectarías con RabbitMQ después)
    const interval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
                metal: 'Gold',
                price: 2150.45 + Math.random(),
                timestamp: Date.now()
            }));
        }
    }, 3000);*/

    ws.on('close', () => {
        console.log(`Cliente ${authId} desconectado`);
        //clearInterval(interval);
    });
});

const port = 3001
server.listen(port, () => {
    console.log(`Servidor WS escuchando en ws://localhost:${port}`);
});