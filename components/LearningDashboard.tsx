import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Brain, Layers, BookOpen, Lightbulb, Activity, ChevronRight, User, Database, Network } from 'lucide-react';
import { UserKnowledgeProfile, LearningArchitecture } from '../types';

interface LearningDashboardProps {
  userProfile: UserKnowledgeProfile;
  architecture: LearningArchitecture;
  onClose: () => void;
}

const tabs = [
  { id: 'architecture', label: 'Learning Architecture', icon: Network },
  { id: 'user-model', label: 'User Model (Live)', icon: Brain },
  { id: 'reflection', label: 'Reflection', icon: BookOpen },
];

export const LearningDashboard: React.FC<LearningDashboardProps> = ({ userProfile, architecture, onClose }) => {
  const [activeTab, setActiveTab] = useState('architecture');

  const radarData = [
    { subject: 'Rules', A: userProfile.rulesKnowledge, fullMark: 100 },
    { subject: 'Strategy', A: userProfile.strategicInsight, fullMark: 100 },
    { subject: 'History', A: userProfile.historicalContext, fullMark: 100 },
    { subject: 'Situational', A: userProfile.situationalAwareness, fullMark: 100 },
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-800 w-full max-w-6xl h-[90vh] rounded-2xl shadow-2xl border border-slate-700 flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-700 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <Brain className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">System Intelligence</h2>
              <p className="text-sm text-slate-400">Under the hood of DiamondTutor</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Close Dashboard
          </button>
        </div>

        {/* Navigation */}
        <div className="flex border-b border-slate-700 bg-slate-800/50">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all relative ${
                  isActive ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {isActive && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-400"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-900/30">
          <AnimatePresence mode="wait">
            {activeTab === 'architecture' && (
              <motion.div 
                key="architecture"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Tokens */}
                  <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 relative overflow-hidden group hover:border-indigo-500/50 transition-colors">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Database className="w-24 h-24" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs">1</span>
                      Tokens
                    </h3>
                    <p className="text-slate-400 text-sm mb-4">
                      The atomic units of baseball reality. These are raw, discrete inputs that the system processes.
                    </p>
                    <div className="space-y-2">
                      <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                        <span className="text-xs font-mono text-blue-400 block mb-1">GAME STATE</span>
                        <code className="text-xs text-slate-300">"Bottom 9th", "2 Outs", "Runner on 1st"</code>
                      </div>
                      <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                        <span className="text-xs font-mono text-blue-400 block mb-1">USER QUERY</span>
                        <code className="text-xs text-slate-300">"What is a balk?"</code>
                      </div>
                    </div>
                  </div>

                  {/* Words */}
                  <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 relative overflow-hidden group hover:border-indigo-500/50 transition-colors">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Layers className="w-24 h-24" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs">2</span>
                      Words (Concepts)
                    </h3>
                    <p className="text-slate-400 text-sm mb-4">
                      Contextual clusters of meaning. The system groups tokens into higher-order baseball concepts.
                    </p>
                    <div className="space-y-2">
                      <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                        <span className="text-xs font-mono text-purple-400 block mb-1">STRATEGIC</span>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-1 bg-purple-500/10 rounded text-xs text-purple-300">High Leverage</span>
                          <span className="px-2 py-1 bg-purple-500/10 rounded text-xs text-purple-300">Squeeze Play</span>
                        </div>
                      </div>
                      <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                        <span className="text-xs font-mono text-purple-400 block mb-1">RULES</span>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-1 bg-purple-500/10 rounded text-xs text-purple-300">Infield Fly</span>
                          <span className="px-2 py-1 bg-purple-500/10 rounded text-xs text-purple-300">Force Out</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Embeddings */}
                  <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 relative overflow-hidden group hover:border-indigo-500/50 transition-colors">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Network className="w-24 h-24" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs">3</span>
                      Embeddings
                    </h3>
                    <p className="text-slate-400 text-sm mb-4">
                      The User's Baseball DNA. A high-dimensional vector representing the user's holistic understanding.
                    </p>
                    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50 h-32 flex items-center justify-center">
                       <div className="w-full h-full flex items-end justify-between gap-1 px-2">
                          {[40, 70, 30, 85, 50, 60, 20, 90].map((h, i) => (
                            <div key={i} className="w-1/12 bg-indigo-500/40 rounded-t" style={{ height: `${h}%` }} />
                          ))}
                       </div>
                    </div>
                    <p className="text-xs text-center text-slate-500 mt-2">Vector Representation</p>
                  </div>
                </div>

                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                  <h3 className="text-lg font-semibold text-white mb-4">Why this is powerful</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex gap-4">
                      <div className="p-2 bg-green-500/10 rounded-lg h-fit">
                        <ChevronRight className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-200">Beyond Keyword Matching</h4>
                        <p className="text-sm text-slate-400 mt-1">
                          Instead of just answering "what is a strike", the system understands the *intent* behind the question. Is the user confused about the zone? Or the rulebook definition?
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="p-2 bg-green-500/10 rounded-lg h-fit">
                        <ChevronRight className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-200">Long-term Adaptation</h4>
                        <p className="text-sm text-slate-400 mt-1">
                          By tracking the embedding state, the system can "level up" its explanations. It won't explain basic rules to an expert, and won't use jargon with a novice.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'user-model' && (
              <motion.div 
                key="user-model"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid md:grid-cols-2 gap-8"
              >
                {/* Radar Chart */}
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col items-center justify-center min-h-[400px]">
                  <h3 className="text-lg font-semibold text-white mb-2 w-full text-left">Your Baseball DNA</h3>
                  <p className="text-sm text-slate-400 mb-6 w-full text-left">Real-time visualization of your inferred knowledge.</p>
                  <div className="w-full h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                        <PolarGrid stroke="#334155" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar
                          name="Knowledge"
                          dataKey="A"
                          stroke="#818cf8"
                          strokeWidth={2}
                          fill="#818cf8"
                          fillOpacity={0.3}
                        />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                          itemStyle={{ color: '#818cf8' }}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Insights Panel */}
                <div className="space-y-6">
                  <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-yellow-400" />
                      Detected Misconceptions
                    </h3>
                    {userProfile.misconceptions.length > 0 ? (
                      <ul className="space-y-3">
                        {userProfile.misconceptions.map((m, i) => (
                          <li key={i} className="flex items-start gap-3 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                            <span className="text-red-400 mt-0.5">•</span>
                            <span className="text-sm text-slate-300">{m}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-center py-8 text-slate-500">
                        <p>No misconceptions detected yet.</p>
                        <p className="text-xs mt-1">Keep chatting to help the model learn about you.</p>
                      </div>
                    )}
                  </div>

                  <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-green-400" />
                      Recommended Learning Path
                    </h3>
                    {userProfile.learningPath.length > 0 ? (
                      <div className="space-y-3">
                        {userProfile.learningPath.map((path, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg border border-slate-600/50 hover:bg-slate-700 transition-colors cursor-pointer">
                            <div className="w-6 h-6 rounded-full bg-slate-600 flex items-center justify-center text-xs font-medium text-slate-300">
                              {i + 1}
                            </div>
                            <span className="text-sm text-slate-200">{path}</span>
                            <ChevronRight className="w-4 h-4 text-slate-500 ml-auto" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-slate-500">
                        <p>Analyzing your interactions...</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'reflection' && (
              <motion.div 
                key="reflection"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8 max-w-4xl mx-auto"
              >
                <div className="bg-slate-800 p-8 rounded-xl border border-slate-700">
                  <h3 className="text-xl font-bold text-white mb-6 border-b border-slate-700 pb-4">Project Reflection</h3>
                  
                  <div className="space-y-8">
                    <div>
                      <h4 className="text-lg font-semibold text-indigo-400 mb-2">Technical Challenges</h4>
                      <p className="text-slate-300 leading-relaxed">
                        One of the main technical challenges was <strong>latency vs. depth</strong>. To build a true "User Embedding", we need to analyze every interaction. Doing this in real-time with a frontier model (like Gemini 1.5 Pro) adds latency to the chat. We solved this by decoupling the "Answer" generation from the "Analysis" generation. The user gets an answer immediately, while the background process updates their profile.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-indigo-400 mb-2">Product Challenges</h4>
                      <p className="text-slate-300 leading-relaxed">
                        <strong>Trust and Hallucination</strong> are critical in educational tools. If the AI confidently explains a rule incorrectly (e.g., the Infield Fly Rule), it can permanently confuse a learner. We mitigated this by grounding the model with a strict "Rulebook Context" in the system prompt, but ensuring it admits uncertainty when rules are ambiguous.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-indigo-400 mb-2">Educational Challenges</h4>
                      <p className="text-slate-300 leading-relaxed">
                        The risk of <strong>over-scaffolding</strong>. If the AI always gives the answer immediately, the user never learns to "read the field" themselves. We tried to design the "Socratic Mode" (in the prompt engineering) to ask guiding questions before giving answers, encouraging active recall.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <h4 className="font-semibold text-green-400 mb-2">Proud Accomplishment</h4>
                    <p className="text-sm text-slate-400">
                      Successfully visualizing the abstract concept of a "User Embedding" into a concrete, actionable Radar Chart that updates live.
                    </p>
                  </div>
                  <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <h4 className="font-semibold text-yellow-400 mb-2">Surprising Insight</h4>
                    <p className="text-sm text-slate-400">
                      How much "context" is hidden in simple questions. A user asking "Why didn't he run?" implies a lack of Force Out knowledge, which is a huge signal for the model.
                    </p>
                  </div>
                  <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <h4 className="font-semibold text-blue-400 mb-2">Next Step</h4>
                    <p className="text-sm text-slate-400">
                      Implement a persistent vector database (like Pinecone) to store user history across sessions, allowing for long-term curriculum planning.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
