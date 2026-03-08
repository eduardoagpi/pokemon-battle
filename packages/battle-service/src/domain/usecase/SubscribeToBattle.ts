import { WebSocket } from "ws";
import { ExtWebSocket } from "../../presentation/webSocket";

export async function subscribeToBattle(socket: ExtWebSocket, matchId: string, db: any) {
    const battles = db.collection('battles');

    // Creamos el stream filtrando por el matchId
    const changeStream = battles.watch([
        {
            $match: {
                $or: [
                    { 'fullDocument.matchId': matchId },
                    { 'documentKey._id': { $exists: true }, 'operationType': 'update' }
                ]
            }
        }
    ], { fullDocument: 'updateLookup' });

    changeStream.on('change', (next) => {
        // Si el documento modificado es el nuestro
        if (next.fullDocument && next.fullDocument.matchId === matchId) {
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({
                    event: 'battle_update',
                    state: next.fullDocument
                }));
            }
        }
    });

    // IMPORTANTE: Limpiar el stream cuando el socket se cierre
    socket.on('close', () => {
        changeStream.close();
        console.log(`ChangeStream cerrado para match ${matchId}`);
    });
}