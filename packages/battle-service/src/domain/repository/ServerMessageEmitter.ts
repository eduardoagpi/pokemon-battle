import { BattleWSServerMessage } from "@poke-albo/shared";

export interface ServerMessageEmitter {
    emitMessage: (message: BattleWSServerMessage) => void
}