import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import fs from "fs";
import path from "path";
import os from "os";

const apiKey = process.env.GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

export async function transcribeAudio(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const tempDir = os.tmpdir();
  const tempFilePath = path.join(tempDir, `upload_${Date.now()}_${file.name}`);
  
  fs.writeFileSync(tempFilePath, buffer);

  try {
    const uploadResult = await fileManager.uploadFile(tempFilePath, {
      mimeType: file.type || "audio/mpeg",
      displayName: file.name,
    });

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent([
      {
        fileData: {
          mimeType: uploadResult.file.mimeType,
          fileUri: uploadResult.file.uri,
        },
      },
      { text: "Transcribe this audio verbatim. If there are multiple speakers, label them. Return only the transcript text." },
    ]);

    // Clean up
    fs.unlinkSync(tempFilePath);
    // Note: We could also delete from Gemini File API, but it auto-deletes after 48h.
    // await fileManager.deleteFile(uploadResult.file.name);

    return result.response.text();
  } catch (error: any) {
    if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
    console.error("Gemini API Error Detail:", error);
    throw new Error(`Gemini Error: ${error.message || "Unknown API error"}`);
  }
}
