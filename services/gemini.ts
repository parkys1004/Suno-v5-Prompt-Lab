
import { GoogleGenAI, Type } from "@google/genai";
import { PromptResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const SYSTEM_INSTRUCTION = `You are an expert Music Producer and Prompt Engineer for Suno AI v5. 
Your goal is to help users create perfect musical compositions by generating highly effective "Style" prompts and "Lyrics".

For "Style", use a mix of specific genres, moods, instruments, and production techniques (e.g., "90s Boom Bap, Lo-fi piano, melancholic mood, male vocals, soulful chords").
For "Lyrics", create structured song lyrics with [Verse], [Chorus], [Bridge], and [Outro] markers.

Always respond in a structured JSON format.`;

export async function generateSunoPrompt(userInput: string): Promise<PromptResult> {
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Generate a Suno v5 prompt for: ${userInput}`,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          style: { type: Type.STRING, description: "Detailed style string for Suno" },
          lyrics: { type: Type.STRING, description: "Structured lyrics with markers" },
          title: { type: Type.STRING, description: "Suggested song title" },
          tags: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Music tags"
          },
          vibe: { type: Type.STRING, description: "A brief description of the song's energy" }
        },
        required: ["style", "lyrics", "title", "tags", "vibe"]
      }
    }
  });

  try {
    return JSON.parse(response.text || "{}") as PromptResult;
  } catch (e) {
    throw new Error("Failed to parse AI response");
  }
}
