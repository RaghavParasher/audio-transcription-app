"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

const MODAL_CONTENT = {
  features: {
    title: "🚀 Advanced Audio Intelligence Features",
    text: "AudioTranscribe is packed with features: verbatim transcription for over 100 languages, multi-speaker identification, custom audio player with interactive waveform rendering, and AI summaries that extract action items and categorize topics in real-time."
  },
  security: {
    title: "🔒 Enterprise-Grade Security",
    text: "We take your privacy seriously. All audio uploads are processed securely via encrypted connections. Local files are stored on secure databases, and all temporary media processed by Google Gemini is automatically scrubbed from Vercel/Google servers after 48 hours."
  },
  api: {
    title: "⚙️ Developer API Access",
    text: "Automate your workflows by integrating AudioTranscribe directly into your tools. Access REST API endpoints to programmatically upload recordings, fetch transcription JSON outputs, or set up webhook listener endpoints. API documentation is releasing soon!"
  },
  about: {
    title: "👋 About AudioTranscribe",
    text: "AudioTranscribe was founded in 2026 to simplify the way professionals, creators, and teams document verbal communication. By leveraging Google's state-of-the-art Gemini LLM, we turn unorganized voice recordings into structured, actionable documents."
  },
  blog: {
    title: "✍️ Official News & Updates",
    text: "Read our official blog for productivity tips, case studies, and engineering updates about audio processing and AI transcription. Our first article, 'How AI Summarization Saves 5 Hours of Meeting Notes Weekly', is coming next week!"
  },
  privacy: {
    title: "🛡️ Privacy & Data Retention Policy",
    text: "We collect only basic metadata (such as your username and audio file name) to display on your dashboard. Audio files are stored as secure binary data. We never sell your data or use it to train machine learning models."
  }
};

export default function LandingPage() {
  const [activeModal, setActiveModal] = useState<{ title: string; text: string } | null>(null);

  return (
    <div className={styles.container}>
      {/* Navbar */}
      <nav className={styles.nav}>
        <div className={styles.navContent}>
          <div className={styles.logo}>Audio<span>Transcribe</span></div>
          <div className={styles.navLinks}>
            <a href="#" onClick={(e) => { e.preventDefault(); setActiveModal(MODAL_CONTENT.features); }}>Features</a>
            <a href="#how-it-works">How it works</a>
            <a href="#pricing">Pricing</a>
            <Link href="/login" className={styles.loginBtn}>Admin Login</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>Powered by Gemini 1.5 Flash</div>
          <h1>Transform Your Audio into <span className={styles.gradientText}>Flawless Text</span></h1>
          <p>The world's most advanced AI-powered transcription platform. Accurate, fast, and designed for professionals.</p>
          <div className={styles.heroActions}>
            <Link href="/login" className={styles.primaryBtn}>Get Started Free</Link>
            <a href="#features" className={styles.secondaryBtn}>Learn More</a>
          </div>
        </div>
        <div className={styles.heroGraphic}>
          <div className={styles.floatingCard}>
            <div className={styles.waveContainer}>
              <div className={styles.wave}></div>
              <div className={styles.wave}></div>
              <div className={styles.wave}></div>
            </div>
            <div className={styles.transcribingText}>Transcribing... 98%</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={styles.features}>
        <div className={styles.sectionHeader}>
          <h2>Why Choose AudioTranscribe?</h2>
          <p>Unmatched accuracy powered by Google's latest generative AI.</p>
        </div>
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <div className={styles.icon}>⚡</div>
            <h3>Instant Processing</h3>
            <p>Transcribe hours of audio in just seconds with Gemini Flash technology.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.icon}>🎯</div>
            <h3>99% Accuracy</h3>
            <p>Our AI understands context, accents, and industry-specific jargon.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.icon}>🌍</div>
            <h3>Global Language Support</h3>
            <p>Transcribe in over 100 languages with native-level precision.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.icon}>🔒</div>
            <h3>Enterprise Security</h3>
            <p>Your data is encrypted and never used for training models.</p>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className={styles.howItWorks}>
        <div className={styles.sectionHeader}>
          <h2>How It Works</h2>
        </div>
        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <h3>Upload Audio</h3>
            <p>Drag and drop your audio files in any format (MP3, WAV, M4A).</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <h3>AI Transcription</h3>
            <div className={styles.connector}></div>
            <p>Our Gemini 2.0 engine processes your file with deep understanding.</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <h3>Review & Export</h3>
            <p>Download your perfect transcript or share it with your team.</p>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className={styles.stats}>
        <div className={styles.statItem}>
          <h3>1M+</h3>
          <p>Files Transcribed</p>
        </div>
        <div className={styles.statItem}>
          <h3>99.9%</h3>
          <p>Uptime Guaranteed</p>
        </div>
        <div className={styles.statItem}>
          <h3>50k+</h3>
          <p>Happy Users</p>
        </div>
      </section>

      {/* Pricing Section (Visual Placeholder) */}
      <section id="pricing" className={styles.pricing}>
        <div className={styles.sectionHeader}>
          <h2>Simple Pricing</h2>
        </div>
        <div className={styles.priceCard}>
          <div className={styles.priceHeader}>
            <h3>Professional</h3>
            <div className={styles.price}>$0<span>/mo</span></div>
            <p>Free for a limited time</p>
          </div>
          <ul className={styles.priceFeatures}>
            <li>Unlimited Transcriptions</li>
            <li>Gemini 2.0 Flash Access</li>
            <li>Speaker Identification</li>
            <li>Priority Support</li>
          </ul>
          <Link href="/login" className={styles.priceBtn}>Start Now</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <div className={styles.logo}>Audio<span>Transcribe</span></div>
            <p>The future of audio intelligence.</p>
          </div>
          <div className={styles.footerLinks}>
            <h4>Product</h4>
            <a href="#" onClick={(e) => { e.preventDefault(); setActiveModal(MODAL_CONTENT.features); }}>Features</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setActiveModal(MODAL_CONTENT.security); }}>Security</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setActiveModal(MODAL_CONTENT.api); }}>API</a>
          </div>
          <div className={styles.footerLinks}>
            <h4>Company</h4>
            <a href="#" onClick={(e) => { e.preventDefault(); setActiveModal(MODAL_CONTENT.about); }}>About</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setActiveModal(MODAL_CONTENT.blog); }}>Blog</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setActiveModal(MODAL_CONTENT.privacy); }}>Privacy</a>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>&copy; 2026 AudioTranscribe AI. All rights reserved.</p>
        </div>
      </footer>

      {/* Interactive Modal Popup */}
      {activeModal && (
        <div 
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(3, 3, 3, 0.8)",
            backdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px"
          }} 
          onClick={() => setActiveModal(null)}
        >
          <div 
            style={{
              background: "var(--surface)",
              backdropFilter: "blur(20px)",
              border: "1px solid var(--surface-border)",
              borderRadius: "24px",
              padding: "35px",
              maxWidth: "500px",
              width: "100%",
              boxShadow: "0 25px 60px -15px rgba(0,0,0,0.9)",
              position: "relative",
              fontFamily: "inherit"
            }} 
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ 
              fontSize: "1.45rem", 
              fontWeight: 800, 
              marginBottom: "1.25rem", 
              color: "#fff", 
              fontFamily: "'Outfit', sans-serif" 
            }}>
              {activeModal.title}
            </h3>
            <p style={{ 
              color: "var(--text-muted)", 
              lineHeight: 1.7, 
              fontSize: "0.95rem", 
              marginBottom: "2rem" 
            }}>
              {activeModal.text}
            </p>
            <button 
              className="logout-btn" 
              onClick={() => setActiveModal(null)} 
              style={{ 
                width: "100%", 
                border: "1px solid var(--primary)", 
                color: "#fff", 
                background: "var(--primary-gradient)",
                padding: "12px",
                fontWeight: 700,
                fontSize: "0.95rem",
                borderRadius: "10px"
              }}
            >
              Okay, Got It!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
