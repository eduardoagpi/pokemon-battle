import { BattleWSClientMessage } from '@poke-albo/shared';
import { RawData } from 'ws';

export function handleClientMessage(message: BattleWSClientMessage, user: string, battleId: string,) {
    switch (message.type) {
        case 'atack':
            break;
        default:
            break;
    }
}