import { BattleWSServerMessage } from "@poke-albo/shared";
import { ServerMessageEmitter } from "../../domain/repository/ServerMessageEmitter";
import { ExtWebSocket } from "../websocket/setup";

export class ServerMessageEmitterRepositoryImpl implements ServerMessageEmitter {

    constructor(private extendedWebSocket: ExtWebSocket) { }

    emitMessage(message: BattleWSServerMessage) {
        console.log(`Emitted messaf: ${JSON.stringify(message)}`)
        this.extendedWebSocket.send(JSON.stringify(message))
    }
}