import { WebSocket } from "ws";
import { ExtWebSocket } from "../../presentation/webSocket";
import { Collections, db } from "../../data/mongoDb";
import { BattleDoc } from "../../data/types";

export async function subscribeToBattle(socket: ExtWebSocket, matchId: string, firstEmitionListener: (battleId: string) => void) {
    const battleCollection = db.collection<BattleDoc>(Collections.BATTLE);

    // Creamos el stream filtrando por el matchId

    // Escuchamos cualquier cambio en el stream, para actualizar el estado de la batalla

    // IMPORTANTE: Limpiar el stream cuando el socket se cierre
    socket.on('close', () => {
        console.log(`ChangeStream cerrado para match ${matchId}`);
    });
}