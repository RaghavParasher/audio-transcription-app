import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { transcripts } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import UploadAudio from "@/components/UploadAudio";
import LogoutButton from "@/components/LogoutButton";

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
        <div style={{ fontWeight: 800, fontSize: "1.2rem", color: "var(--primary)" }}>TranscribeAI</div>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>{session.user.name}</span>
          <LogoutButton />
        </div>
      </nav>

      <main className="container">
        <header style={{ marginBottom: "3rem" }}>
          <h1 className="title">Admin Dashboard</h1>
          <p className="subtitle">Upload audio files and view AI-generated transcripts.</p>
        </header>

        <UploadAudio />

        <section className="transcript-list">
          <h2 style={{ marginBottom: "1.5rem", fontSize: "1.5rem" }}>Recent Transcripts</h2>
          {allTranscripts.length === 0 ? (
            <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "3rem" }}>
              No transcripts found. Upload your first audio file above!
            </p>
          ) : (
            allTranscripts.map((t) => (
              <div key={t.id} className="transcript-card">
                <div className="transcript-header">
                  <span>{t.fileName}</span>
                  <span>{new Date(t.createdAt).toLocaleString()}</span>
                </div>
                <div className="transcript-text">{t.text}</div>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}
