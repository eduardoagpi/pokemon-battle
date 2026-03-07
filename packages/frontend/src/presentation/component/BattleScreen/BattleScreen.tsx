import pokeAlboLogo from '../../../assets/pokealbo.png';

export const BattleScreen = () => {
    return (
        <div className="flex flex-col items-center justify-center gap-8 animate-fade-in">
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">Battle Screen</h1>
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 shadow-2xl text-center">
                <p className="text-xl text-white mb-6">Próximamente: ¡Batallas Pokémon Épicas!</p>
                <div className="animate-bounce">
                    <img className="w-32 h-auto opacity-50 grayscale" src={pokeAlboLogo} alt="Poke-Albo" />
                </div>
            </div>
            <button
                onClick={() => window.history.back()}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg"
            >
                Regresar al Lobby
            </button>
        </div>
    );
};
