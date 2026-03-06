import { useLobbyStatus } from './LobbyStatusViewController';

interface Props {
    nickname: string;
    onBack: () => void;
}

export function LobbyStatus({ nickname, onBack }: Props) {
    const { assignedPokemons, isWaitingForOpponent } = useLobbyStatus();

    return (
        <section className="w-full max-w-[900px] flex flex-col items-center gap-12 animate-fade-in-slow">
            <div className="w-full flex justify-start">
                <button
                    onClick={onBack}
                    className="group flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/50 transition-all duration-300 cursor-pointer"
                >
                    <span className="text-primary group-hover:-translate-x-1 transition-transform">←</span>
                    <span className="text-white/80 font-medium group-hover:text-primary transition-colors">Regresar</span>
                </button>
            </div>

            <div className="text-center glass-panel w-full p-8">
                <h2 className="text-[2.2rem] mb-2 text-primary">¡Hola, {nickname}!</h2>
                <p className="text-[1.2rem] text-white/80">Estos son los Pokémon que te han sido asignados.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-8 w-full">
                {assignedPokemons.map((pokemon) => (
                    <div key={pokemon.id} className="flex flex-col items-center p-8 gap-6 transition-transform duration-300 bg-gradient-to-b from-white/10 to-[rgba(255,255,255,0.02)] hover:-translate-y-[10px] hover:border-primary hover:shadow-[0_10px_30px_rgba(255,203,5,0.2)] glass-panel">
                        <div className="w-[120px] h-[120px] rounded-full bg-black/40 flex justify-center items-center shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] relative overflow-hidden after:content-[''] after:absolute after:-top-[50%] after:-left-[50%] after:w-[200%] after:h-[200%] after:bg-[conic-gradient(transparent,transparent,transparent,rgba(255,255,255,0.1))] after:animate-spin-slow">
                            <img
                                src={pokemon.imageUrl}
                                alt={pokemon.name}
                                className="w-[80%] h-[80%] object-contain z-[1] drop-shadow-[0_5px_10px_rgba(0,0,0,0.5)]"
                            />
                        </div>
                        <h3 className="text-[1.3rem] font-semibold text-white capitalize tracking-[1px]">{pokemon.name}</h3>
                    </div>
                ))}
            </div>

            {isWaitingForOpponent && (
                <div className="flex flex-col items-center gap-6 mt-8 p-8 w-full rounded-2xl bg-[#3466AF]/10 border border-dashed border-secondary">
                    <div className="w-[50px] h-[50px] border-4 border-white/10 border-t-primary rounded-full animate-spin"></div>
                    <p className="text-[1.2rem] font-medium text-text-light tracking-[2px] uppercase animate-pulse">Esperando contrincante...</p>
                </div>
            )}
        </section>
    );
}
