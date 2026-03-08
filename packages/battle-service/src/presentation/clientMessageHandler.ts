import { BattleWSClientMessage } from '@poke-albo/shared';
import { BattleRepository } from '../domain/repository/BattleRepository';
import { performAttack } from '../domain/usecase/PerformAttack';

export async function handleClientMessage(
    battleRepository: BattleRepository,
    message: BattleWSClientMessage,
    user: string,
    battleId: string,
) {
    switch (message.type) {
        case 'attack':
            await performAttack(battleRepository, battleId, user);
            break;
        default:
            break;
    }
}