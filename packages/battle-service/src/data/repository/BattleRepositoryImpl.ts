import { ObjectId } from "mongodb";
import { Battle } from "../../domain/entity/Battle";
import { BattleRepository } from "../../domain/repository/BattleRepository";
import { BattleToBattleDoc } from "../mapper/domainToData";
import { Collections, db } from "../mongoDb";
import { BattleDoc } from "../types";


export class BattleRepositoryImpl implements BattleRepository {
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
}



export default BattleRepository;