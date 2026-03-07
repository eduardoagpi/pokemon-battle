import { useQuery } from "@tanstack/react-query";
import { CACHE_KEYS } from "../../data/api/cacheKeys";
import { getPokemonDetail } from "../../data/api/requests";

export function useGetPokemonDetails(pokemonNumber?: number) {
    const { data, isLoading, error } = useQuery({
        queryKey: [CACHE_KEYS.POKEMON_DETAILS, pokemonNumber],
        queryFn: () => getPokemonDetail(pokemonNumber ?? 0),
        enabled: !!pokemonNumber,
    });

    return { pokemonDetails: data, isLoading, error }
}