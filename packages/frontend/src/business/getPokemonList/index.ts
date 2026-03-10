import { useQuery } from "@tanstack/react-query";
import { getPokemonList } from "../../data/api/requests";
import { CACHE_KEYS } from "../../data/api/cacheKeys";
import { useEffect } from "react";
import { useSnackbar } from "../../presentation/hooks/useSnackbar";

export function useGetPokemonList(enabled?: boolean) {
    const { showError } = useSnackbar()
    const { data, isLoading, error } = useQuery({
        queryKey: [CACHE_KEYS.POKEMON_LIST],
        queryFn: getPokemonList,
        enabled: enabled ?? true,
    });

    useEffect(() => {
        if (error) showError("ups!, no se pudo obtener la lista de pokemones")
    }, [error])

    return {
        pokemonList: data,
        isLoading,
        error,
    };
}