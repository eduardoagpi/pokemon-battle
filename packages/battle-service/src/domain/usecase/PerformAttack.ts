import { BattleRepository } from "../repository/BattleRepository";

export async function performAttack(
    battleRepository: BattleRepository,
    battleId: string,
    nickname: string
) {
    const battle = await battleRepository.getBattle(battleId);
    if (!battle) {
        console.error('Battle not found');
        return;
    }

    if (battle.status !== 'active') {
        console.error('Cannot perform attack. Battle is not active');
        return;
    }

    const attackerPlayer = battle.player1.playerInfo.nickname === nickname ? battle.player1 : battle.player2;
    const defenderPlayer = battle.player1.playerInfo.nickname === nickname ? battle.player2 : battle.player1;

    // Determine active pokemon (first with healthPoints > 0)
    const pockemonAttacking = attackerPlayer.pokemonList.find(p => p.healthPoints > 0);
    const pokemonDeffending = defenderPlayer.pokemonList.find(p => p.healthPoints > 0);

    if (!pockemonAttacking || !pokemonDeffending) {
        console.error("No se pudo determinar el pokemon atacante o defensor");
        return;
    }

    // Calculo de daño
    // TODO cambiar max a 1, 20 is set for debugg reasons
    let damage = Math.max(20, pockemonAttacking.attackPoints - pokemonDeffending.defensePoints)
    pokemonDeffending.healthPoints = Math.max(0, pokemonDeffending.healthPoints - damage);

    // Verify if all pokemons have been defeated
    // finish battle if no more pokemons left
    if (defenderPlayer.pokemonList.every(pokemon => {
        console.log("sanity check: ", pokemon.healthPoints)
        return pokemon.healthPoints === 0
    })) {
        battle.status = 'finished'
        battle.result = {
            winner: defenderPlayer.playerInfo.nickname === battle.player1.playerInfo.nickname ? 'b' : 'a',
            reason: 'combat'
        }
        console.log(`battle status set to finished, ${JSON.stringify(battle)}`)
    }

    console.log(`${nickname}'s ${pockemonAttacking.name} attacks ${pokemonDeffending.name} for ${damage} damage.`);

    battle.turn = battle.turn + 1

    await battleRepository.updateBattle(battle);
}