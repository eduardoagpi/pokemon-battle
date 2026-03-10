import { BattleRepository } from "../repository/BattleRepository";

export async function handleFighterDisconnection(battleRepository: BattleRepository, nicknameUserDisconnected: string, battleId: string) {
    const battle = await battleRepository.getBattle(battleId);
    if (!battle) {
        console.error('Battle not found');
        return
    }
    if (battle.status === 'finished') {
        return
    }
    const winner = battle.player1.playerInfo.nickname === nicknameUserDisconnected ? 'b' : 'a'
    battle.status = 'finished';
    battle.result = {
        winner: winner,
        reason: 'desertion'
    }
    await battleRepository.updateBattle(battle);
}