export type BattlePlayer = {
    id: string;
    nickname: string;
}

export type Pokemon = {
    id: string;
    name: string;
    type: string[];
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
