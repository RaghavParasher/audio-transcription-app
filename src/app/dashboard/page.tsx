import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { transcripts } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import UploadAudio from "@/components/UploadAudio";
import LogoutButton from "@/components/LogoutButton";
import TranscriptCard from "@/components/TranscriptCard";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const allTranscripts = await db.query.transcripts.findMany({
    where: eq(transcripts.adminId, session.user.id),
    orderBy: [desc(transcripts.createdAt)],
  });

  return (
    <div>
      <nav className="nav">
        <div style={{ fontWeight: 800, fontSize: "1.4rem", color: "var(--primary)", fontFamily: "'Outfit', sans-serif" }}>
          Audio<span style={{ color: "#fff" }}>Transcribe</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>{session.user.name}</span>
          <LogoutButton />
        </div>
      </nav>

      <main className="container">
        <header style={{ marginBottom: "3rem" }}>
          <h1 className="title">Admin Dashboard</h1>
          <p className="subtitle">Upload audio files or record directly to get AI-generated transcriptions, summaries, and action items.</p>
        </header>

        <UploadAudio />

        <section className="transcript-list">
          <h2 style={{ marginBottom: "1.5rem", fontSize: "1.5rem", fontFamily: "'Outfit', sans-serif" }}>Recent Transcripts</h2>
          {allTranscripts.length === 0 ? (
            <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "3rem" }}>
              No transcripts found. Upload your first audio file above!
            </p>
          ) : (
            allTranscripts.map((t) => (
              <TranscriptCard 
                key={t.id} 
                transcript={{
                  ...t,
                  createdAt: t.createdAt.toISOString()
                }} 
              />
            ))
          )}
        </section>
      </main>
    </div>
  );
}
