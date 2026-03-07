import { createContext, useContext, useState, type ReactNode } from 'react';
import type { PokemonDetailResponse } from '@poke-albo/shared';

interface GeneralContextType {
    nickname: string;
    selectedPokemons: PokemonDetailResponse[];
    setNickname: (name: string) => void;
    setSelectedPokemons: (pokemons: PokemonDetailResponse[]) => void;
    resetSession: () => void;
}

const GeneralAppContext = createContext<GeneralContextType | undefined>(undefined);

export const GeneralAppContextProvider = ({ children }: { children: ReactNode }) => {
    const [nickname, setNicknameState] = useState<string>('');
    const [selectedPokemons, setSelectedPokemonsState] = useState<PokemonDetailResponse[]>([]);

    const setNickname = (name: string) => setNicknameState(name);
    const setSelectedPokemons = (pokemons: PokemonDetailResponse[]) => setSelectedPokemonsState(pokemons);

    const resetSession = () => {
        setNicknameState('');
        setSelectedPokemonsState([]);
    };

    return (
        <GeneralAppContext.Provider value={{ nickname, selectedPokemons, setNickname, setSelectedPokemons, resetSession }}>
            {children}
        </GeneralAppContext.Provider>
    );
};

export const useGeneralAppContext = () => {
    const context = useContext(GeneralAppContext);
    if (context === undefined) {
        throw new Error('useGeneralApp must be used within a GeneralAppProvider');
    }
    return context;
};
