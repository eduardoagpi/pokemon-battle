import { Pokemon } from "../entity/Pokemon";
import { BattleRepository } from "../repository/BattleRepository";

export async function performAttack(
    battleRepository: BattleRepository,
    battleId: string,
    nickname: string,
    pokemonId: number
) {
    const battle = await battleRepository.getBattle(battleId);
    if (!battle) {
        console.error('Battle not found');
        return;
    }

    let pokemonAttacking: Pokemon | undefined;
    let pokemonDeffending: Pokemon | undefined;
    if (battle.player1.playerInfo.nickname === nickname) {
        pokemonAttacking = battle.player1.pokemonList.find(pokemon => { pokemon.healthPoints > 0 })
        pokemonDeffending = battle.player2.pokemonList.find(pokemon => { pokemon.healthPoints > 0 })
    } else {
        pokemonAttacking = battle.player2.pokemonList.find(pokemon => { pokemon.healthPoints > 0 })
        pokemonDeffending = battle.player1.pokemonList.find(pokemon => { pokemon.healthPoints > 0 })
    }
    if (pokemonAttacking === undefined) {
        console.error("No se pudo determinar el pokemon atacante")
        return
    }
    if (pokemonDeffending === undefined) {
        console.error("No se pudo determinar el pokemon atacado")
        return;
    }



    const player = battle.player1.playerInfo.nickname === nickname ? battle.player1 : battle.player2;
    const pokemon = player.pokemonList.find(p => p.pokemonId === pokemonId);
    if (!pokemon) {
        throw new Error('Pokemon not found');
    }
    pokemon.hp -= 10;
    await battleRepository.updateBattle(battleId, battle);
}