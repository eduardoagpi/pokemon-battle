import { Battle } from "../entity/entity";

export interface BattleReactiveRepository {
    subscribeToBattleCreation(callback: () => void): void;
    subscribeToBattle(callback: (previousBattleState: Battle, currentBattleState: Battle) => void): void;
}
