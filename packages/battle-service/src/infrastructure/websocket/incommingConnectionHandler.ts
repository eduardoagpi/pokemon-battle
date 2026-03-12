import { RawData, WebSocket } from 'ws';
import url from 'url';
import http from 'http';
import { ExtWebSocket } from './setup';
import { PokemonDetailResponse, PokemonDetailResponseSchema, BattleWSClientMessage, BattleWSClientMessageSchema } from '@poke-albo/shared';
import { BattleReactiveRepository } from '../../domain/repository/BattleReactiveRepository';
import { MatchmakingRepository } from '../../domain/repository/MatchmakingRepository';
import { ServerMessageEmitter } from '../../domain/repository/ServerMessageEmitter';
import { handleBattleChange } from '../../domain/usecase/HandleBattleChange';
import { handleFighterDisconnection } from '../../domain/usecase/HandleDisconnection';
import { handleMatchMaking } from '../../domain/usecase/HandleMatchMaking';
import { handleNewConnection } from '../../domain/usecase/HandleNewConnection';
import { PokemonDetailResponseToPokemon } from '../mappers/dataToDomain';
import { MongoBattleReactiveRepository } from '../repositories/BattleReactiveRepositoryImpl';
import BattleRepository from '../repositories/BattleRepositoryImpl';
import { ServerMessageEmitterRepositoryImpl } from '../repositories/ServerMessageEmitterImpl';
import { handleClientMessage } from './incommingMessageHandler';

export async function handleNewClientConnection(
    webSocket: WebSocket,
    req: http.IncomingMessage,
    matchmakingRepository: MatchmakingRepository,
    battleRepository: BattleRepository
) {


    const authConnection = validateIncommingConnection(req, webSocket)
    if (authConnection === false) return;
    const { nickname, extendedWebSocket, pokemons } = authConnection

    console.log(`Cliente conectado: ${nickname}`);

    // Configurar Heartbeat individual
    extendedWebSocket.on('pong', () => { extendedWebSocket.isAlive = true; });

    // Maneja la conexion inicial
    const newConnectionResult = await handleNewConnection(nickname, pokemons.map(PokemonDetailResponseToPokemon), matchmakingRepository);
    if (!newConnectionResult.success) {
        console.error(`Error en matchmaking inicial para ${nickname}:`, newConnectionResult.error);
        return;
    }
    const battleReactiveRepository: BattleReactiveRepository = new MongoBattleReactiveRepository(newConnectionResult.value.matchId);
    const serverMessageEmitter: ServerMessageEmitter = new ServerMessageEmitterRepositoryImpl(extendedWebSocket)
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
    extendedWebSocket.on('message', async (data) => {
        await handleClientMessage(battleRepository, data, nickname, battleId,);
    });

    // Cleanup cuando se desconecta el cliente
    extendedWebSocket.on('close', async () => {
        console.log(`Cliente ${nickname} desconectado`);
        const waitingHallId = newConnectionResult.value.matchId;
        await matchmakingRepository.deleteMatchmaking(waitingHallId);
        if (!battleId) {
            console.error(`No se encontro el id de la batalla para ${nickname}`);
            return;
        }
        handleFighterDisconnection(battleRepository, nickname, battleId);
    });
}

function validateIncommingConnection(
    req: http.IncomingMessage,
    webSocket: WebSocket
): { extendedWebSocket: ExtWebSocket, pokemons: PokemonDetailResponse[], nickname: string } | false {
    // Extraer user ID del query string
    const location = url.parse(req.url || '', true);
    const nickname = location.query.nickname as string;
    const pokemonListSerialized = location.query.pokemonList as string;

    if (!nickname) {
        webSocket.close(4001, "Nickname Required");
        console.error("Nickname Required, connection closed");
        return false;
    }

    let pokemonData: PokemonDetailResponse[];
    try {
        pokemonData = PokemonDetailResponseSchema.array().parse(JSON.parse(pokemonListSerialized));
    } catch (error) {
        console.error("Error, pokemones no validos", error);
        webSocket.close(4001, "Pokemons no validos");
        return false;
    }

    // Setup del socket extendido
    const extendedWebSocket = webSocket as ExtWebSocket;
    extendedWebSocket.nickname = nickname;
    extendedWebSocket.isAlive = true;

    return {
        extendedWebSocket: extendedWebSocket,
        pokemons: pokemonData,
        nickname: nickname
    };
}