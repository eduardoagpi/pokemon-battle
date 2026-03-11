import { BattleHistoryItemResponse } from "@poke-albo/shared";
import { Battle } from "../../domain/entity/Battle";

export function BattleToBattleHistory(battle: Battle, nickname: string): BattleHistoryItemResponse | null {
    const isPlayer1 = battle.player1.playerInfo.nickname === nickname;
    const opponent = isPlayer1 ? battle.player2 : battle.player1;
    if (!battle.result) return null;

    let result: 'win' | 'loss';
    const winner = battle.result.winner;
    if (winner === 'a') {
        result = isPlayer1 ? "win" : "loss";
    } else {
        result = isPlayer1 ? "loss" : "win";
    }

    return {
        opponentNickname: opponent.playerInfo.nickname,
        result: result,
        date: battle.created.toISOString(),
        reason: battle.result?.reason
    };
}