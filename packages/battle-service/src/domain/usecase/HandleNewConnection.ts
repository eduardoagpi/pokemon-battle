import { Db } from "mongodb";
import { Result, success } from "../entity/result";
import { db } from "../../data/mongoDb";

export type NewConnectionSuccess = {
    matchId: string;
    status: 'waiting' | 'matched';
}

export async function handleNewConnection(userId: string): Promise<Result<NewConnectionSuccess, unknown>> {
    const col = db.collection('matchmaking');

    const waitingPlayer = await col.findOneAndDelete(
        { userA: { $ne: userId } },
        { sort: { createdAt: 1 } }
    );

    if (waitingPlayer) {
        return success({ matchId: waitingPlayer.roomId, status: 'matched' });
    } else {
        const matchId = `match_${userId}_${Date.now()}`;
        await col.insertOne({
            roomId: matchId,
            userA: userId,
            createdAt: new Date()
        });
        return success({ matchId: matchId, status: 'waiting' });
    }
}
