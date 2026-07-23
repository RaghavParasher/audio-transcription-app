"use server";

import { transcribeAudio } from "@/lib/gemini";
import { db } from "@/db";
import { transcripts } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";

export async function transcribeAction(formData: FormData) {
  let createdFilePath: string | null = null;

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("Unauthorized: Please log in again");
    }

    const file = formData.get("audio") as File;
    if (!file) {
      throw new Error("No file uploaded");
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      throw new Error("File too large (max 10MB)");
    }

    // Create public/uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Generate unique filename and write buffer
    const fileExtension = file.name.split(".").pop() || "mp3";
    const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExtension}`;
    const filePath = path.join(uploadsDir, uniqueFileName);
    createdFilePath = filePath;
    
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);
    
    const audioUrl = `/uploads/${uniqueFileName}`;

    const result = await transcribeAudio(file);

    await db.insert(transcripts).values({
      adminId: session.user.id,
      text: result.transcript,
      fileName: file.name,
      audioUrl: audioUrl,
      summary: result.summary,
      actionItems: JSON.stringify(result.actionItems),
      tags: result.tags.join(", "),
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    // Cleanup the uploaded file if anything fails
    if (createdFilePath && fs.existsSync(createdFilePath)) {
      fs.unlinkSync(createdFilePath);
    }
    console.error("Action Error Details:", error);
    return { success: false, error: error.message || "Internal server error during transcription" };
  }
}
