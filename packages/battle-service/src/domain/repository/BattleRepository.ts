import { Battle } from "../entity/Battle";

export interface BattleRepository {
    getBattle(battleId: string): Promise<Battle | null>
    createBattle(battle: Battle): Promise<void>
    updateBattle(battle: Battle): Promise<void>
}