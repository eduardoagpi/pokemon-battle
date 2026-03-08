import { Battle } from "../../domain/entity/entity";
import { BattleReactiveRepository } from "../../domain/repository/BattleReactiveRepository";
import { BattleDocToBattle } from "../mapper/dataToDomain";
import { Collections, db } from "../mongoDb";
import { BattleDoc } from "../types";

export class MongoBattleReactiveRepository implements BattleReactiveRepository {
    constructor(private matchId: string) { }

    subscribeToBattleCreation(callback: () => void): void {
        const collection = db.collection<BattleDoc>(Collections.BATTLE);
        const changeStream = collection.watch([
            {
                $match: {
                    operationType: 'insert',
                    'fullDocument.matchmakingId': this.matchId
                }
            }
        ]);

        changeStream.on('change', (change) => {
            if (change.operationType === 'insert') {
                callback();
                changeStream.close();
            }
        });
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
