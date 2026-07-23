import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { transcripts } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const transcript = await db.query.transcripts.findFirst({
      where: eq(transcripts.id, id),
    });

    if (!transcript || !transcript.audioData) {
      return new NextResponse("Audio not found", { status: 404 });
    }

    const buffer = Buffer.from(transcript.audioData, "base64");
    
    // Determine mimeType from file extension
    const fileName = transcript.fileName.toLowerCase();
    const contentType = fileName.endsWith(".webm")
      ? "audio/webm"
      : fileName.endsWith(".wav")
      ? "audio/wav"
      : fileName.endsWith(".m4a")
      ? "audio/mp4"
      : "audio/mpeg";

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Length": buffer.length.toString(),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error: any) {
    console.error("API Audio Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
