import { Routes, Route } from 'react-router-dom';
import pokeAlboLogo from './assets/pokealbo.png';
import { NickNameSelector } from './presentation/component/NickNameSelector/NickNameSelector';
import { LobbyStatus } from './presentation/component/LobbyStatus/LobbyStatus';
import { BattleScreen } from './presentation/component/BattleScreen/BattleScreen';
import { BattleGuard } from './presentation/component/BattleScreen/BattleGuard';
import { SideMenu } from './presentation/component/SideMenu/SideMenu';
import { useGeneralAppContext } from './presentation/context/GeneralAppContext';

function App() {
  const { isMenuOpen, setIsMenuOpen } = useGeneralAppContext();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-1 animate-fade-in relative">
      {/* Header with Image Title */}
      <header className="text-center mb-0 animate-float flex items-center justify-center gap-4 relative">
        <img className="max-w-[90%] w-[500px] h-auto block mx-auto drop-shadow-[4px_4px_0_rgba(0,0,0,0.5)]" src={pokeAlboLogo} alt="Poke-Albo" />

        {/* Global Menu Button */}
        <button
          onClick={toggleMenu}
          className="absolute -right-16 top-1/2 -translate-y-1/2 p-4 rounded-full bg-[#3466AF]/20 border border-secondary hover:bg-secondary/40 transition-all duration-300 cursor-pointer shadow-[0_0_15px_rgba(52,102,175,0.3)] z-10"
          title="Abrir Menú"
        >
          <span className="text-primary text-2xl">☰</span>
        </button>
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
          element={
            <BattleGuard>
              <BattleScreen />
            </BattleGuard>
          }
        />
      </Routes>

      <SideMenu
        isOpen={isMenuOpen}
        onClose={toggleMenu}
      />
    </div>
  );
}

export default App;
