import { useSideMenuViewController } from './SideMenuViewController';

export function SideMenu(props: { isOpen: boolean, onClose: () => void; }) {
    const { uiState, actions } = useSideMenuViewController(props.isOpen, props.onClose)

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity duration-300 ${props.isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={actions.onClose}
            />

            {/* Side Panel */}
            <div
                className={`fixed top-0 right-0 h-full w-[80%] sm:w-[50%] md:w-[40%] lg:w-[30%] z-[101] glass-panel rounded-none border-y-0 border-r-0 transform transition-transform duration-300 ease-in-out ${props.isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}
            >
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/40">
                    <h2 className="text-xl font-bold text-white tracking-tight">Menú</h2>
                    <button
                        onClick={actions.onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-all text-2xl"
                    >
                        ×
                    </button>
                </div>

                {/* Tabs Navigation */}
                <div className="flex border-b border-white/10 bg-black/20">
                    <button
                        onClick={() => actions.onClickedTab('config')}
                        className={`flex-1 py-4 text-xs uppercase tracking-[0.2em] font-bold transition-all ${uiState.activeTab === 'config' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-white/40 hover:text-white/60 hover:bg-white/5'}`}
                    >
                        Configuración
                    </button>
                    <button
                        onClick={() => actions.onClickedTab('history')}
                        className={`flex-1 py-4 text-xs uppercase tracking-[0.2em] font-bold transition-all ${uiState.activeTab === 'history' ? 'text-secondary border-b-2 border-secondary bg-secondary/5' : 'text-white/40 hover:text-white/60 hover:bg-white/5'}`}
                    >
                        Historial
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-6">
                    {uiState.activeTab === 'config' ? (
                        <div className="animate-fade-in space-y-8 mt-2">
                            <div className="space-y-4">
                                <label className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">API Endpoint</label>
                                <div className="flex flex-col gap-4">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={uiState.apiUrl}
                                            onChange={(e) => actions.onChangedApiUrl(e.target.value)}
                                            placeholder="http://localhost:3000"
                                            className="w-full p-4 pl-5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-all font-mono text-sm"
                                        />
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/40 rounded-l-xl opacity-0 transition-opacity peer-focus:opacity-100" />
                                    </div>
                                    <button
                                        type='button'
                                        onClick={actions.onClickedSaveApiUrl}
                                        className="w-full py-4 rounded-xl bg-primary/20 border border-primary/50 text-primary font-bold hover:bg-primary/30 active:bg-primary/40 transition-all shadow-[0_0_15px_rgba(52,102,175,0.1)] active:scale-[0.98] flex items-center justify-center gap-2"
                                    >
                                        <span>Guardar Cambios</span>
                                    </button>
                                </div>
                            </div>


                        </div>
                    ) : (
                        <div className="animate-fade-in flex flex-col items-center justify-center h-full text-center space-y-6 opacity-60">
                            <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                <span className="text-4xl">📜</span>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-lg font-bold text-white">Sin historial</h3>
                                <p className="text-sm text-white/40 max-w-[200px] mx-auto">
                                    Tus resultados de batallas aparecerán aquí después de combatir.
                                </p>
                            </div>
                            <button
                                onClick={() => actions.onClickedTab('config')}
                                className="text-xs text-primary hover:underline uppercase tracking-widest font-bold"
                            >
                                Volver a configuración
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/10 bg-black/40">
                    <div className="flex flex-col items-center gap-2">
                        <p className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-bold">Poke-Albo Project</p>
                        <div className="h-[2px] w-8 bg-primary/20 rounded-full" />
                        <p className="text-[9px] text-white/10 font-mono">BUILD v0</p>
                    </div>
                </div>
            </div>
        </>
    );
};
