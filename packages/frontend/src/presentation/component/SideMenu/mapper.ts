import type { BattleHistoryItemResponse } from "@poke-albo/shared";
import type { BattleHistoryItemUi } from "./SideMenuUi";

export function BattleHistoryItemResponseToBattleHistoryUi(nickname: string, input: BattleHistoryItemResponse): BattleHistoryItemUi {

    const battleResult = input.result === 'win' ? 'Victoria' : 'Derrota';
    const battleResultReason = input.reason === undefined ? '' : input.reason === 'combat' ? 'Combate' : 'Desertión';
    return {
        id: `${nickname}-${input.date}`,
        opponentNickname: input.opponentNickname,
        result: {
            customStyle: input.result === 'win' ? 'bg-green-500/20 text-green-400' :
                input.result === 'loss' ? 'bg-red-500/20 text-red-400' : 'bg-gray-500/20 text-gray-400',
            text: battleResult
        },
        date: `${new Date(input.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }).toLowerCase()} ${new Date(input.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false })}`,
        reason: battleResultReason,
    }
}