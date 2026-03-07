import type { PokemonDetailResponse } from "@poke-albo/shared";

export function useLobbyStatus(pokemons: PokemonDetailResponse[]) {
    return {
        assignedPokemons: pokemons,
        isWaitingForOpponent: true
    };
}
