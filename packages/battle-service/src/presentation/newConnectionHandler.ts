import { RawData, WebSocket } from 'ws';
import url from 'url';
import http from 'http';
import { ExtWebSocket } from './webSocket';
import { handleNewConnection } from '../domain/usecase/HandleNewConnection';
import { handleMatchMaking } from '../domain/usecase/HandleMatchMaking';
import { handleClientMessage } from './clientMessageHandler';
import { handleFighterDisconnection } from '../domain/usecase/HandleDisconnection';
import { BattleWSClientMessage, BattleWSClientMessageSchema, PokemonDetailResponse, PokemonDetailResponseSchema } from '@poke-albo/shared';
import { PokemonDetailResponseToPokemon } from '../data/mapper/dataToDomain';
import { MatchmakingRepository } from '../domain/repository/MatchmakingRepository';
import { BattleRepository } from '../domain/repository/BattleRepository';
import { BattleReactiveRepository } from '../domain/repository/BattleReactiveRepository';
import { MongoBattleReactiveRepository } from '../data/repository/BattleReactiveRepositoryImpl';
import { handleBattleChange } from '../domain/usecase/HandleBattleChange';
import { ServerMessageEmitter } from '../domain/repository/ServerMessageEmitter';
import { ServerMessageEmitterRepositoryImpl } from '../data/repository/ServerMessageEmitterImpl';

export async function handleNewClientConnection(
    webSocket: WebSocket,
    req: http.IncomingMessage,
    matchmakingRepository: MatchmakingRepository,
    battleRepository: BattleRepository
) {

    // Extraer user ID del query string
    const location = url.parse(req.url || '', true);
    const nickname = location.query.nickname as string;
    const pokemonListSerialized = location.query.pokemonList as string;

    if (!nickname) {
        webSocket.close(4001, "Nickname Required");
        console.warn("Nickname Required, connection closed");
        return;
    }

    let pokemonData: PokemonDetailResponse[];
    try {
        pokemonData = PokemonDetailResponseSchema.array().parse(JSON.parse(pokemonListSerialized));
    } catch (error) {
        console.error("Error, pokemones no validos", error);
        webSocket.close(4001, "Pokemons no validos");
        return
    }

    // Setup del socket extendido
    const extWs = webSocket as ExtWebSocket;
    extWs.nickname = nickname;
    extWs.isAlive = true;

    console.log(`Cliente conectado: ${nickname}`);

    // Configurar Heartbeat individual
    extWs.on('pong', () => { extWs.isAlive = true; });


    // Maneja la conexion inicial
    const newConnectionResult = await handleNewConnection(nickname, pokemonData.map(PokemonDetailResponseToPokemon), matchmakingRepository);
    if (!newConnectionResult.success) {
        console.error(`Error en matchmaking inicial para ${nickname}:`, newConnectionResult.error);
        return;
    }
    const battleReactiveRepository: BattleReactiveRepository = new MongoBattleReactiveRepository(newConnectionResult.value.matchId);
    const serverMessageEmitter: ServerMessageEmitter = new ServerMessageEmitterRepositoryImpl(extWs)
    let battleId: string | undefined;
    battleReactiveRepository.subscribeToBattle((previousBattleState, currentBattleState) => {
        console.log("battle changed")
        if (!battleId) {
            battleId = currentBattleState.id
            serverMessageEmitter.emitMessage({ type: "start_battle" })
        }
        handleBattleChange(serverMessageEmitter, nickname, previousBattleState, currentBattleState);
    });

    setTimeout(() => handleMatchMaking(newConnectionResult.value, battleRepository), 1000);

    // Manejar mensajes desde los clientes
    extWs.on('message', async (data) => {
        if (!battleId) {
            console.error(`No se encontro el id de la batalla para ${nickname}`);
            return;
        }
        const message = validateClientMessage(data);
        if (!message) {
            console.error(`Mensaje invalido para ${nickname}`);
            return;
        }
        await handleClientMessage(battleRepository, message, nickname, battleId,);
    });

    // Cleanup al cerrar
    extWs.on('close', async () => {
        console.log(`Cliente ${nickname} desconectado`);
        if (!battleId) {
            console.error(`No se encontro el id de la batalla para ${nickname}`);
            return;
        }
        handleFighterDisconnection(battleRepository, nickname, battleId);
    });
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