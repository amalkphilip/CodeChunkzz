
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY;
if (!apiKey) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey });

export const getHealthRecommendation = async (aqi: number, level: string): Promise<string> => {
  const prompt = `The current air quality index (AQI) is ${aqi}, which is considered '${level}'. Provide a short, actionable health recommendation for the general public in 2-3 concise bullet points. The tone should be helpful and clear. Do not use markdown formatting, just plain text with bullet points (e.g., using '-' or '*').`;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error fetching health recommendation from Gemini:", error);
    throw new Error("Failed to generate health recommendation.");
  }
};
