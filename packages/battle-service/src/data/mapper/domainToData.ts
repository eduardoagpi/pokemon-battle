import { Battle } from "../../domain/entity/Battle";
import { BattleDoc } from "../types";

export function BattleToBattleDoc(battle: Battle): BattleDoc {
    return {
        matchmakingId: battle.matchmakingId,
        playerA: {
            nickname: battle.player1.playerInfo.nickname,
            pokemons: battle.player1.pokemonList
        },
        playerB: {
            nickname: battle.player2.playerInfo.nickname,
            pokemons: battle.player2.pokemonList
        },
        status: battle.status,
        result: battle.result,
        turn: battle.turn,
        createdAt: battle.created
    }
}