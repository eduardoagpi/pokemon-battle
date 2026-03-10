import { Pokemon } from "./Pokemon";

export type BattlePlayer = {
    nickname: string;
}

export type BattlePlayerState = {
    playerInfo: BattlePlayer;
    pokemonList: Pokemon[];
}

export type Battle = {
    id?: string;
    matchmakingId: string;
    player1: BattlePlayerState;
    player2: BattlePlayerState;
    turn: number;
    status: 'active' | 'finished';
    result?: {
        winner: 'a' | 'b';
        reason: 'combat' | 'desertion'
    }
    created: Date;
}
export { Pokemon };

