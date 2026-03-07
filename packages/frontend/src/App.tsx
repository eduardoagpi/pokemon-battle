import { BrowserRouter, Routes, Route } from 'react-router-dom';
import pokeAlboLogo from './assets/pokealbo.png';
import { NickNameSelector } from './presentation/component/NickNameSelector/NickNameSelector';
import { LobbyStatus } from './presentation/component/LobbyStatus/LobbyStatus';
import { BattleScreen } from './presentation/component/BattleScreen/BattleScreen';

function AppContent() {

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-12 animate-fade-in">
      {/* Header with Image Title */}
      <header className="text-center mb-4 animate-float">
        <img className="max-w-[90%] w-[500px] h-auto block mx-auto drop-shadow-[4px_4px_0_rgba(0,0,0,0.5)]" src={pokeAlboLogo} alt="Poke-Albo" />
      </header>

      {/* Main Content Area */}
      <Routes>
        <Route
          path="/"
          element={<NickNameSelector />}
        />
        <Route
          path="/lobby"
          element={<LobbyStatus />}
        />
        <Route
          path="/battle"
          element={<BattleScreen />}
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
