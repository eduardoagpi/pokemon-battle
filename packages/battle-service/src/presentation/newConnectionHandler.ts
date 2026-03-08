import { WebSocket } from 'ws';
import url from 'url';
import http from 'http';
import { ExtWebSocket } from './webSocket';
import { handleNewConnection } from '../domain/usecase/HandleNewConnection';
import { handleMatchMaking } from '../domain/usecase/HandleMatchMaking';
import { handleClientMessage } from './clientMessageHandler';
import { handleFighterDisconnection } from '../domain/usecase/HandleDisconnection';
import { PokemonDetailResponse, PokemonDetailResponseSchema } from '@poke-albo/shared';
import { PokemonDetailResponseToPokemon } from '../data/mapper/dataToDomain';


export async function handleNewClientConnection(webSocket: WebSocket, req: http.IncomingMessage) {
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
    const newConnectionResult = await handleNewConnection(authId, pokemonData.map(PokemonDetailResponseToPokemon));
    if (!newConnectionResult.success) {
        console.error(`Error en matchmaking inicial para ${authId}:`, newConnectionResult.error);
        return;
    }
    let battleId: string;
    handleMatchMaking(extWs, newConnectionResult.value, (_battleId) => {
        if (!battleId) battleId = _battleId
    });


    // Manejar mensajes desde los clientes
    extWs.on('message', async (data) => {
        handleClientMessage(data, authId, battleId);
    });

    // Cleanup al cerrar
    extWs.on('close', async () => {
        console.log(`Cliente ${authId} desconectado`);
        handleFighterDisconnection(authId);
    });
}