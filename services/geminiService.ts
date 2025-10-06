

import { GoogleGenAI, Modality, Part } from '@google/genai';
import { ImageFile } from '../types';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Using a placeholder. The app will not work without a valid key.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const editImageWithGemini = async (prompt: string, images: ImageFile[]): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  const imageParts: Part[] = images.map(image => {
      const base64Data = image.base64.split(',')[1];
      if (!base64Data) {
          throw new Error("Invalid base64 image data");
      }
      return {
        inlineData: {
          data: base64Data,
          mimeType: image.mimeType,
        },
      };
  });

  const contents = {
    parts: [...imageParts, { text: prompt }],
  };

  let response;
  try {
    response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: contents,
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    const message = error instanceof Error ? error.message : "An unknown API error occurred.";
    throw new Error(`Failed to communicate with the AI model: ${message}`);
  }

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      const base64ImageBytes = part.inlineData.data;
      const mimeType = part.inlineData.mimeType;
      return `data:${mimeType};base64,${base64ImageBytes}`;
    }
  }
  
  const textResponse = response.text;
  // If we reach here, the API call was successful but didn't yield an image.
  // This is a "soft" failure. We throw the model's text response as the error message.
  throw new Error(textResponse || 'The AI model did not return an image. Please adjust your prompt and try again.');
};