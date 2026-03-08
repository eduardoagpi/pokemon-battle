// context/WebSocketContext.tsx
import { createContext, useContext, useRef, useState, type ReactNode, useCallback } from 'react';

interface WebSocketContextType {
    isReady: boolean;
    val: any;
    connect: (nickname: string) => void;
    disconnect: () => void;
    send: (data: any) => void;
}

const BattleContext = createContext<WebSocketContextType | undefined>(undefined);

export function BattleContextProvider({ children }: { children: ReactNode }) {
    const [isReady, setIsReady] = useState(false);
    const [val, setVal] = useState<any>(null);
    const ws = useRef<WebSocket | null>(null);

    const disconnect = useCallback(() => {
        if (ws.current) {
            ws.current.close();
            ws.current = null;
            setIsReady(false);
        }
    }, []);

    const connect = useCallback((nickname: string) => {

        // Evitar múltiples conexiones simultáneas
        if (ws.current?.readyState === WebSocket.OPEN) return;

        const socket = new WebSocket(`ws://localhost:3001?nickname=${nickname}`);

        socket.onopen = () => {
            console.log("Conexión establecida");
            setIsReady(true);
        }
        socket.onclose = () => setIsReady(false);
        socket.onmessage = (event) => {
            try {
                setVal(JSON.parse(event.data));
            } catch {
                setVal(event.data);
            }
        };

        ws.current = socket;
    }, []);

    const send = useCallback((data: any) => {
        if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify(data));
        }
    }, []);

    return (
        <BattleContext.Provider value={{ isReady, val, connect, disconnect, send }}>
            {children}
        </BattleContext.Provider>
    );
}

export function useBattleContext() {
    const context = useContext(BattleContext);
    if (!context) throw new Error("useWS debe usarse dentro de BattleContextProvider");
    return context;
}