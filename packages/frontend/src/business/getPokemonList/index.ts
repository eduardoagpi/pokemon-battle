import { useQuery } from "@tanstack/react-query";
import { getPokemonList } from "../../data/api/requests";
import { CACHE_KEYS } from "../../data/api/cacheKeys";

export function useGetPokemonList(enabled?: boolean) {
    const { data, isLoading, error } = useQuery({
        queryKey: [CACHE_KEYS.POKEMON_LIST],
        queryFn: getPokemonList,
        enabled: enabled ?? true,
    });

    return {
        pokemonList: data,
        isLoading,
        error,
    };
}