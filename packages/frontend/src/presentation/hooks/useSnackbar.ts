import { useContext } from 'react';
import { SnackbarContext } from '../context/SnackbarContext';

export const useSnackbar = () => {
    const context = useContext(SnackbarContext);

    if (!context) {
        throw new Error('useSnackbar must be used within a SnackbarProvider');
    }

    const { addSnackbar } = context;

    const showSuccess = (message: string, duration = 3000) => {
        addSnackbar({ type: 'success', message, duration });
    };

    const showError = (message: string, duration = 3000) => {
        addSnackbar({ type: 'error', message, duration });
    };

    const showInfo = (message: string, duration = 3000) => {
        addSnackbar({ type: 'info', message, duration });
    };

    return { showSuccess, showError, showInfo };
};
