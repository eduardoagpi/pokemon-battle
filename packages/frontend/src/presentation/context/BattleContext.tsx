// context/WebSocketContext.tsx
import { createContext, useContext, useRef, useState, type ReactNode, useCallback } from 'react';
import { useSnackbar } from '../hooks/useSnackbar';
import { useGeneralAppContext } from './GeneralAppContext';
import { BattleWSServerMessageSchema, parseJsonSerializedOrNull, type BattleState, type BattleWSClientMessage, type PokemonDetailResponse } from '@poke-albo/shared';
import { useNavigate } from 'react-router-dom';

interface WebSocketContextType {
    isReady: boolean;
    battleState: BattleState | null;
    connect: (nickname: string, pokemonList: PokemonDetailResponse[]) => void;
    disconnect: () => void;
    send: (data: BattleWSClientMessage) => void;
}

const BattleContext = createContext<WebSocketContextType | undefined>(undefined);

export function BattleContextProvider({ children }: { children: ReactNode }) {
    const [isReady, setIsReady] = useState(false);
    const ws = useRef<WebSocket | null>(null);
    const { showError, showInfo } = useSnackbar();
    const { resetSession } = useGeneralAppContext();
    const navigate = useNavigate();

    const [battleState, setBattleState] = useState<BattleState | null>(null);

    const disconnect = useCallback(() => {
        if (ws.current) {
            ws.current.close();
            ws.current = null;
            setIsReady(false);
        }
    }, []);

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
            showError("Conexión cerrada");

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
                    showInfo("Tu Pokémon ha sido derrotado");
                    break;
                case "notify_oponent_pokemon_defeated":
                    showInfo("El oponente ha sido derrotado");
                    break;
                case "notify_you_won":
                    showInfo("Has ganado la batalla");
                    break;
                case "notify_you_lost":
                    showInfo("Has perdido la batalla");
                    break;
                case "notify_battle_finished":
                    showInfo(`La batalla ha terminado. El ganador es ${parsedData.winnerNickname}`);
                    break;
                default:
                    console.error("Mensaje no válido");
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
        <BattleContext.Provider value={{ isReady, battleState, connect, disconnect, send }}>
            {children}
        </BattleContext.Provider>
    );
}

export function useBattleContext() {
    const context = useContext(BattleContext);
    if (!context) throw new Error("useWS debe usarse dentro de BattleContextProvider");
    return context;
}