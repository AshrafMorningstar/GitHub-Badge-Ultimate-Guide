import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { ModelType } from "../types";

// Helper to get client (assumes process.env.API_KEY is available as per instructions)
const getClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Handles fast queries using Flash-Lite
 */
export const askFastAI = async (prompt: string): Promise<string> => {
  const ai = getClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite-latest',
      contents: prompt,
      config: {
        systemInstruction: "You are a concise GitHub expert. Answer quickly and briefly."
      }
    });
    return response.text || "No response generated.";
  } catch (error) {
    console.error("Fast AI Error:", error);
    return "Sorry, I couldn't fetch a fast response.";
  }
};

/**
 * Handles complex queries with Thinking Budget using Pro
 */
export const askReasoningAI = async (prompt: string): Promise<string> => {
  const ai = getClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 32768 }, // Max thinking for deep reasoning
      }
    });
    return response.text || "I thought about it, but couldn't generate an answer.";
  } catch (error) {
    console.error("Reasoning AI Error:", error);
    return "Complex reasoning failed. Please try again.";
  }
};

/**
 * Handles grounded search queries using Flash
 */
export const askSearchAI = async (prompt: string): Promise<{ text: string; sources: Array<{title: string, uri: string}> }> => {
  const ai = getClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    const sources: Array<{title: string, uri: string}> = [];
    
    // Extract grounding chunks
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web) {
          sources.push({ title: chunk.web.title, uri: chunk.web.uri });
        }
      });
    }

    return {
      text: response.text || "No grounded info found.",
      sources
    };
  } catch (error) {
    console.error("Search AI Error:", error);
    return { text: "Search failed.", sources: [] };
  }
};

/**
 * Generates images for badge concepts
 */
export const generateBadgeConcept = async (prompt: string, size: '1K' | '2K' | '4K' = '1K'): Promise<string | null> => {
  const ai = getClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: `Design a high quality, 3D glossy GitHub profile badge for: ${prompt}. Minimalist, hexagon or circular shape.` }]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
          imageSize: size
        }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image Gen Error:", error);
    return null;
  }
};
