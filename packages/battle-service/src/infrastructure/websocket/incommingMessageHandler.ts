import { BattleWSClientMessage, BattleWSClientMessageSchema } from '@poke-albo/shared';
import { BattleRepository } from '../../domain/repository/BattleRepository';
import { performAttack } from '../../domain/usecase/PerformAttack';
import { RawData } from 'ws';

export async function handleClientMessage(
    battleRepository: BattleRepository,
    message: RawData,
    user: string,
    battleId?: string,
) {
    if (!battleId) {
        console.error(`No se encontro el id de la batalla para ${user}`);
        return;
    }

    const messageValidated: BattleWSClientMessage | null = validateClientMessage(message);
    if (!messageValidated) {
        console.error(`Mensaje invalido para ${user}`);
        return;
    }

    switch (messageValidated.type) {
        case 'attack':
            await performAttack(battleRepository, battleId, user);
            break;
        default:
            break;
    }
}

function validateClientMessage(data: RawData): BattleWSClientMessage | null {
    try {
        const message = JSON.parse(data.toString());
        const parsedMessage = BattleWSClientMessageSchema.parse(message);
        return parsedMessage;
    } catch (error) {
        console.error("Error al validar el mensaje del cliente", error);
        return null;
    }
}