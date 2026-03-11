import { Battle } from "../entity/Battle";

export abstract class BattleRepository {
    abstract getBattle(battleId: string): Promise<Battle | null>
    abstract createBattle(battle: Battle): Promise<void>
    abstract updateBattle(battle: Battle): Promise<void>
    abstract findHistoryByNickname(nickname: string): Promise<Battle[]>

}