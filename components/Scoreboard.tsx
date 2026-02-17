import React from 'react';
import { GameState, ScoreboardUpdate } from '../types';

interface ScoreboardProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({ gameState, setGameState }) => {
  const updateState = (update: ScoreboardUpdate) => {
    setGameState(prev => ({ ...prev, ...update }));
  };

  const cycleOuts = () => updateState({ outs: (gameState.outs + 1) % 3 });
  const cycleBalls = () => updateState({ balls: (gameState.balls + 1) % 4 });
  const cycleStrikes = () => updateState({ strikes: (gameState.strikes + 1) % 3 });
  
  const toggleRunner = (base: 'runnerOnFirst' | 'runnerOnSecond' | 'runnerOnThird') => {
    updateState({ [base]: !gameState[base] });
  };

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-700 p-4 shadow-sm">
      {/* Score & Inning */}
      <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-4">
        <div className="text-center">
            <label className="text-xs text-slate-500 block mb-1">AWAY</label>
            <div className="flex items-center gap-2">
                 <button onClick={() => updateState({ awayScore: Math.max(0, gameState.awayScore - 1)})} className="text-slate-600 hover:text-slate-400 font-bold px-1">-</button>
                 <span className="text-2xl font-mono font-bold text-white w-6 text-center">{gameState.awayScore}</span>
                 <button onClick={() => updateState({ awayScore: gameState.awayScore + 1})} className="text-slate-600 hover:text-white font-bold px-1">+</button>
            </div>
        </div>
        <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-slate-300 font-semibold cursor-pointer select-none hover:text-white transition-colors"
                 onClick={() => updateState({ isTop: !gameState.isTop })}>
                <span className={`transform transition-transform ${gameState.isTop ? 'rotate-180' : ''}`}>
                    ▲
                </span>
                <span>{gameState.inning}</span>
            </div>
             <div className="flex gap-2 text-xs mt-1">
                <button onClick={() => updateState({ inning: Math.max(1, gameState.inning - 1)})} className="text-slate-600 hover:text-white">Prev</button>
                <button onClick={() => updateState({ inning: gameState.inning + 1})} className="text-slate-600 hover:text-white">Next</button>
             </div>
        </div>
        <div className="text-center">
            <label className="text-xs text-slate-500 block mb-1">HOME</label>
            <div className="flex items-center gap-2">
                 <button onClick={() => updateState({ homeScore: Math.max(0, gameState.homeScore - 1)})} className="text-slate-600 hover:text-slate-400 font-bold px-1">-</button>
                 <span className="text-2xl font-mono font-bold text-white w-6 text-center">{gameState.homeScore}</span>
                 <button onClick={() => updateState({ homeScore: gameState.homeScore + 1})} className="text-slate-600 hover:text-white font-bold px-1">+</button>
            </div>
        </div>
      </div>

      {/* Balls / Strikes / Outs */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <button onClick={cycleBalls} className="flex flex-col items-center p-2 bg-slate-800 rounded hover:bg-slate-750 transition-colors border border-slate-700 hover:border-blue-500/50">
            <span className="text-xs text-slate-400">BALL</span>
            <div className="flex gap-1 mt-1">
                {[1, 2, 3].map(i => (
                    <div key={i} className={`w-2 h-2 rounded-full ${i <= gameState.balls ? 'bg-green-500' : 'bg-slate-600'}`} />
                ))}
            </div>
        </button>
        <button onClick={cycleStrikes} className="flex flex-col items-center p-2 bg-slate-800 rounded hover:bg-slate-750 transition-colors border border-slate-700 hover:border-red-500/50">
            <span className="text-xs text-slate-400">STRIKE</span>
             <div className="flex gap-1 mt-1">
                {[1, 2].map(i => (
                    <div key={i} className={`w-2 h-2 rounded-full ${i <= gameState.strikes ? 'bg-red-500' : 'bg-slate-600'}`} />
                ))}
            </div>
        </button>
        <button onClick={cycleOuts} className="flex flex-col items-center p-2 bg-slate-800 rounded hover:bg-slate-750 transition-colors border border-slate-700 hover:border-orange-500/50">
            <span className="text-xs text-slate-400">OUT</span>
             <div className="flex gap-1 mt-1">
                {[1, 2].map(i => (
                    <div key={i} className={`w-2 h-2 rounded-full ${i <= gameState.outs ? 'bg-orange-500' : 'bg-slate-600'}`} />
                ))}
            </div>
        </button>
      </div>

      {/* Bases */}
      <div className="relative h-24 bg-green-900/30 rounded-lg border border-green-900/50 mt-4 flex items-center justify-center">
          {/* Diamond Shape CSS */}
          <div className="relative w-16 h-16 rotate-45 border-2 border-slate-500/50">
             {/* 2nd Base */}
             <button 
                onClick={() => toggleRunner('runnerOnSecond')}
                className={`absolute -top-3 -left-3 w-6 h-6 -rotate-45 border-2 flex items-center justify-center transition-all ${gameState.runnerOnSecond ? 'bg-yellow-400 border-yellow-200 shadow-[0_0_10px_rgba(250,204,21,0.6)]' : 'bg-slate-800 border-slate-600 hover:bg-slate-700'}`}>
                {gameState.runnerOnSecond && <div className="w-2 h-2 bg-yellow-700 rounded-full" />}
             </button>
             {/* 1st Base */}
             <button 
                onClick={() => toggleRunner('runnerOnFirst')}
                className={`absolute -top-3 -right-3 w-6 h-6 -rotate-45 border-2 flex items-center justify-center transition-all ${gameState.runnerOnFirst ? 'bg-yellow-400 border-yellow-200 shadow-[0_0_10px_rgba(250,204,21,0.6)]' : 'bg-slate-800 border-slate-600 hover:bg-slate-700'}`}>
                {gameState.runnerOnFirst && <div className="w-2 h-2 bg-yellow-700 rounded-full" />}
             </button>
             {/* 3rd Base */}
             <button 
                onClick={() => toggleRunner('runnerOnThird')}
                className={`absolute -bottom-3 -left-3 w-6 h-6 -rotate-45 border-2 flex items-center justify-center transition-all ${gameState.runnerOnThird ? 'bg-yellow-400 border-yellow-200 shadow-[0_0_10px_rgba(250,204,21,0.6)]' : 'bg-slate-800 border-slate-600 hover:bg-slate-700'}`}>
                {gameState.runnerOnThird && <div className="w-2 h-2 bg-yellow-700 rounded-full" />}
             </button>
             {/* Home Plate */}
             <div className="absolute -bottom-3 -right-3 w-6 h-6 -rotate-45 bg-white border-2 border-slate-300 flex items-center justify-center z-10 clip-path-home">
             </div>
          </div>
      </div>
      <p className="text-[10px] text-center text-slate-500 mt-2">Tap bases to toggle runners</p>
    </div>
  );
};