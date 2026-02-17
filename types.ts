export interface GameState {
  inning: number;
  isTop: boolean; // Top or Bottom of inning
  outs: number; // 0, 1, 2
  strikes: number; // 0, 1, 2
  balls: number; // 0, 1, 2, 3
  runnerOnFirst: boolean;
  runnerOnSecond: boolean;
  runnerOnThird: boolean;
  homeScore: number;
  awayScore: number;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isError?: boolean;
}

export type ScoreboardUpdate = Partial<GameState>;