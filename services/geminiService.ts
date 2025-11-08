
import { GoogleGenAI } from "@google/genai";

// Assume API_KEY is set in the environment variables
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}
const ai = new GoogleGenAI({ apiKey: API_KEY });

export type AIOperation = 'summarize' | 'rewrite' | 'fix-grammar';

const prompts: Record<AIOperation, string> = {
    summarize: "Summarize the following text concisely:",
    rewrite: "Rewrite the following text in a more engaging and clear tone:",
    'fix-grammar': "Correct any spelling and grammar mistakes in the following text. Only return the corrected text, without any introductory phrases:"
};

export async function generateTextWithGemini(operation: AIOperation, text: string): Promise<string> {
    if (!API_KEY) {
        return Promise.reject(new Error("API key is not configured."));
    }
    if (!text.trim()) {
        return Promise.resolve("Please provide some text to work on.");
    }
    
    const fullPrompt = `${prompts[operation]}\n\n---\n\n${text}`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: fullPrompt,
        });

        return response.text ?? '';
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to generate text. Please check your connection or API key.");
    }
}