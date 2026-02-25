import { GoogleGenAI, Chat, Type } from "@google/genai";
import { GameState, Message, UserKnowledgeProfile } from "../types";

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

let ai: GoogleGenAI | null = null;
let chatSession: Chat | null = null;

// Lazy initialization of the AI client
const getAiClient = (): GoogleGenAI => {
  if (!ai) {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API_KEY is not defined");
    }
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
};

export const getChatSession = async (): Promise<Chat> => {
  if (!chatSession) {
    const client = getAiClient();
    chatSession = client.chats.create({
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
    return "Sorry, I lost my connection to the dugout. Please try asking again.";
  }
};

export const analyzeUserKnowledge = async (
  history: { role: string; text: string }[],
  currentProfile: UserKnowledgeProfile
): Promise<UserKnowledgeProfile> => {
  if (!process.env.API_KEY) {
    console.warn("No API Key for analysis");
    return currentProfile;
  }

  const client = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    You are an expert educational psychologist and baseball coach.
    Your task is to analyze the user's baseball knowledge based on their chat history.
    
    Current Profile:
    ${JSON.stringify(currentProfile)}
    
    Recent Chat History:
    ${history.map(m => `${m.role}: ${m.text}`).join('\n')}
    
    Analyze the user's questions and responses.
    - Update their knowledge scores (0-100) for Rules, Strategy, History, and Situational Awareness.
    - Identify any specific misconceptions they might have shown (e.g., "Why didn't he run on a foul tip?").
    - Suggest the next 3 topics they should learn based on their current gaps.
    
    Return a JSON object matching the UserKnowledgeProfile structure.
  `;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            rulesKnowledge: { type: Type.NUMBER },
            strategicInsight: { type: Type.NUMBER },
            historicalContext: { type: Type.NUMBER },
            situationalAwareness: { type: Type.NUMBER },
            misconceptions: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            learningPath: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            lastAnalyzed: { type: Type.STRING }
          }
        }
      }
    });
    
    const text = response.text;
    if (!text) return currentProfile;
    
    const newProfile = JSON.parse(text) as UserKnowledgeProfile;
    // Ensure we keep the timestamp fresh
    newProfile.lastAnalyzed = new Date().toISOString();
    
    return newProfile;
  } catch (error) {
    console.error("Analysis Error:", error);
    return currentProfile;
  }
};
