import { Db } from "mongodb";
import { ExtWebSocket } from "../../presentation/webSocket";
import { subscribeToBattle } from "../usecase/SubscribeToBattle";
import { NewConnectionSuccess } from "./HandleNewConnection";
import { db } from "../../data/mongoDb";

export async function handleMatchMaking(socket: ExtWebSocket, newConnection: NewConnectionSuccess) {
    subscribeToBattle(socket, newConnection.matchId, db);
    if (newConnection.status === 'matched') {
        // insertar la batalla
        const battles = db.collection('battles');
        await battles.insertOne({
            matchId: newConnection.matchId,
            players: [newConnection.userA, newConnection.userB],
            status: 'active',
            updatedAt: new Date()
        });
    }
}