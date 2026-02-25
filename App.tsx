import React, { useState, useRef } from 'react';
import { GameState, Message, UserKnowledgeProfile, LearningArchitecture } from './types';
import { Scoreboard } from './components/Scoreboard';
import { Field } from './components/Field';
import { Chat } from './components/Chat';
import { QuickTips } from './components/QuickTips';
import { LearningDashboard } from './components/LearningDashboard';
import { analyzeUserKnowledge } from './services/gemini';
import { Brain } from 'lucide-react';

const App: React.FC = () => {
  // Centralized state for the game context (User manually updates this to give AI context)
  const [gameState, setGameState] = useState<GameState>({
    inning: 1,
    isTop: true,
    outs: 0,
    strikes: 0,
    balls: 0,
    runnerOnFirst: false,
    runnerOnSecond: false,
    runnerOnThird: false,
    homeScore: 0,
    awayScore: 0,
  });

  const [userProfile, setUserProfile] = useState<UserKnowledgeProfile>({
    rulesKnowledge: 10,
    strategicInsight: 5,
    historicalContext: 0,
    situationalAwareness: 5,
    misconceptions: [],
    learningPath: [],
    lastAnalyzed: new Date().toISOString()
  });

  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const messageCountRef = useRef(1); // Start at 1 (welcome message)

  const handleMessagesUpdate = async (messages: Message[]) => {
    // Analyze every 2 new messages (User + AI pair)
    if (messages.length >= messageCountRef.current + 2) {
      messageCountRef.current = messages.length;
      
      // Run analysis in background
      try {
        const history = messages.map(m => ({ role: m.role, text: m.text }));
        const newProfile = await analyzeUserKnowledge(history, userProfile);
        setUserProfile(newProfile);
      } catch (e) {
        console.error("Failed to update user profile", e);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-screen bg-slate-900 text-slate-100 overflow-hidden">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 p-4 flex items-center justify-between shrink-0 z-10 shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-green-600 p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">DiamondTutor</h1>
            <p className="text-xs text-slate-400">Your AI Baseball Companion</p>
          </div>
        </div>
        
        <button
          onClick={() => setIsDashboardOpen(true)}
          className="flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-indigo-900/20"
        >
          <Brain className="w-4 h-4" />
          <span className="hidden sm:inline">System Intelligence</span>
        </button>
      </header>

      {/* Main Layout - Responsive Grid */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        
        {/* Left Panel: Game Context (Scoreboard & Field) */}
        <section className="w-full md:w-1/3 lg:w-1/4 bg-slate-800/50 border-r border-slate-700 flex flex-col overflow-y-auto shrink-0 md:h-full">
          <div className="p-4 space-y-6">
            <div>
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Live Context</h2>
              <p className="text-xs text-slate-500 mb-4">Set the current game state so the AI can give context-aware advice.</p>
              <Scoreboard gameState={gameState} setGameState={setGameState} />
            </div>
            
            <div className="hidden md:block">
               <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Field View</h2>
               <div className="aspect-square w-full bg-green-800 rounded-xl border-4 border-slate-700 relative shadow-inner overflow-hidden">
                  <Field gameState={gameState} />
               </div>
               <p className="text-xs text-center text-slate-500 mt-2">Visual representation of runners</p>
            </div>

            <div className="hidden md:block">
              <QuickTips />
            </div>
          </div>
        </section>

        {/* Right Panel: Chat Interface */}
        <section className="flex-1 flex flex-col h-full relative bg-slate-900">
           {/* Mobile Field View Toggle could go here, but keeping it simple */}
           <Chat gameState={gameState} onMessagesUpdate={handleMessagesUpdate} />
        </section>

      </main>

      {/* Learning Dashboard Modal */}
      {isDashboardOpen && (
        <LearningDashboard 
          userProfile={userProfile}
          architecture={{
            tokens: ["Game State", "User Query"],
            words: ["Rules", "Strategy", "History"],
            embeddings: ["User Knowledge Vector"]
          }}
          onClose={() => setIsDashboardOpen(false)}
        />
      )}
    </div>
  );
};

export default App;