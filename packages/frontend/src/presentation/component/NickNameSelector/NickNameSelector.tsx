import { useNickNameSelector } from './NickNameSelectorViewController';

interface Props {
    onConfirm: (nickname: string) => void;
}

export function NickNameSelector({ onConfirm }: Props) {
    const { nickname, setNickname, handleSubmit } = useNickNameSelector(onConfirm);

    return (
        <section className="w-full max-w-[500px] p-8 md:p-12 flex flex-col gap-8 text-center glass-panel mt-1000">
            <h2 className="text-3xl font-semibold text-text-light mb-4">¡Bienvenido Entrenador!</h2>
            <p>Para comenzar tu aventura, por favor introduce tu nickname.</p>

            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                <input
                    type="text"
                    className="w-full py-[1.2rem] px-[1.5rem] text-[1.2rem] bg-black/30 border-2 border-glass-border rounded-xl text-white transition-all duration-300 outline-none focus:border-secondary focus:bg-black/50 focus:shadow-[0_0_15px_rgba(52,102,175,0.4)]"
                    placeholder="Ej. Ash Ketchum"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    required
                    maxLength={20}
                    autoFocus
                />
                <button
                    type="submit"
                    className="p-[1.2rem] text-[1.2rem] font-bold uppercase tracking-[1px] text-secondary-dark bg-gradient-to-br from-primary to-[#FFE373] border-none rounded-xl cursor-pointer transition-all duration-300 shadow-[0_4px_15px_rgba(255,203,5,0.4)] hover:-translate-y-[2px] hover:shadow-[0_6px_20px_rgba(255,203,5,0.6)] hover:from-[#FFE373] hover:to-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    disabled={!nickname.trim()}
                >
                    Comenzar Aventura
                </button>
            </form>
        </section>
    );
}
