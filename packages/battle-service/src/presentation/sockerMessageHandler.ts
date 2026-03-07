import { logMessage } from "@poke-albo/shared";
import { DefaultEventsMap, Server, Socket } from "socket.io";

export function setupSocketMessageHandler(
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
    io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) {

    socket.on('disconnect', () => {
        logMessage(`User disconnected: ${socket.id}`);

    });
}