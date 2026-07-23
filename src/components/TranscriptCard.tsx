"use client";

import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { Play, Pause, Download, FileText, Calendar, Clock, Tag } from "lucide-react";

interface Transcript {
  id: string;
  fileName: string;
  text: string;
  audioUrl: string | null;
  summary: string | null;
  actionItems: string | null;
  tags: string | null;
  createdAt: string;
}

interface TranscriptCardProps {
  transcript: Transcript;
}

export default function TranscriptCard({ transcript }: TranscriptCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [activeTab, setActiveTab] = useState<"transcript" | "summary" | "actions">("transcript");

  // Parse action items
  let actionItemsList: string[] = [];
  try {
    if (transcript.actionItems) {
      actionItemsList = JSON.parse(transcript.actionItems);
    }
  } catch (e) {
    console.error("Error parsing action items", e);
  }

  // Parse tags
  const tagsList = transcript.tags ? transcript.tags.split(",").map(t => t.trim()).filter(Boolean) : [];

  // Parse lines with timestamps
  const parseLines = (rawText: string) => {
    const lines = rawText.split("\n");
    return lines.map((line, index) => {
      const timestampRegex = /\[(\d{2}):(\d{2})\]/;
      const match = line.match(timestampRegex);
      if (match) {
        const mins = parseInt(match[1]);
        const secs = parseInt(match[2]);
        const seconds = mins * 60 + secs;
        const cleanLine = line.replace(timestampRegex, "").trim();
        return {
          key: index,
          seconds,
          timestampStr: match[0],
          text: cleanLine,
        };
      }
      return {
        key: index,
        seconds: null,
        timestampStr: null,
        text: line,
      };
    });
  };

  const parsedLines = parseLines(transcript.text);

  // Initialize wavesurfer
  useEffect(() => {
    if (!containerRef.current || !transcript.audioUrl) return;

    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: "rgba(99, 102, 241, 0.2)",
      progressColor: "#6366f1",
      cursorColor: "#8b5cf6",
      barWidth: 2,
      barRadius: 3,
      height: 48,
      url: transcript.audioUrl,
    });

    wavesurferRef.current = ws;

    ws.on("play", () => setIsPlaying(true));
    ws.on("pause", () => setIsPlaying(false));
    ws.on("ready", () => setDuration(ws.getDuration()));
    ws.on("audioprocess", () => setCurrentTime(ws.getCurrentTime()));
    ws.on("seeking", () => setCurrentTime(ws.getCurrentTime()));

    return () => {
      ws.destroy();
    };
  }, [transcript.audioUrl]);

  const togglePlay = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.playPause();
    }
  };

  const setSpeed = (rate: number) => {
    setPlaybackRate(rate);
    if (wavesurferRef.current) {
      wavesurferRef.current.setPlaybackRate(rate);
    }
  };

  const playFromSeconds = (seconds: number) => {
    if (wavesurferRef.current) {
      wavesurferRef.current.setTime(seconds);
      wavesurferRef.current.play();
    }
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Export functions
  const downloadTxt = () => {
    const element = document.createElement("a");
    const file = new Blob([transcript.text], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${transcript.fileName.replace(/\.[^/.]+$/, "")}-transcript.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const formatSrtTime = (seconds: number) => {
    const date = new Date(0);
    date.setSeconds(seconds);
    const timeString = date.toISOString().substr(11, 8);
    const ms = Math.floor((seconds % 1) * 1000).toString().padStart(3, "0");
    return `${timeString},${ms}`;
  };

  const downloadSrt = () => {
    let srtText = "";
    let itemIndex = 1;

    for (let i = 0; i < parsedLines.length; i++) {
      const current = parsedLines[i];
      if (current.seconds !== null) {
        const startTime = current.seconds;
        let endTime = startTime + 4; // default duration if no next timestamp

        // find next line with timestamp
        for (let j = i + 1; j < parsedLines.length; j++) {
          if (parsedLines[j].seconds !== null) {
            endTime = parsedLines[j].seconds!;
            break;
          }
        }
        
        // cap at duration if loaded
        if (duration && endTime > duration) {
          endTime = duration;
        }

        srtText += `${itemIndex}\n`;
        srtText += `${formatSrtTime(startTime)} --> ${formatSrtTime(endTime)}\n`;
        srtText += `${current.text}\n\n`;
        itemIndex++;
      }
    }

    if (!srtText) {
      // fallback to whole text if no timestamps
      srtText = `1\n00:00:00,000 --> ${formatSrtTime(duration || 60)}\n${transcript.text}`;
    }

    const element = document.createElement("a");
    const file = new Blob([srtText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${transcript.fileName.replace(/\.[^/.]+$/, "")}-transcript.srt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="card" style={{ marginBottom: "2rem" }}>
      {/* Card Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
        <div>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.25rem", color: "#fff" }}>
            {transcript.fileName}
          </h3>
          <div style={{ display: "flex", gap: "1rem", color: "var(--text-muted)", fontSize: "0.85rem" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <Calendar size={14} />
              {new Date(transcript.createdAt).toLocaleDateString()}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <Clock size={14} />
              {new Date(transcript.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        {/* Tags */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-end", maxWidth: "40%" }}>
          {tagsList.map((tag, idx) => (
            <span key={idx} className="badge-tag" style={{ display: "flex", alignItems: "center", gap: "3px" }}>
              <Tag size={10} />
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Wavesurfer Player Container */}
      {transcript.audioUrl && (
        <div className="waveform-container">
          <div ref={containerRef} />
          
          <div className="waveform-controls">
            <button 
              className="button" 
              onClick={togglePlay}
              style={{ width: "40px", height: "40px", padding: 0, borderRadius: "50%" }}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: "2px" }} />}
            </button>

            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", minWidth: "80px" }}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            {/* Speed control */}
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Speed:</span>
              <select 
                className="input" 
                value={playbackRate} 
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                style={{ width: "70px", padding: "4px 8px", fontSize: "0.85rem", background: "rgba(0, 0, 0, 0.6)" }}
              >
                <option value="0.5">0.5x</option>
                <option value="1">1.0x</option>
                <option value="1.25">1.25x</option>
                <option value="1.5">1.5x</option>
                <option value="2">2.0x</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="tabs">
        <button 
          className={`tab-btn ${activeTab === "transcript" ? "active" : ""}`}
          onClick={() => setActiveTab("transcript")}
        >
          Transcript
        </button>
        <button 
          className={`tab-btn ${activeTab === "summary" ? "active" : ""}`}
          onClick={() => setActiveTab("summary")}
        >
          AI Summary
        </button>
        <button 
          className={`tab-btn ${activeTab === "actions" ? "active" : ""}`}
          onClick={() => setActiveTab("actions")}
        >
          Action Items ({actionItemsList.length})
        </button>
      </div>

      {/* Tab Contents */}
      <div style={{ minHeight: "150px", marginBottom: "1.5rem" }}>
        {activeTab === "transcript" && (
          <div className="transcript-text">
            {parsedLines.map((line) => (
              <p key={line.key} style={{ marginBottom: "0.75rem" }}>
                {line.seconds !== null ? (
                  <span 
                    className={`timestamp-word ${Math.abs(currentTime - line.seconds) < 2 ? "active" : ""}`}
                    onClick={() => playFromSeconds(line.seconds!)}
                    style={{ 
                      color: "var(--primary)", 
                      fontWeight: 600, 
                      marginRight: "8px", 
                      fontSize: "0.85rem",
                      background: "rgba(99, 102, 241, 0.1)",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      cursor: "pointer"
                    }}
                  >
                    {line.timestampStr}
                  </span>
                ) : null}
                {line.text}
              </p>
            ))}
          </div>
        )}

        {activeTab === "summary" && (
          <div style={{ color: "#d1d5db" }}>
            {transcript.summary ? (
              <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.7 }}>
                {transcript.summary}
              </div>
            ) : (
              <p style={{ color: "var(--text-muted)" }}>No summary available.</p>
            )}
          </div>
        )}

        {activeTab === "actions" && (
          <div>
            {actionItemsList.length > 0 ? (
              <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
                {actionItemsList.map((item, idx) => (
                  <li key={idx} style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginBottom: "0.75rem", color: "#d1d5db" }}>
                    <input 
                      type="checkbox" 
                      style={{ marginTop: "4px", cursor: "pointer", accentColor: "var(--primary)" }} 
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: "var(--text-muted)" }}>No action items extracted.</p>
            )}
          </div>
        )}
      </div>

      {/* Export Footer */}
      <div style={{ display: "flex", gap: "10px", borderTop: "1px solid var(--surface-border)", paddingTop: "1.25rem" }}>
        <button className="logout-btn" onClick={downloadTxt} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <FileText size={16} />
          Export TXT
        </button>
        <button className="logout-btn" onClick={downloadSrt} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Download size={16} />
          Export SRT
        </button>
      </div>
    </div>
  );
}
