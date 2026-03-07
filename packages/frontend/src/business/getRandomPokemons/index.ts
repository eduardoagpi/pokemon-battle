import { useQuery, useQueries } from "@tanstack/react-query";
import { useMemo, useEffect } from "react";
import { CACHE_KEYS } from "../../data/api/cacheKeys";
import { getPokemonList, getPokemonDetail } from "../../data/api/requests";
import { useSnackbar } from "../../presentation/hooks/useSnackbar";
import type { PokemonDetailResponse } from "@poke-albo/shared";
import { NUM_POKEMONS } from "../../util";

export function useGetRandomPokemons(count: number = NUM_POKEMONS, enabled: boolean) {
    const { showError } = useSnackbar();

    const {
        data: pokemonList,
        isLoading: isLoadingPokemonList,
        error: pokemonListError,
    } = useQuery({
        queryKey: [CACHE_KEYS.POKEMON_LIST],
        queryFn: getPokemonList,
        enabled,
    });

    const randomPokemons = useMemo(() => {
        if (!pokemonList) return [];

        const shuffled = [...pokemonList].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }, [pokemonList, count]);

    const detailQueries = useQueries({
        queries: randomPokemons.map((pokemon) => ({
            queryKey: [CACHE_KEYS.POKEMON_DETAILS, pokemon.id],
            queryFn: () => getPokemonDetail(pokemon.id),
            enabled: randomPokemons.length === count,
        })),
    });

    const pokemonDetailsList = useMemo(() => {
        const pokemons: PokemonDetailResponse[] = [];

        detailQueries.forEach((pokemonDetailQuery) => {
            if (pokemonDetailQuery.data) {
                pokemons.push(pokemonDetailQuery.data);
            }
        });

        if (pokemons.length !== count) return undefined;

        return pokemons;
    }, [detailQueries, count]);

    const isLoading =
        isLoadingPokemonList || detailQueries.some((q) => q.isLoading);

    const failedPokemonNames = useMemo(() => {
        return detailQueries
            .map((query, index) =>
                query.error ? randomPokemons[index]?.name : null
            )
            .filter(Boolean) as string[];
    }, [detailQueries, randomPokemons]);

    const detailError = detailQueries.find((q) => q.error)?.error;

    useEffect(() => {
        if (pokemonListError) {
            showError("Error al obtener la lista de pokemon");
            return;
        }

        if (failedPokemonNames.length > 0) {
            showError(
                `Error al obtener los detalles de: ${failedPokemonNames.join(", ")}`
            );
        }
    }, [pokemonListError, failedPokemonNames, showError]);

    return {
        pokemons: pokemonDetailsList ?? [],
        isLoading,
        error: pokemonListError ?? detailError,
    };
}