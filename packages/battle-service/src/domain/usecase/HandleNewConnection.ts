import { Pokemon } from "../entity/Battle";
import { Result, success } from "../entity/result";
import { MatchmakingRepository } from "../repository/MatchmakingRepository";

export type NewWaitingHallCreated = {
    matchId: string;
    type: "waitingOpponent";
    userId: string;
    pokemons: Pokemon[];
}

export type JoinedToHall = {
    matchId: string;
    type: "opponentFound";
    userA: string;
    userB: string;
    userAPokemons: Pokemon[];
    userBPokemons: Pokemon[];
}

export type NewConnectionSuccess = JoinedToHall | NewWaitingHallCreated

export async function handleNewConnection(
    userId: string,
    pokemonList: Pokemon[],
    matchmakingRepository: MatchmakingRepository,
): Promise<Result<NewConnectionSuccess, unknown>> {

    const matchWaiting = await matchmakingRepository.popMatchmakingOrNull(userId)
    const pokemonsRepeated = pokemonsRepeatedBetweenPlayers(matchWaiting?.pokemonList || [], pokemonList)

    // si el nickname ya existe o los pokemones se repiten, se crea un nuevo hall
    if (!matchWaiting || pokemonsRepeated) {
        const matchMakingId = await matchmakingRepository.createMatchmaking(userId, pokemonList);
        return success({
            matchId: matchMakingId,
            type: "waitingOpponent",
            userId: userId,
            pokemons: pokemonList
        });
    } else {
        return success({
            matchId: matchWaiting.id,
            type: "opponentFound",
            userA: matchWaiting.player.nickname,
            userB: userId,
            userAPokemons: matchWaiting.pokemonList,
            userBPokemons: pokemonList
        });
    }

}

function pokemonsRepeatedBetweenPlayers(pokemonsA: Pokemon[], pokemonsB: Pokemon[]): boolean {
    const pokemonsIndexASet = new Set(pokemonsA.map(p => p.index));
    return pokemonsB.some(p => pokemonsIndexASet.has(p.index));
}