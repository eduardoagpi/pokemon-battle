import { ObjectId } from "mongodb";
import { Battle } from "../../domain/entity/Battle";
import { BattleRepository } from "../../domain/repository/BattleRepository";
import { BattleDocToBattle } from "../mapper/dataToDomain";
import { BattleToBattleDoc } from "../mapper/domainToData";
import { Collections, db } from "../mongoDb";
import { BattleDoc } from "../types";

export class BattleRepositoryImpl implements BattleRepository {
    async getBattle(battleId: string): Promise<Battle | null> {
        const battleCollection = db.collection<BattleDoc>(Collections.BATTLE)
        const battleDoc = await battleCollection.findOne({ _id: new ObjectId(battleId) });
        if (!battleDoc) return null;
        return BattleDocToBattle(battleDoc);
    }

    async createBattle(battle: Battle): Promise<void> {
        const battleDoc = BattleToBattleDoc(battle);
        const battleCollection = db.collection<BattleDoc>(Collections.BATTLE)
        await battleCollection.insertOne(battleDoc);
    }

    async updateBattle(battle: Battle): Promise<void> {
        if (!battle.id) throw new Error("Battle id is required");
        const battleCollection = db.collection<BattleDoc>(Collections.BATTLE)
        await battleCollection.updateOne({ _id: new ObjectId(battle.id) }, { $set: BattleToBattleDoc(battle) });
    }

    async findHistoryByNickname(nickname: string): Promise<Battle[]> {
        const battleCollection = db.collection<BattleDoc>(Collections.BATTLE);
        const battleDocs = await battleCollection.find({
            status: 'finished',
            $or: [
                { 'playerA.nickname': nickname },
                { 'playerB.nickname': nickname }
            ]
        }).sort({ createdAt: -1 }).toArray();
        return battleDocs.map(BattleDocToBattle);
    }
}



export default BattleRepository;