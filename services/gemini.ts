import { GoogleGenAI, ChatSession } from "@google/genai";
import { GameState, Message } from "../types";

// Helper to get key safely across environments (Vite vs Node/Simulated)
const getApiKey = (): string => {
  // For Vite (Local Development)
  // We use type coercion to avoid TypeScript errors if types aren't fully set up
  if (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_KEY) {
    return (import.meta as any).env.VITE_API_KEY;
  }
  
  // For Simulated Environment / Node
  try {
    if (typeof process !== 'undefined' && process.env?.API_KEY) {
      return process.env.API_KEY;
    }
  } catch(e) {
    // Ignore process not defined errors in strict browser environments
  }
  
  return '';
};

const ai = new GoogleGenAI({ apiKey: getApiKey() });

const SYSTEM_INSTRUCTION = `
You are DiamondTutor, an expert, friendly, and enthusiastic baseball tutor.
Your goal is to help new fans understand the game of baseball in real-time.

Style Guide:
- Be concise. Live baseball moves fast.
- Use analogies (e.g., comparing positions to other sports or real-life jobs).
- Be encouraging and welcoming to beginners.
- If the user asks about a rule, explain it simply first, then add nuance if needed.

Context Awareness:
- Each message will come with a "Current Game State" prefix. Use this to tailor your advice.
- For example, if there are 2 outs and bases loaded, explain the pressure or specific defensive positioning.
- If the count is 3-0, explain why the batter might "take" a pitch.
`;

let chatSession: ChatSession | null = null;

export const getChatSession = async (): Promise<ChatSession> => {
  if (!chatSession) {
    chatSession = await ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });
  }
  return chatSession;
};

export const formatGameStateForPrompt = (state: GameState): string => {
  const runners = [];
  if (state.runnerOnFirst) runners.push('1st');
  if (state.runnerOnSecond) runners.push('2nd');
  if (state.runnerOnThird) runners.push('3rd');
  const runnersStr = runners.length > 0 ? runners.join(', ') : 'None';

  return `
[CURRENT CONTEXT]
Inning: ${state.isTop ? 'Top' : 'Bottom'} of ${state.inning}
Score: Home ${state.homeScore} - Away ${state.awayScore}
Outs: ${state.outs}
Count: ${state.balls} Balls, ${state.strikes} Strikes
Runners on: ${runnersStr}
[END CONTEXT]
`;
};

export const sendMessage = async (
  text: string, 
  gameState: GameState
): Promise<string> => {
  const key = getApiKey();
  if (!key) {
    return "Configuration Error: No API Key found. If running locally, please add VITE_API_KEY to your .env file.";
  }

  try {
    const session = await getChatSession();
    const contextPrefix = formatGameStateForPrompt(gameState);
    const fullPrompt = `${contextPrefix}\n\nUser Question: ${text}`;
    
    const result = await session.sendMessage({
      message: fullPrompt
    });

    return result.text || "I'm having trouble reading the play right now. Ask me again in a moment!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Return the error message to the chat so the user knows something went wrong
    return "Sorry, I lost my connection to the dugout. Please try asking again.";
  }
};