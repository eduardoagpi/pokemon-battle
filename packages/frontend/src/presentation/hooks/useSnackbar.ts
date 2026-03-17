import { useCallback, useContext } from 'react';
import { SnackbarContext } from '../context/SnackbarContext';

export const useSnackbar = () => {
    const context = useContext(SnackbarContext);

    if (!context) {
        throw new Error('useSnackbar must be used within a SnackbarProvider');
    }

    const { addSnackbar } = context;

    const showSuccess = useCallback((message: string, duration = 3000) => {
        addSnackbar({ type: 'success', message, duration });
    }, [addSnackbar]);

    const showError = useCallback((message: string, duration = 3000) => {
        addSnackbar({ type: 'error', message, duration });
    }, [addSnackbar]);

    const showInfo = useCallback((message: string, duration = 3000) => {
        addSnackbar({ type: 'info', message, duration });
    }, [addSnackbar]);
    return { showSuccess, showError, showInfo };
};
