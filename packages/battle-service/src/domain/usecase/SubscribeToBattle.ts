import { ExtWebSocket } from "../../presentation/webSocket";
import { Collections, db } from "../../data/mongoDb";
import { BattleDoc } from "../../data/types";

export async function subscribeToBattle(
    socket: ExtWebSocket,
    matchId: string,
    firstEmissionListener: (battleId: string) => void
) {
    const battleCollection = db.collection<BattleDoc>(Collections.BATTLE);
    let previousState: BattleDoc | null = null;

    // Filtro para escuchar los cambios en la batalla.
    // Filtramos por el matchId, ya que tambien queremos escuchar la creacion de la batalla.
    // Si filtraramos por el _id, solo escucharíamos los cambios en la batalla.
    const pipeline = [
        {
            $match: {
                'fullDocument.matchmakingId': matchId,
                operationType: { $in: ['insert', 'update', 'replace'] }
            }
        }
    ];

    const changeStream = battleCollection.watch(pipeline, { fullDocument: 'updateLookup' });

    let isFirstEmission = true;

    const handleChange = (change: any) => {
        const battle = change.fullDocument as BattleDoc;
        if (!battle) return;

        if (isFirstEmission && battle._id) {
            firstEmissionListener(battle._id.toString());
            isFirstEmission = false;
        }

        if (socket.readyState === 1) { // 1 === WebSocket.OPEN
            socket.send(JSON.stringify({
                type: 'BATTLE_UPDATE',
                payload: battle
            }));
        }
    };

    changeStream.on('change', handleChange);

    // 3. Función de limpieza centralizada
    const cleanup = async () => {
        changeStream.removeListener('change', handleChange);
        if (!changeStream.closed) {
            await changeStream.close();
        }
    };

    // 4. Manejo de eventos de cierre (una sola vez)
    socket.once('close', cleanup);
    socket.once('error', cleanup);
}