import { BattleWSServerMessage } from "@poke-albo/shared";
import { ServerMessageEmitter } from "../../domain/repository/ServerMessageEmitter";
import { ExtWebSocket } from "../../presentation/webSocket";

export class ServerMessageEmitterRepositoryImpl implements ServerMessageEmitter {

    constructor(private extendedWebSocket: ExtWebSocket) { }

    emitMessage(message: BattleWSServerMessage) {
        this.extendedWebSocket.send(JSON.stringify(message))
    }
}