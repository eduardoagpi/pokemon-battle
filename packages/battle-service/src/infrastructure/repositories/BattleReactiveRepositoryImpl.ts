import { Battle } from "../../domain/entity/Battle";
import { BattleReactiveRepository } from "../../domain/repository/BattleReactiveRepository";
import { BattleDocToBattle } from "../mappers/dataToDomain";
import { Collections, db } from "../database/mongoDb";
import { BattleDoc } from "../database/types";

export class MongoBattleReactiveRepository implements BattleReactiveRepository {

    constructor(private matchId: string) {
        console.log(`created BattleReactiveRepo for matchId: ${matchId}`)
    }

    private lastBattleState: Battle | null = null;

    subscribeToBattle(callback: (previousBattleState: Battle, currentBattleState: Battle) => void): void {
        const collection = db.collection<BattleDoc>(Collections.BATTLE);
        const changeStream = collection.watch([
            {
                $match: {
                    $or: [
                        { operationType: 'insert' },
                        { operationType: 'update' },
                        { operationType: 'replace' }
                    ],
                    'fullDocument.matchmakingId': this.matchId
                }
            }
        ], { fullDocument: 'updateLookup' });

        changeStream.on('change', (change) => {
            if (change.operationType === 'insert' || change.operationType === 'update' || change.operationType === 'replace') {
                const fullDoc = change.fullDocument;
                if (fullDoc) {
                    const currentBattle = BattleDocToBattle(fullDoc);
                    const previousBattle = this.lastBattleState || currentBattle;
                    this.lastBattleState = currentBattle;
                    callback(previousBattle, currentBattle);
                }
            }
        });
    }
}
