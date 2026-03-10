import { type SnackbarMessage } from '../../context/SnackbarContext';
import { SnackbarItem } from './SnackbarItem';

interface SnackbarContainerProps {
    snackbars: SnackbarMessage[];
    onClose: (id: string) => void;
}

export const SnackbarContainer = ({ snackbars, onClose }: SnackbarContainerProps) => {
    return (
        <div className="fixed top-4 right-4 z-1000 flex flex-col items-end pointer-events-none">
            <div className="pointer-events-auto flex flex-col items-end">
                {snackbars.map((snackbar) => (
                    <SnackbarItem key={snackbar.id} snackbar={snackbar} onClose={onClose} />
                ))}
            </div>
        </div>
    );
};
