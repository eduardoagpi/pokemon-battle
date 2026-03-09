import { BattleRepository } from "../repository/BattleRepository";

export function handleFighterDisconnection(battleRepository: BattleRepository, nickname: string, battleId: string) {
    const battle = battleRepository.getBattle(battleId);

}