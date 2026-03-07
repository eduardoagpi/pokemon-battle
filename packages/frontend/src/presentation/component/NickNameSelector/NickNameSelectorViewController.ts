import { useState, useEffect } from 'react';
import { useGetRandomPokemons } from '../../../business/getRandomPokemons';
import type { PokemonDetailResponse } from '@poke-albo/shared';
import { NUM_POKEMONS } from '../../../util';

export function useNickNameSelector(
    onConfirm: (
        nickname: string,
        selectedPokemons: PokemonDetailResponse[]
    ) => void,
    initialNickname: string = ''
) {
    const [nickname, setNickname] = useState(initialNickname);
    const [enabled, setEnabled] = useState(false);

    const { pokemons } = useGetRandomPokemons(NUM_POKEMONS, enabled);

    const handleSubmit = () => {
        if (!nickname.trim()) return;
        setEnabled(true);
    };

    useEffect(() => {
        if (!enabled || pokemons.length !== NUM_POKEMONS) return;
        onConfirm(nickname, pokemons);
    }, [pokemons, enabled, nickname, onConfirm]);


    return {
        nickname,
        setNickname,
        handleSubmit
    };
}
