import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import fs from "fs";
import path from "path";
import os from "os";

const apiKey = process.env.GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

export interface TranscriptionResult {
  transcript: string;
  summary: string;
  actionItems: string[];
  tags: string[];
}

export async function transcribeAudio(file: File): Promise<TranscriptionResult> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const tempDir = os.tmpdir();
  const tempFilePath = path.join(tempDir, `upload_${Date.now()}_${file.name}`);
  
  fs.writeFileSync(tempFilePath, buffer);

  try {
    const uploadResult = await fileManager.uploadFile(tempFilePath, {
      mimeType: file.type || "audio/mpeg",
      displayName: file.name,
    });

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            transcript: {
              type: SchemaType.STRING,
              description: "Verbatim transcription of the audio file. If there are multiple speakers, label them clearly (e.g. Speaker 1: Hello, Speaker 2: Hi)."
            },
            summary: {
              type: SchemaType.STRING,
              description: "A bulleted executive summary of the conversation."
            },
            actionItems: {
              type: SchemaType.ARRAY,
              items: { type: SchemaType.STRING },
              description: "A list of concrete action items, tasks, or decisions extracted from the audio."
            },
            tags: {
              type: SchemaType.ARRAY,
              items: { type: SchemaType.STRING },
              description: "Suggested tags/labels (e.g., meeting, finance, ideas) for categorizing the transcript. Do not include hash prefix."
            }
          },
          required: ["transcript", "summary", "actionItems", "tags"]
        }
      }
    });

    const result = await model.generateContent([
      {
        fileData: {
          mimeType: uploadResult.file.mimeType,
          fileUri: uploadResult.file.uri,
        },
      },
      { text: "Transcribe this audio verbatim, generate an executive summary, list action items, and recommend relevant tags." },
    ]);

    // Clean up
    fs.unlinkSync(tempFilePath);

    const jsonText = result.response.text();
    const parsedData: TranscriptionResult = JSON.parse(jsonText);
    return parsedData;
  } catch (error: any) {
    if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
    console.error("Gemini API Error Detail:", error);
    throw new Error(`Gemini Error: ${error.message || "Unknown API error"}`);
  }
}
