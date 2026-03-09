import { Battle } from "../entity/Battle";

export interface BattleReactiveRepository {
    //subscribeToBattleCreation(callback: (battle: Battle) => void): void;
    subscribeToBattle(callback: (previousBattleState: Battle, currentBattleState: Battle) => void): void;
}
