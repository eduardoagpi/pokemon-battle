import { createContext, useState, type ReactNode, useCallback } from 'react';
import { SnackbarContainer } from '../component/Snackbar/SnackbarContainer';

export type SnackbarType = 'success' | 'error' | 'info';

export interface SnackbarMessage {
    id: string;
    type: SnackbarType;
    message: string;
    duration?: number;
}

interface SnackbarContextProps {
    snackbars: SnackbarMessage[];
    addSnackbar: (message: Omit<SnackbarMessage, 'id'>) => void;
    removeSnackbar: (id: string) => void;
}

export const SnackbarContext = createContext<SnackbarContextProps | undefined>(undefined);

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
    const [snackbars, setSnackbars] = useState<SnackbarMessage[]>([]);

    const addSnackbar = useCallback((message: Omit<SnackbarMessage, 'id'>) => {
        const id = Math.random().toString(36).substring(2, 9);
        setSnackbars((prev) => [...prev, { ...message, id }]);
    }, []);

    const removeSnackbar = useCallback((id: string) => {
        setSnackbars((prev) => prev.filter((snack) => snack.id !== id));
    }, []);

    return (
        <SnackbarContext.Provider value={{ snackbars, addSnackbar, removeSnackbar }}>
            {children}
            <SnackbarContainer snackbars={snackbars} onClose={removeSnackbar} />
        </SnackbarContext.Provider>
    );
};
