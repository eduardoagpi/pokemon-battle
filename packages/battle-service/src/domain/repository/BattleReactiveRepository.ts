import { Battle } from "../entity/Battle";

export interface BattleReactiveRepository {
    subscribeToBattle(callback: (previousBattleState: Battle, currentBattleState: Battle) => void): void;
}
