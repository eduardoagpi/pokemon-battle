// Mocked structural data for pokemons
export interface Pokemon {
    id: number;
    name: string;
    imageUrl: string;
}

const MOCK_POKEMONS: Pokemon[] = [
    {
        id: 1,
        name: 'Bulbasaur',
        imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png'
    },
    {
        id: 4,
        name: 'Charmander',
        imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png'
    },
    {
        id: 7,
        name: 'Squirtle',
        imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png'
    }
];

export function useLobbyStatus() {
    // In the future this will manage fetching actual pokemon data.
    // For now it returns mocked assigned pokemons and waiting state.
    return {
        assignedPokemons: MOCK_POKEMONS,
        isWaitingForOpponent: true
    };
}
