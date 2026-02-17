import React from 'react';
import { GameState } from '../types';

interface FieldProps {
  gameState: GameState;
}

export const Field: React.FC<FieldProps> = ({ gameState }) => {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full p-2">
      {/* Grass */}
      <rect x="0" y="0" width="100" height="100" fill="transparent" />
      
      {/* Infield Dirt (Arc) */}
      <path d="M 15 50 Q 50 15 85 50 L 50 85 Z" fill="#78350f" opacity="0.4" />
      
      {/* Diamond Lines */}
      <path d="M 50 85 L 80 55 L 50 25 L 20 55 Z" stroke="white" strokeWidth="0.5" fill="none" />
      
      {/* Bases */}
      {/* 2nd Base */}
      <rect x="48" y="23" width="4" height="4" fill={gameState.runnerOnSecond ? "#fbbf24" : "white"} transform="rotate(45 50 25)" />
      {/* 1st Base */}
      <rect x="78" y="53" width="4" height="4" fill={gameState.runnerOnFirst ? "#fbbf24" : "white"} transform="rotate(45 80 55)" />
      {/* 3rd Base */}
      <rect x="18" y="53" width="4" height="4" fill={gameState.runnerOnThird ? "#fbbf24" : "white"} transform="rotate(45 20 55)" />
      
      {/* Home Plate */}
      <path d="M 48 83 L 52 83 L 52 86 L 50 88 L 48 86 Z" fill="white" />

      {/* Positions Label (Optional - Simple dots for positions) */}
      <circle cx="50" cy="60" r="1.5" fill="#94a3b8" /> {/* Pitcher */}
      <circle cx="50" cy="90" r="1.5" fill="#94a3b8" /> {/* Catcher */}
      <circle cx="80" cy="45" r="1.5" fill="#94a3b8" /> {/* 1B */}
      <circle cx="65" cy="40" r="1.5" fill="#94a3b8" /> {/* 2B */}
      <circle cx="35" cy="40" r="1.5" fill="#94a3b8" /> {/* SS */}
      <circle cx="20" cy="45" r="1.5" fill="#94a3b8" /> {/* 3B */}
      <circle cx="20" cy="20" r="1.5" fill="#94a3b8" /> {/* LF */}
      <circle cx="50" cy="10" r="1.5" fill="#94a3b8" /> {/* CF */}
      <circle cx="80" cy="20" r="1.5" fill="#94a3b8" /> {/* RF */}

    </svg>
  );
};