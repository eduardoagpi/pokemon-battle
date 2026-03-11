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
                className={`fixed top-0 right-0 h-full w-100 z-[101] glass-panel rounded-none border-y-0 border-r-0 transform transition-transform duration-300 ease-in-out ${props.isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}
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
                        <div className="animate-fade-in space-y-6 flex flex-col h-full">
                            {/* Search Section */}
                            <div className="space-y-3">
                                <label className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">Buscar Jugador</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={uiState.nicknameSearch}
                                        onChange={(e) => actions.onNicknameSearchChanged(e.target.value)}
                                        placeholder="Nickname del usuario"
                                        className="flex-1 p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-secondary/50 transition-all text-sm"
                                    />
                                    <button
                                        onClick={actions.onClickedSearchHistoryButton}
                                        disabled={uiState.isSearching}
                                        className="px-4 rounded-xl bg-secondary/20 border border-secondary/50 text-secondary font-bold hover:bg-secondary/30 transition-all disabled:opacity-50"
                                    >
                                        {uiState.isSearching ? '...' : '🔍'}
                                    </button>
                                    <button
                                        onClick={actions.onClicekdClearHistoryButton}
                                        disabled={uiState.isSearching}
                                        className="px-4 rounded-xl bg-secondary/20 border border-secondary/50 text-secondary font-bold hover:bg-secondary/30 transition-all disabled:opacity-50"
                                    >
                                        {uiState.isSearching ? '...' : '❌'}
                                    </button>
                                </div>
                            </div>

                            {/* Results Section */}
                            <div className="flex-1 overflow-y-auto min-h-0 -mx-2 px-2 space-y-3">
                                {uiState.searchError && (
                                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
                                        {uiState.searchError}
                                    </div>
                                )}

                                {uiState.historyResults.length > 0 ? (
                                    uiState.historyResults.map((item, index) => (
                                        <div key={index} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${item.result.customStyle}`}>
                                                    {item.result.text}
                                                </span>
                                                <span className="text-[10px] text-white/30 font-mono">
                                                    {item.date}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-white/80">
                                                <span className="text-sm font-medium">vs <span className="text-white font-bold">{item.opponentNickname}</span></span>
                                                {item.reason && (
                                                    <span className="text-[10px] text-white/20 italic capitalize">{item.reason}</span>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : !uiState.isSearching && !uiState.searchError && (
                                    <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 opacity-40">
                                        <p className="text-xs text-white max-w-[180px]">Ingresa un nickname para ver el historial de batallas.</p>
                                    </div>
                                )}

                                {uiState.isSearching && (
                                    <div className="flex justify-center py-12">
                                        <div className="w-6 h-6 border-2 border-secondary/30 border-t-secondary rounded-full animate-spin" />
                                    </div>
                                )}
                            </div>
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
