import { useEffect } from 'react';
import { type SnackbarMessage } from '../../context/SnackbarContext';

interface SnackbarItemProps {
    snackbar: SnackbarMessage;
    onClose: (id: string) => void;
}

export const SnackbarItem = ({ snackbar, onClose }: SnackbarItemProps) => {
    useEffect(() => {
        const duration = snackbar.duration || 3000;
        const timer = setTimeout(() => {
            onClose(snackbar.id);
        }, duration);

        return () => clearTimeout(timer);
    }, [snackbar, onClose]);

    const getStyleByType = (type: SnackbarMessage['type']) => {
        switch (type) {
            case 'success':
                return 'bg-green-500 text-white';
            case 'error':
                return 'bg-red-500 text-white';
            case 'info':
                return 'bg-gray-500 text-white';
            default:
                return 'bg-gray-500 text-white';
        }
    };

    return (
        <div
            className={`min-w-[250px] max-w-sm rounded-lg shadow-lg p-4 flex justify-between items-center mb-3 animate-fade-in ${getStyleByType(
                snackbar.type
            )}`}
            role="alert"
        >
            <span className="text-sm font-medium pr-4">{snackbar.message}</span>
            <button
                onClick={() => onClose(snackbar.id)}
                className="text-white hover:text-gray-200 transition-colors bg-transparent border-none cursor-pointer focus:outline-none shrink-0"
                aria-label="Cerrar"
            >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
};
