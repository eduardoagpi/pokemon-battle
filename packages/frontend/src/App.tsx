import { useState } from 'react';
import pokeAlboLogo from './assets/pokealbo.png';
import { NickNameSelector } from './presentation/component/NickNameSelector/NickNameSelector';
import { LobbyStatus } from './presentation/component/LobbyStatus/LobbyStatus';
import { useSnackbar } from './presentation/hooks/useSnackbar';

function App() {
  // Global state for application progress
  const [nickname, setNickname] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const { showSuccess, showError, showInfo } = useSnackbar();

  const handleConfirmNickname = (name: string) => {
    setNickname(name);
    setIsConfirmed(true);
  };

  const handleBackToNickname = () => {
    setIsConfirmed(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-12 animate-fade-in">
      {/* Header with Image Title */}
      <header className="text-center mb-4 animate-float">
        <img className="max-w-[90%] w-[500px] h-auto block mx-auto drop-shadow-[4px_4px_0_rgba(0,0,0,0.5)]" src={pokeAlboLogo} alt="Poke-Albo" />
      </header>

      {/* Test Snackbar Buttons */}
      <div className="flex gap-4 mb-4 z-50 relative">
        <button onClick={() => showSuccess('Acción completada con éxito!')} className="px-4 py-2 bg-green-500 rounded text-white font-bold cursor-pointer hover:bg-green-600 transition-colors">Test Success</button>
        <button onClick={() => showError('Ha ocurrido un error inesperado')} className="px-4 py-2 bg-red-500 rounded text-white font-bold cursor-pointer hover:bg-red-600 transition-colors">Test Error</button>
        <button onClick={() => showInfo('Información importante sobre tu cuenta')} className="px-4 py-2 bg-gray-500 rounded text-white font-bold cursor-pointer hover:bg-gray-600 transition-colors">Test Info</button>
      </div>

      {/* Main Content Area */}
      {!isConfirmed ? (
        <NickNameSelector onConfirm={handleConfirmNickname} />
      ) : (
        <LobbyStatus nickname={nickname} onBack={handleBackToNickname} />
      )}
    </div>
  );
}

export default App;
