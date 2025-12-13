import { GoogleGenAI, Type } from "@google/genai";
import { UploadedFile, PatientAnalysisResult } from "../types";

const SYSTEM_INSTRUCTION = `
You are MediSynth AI, an advanced medical intelligence assistant.
Your goal is to synthesize patient data into a coherent medical summary AND extract a chronological timeline of events.

Input: Medical documents (images/text).
Output: JSON object containing a 'summary' (Markdown) and a 'timeline' (Array).

Guidelines for Summary:
1. Sections: Demographics, History, Key Findings (highlight abnormalities), Diagnosis/Impressions, Plan.
2. Tone: Professional, clinical.
3. No PII unless explicitly in docs.
4. Format: Clean Markdown.

Guidelines for Timeline:
1. Extract every distinct event with a date (Consultations, Labs, Procedures, Med changes).
2. If date is inexact, use best approximation or "Undated".
3. Categorize accurately.
`;

export const generatePatientSummary = async (files: UploadedFile[]): Promise<PatientAnalysisResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    // gemini-2.5-flash is often faster and sufficient for structured extraction, 
    // but gemini-3-pro-preview provides deeper reasoning for complex medical handwriting.
    const model = 'gemini-3-pro-preview'; 
    
    const parts = files.map(file => {
       const base64Data = file.content.split(',')[1];
       return {
         inlineData: {
           mimeType: file.type || 'image/jpeg',
           data: base64Data
         }
       };
    });

    const textPart = {
      text: "Analyze the documents. Generate a structured JSON response with a Markdown summary and a patient timeline."
    };

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [...parts, textPart]
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.2,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: "The full medical summary in Markdown format."
            },
            timeline: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  date: { type: Type.STRING, description: "Date of event (YYYY-MM-DD or readable format)" },
                  title: { type: Type.STRING, description: "Event title" },
                  description: { type: Type.STRING, description: "Short details" },
                  category: { 
                    type: Type.STRING, 
                    description: "consultation, lab, procedure, medication, or general",
                    enum: ["consultation", "lab", "procedure", "medication", "general"]
                  }
                },
                required: ["date", "title", "category"]
              }
            }
          },
          required: ["summary", "timeline"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response generated from the model.");
    }

    // Parse JSON response
    const data = JSON.parse(text) as PatientAnalysisResult;
    return data;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
