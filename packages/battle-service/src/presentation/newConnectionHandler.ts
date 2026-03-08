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
    const authId = location.query.auth_id as string;
    const pokemonListSerialized = location.query.pokemonList as string;

    if (!authId) {
        webSocket.close(4001, "Auth ID Required");
        return;
    }

    let pokemonData: PokemonDetailResponse[];
    try {
        pokemonData = PokemonDetailResponseSchema.array().parse(JSON.parse(pokemonListSerialized));
        console.log("¡Válido!", pokemonData);
    } catch (error) {
        console.error("Error, pokemones no validos", error);
        return
    }

    // Setup del socket extendido
    const extWs = webSocket as ExtWebSocket;
    extWs.authId = authId;
    extWs.isAlive = true;

    console.log(`Cliente conectado: ${authId}`);

    // Configurar Heartbeat individual
    extWs.on('pong', () => { extWs.isAlive = true; });


    // Maneja la conexion inicial
    const newConnectionResult = await handleNewConnection(authId, pokemonData.map(PokemonDetailResponseToPokemon), matchmakingRepository);
    if (!newConnectionResult.success) {
        console.error(`Error en matchmaking inicial para ${authId}:`, newConnectionResult.error);
        return;
    }
    const battleReactiveRepository: BattleReactiveRepository = new MongoBattleReactiveRepository(newConnectionResult.value.matchId);
    const serverMessageEmitter: ServerMessageEmitter = new ServerMessageEmitterRepositoryImpl(extWs)
    let battleId: string | undefined;
    battleReactiveRepository.subscribeToBattleCreation((battle) => {
        battleId = battle.id;
    });
    battleReactiveRepository.subscribeToBattle((previousBattleState, currentBattleState) => {
        handleBattleChange(serverMessageEmitter, authId, previousBattleState, currentBattleState);
    });

    handleMatchMaking(newConnectionResult.value, battleRepository);

    // Manejar mensajes desde los clientes
    extWs.on('message', async (data) => {
        if (!battleId) {
            console.error(`No se encontro el id de la batalla para ${authId}`);
            return;
        }
        const message = validateClientMessage(data);
        if (!message) {
            console.error(`Mensaje invalido para ${authId}`);
            return;
        }
        await handleClientMessage(battleRepository, serverMessageEmitter, message, authId, battleId,);
    });

    // Cleanup al cerrar
    extWs.on('close', async () => {
        console.log(`Cliente ${authId} desconectado`);
        handleFighterDisconnection(authId);
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