import { useState } from 'react';
import pokeAlboLogo from './assets/pokealbo.png';
import { NickNameSelector } from './presentation/component/NickNameSelector/NickNameSelector';
import { LobbyStatus } from './presentation/component/LobbyStatus/LobbyStatus';

function App() {
  // Global state for application progress
  const [nickname, setNickname] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleConfirmNickname = (name: string) => {
    setNickname(name);
    setIsConfirmed(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-12 animate-fade-in">
      {/* Header with Image Title */}
      <header className="text-center mb-4 animate-float">
        <img className="max-w-[90%] w-[500px] h-auto block mx-auto drop-shadow-[4px_4px_0_rgba(0,0,0,0.5)]" src={pokeAlboLogo} alt="Poke-Albo" />
      </header>

      {/* Main Content Area */}
      {!isConfirmed ? (
        <NickNameSelector onConfirm={handleConfirmNickname} />
      ) : (
        <LobbyStatus nickname={nickname} />
      )}
    </div>
  );
}

export default App;
