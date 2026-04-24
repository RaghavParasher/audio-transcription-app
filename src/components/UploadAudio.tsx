"use client";

import { useState, useRef } from "react";
import { transcribeAction } from "@/app/actions";
import { Upload, FileAudio, AlertCircle } from "lucide-react";

export default function UploadAudio() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  return (
    <div className="card" style={{ marginBottom: "2rem" }}>
      <div 
        className="upload-zone"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="audio/*"
          style={{ display: "none" }}
        />
        {file ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
            <FileAudio size={48} color="var(--primary)" />
            <div>
              <p style={{ fontWeight: 600 }}>{file.name}</p>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
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
                  style={{ width: "auto", border: "none" }}
                >
                  Cancel
                </button>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
            <Upload size={48} color="var(--text-muted)" />
            <div>
              <p style={{ fontWeight: 600 }}>Click to upload audio</p>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                MP3, WAV, M4A up to 10MB
              </p>
            </div>
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
