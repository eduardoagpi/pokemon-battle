import pokeAlboLogo from '../../../assets/pokealbo.png';
import { useBattleScreenViewController } from './BattleScreenViewController';

export const BattleScreen = () => {

    const { uiState, actions } = useBattleScreenViewController()

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] animate-fade-in py-10">
            {/* GameBoy Color Container */}
            <div className="relative w-[340px] h-[580px] bg-[#9c27b0] rounded-[20px] rounded-bl-[80px] shadow-[10px_10px_0_0_#7b1fa2,20px_20px_40px_rgba(0,0,0,0.5)] border-4 border-[#7b1fa2] flex flex-col items-center p-6 select-none transition-transform hover:scale-[1.02]">

                {/* Screen Surround */}
                <div className="w-full bg-[#2d2d2d] rounded-t-lg rounded-b-md p-6 mb-8 shadow-inner border-b-8 border-black/20">
                    <div className="flex justify-between items-center mb-1 px-1">
                        <div className="flex gap-1">
                            <div className="w-2 h-2 rounded-full bg-[#ff0000] shadow-[0_0_5px_#ff0000]"></div>
                            <div className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">Power</div>
                        </div>
                        <div className="text-[10px] text-gray-300 font-bold italic tracking-tighter">
                            <span className="text-blue-400">G</span>
                            <span className="text-red-400">A</span>
                            <span className="text-yellow-400">M</span>
                            <span className="text-green-400">E</span>
                            <span className="text-purple-400"> B</span>
                            <span className="text-cyan-400">O</span>
                            <span className="text-pink-400">Y</span>
                            <span className="text-gray-400 ml-1">COLOR</span>
                        </div>
                    </div>

                    {/* Actual Game Screen */}
                    <div className="w-full h-[200px] bg-[#fdfdfd] overflow-hidden relative shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] border-2 border-black/40 flex flex-col justify-between p-3 font-mono">
                        {/* Battle UI - Opponent (Top Right) */}
                        <div className="self-end w-40 bg-white/90 p-1 border-2 border-black/20 rounded-sm shadow-sm z-10">
                            <div className="flex justify-between text-[10px] font-bold">
                                <span className="text-red-700">OPONENTE</span>
                                <span>Lv100</span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 border border-black/10 mt-1 relative overflow-hidden rounded-full">
                                <div className="absolute top-0 left-0 h-full bg-green-500 w-[60%] transition-all"></div>
                            </div>
                        </div>

                        {/* Middle Area for Sprites */}
                        <div className="flex-1 relative flex items-center justify-center">
                            {/* Opponent Sprite Placeholder */}
                            <div className="absolute top-2 right-4 w-16 h-16 opacity-30 filter drop-shadow-md">
                                <img src={pokeAlboLogo} alt="Enemy" className="w-full h-full object-contain grayscale opacity-60" />
                            </div>
                            {/* Player Sprite Placeholder */}
                            <div className="absolute bottom-2 left-4 w-20 h-20 opacity-80 filter drop-shadow-lg">
                                <img src={pokeAlboLogo} alt="Player" className="w-full h-full object-contain" />
                            </div>

                            {/* Retro Ground Effect */}
                            <div className="absolute bottom-4 left-4 w-24 h-4 bg-gray-200/50 rounded-[100%] blur-[2px]"></div>
                            <div className="absolute top-10 right-4 w-20 h-4 bg-gray-200/30 rounded-[100%] blur-[2px]"></div>
                        </div>

                        {/* Battle UI - Player (Bottom Left) */}
                        <div className="self-start w-40 bg-white/90 p-1 border-2 border-black/20 rounded-sm shadow-sm z-10">
                            <div className="flex justify-between text-[10px] font-bold">
                                <span className="text-blue-700">TU POKÉMON</span>
                                <span>Lv100</span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 border border-black/10 mt-1 relative overflow-hidden rounded-full">
                                <div className="absolute top-0 left-0 h-full bg-green-500 w-[100%] transition-all"></div>
                            </div>
                            <div className="text-[8px] font-bold text-right mt-0.5">250/250</div>
                        </div>
                    </div>
                </div>

                {/* Controls Area */}
                <div className="w-full flex flex-1 flex-col justify-between items-center pb-2">

                    {/* Upper Controls: D-Pad and Action Buttons */}
                    <div className="w-full flex justify-between items-center px-4 pt-4">

                        {/* D-Pad Container */}
                        <div className="relative w-24 h-24 flex items-center justify-center translate-y-2">
                            {/* D-Pad Shadow Layer (Behind) */}
                            <div className="absolute w-24 h-8 bg-black/40 rounded-sm translate-y-1 translate-x-0.5 blur-[1px]"></div>
                            <div className="absolute w-8 h-24 bg-black/40 rounded-sm translate-y-1 translate-x-0.5 blur-[1px]"></div>

                            {/* D-Pad Buttons (Above Shadow) */}
                            <div className="absolute w-24 h-8 bg-[#333] rounded-sm z-10"></div>
                            <div className="absolute w-8 h-24 bg-[#333] rounded-sm z-10"></div>

                            {/* Center Circle */}
                            <div className="absolute w-6 h-6 bg-[#333] rounded-full z-20 border border-black/10 shadow-inner"></div>

                            {/* Visual Directional Buttons (Clickable but do nothing) */}
                            <button className="absolute top-0 w-8 h-8 rounded-t-sm hover:bg-white/10 active:scale-95 z-30"></button>
                            <button className="absolute bottom-0 w-8 h-8 rounded-b-sm hover:bg-white/10 active:scale-95 z-30"></button>
                            <button className="absolute left-0 w-8 h-8 rounded-l-sm hover:bg-white/10 active:scale-95 z-30"></button>
                            <button className="absolute right-0 w-8 h-8 rounded-r-sm hover:bg-white/10 active:scale-95 z-30"></button>
                        </div>

                        {/* Action Buttons A/B */}
                        <div className="flex gap-4 -rotate-12 -mt-4">
                            {/* B Button (Decorative) */}
                            <div className="flex flex-col items-center">
                                <button className="w-12 h-12 bg-[#333] rounded-full shadow-[2px_4px_0_rgba(0,0,0,0.4)] border-b-2 border-black/40 hover:scale-95 transition-transform active:translate-y-1 active:shadow-none"></button>
                                <span className="text-[10px] text-[#7b1fa2] font-black mt-2 opacity-60 italic">B</span>
                            </div>
                            {/* A Button (Attack) */}
                            <div className="flex flex-col items-center">
                                <button
                                    disabled={!uiState.isAttackEnabled}
                                    onClick={() => alert('¡Atacando!')}
                                    className={`w-14 h-14 rounded-full shadow-[2px_4px_0_rgba(0,0,0,0.4)] border-b-2 transition-all hover:scale-105 active:scale-95 active:translate-y-1 active:shadow-none flex items-center justify-center ${uiState.isAttackEnabled
                                        ? 'bg-red-600 border-red-800'
                                        : 'bg-gray-400 border-gray-600 cursor-not-allowed opacity-50'
                                        }`}
                                >
                                    <span className="text-white font-bold text-xl">A</span>
                                </button>
                                <span className="text-[10px] text-[#7b1fa2] font-black mt-2 italic">ATTACK</span>
                            </div>
                        </div>
                    </div>

                    {/* Lower Controls: Start / Select */}
                    <div className="flex gap-8 rotate-12 mt-12">
                        <div className="flex flex-col items-center">
                            <div className="w-10 h-3 bg-[#555] rounded-full shadow-inner border-b-2 border-black/20 rotate-[35deg] hover:bg-gray-600 cursor-pointer"></div>
                            <span className="text-[8px] font-bold text-[#7b1fa2] mt-2 opacity-50 uppercase tracking-tighter">Select</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-10 h-3 bg-[#555] rounded-full shadow-inner border-b-2 border-black/20 rotate-[35deg] hover:bg-gray-600 cursor-pointer"></div>
                            <span className="text-[8px] font-bold text-[#7b1fa2] mt-2 opacity-50 uppercase tracking-tighter">Start</span>
                        </div>
                    </div>

                    {/* Logo & Decorative Ridges */}
                    <div className="w-full flex justify-between items-end px-6 mt-auto">
                        <div className="opacity-20 flex flex-col gap-1 mb-4">
                            <div className="w-16 h-1 bg-black/40 rounded-full"></div>
                            <div className="w-16 h-1 bg-black/40 rounded-full"></div>
                            <div className="w-16 h-1 bg-black/40 rounded-full"></div>
                        </div>
                        <button
                            onClick={() => window.history.back()}
                            className="text-[10px] text-white/70 font-bold hover:text-white transition-colors mb-4 uppercase tracking-widest bg-black/20 px-3 py-1 rounded-full border border-white/10"
                        >
                            Menu
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
