import { Pokemon } from "../entity/Battle";
import BattleRepository from "../../data/repository/BattleRepositoryImpl";
import { Result, success } from "../entity/result";
import { MatchmakingRepository } from "../repository/MatchmakingRepository";

export type NewConnectionWaitingOpponent = {
    matchId: string;
    type: "waitingOpponent";
    userId: string;
    pokemons: Pokemon[];
}

export type NewConnectionOpponentFound = {
    matchId: string;
    type: "opponentFound";
    userA: string;
    userB: string;
    userAPokemons: Pokemon[];
    userBPokemons: Pokemon[];
}

export type NewConnectionSuccess = NewConnectionOpponentFound | NewConnectionWaitingOpponent

export async function handleNewConnection(
    userId: string,
    pokemonList: Pokemon[],
    matchmakingRepository: MatchmakingRepository,
): Promise<Result<NewConnectionSuccess, unknown>> {

    const matchWaiting = await matchmakingRepository.popMatchmakingOrNull(userId)

    if (matchWaiting) {
        return success({
            matchId: matchWaiting.id,
            type: "opponentFound",
            userA: matchWaiting.player.nickname,
            userB: userId,
            userAPokemons: matchWaiting.pokemonList,
            userBPokemons: pokemonList
        });
    } else {
        const matchMakingId = await matchmakingRepository.createMatchmaking(userId, pokemonList);
        return success({
            matchId: matchMakingId,
            type: "waitingOpponent",
            userId: userId,
            pokemons: pokemonList
        });
    }
}
