import { BattleRepository } from "../repository/BattleRepository";
import { ServerMessageEmitter } from "../repository/ServerMessageEmitter";

export async function performAttack(
    battleRepository: BattleRepository,
    serverMessageEmitter: ServerMessageEmitter,
    battleId: string,
    nickname: string
) {
    const battle = await battleRepository.getBattle(battleId);
    if (!battle) {
        console.error('Battle not found');
        return;
    }

    const attackerPlayer = battle.player1.playerInfo.nickname === nickname ? battle.player1 : battle.player2;
    const defenderPlayer = battle.player1.playerInfo.nickname === nickname ? battle.player2 : battle.player1;

    // Determine active pokemon (first with healthPoints > 0)
    const activeAttacker = attackerPlayer.pokemonList.find(p => p.healthPoints > 0);
    const activeDefender = defenderPlayer.pokemonList.find(p => p.healthPoints > 0);

    if (!activeAttacker || !activeDefender) {
        console.error("No se pudo determinar el pokemon atacante o defensor");
        return;
    }

    // Calculo de daño
    let damage = Math.max(1, activeAttacker.attackPoints - activeDefender.defensePoints)
    activeDefender.healthPoints = Math.max(0, activeDefender.healthPoints - damage);

    /*
    if (activeDefender.healthPoints === 0) {
        serverMessageEmitter.emitMessage({
            type: "notify_pokemon_defeated", pokemonDefeated: {
                pokemonName: activeDefender.name
            }
        })
    }*/

    console.log(`${nickname}'s ${activeAttacker.name} attacks ${activeDefender.name} for ${damage} damage.`);

    await battleRepository.updateBattle(battle);
}