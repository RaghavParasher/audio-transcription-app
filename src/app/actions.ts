"use server";

import { transcribeAudio } from "@/lib/gemini";
import { db } from "@/db";
import { transcripts } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

export async function transcribeAction(formData: FormData) {
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

    // Convert file to base64 string
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = buffer.toString("base64");

    const result = await transcribeAudio(file);

    // Insert record with temporary audioUrl
    const insertResult = await db.insert(transcripts).values({
      adminId: session.user.id,
      text: result.transcript,
      fileName: file.name,
      audioUrl: "", // Will update with generated ID next
      audioData: base64Data,
      summary: result.summary,
      actionItems: JSON.stringify(result.actionItems),
      tags: result.tags.join(", "),
    }).returning({ id: transcripts.id });

    const insertedId = insertResult[0].id;
    const audioUrl = `/api/audio/${insertedId}`;

    // Update with correct audioUrl
    await db.update(transcripts)
      .set({ audioUrl: audioUrl })
      .where(eq(transcripts.id, insertedId));

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Action Error Details:", error);
    return { success: false, error: error.message || "Internal server error during transcription" };
  }
}
