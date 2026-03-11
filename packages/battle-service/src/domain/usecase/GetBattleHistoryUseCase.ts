import { BattleRepository } from "../repository/BattleRepository";
import { Battle } from "../entity/Battle";

export async function getBattleHistory(
    nickname: string,
    battleRepository: BattleRepository
): Promise<Battle[]> {
    const battles = await battleRepository.findHistoryByNickname(nickname);
    return battles;
}
