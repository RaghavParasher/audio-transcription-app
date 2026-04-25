"use server";

import { transcribeAudio } from "@/lib/gemini";
import { db } from "@/db";
import { transcripts } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function transcribeAction(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const file = formData.get("audio") as File;
  if (!file) {
    throw new Error("No file uploaded");
  }

  if (file.size > 10 * 1024 * 1024) { // 10MB limit
    throw new Error("File too large");
  }

  try {
    const text = await transcribeAudio(file);

    await db.insert(transcripts).values({
      adminId: session.user.id,
      text: text,
      fileName: file.name,
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Action Error:", error);
    return { success: false, error: error.message || "Internal server error during transcription" };
  }
}
