import { Pokemon } from "./Pokemon";

export type BattlePlayer = {
    nickname: string;
}

export type Battle = {
    id?: string;
    matchmakingId: string;
    player1: {
        playerInfo: BattlePlayer;
        pokemonList: Pokemon[];
    }
    player2: {
        playerInfo: BattlePlayer;
        pokemonList: Pokemon[];
    }
    turn: number;
    created: Date;
}
export { Pokemon };

