import { GoogleGenAI, Chat } from "@google/genai";
import { GameState, Message } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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

let chatSession: Chat | null = null;

export const getChatSession = async (): Promise<Chat> => {
  if (!chatSession) {
    chatSession = ai.chats.create({
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
  if (!process.env.API_KEY) {
    return "Configuration Error: No API Key found. Please ensure process.env.API_KEY is set.";
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