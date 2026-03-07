import { useEffect, useMemo, useState } from "react";
import { useGetPokemonList } from "../getPokemonList";
import { useGetPokemonDetails } from "../getPokemonDetails";
import { getUniqueItems, NUM_POKEMONS } from "../../util";
import type { PokemonListItemResponse } from "@poke-albo/shared";
export function useGetRandomPokemons(enabled: boolean) {
    const { pokemonList } = useGetPokemonList(enabled);
    const [selectedPokemons, setSelectedPokemons] = useState<PokemonListItemResponse[]>([])


    useEffect(() => {
        if (!pokemonList || pokemonList?.length === 0) return
        const randomPokemons = getUniqueItems(pokemonList, NUM_POKEMONS)
        setSelectedPokemons(randomPokemons)
    }, [pokemonList])

    // Asumimos que estos hooks devuelven objetos. 
    // Los llamamos incondicionalmente (regla de oro de los hooks)
    const first = useGetPokemonDetails(selectedPokemons?.[0]?.id);
    const second = useGetPokemonDetails(selectedPokemons?.[1]?.id);
    const third = useGetPokemonDetails(selectedPokemons?.[2]?.id);

    // Extraemos las dependencias reales
    const p1 = first.pokemonDetails;
    const p2 = second.pokemonDetails;
    const p3 = third.pokemonDetails;

    return useMemo(() => {
        const allLoaded = p1 && p2 && p3;

        if (allLoaded) {
            return {
                pokemons: [p1, p2, p3], // Ahora este array es estable gracias al useMemo
                isLoading: false,
                error: null
            };
        }

        return {
            pokemons: [],
            isLoading: first.isLoading || second.isLoading || third.isLoading,
            error: first.error || second.error || third.error
        };
        // Solo recalculamos si cambian los datos reales o los estados de carga/error
    }, [p1, p2, p3, first.isLoading, second.isLoading, third.isLoading, first.error, second.error, third.error]);
}