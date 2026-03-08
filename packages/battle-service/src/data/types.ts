import { ObjectId } from 'mongodb';

export interface MatchmakingDoc {
    _id?: ObjectId;
    roomId: string;
    userA: string;
    userB?: string;
    createdAt: Date;
}

export interface BattleDoc {
    matchId: string;
    players: string[]; // [userA, userB]
    status: 'active' | 'finished';
    lastAction?: any;
    updatedAt: Date;
}