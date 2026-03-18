import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { PokemonDetailResponse } from '@poke-albo/shared';

const FIRST_TIME_FLAG = 'has_opened_before';

interface GeneralContextType {
    nickname: string;
    selectedPokemons: PokemonDetailResponse[];
    setNickname: (name: string) => void;
    setSelectedPokemons: (pokemons: PokemonDetailResponse[]) => void;
    resetSession: () => void;
    isMenuOpen: boolean;
    setIsMenuOpen: (isOpen: boolean) => void;
}

const GeneralAppContext = createContext<GeneralContextType | undefined>(undefined);

export const GeneralAppContextProvider = ({ children }: { children: ReactNode }) => {
    const [nickname, setNicknameState] = useState<string>('');
    const [selectedPokemons, setSelectedPokemonsState] = useState<PokemonDetailResponse[]>([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const hasOpenedBefore = localStorage.getItem(FIRST_TIME_FLAG);
        if (!hasOpenedBefore) {
            setIsMenuOpen(true);
            localStorage.setItem(FIRST_TIME_FLAG, 'true');
        }
    }, []);

    const setNickname = (name: string) => setNicknameState(name);
    const setSelectedPokemons = (pokemons: PokemonDetailResponse[]) => setSelectedPokemonsState(pokemons);

    const resetSession = () => {
        setNicknameState('');
        setSelectedPokemonsState([]);
    };

    return (
        <GeneralAppContext.Provider value={{
            nickname,
            selectedPokemons,
            setNickname,
            setSelectedPokemons,
            resetSession,
            isMenuOpen,
            setIsMenuOpen,
        }}>
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
