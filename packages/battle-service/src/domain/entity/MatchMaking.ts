import { BattlePlayer, Pokemon } from "./Battle";

export type Matchmaking = {
    id: string;
    player: BattlePlayer;
    pokemonList: Pokemon[];
    createdAt: Date;
}