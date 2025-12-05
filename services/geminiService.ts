import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getDailyInsight = async (userName: string): Promise<string> => {
  try {
    const hour = new Date().getHours();
    let timeContext = "morning";
    if (hour >= 12 && hour < 18) timeContext = "afternoon";
    if (hour >= 18) timeContext = "evening";

    const prompt = `
      You are a helpful, minimalist dashboard assistant.
      The user's name is ${userName}.
      It is currently ${timeContext}.
      Generate a very short, inspiring greeting or a one-sentence productivity tip.
      Keep it under 20 words.
      Do not use quotes around the response.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return `Welcome back, ${userName}. Ready to focus?`;
  }
};