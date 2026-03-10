// context/WebSocketContext.tsx
import { createContext, useContext, useRef, useState, type ReactNode, useCallback } from 'react';
import { useSnackbar } from '../hooks/useSnackbar';
import { useGeneralAppContext } from './GeneralAppContext';
import { BattleWSServerMessageSchema, parseJsonSerializedOrNull, type BattleState, type BattleWSClientMessage, type BattleWSServerMessage, type PokemonDetailResponse } from '@poke-albo/shared';
import { useNavigate } from 'react-router-dom';
import { useMessageQueue } from '../hooks/useMessageQueue';

interface WebSocketContextType {
    isReady: boolean;
    battleState: BattleState | null;
    battleMessage: BattleWSServerMessage | null;
    connect: (nickname: string, pokemonList: PokemonDetailResponse[]) => void;
    disconnect: (silentDisconnect?: boolean) => void;
    send: (data: BattleWSClientMessage) => void;
}

const BattleContext = createContext<WebSocketContextType | undefined>(undefined);

export function BattleContextProvider({ children }: { children: ReactNode }) {
    const [isReady, setIsReady] = useState(false);
    const ws = useRef<WebSocket | null>(null);
    const { showError } = useSnackbar();
    const { resetSession } = useGeneralAppContext();
    const navigate = useNavigate();
    const silentDisconnectRef = useRef(false);

    const [battleState, setBattleState] = useState<BattleState | null>(null);

    const disconnect = useCallback((silentDisconnect: boolean = false) => {
        if (ws.current) {
            silentDisconnectRef.current = silentDisconnect;
            ws.current.close();
            ws.current = null;
            setIsReady(false);
        }
    }, []);

    const battleEventsQueue = useMessageQueue<BattleWSServerMessage>()

    const connect = useCallback((nickname: string, pokemonList: PokemonDetailResponse[]) => {

        // Evitar múltiples conexiones simultáneas
        if (ws.current?.readyState === WebSocket.OPEN) return;

        const socket = new WebSocket(`ws://localhost:3003?nickname=${nickname}&pokemonList=${JSON.stringify(pokemonList)}`);

        socket.onopen = () => {
            console.log("Conexión establecida");
            setIsReady(true);
        }
        socket.onclose = (event) => {
            console.log("Conexión cerrada", event);
            setIsReady(false);
            if (!silentDisconnectRef.current) {
                showError("Conexión cerrada");
            }
            silentDisconnectRef.current = false;

            setTimeout(() => {
                resetSession();
            }, 1000);
        }
        socket.onmessage = (event) => {
            const parsedData = parseJsonSerializedOrNull(BattleWSServerMessageSchema, event.data);
            if (!parsedData) {
                console.error("Mensaje no válido");
                console.error(JSON.stringify(event.data));
                return;
            }
            console.log(JSON.stringify(parsedData));
            switch (parsedData.type) {
                case "start_battle":
                    navigate("/battle");
                    break;
                case "updateBattleStatus":
                    setBattleState(parsedData.battleState);
                    break;
                case "notify_your_pokemon_defeated":
                    battleEventsQueue.addMessage(parsedData)
                    break;
                case "notify_oponent_pokemon_defeated":
                    battleEventsQueue.addMessage(parsedData)
                    break;
                case "notify_you_won":
                    battleEventsQueue.addMessage(parsedData)
                    break;
                case "notify_you_lost":
                    battleEventsQueue.addMessage(parsedData)
                    break;
                default:
                    console.error("Error, mensaje recibido no es válido");
                    break;
            }
        };

        ws.current = socket;
    }, []);

    const send = useCallback((data: BattleWSClientMessage) => {
        if (ws.current?.readyState === WebSocket.OPEN) {
            console.log("Enviando mensaje ", JSON.stringify(data));
            ws.current.send(JSON.stringify(data));
        }
    }, []);

    return (
        <BattleContext.Provider value={{ isReady, battleState, connect, disconnect, send, battleMessage: battleEventsQueue.currentMessage }}>
            {children}
        </BattleContext.Provider>
    );
}

export function useBattleContext() {
    const context = useContext(BattleContext);
    if (!context) throw new Error("useWS debe usarse dentro de BattleContextProvider");
    return context;
}