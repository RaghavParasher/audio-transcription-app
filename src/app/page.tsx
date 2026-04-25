import Link from "next/link";

export default function Home() {
  return (
    <div className="container" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
      <h1 className="title" style={{ fontSize: "4rem", marginBottom: "1.5rem" }}>
        Audio to Text, <br />Powered by Gemini AI
      </h1>
      <p className="subtitle" style={{ fontSize: "1.2rem", maxWidth: "600px" }}>
        A premium, full-stack transcription service for administrators. 
        Secure, fast, and remarkably accurate.
      </p>
      
      <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
        <Link href="/login" className="button" style={{ width: "auto", padding: "1rem 2.5rem" }}>
          Admin Login
        </Link>
      </div>

      <div style={{ marginTop: "4rem", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "2rem", width: "100%", maxWidth: "900px" }}>
        <div className="card" style={{ padding: "1.5rem" }}>
          <h3 style={{ color: "var(--primary)", marginBottom: "0.5rem" }}>Fast</h3>
          <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>Transcription in seconds using Gemini 1.5 Flash.</p>
        </div>
        <div className="card" style={{ padding: "1.5rem" }}>
          <h3 style={{ color: "var(--primary)", marginBottom: "0.5rem" }}>Secure</h3>
          <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>Built with Better Auth and PostgreSQL for robust security.</p>
        </div>
        <div className="card" style={{ padding: "1.5rem" }}>
          <h3 style={{ color: "var(--primary)", marginBottom: "0.5rem" }}>Simple</h3>
          <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>Minimalist dashboard for seamless audio management.</p>
        </div>
      </div>
    </div>
  );
}
