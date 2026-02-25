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

export interface UserKnowledgeProfile {
  rulesKnowledge: number;
  strategicInsight: number;
  historicalContext: number;
  situationalAwareness: number;
  misconceptions: string[];
  learningPath: string[]; // Suggested topics to learn next
  lastAnalyzed: string; // ISO string
}

export interface LearningArchitecture {
  tokens: string[];
  words: string[];
  embeddings: string[];
}

export type ScoreboardUpdate = Partial<GameState>;
