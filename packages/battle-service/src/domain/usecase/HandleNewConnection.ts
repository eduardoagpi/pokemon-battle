import { Result, success } from "../entity/result";
import { Pokemon } from "../entity/entity";
import BattleRepository from "../../data/repository/BattleRepository";

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

export async function handleNewConnection(userId: string, pokemonList: Pokemon[]): Promise<Result<NewConnectionSuccess, unknown>> {

    const matchWaiting = await BattleRepository.popMatchmakingOrNull(userId)

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
        const matchMakingId = await BattleRepository.createMatchmaking(userId, pokemonList);
        return success({
            matchId: matchMakingId,
            type: "waitingOpponent",
            userId: userId,
            pokemons: pokemonList
        });
    }
}
