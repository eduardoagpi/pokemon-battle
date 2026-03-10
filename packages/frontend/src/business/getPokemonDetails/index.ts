import { useQuery } from "@tanstack/react-query";
import { CACHE_KEYS } from "../../data/api/cacheKeys";
import { getPokemonDetail } from "../../data/api/requests";
import { useSnackbar } from "../../presentation/hooks/useSnackbar";
import { useEffect } from "react";

export function useGetPokemonDetails(pokemonNumber?: number) {
    const { showError } = useSnackbar()
    const { data, isLoading, error } = useQuery({
        queryKey: [CACHE_KEYS.POKEMON_DETAILS, pokemonNumber],
        queryFn: () => getPokemonDetail(pokemonNumber ?? 0),
        enabled: !!pokemonNumber,
    });

    useEffect(() => {
        if (error) showError("ups!, no se pudo obtener los detalles del pokemon " + pokemonNumber)
    }, [error])

    return { pokemonDetails: data, isLoading, error }
}