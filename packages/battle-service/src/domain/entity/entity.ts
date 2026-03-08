
export type Matchmaking = {
    id: string;
    player: BattlePlayer;
    pokemonList: Pokemon[];
    createdAt: Date;
}

export type BattlePlayer = {
    nickname: string;
}

export type Pokemon = {
    index: number;
    name: string;
    type: string[]; /// remove?

    healthPoints: number;
    attackPoints: number;
    defensePoints: number;
    speedPoints: number;
}

export type Battle = {
    id: string;
    player1: {
        playerInfo: BattlePlayer;
        pokemonList: Pokemon[];
    }
    player2: {
        playerInfo: BattlePlayer;
        pokemonList: Pokemon[];
    }
    status: BattleStatus;
    turn: number;
    created: Date;
}

export enum BattleStatus {
    WAITING = 'waiting',
    Battling = 'battling',
    FINISHED = 'finished'
}
