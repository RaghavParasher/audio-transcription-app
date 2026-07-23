"use client";

import { useState, useRef, useEffect } from "react";
import { transcribeAction } from "@/app/actions";
import { Upload, FileAudio, AlertCircle, Mic, Square, Radio } from "lucide-react";

export default function UploadAudio() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  
  // Recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clean up recording timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB");
        setFile(null);
      } else {
        setFile(selectedFile);
        setError("");
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("audio", file);

    try {
      const result = await transcribeAction(formData);
      if (result.success) {
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        setError(result.error || "Failed to transcribe");
      }
    } catch (err) {
      setError("An error occurred during upload");
    } finally {
      setUploading(false);
    }
  };

  // Start recording
  const startRecording = async () => {
    setError("");
    audioChunksRef.current = [];
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const recordedFile = new File([audioBlob], `recording_${Date.now()}.webm`, {
          type: "audio/webm",
        });
        
        setFile(recordedFile);
        // Stop all audio tracks to release the microphone
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);

    } catch (err: any) {
      console.error("Recording error:", err);
      setError("Microphone access denied or not supported on this device.");
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="card" style={{ marginBottom: "2rem" }}>
      <div 
        className="upload-zone"
        onClick={() => !isRecording && fileInputRef.current?.click()}
        style={{ cursor: isRecording ? "default" : "pointer" }}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="audio/*"
          style={{ display: "none" }}
        />

        {isRecording ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
            <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Radio size={48} color="var(--error)" className="pulse" style={{ animation: "pulse 1.5s infinite" }} />
              <style jsx global>{`
                @keyframes pulse {
                  0% { transform: scale(1); opacity: 1; }
                  50% { transform: scale(1.1); opacity: 0.5; }
                  100% { transform: scale(1); opacity: 1; }
                }
              `}</style>
            </div>
            <div>
              <p style={{ fontWeight: 600, color: "var(--error)" }}>Recording from Microphone...</p>
              <p style={{ fontSize: "1.5rem", fontWeight: 700, fontFamily: "monospace", marginTop: "0.5rem" }}>
                {formatTime(recordingSeconds)}
              </p>
            </div>
            <button 
              className="button" 
              onClick={(e) => { e.stopPropagation(); stopRecording(); }}
              style={{ width: "auto", minWidth: "160px", background: "var(--error)", boxShadow: "0 4px 20px rgba(239, 68, 68, 0.2)" }}
            >
              <Square size={16} /> Stop Recording
            </button>
          </div>
        ) : file ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
            <FileAudio size={48} color="var(--primary)" />
            <div>
              <p style={{ fontWeight: 600 }}>{file.name}</p>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <div style={{ display: "flex", gap: "10px", width: "100%", justifyContent: "center" }}>
              <button 
                className="button" 
                onClick={(e) => { e.stopPropagation(); handleUpload(); }}
                disabled={uploading}
                style={{ width: "auto", minWidth: "200px" }}
              >
                {uploading ? (
                  <><span className="spinner"></span> Transcribing...</>
                ) : (
                  "Start Transcription"
                )}
              </button>
              {!uploading && (
                <button 
                  className="logout-btn" 
                  onClick={(e) => { e.stopPropagation(); setFile(null); }}
                  style={{ width: "auto" }}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem", padding: "20px 0" }}>
            <div style={{ display: "flex", gap: "40px", alignItems: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                <Upload size={40} color="var(--text-muted)" />
                <p style={{ fontWeight: 600, fontSize: "0.95rem" }}>Click to upload file</p>
              </div>
              <div style={{ height: "40px", borderLeft: "1px solid var(--surface-border)" }}></div>
              <div 
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}
                onClick={(e) => { e.stopPropagation(); startRecording(); }}
              >
                <Mic size={40} color="var(--primary)" />
                <p style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--primary)" }}>Record Live</p>
              </div>
            </div>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              MP3, WAV, M4A, or WEBM up to 10MB
            </p>
          </div>
        )}
      </div>

      {error && (
        <div style={{ color: "var(--error)", display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "1rem", fontSize: "0.9rem" }}>
          <AlertCircle size={16} />
          {error}
        </div>
      )}
    </div>
  );
}
