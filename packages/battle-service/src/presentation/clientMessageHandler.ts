import { BattleWSClientMessage } from '@poke-albo/shared';
import { BattleRepository } from '../domain/repository/BattleRepository';
import { performAttack } from '../domain/usecase/PerformAttack';
import { ServerMessageEmitter } from '../domain/repository/ServerMessageEmitter';

export async function handleClientMessage(
    battleRepository: BattleRepository,
    serverMessageEmitter: ServerMessageEmitter,
    message: BattleWSClientMessage,
    user: string,
    battleId: string,
) {
    switch (message.type) {
        case 'attack':
            await performAttack(battleRepository, serverMessageEmitter, battleId, user);
            break;
        default:
            break;
    }
}