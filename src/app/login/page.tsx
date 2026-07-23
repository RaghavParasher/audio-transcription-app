"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error } = await authClient.signIn.username({
        username,
        password,
      });

      if (error) {
        setError(error.message || "Invalid credentials");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const { error } = await authClient.signIn.username({
        username: "admin",
        password: "AdminTranscribe2026!",
      });

      if (error) {
        setError(error.message || "Invalid credentials");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="card" style={{ width: "100%", maxWidth: "420px", padding: "40px 30px" }}>
        <h1 className="title" style={{ fontSize: "2.2rem", textAlign: "center", marginBottom: "0.5rem" }}>Admin Login</h1>
        <p className="subtitle" style={{ textAlign: "center", marginBottom: "2rem" }}>Access your audio transcription dashboard</p>

        {/* Large Premium One-Click Login */}
        <button 
          type="button" 
          onClick={handleDemoLogin} 
          className="button"
          style={{ 
            background: "var(--primary-gradient)",
            boxShadow: "0 8px 30px rgba(99, 102, 241, 0.4)",
            padding: "16px 24px",
            fontSize: "1.1rem",
            fontWeight: "800",
            borderRadius: "12px",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            marginBottom: "1.5rem",
            letterSpacing: "0.5px",
            transform: "scale(1.02)",
            animation: "pulseGlow 2s infinite alternate"
          }}
          disabled={loading}
        >
          {loading ? "Launching Demo..." : "✨ Instant Demo Login (One-Click)"}
        </button>

        <style jsx global>{`
          @keyframes pulseGlow {
            0% { box-shadow: 0 8px 30px rgba(99, 102, 241, 0.3); }
            100% { box-shadow: 0 8px 35px rgba(139, 92, 246, 0.6); }
          }
        `}</style>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "1.5rem 0", color: "var(--text-muted)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "1px" }}>
          <div style={{ flex: 1, height: "1px", background: "var(--surface-border)" }}></div>
          <span>OR LOG IN MANUALLY</span>
          <div style={{ flex: 1, height: "1px", background: "var(--surface-border)" }}></div>
        </div>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label className="label">Username</label>
            <input
              type="text"
              className="input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="admin"
            />
          </div>

          <div className="input-group">
            <label className="label">Password</label>
            <input
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          {error && <p style={{ color: "var(--error)", fontSize: "0.9rem", marginBottom: "1rem" }}>{error}</p>}

          <button type="submit" className="button" disabled={loading} style={{ background: "rgba(255, 255, 255, 0.05)", border: "1px solid var(--surface-border)" }}>
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
