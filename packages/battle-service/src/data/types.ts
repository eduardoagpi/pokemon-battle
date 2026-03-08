import { ObjectId } from 'mongodb';

export interface MatchmakingDoc {
    _id?: ObjectId;
    player: string;
    pokemons: PokemonDoc[];
    createdAt: Date;
}

export interface BattleDoc {
    _id?: ObjectId;
    matchmakingId: string;
    playerA: {
        nickname: string;
        pokemons: PokemonDoc[];
    };
    playerB: {
        nickname: string;
        pokemons: PokemonDoc[]
    },
    status: 'active' | 'finished';
    turn: number;
    createdAt: Date;
}

export interface PokemonDoc {
    _id?: ObjectId;
    index: number;
    name: string;
    type: string[];
    healthPoints: number;
    attackPoints: number;
    defensePoints: number;
    speedPoints: number;
}