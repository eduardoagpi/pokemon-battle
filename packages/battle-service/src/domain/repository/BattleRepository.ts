import { BattlePlayer, Pokemon } from "../entity/entity";

export interface BattleRepository {
    createBattle(
        player1: BattlePlayer,
        player2: BattlePlayer,
        player1PokemonList: Pokemon[],
        player2PokemonList: Pokemon[]
    ): void;

    registerAttack(
        battleId: string,
        playerId: string,
        pokemonId: string,
        attack: string
    ): void;

    changeBattleStatus(
        battleId: string,
        status: 'waiting' | 'battling' | 'finished'
    ): void;
}