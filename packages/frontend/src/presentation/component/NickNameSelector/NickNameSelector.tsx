import { useNickNameSelectorViewController } from './NickNameSelectorViewController';


export function NickNameSelector() {
    const { uiState, actions } = useNickNameSelectorViewController();

    return (
        <section className="w-full max-w-[500px] p-10 md:p-14 flex flex-col gap-8 text-center glass-panel mt-10">
            <h2 className="text-3xl font-semibold text-text-light mb-1">¡Bienvenido Entrenador!</h2>
            <p className="mb-2">Para comenzar tu aventura, por favor introduce tu nickname.</p>

            <div className="flex flex-col gap-6">
                <input
                    type="text"
                    className="w-full py-[1.2rem] px-[1.5rem] text-[1.2rem] bg-black/30 border-2 border-glass-border rounded-xl text-white transition-all duration-300 outline-none focus:border-secondary focus:bg-black/50 focus:shadow-[0_0_15px_rgba(52,102,175,0.4)]"
                    placeholder="Ej. Ash Ketchum"
                    value={uiState.nickname}
                    onChange={(e) => actions.setNickname(e.target.value)}
                    required
                    maxLength={20}
                    autoFocus
                />
                <button
                    type="button"
                    onClick={actions.onClickedConfirm}
                    className="p-[1.2rem] text-[1.2rem] font-bold uppercase tracking-[1px] text-secondary-dark bg-gradient-to-br from-primary to-[#FFE373] border-none rounded-xl cursor-pointer transition-all duration-300 shadow-[0_4px_15px_rgba(255,203,5,0.4)] hover:-translate-y-[2px] hover:shadow-[0_6px_20px_rgba(255,203,5,0.6)] hover:from-[#FFE373] hover:to-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    disabled={uiState.buttonDisabled}
                >
                    Comenzar Aventura
                </button>
            </div>
        </section>
    );
}
