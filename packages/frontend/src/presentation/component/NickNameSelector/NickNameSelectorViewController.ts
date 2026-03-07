import { useState, useEffect } from 'react';
import { useGetRandomPokemons } from '../../../business/getRandomPokemons';
import type { PokemonDetailResponse } from '@poke-albo/shared';
import { NUM_POKEMONS } from '../../../util';

export function useNickNameSelector(
    onConfirm: (
        nickname: string,
        selectedPokemons: PokemonDetailResponse[]
    ) => void
) {
    const [nickname, setNickname] = useState('');
    const [enabled, setEnabled] = useState(false);

    const { pokemons } = useGetRandomPokemons(NUM_POKEMONS, enabled);

    const handleSubmit = () => {
        if (!nickname.trim()) return;
        setEnabled(true);
    };

    useEffect(() => {
        if (pokemons.length !== NUM_POKEMONS) return;
        onConfirm(nickname, pokemons);
    }, [pokemons]);


    return {
        nickname,
        setNickname,
        handleSubmit
    };
}
