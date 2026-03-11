export type BattleHistoryItemUi = {
    id: string;
    opponentNickname: string;
    result: {
        customStyle: string;
        text: string;
    };
    reason: string;
    date: string;
}