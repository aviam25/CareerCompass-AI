import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

// ─── Markdown-lite renderer ───────────────────────────────────
function renderMarkdown(text) {
  if (!text) return "";
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^(\d+)\.\s/gm, "<span style='color:#3b6ef8;font-weight:600'>$1.</span> ")
    .replace(/\n/g, "<br/>");
}

// ─── Suggestion chips ─────────────────────────────────────────
const SUGGESTIONS = [
  "What's my biggest skill gap?",
  "Give me a learning roadmap",
  "How do I improve my ATS score?",
  "What jobs suit my profile?",
  "Which skills should I learn first?",
  "Review my resume weaknesses",
];

// ─── Single message bubble ────────────────────────────────────
function Message({ msg }) {
  const isUser = msg.role === "user";

  return (
    <div style={{
      display: "flex",
      justifyContent: isUser ? "flex-end" : "flex-start",
      marginBottom: 10,
    }}>
      {!isUser && (
        <div style={{
          width: 26, height: 26, borderRadius: 8, flexShrink: 0,
          background: "linear-gradient(135deg,#3b6ef8,#6c63ff)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "0.65rem", fontWeight: 700, color: "#fff",
          marginRight: 8, marginTop: 2,
          fontFamily: "Plus Jakarta Sans, sans-serif",
        }}>AI</div>
      )}
      <div style={{
        maxWidth: "82%",
        padding: "9px 13px",
        borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
        background: isUser
          ? "linear-gradient(135deg,#3b6ef8,#6c63ff)"
          : "rgba(255,255,255,0.65)",
        border: isUser ? "none" : "1px solid rgba(180,190,220,0.4)",
        backdropFilter: "blur(8px)",
        fontSize: "0.78rem",
        color: isUser ? "#fff" : "var(--text)",
        fontFamily: "Plus Jakarta Sans, sans-serif",
        lineHeight: 1.55,
      }}
        dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
      />
    </div>
  );
}

// ─── Typing indicator ─────────────────────────────────────────
function TypingDots() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
      <div style={{
        width: 26, height: 26, borderRadius: 8, flexShrink: 0,
        background: "linear-gradient(135deg,#3b6ef8,#6c63ff)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "0.65rem", fontWeight: 700, color: "#fff",
        fontFamily: "Plus Jakarta Sans, sans-serif",
      }}>AI</div>
      <div style={{
        padding: "10px 14px", borderRadius: "16px 16px 16px 4px",
        background: "rgba(255,255,255,0.65)", border: "1px solid rgba(180,190,220,0.4)",
        display: "flex", gap: 4, alignItems: "center",
      }}>
        {[0, 0.18, 0.36].map((delay, i) => (
          <div key={i} style={{
            width: 6, height: 6, borderRadius: "50%",
            background: "#3b6ef8", opacity: 0.6,
            animation: "bounce 1s infinite",
            animationDelay: `${delay}s`,
          }} />
        ))}
      </div>
      <style>{`
        @keyframes bounce {
          0%,80%,100% { transform:translateY(0); }
          40%          { transform:translateY(-5px); }
        }
      `}</style>
    </div>
  );
}

// ─── Main Agent component ─────────────────────────────────────
export default function CareerAgent({ skills, atsScore, atsBreakdown, bestRole, matchData }) {
  const [open,    setOpen]    = useState(false);
  const [input,   setInput]   = useState("");
  const [messages, setMessages] = useState([
    {
      role:    "assistant",
      content: `Hey! I'm your AI career coach 👋\n\nI've analysed your resume — **${skills?.length || 0} skills detected**, ATS score **${atsScore || 0}/100**, best match **${bestRole?.role || "loading…"}**.\n\nAsk me anything about your skill gaps, what to learn next, or how to improve your resume.`,
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);
  const token     = localStorage.getItem("token");

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const send = async (text) => {
    const content = (text || input).trim();
    if (!content || loading) return;

    setInput("");
    setError("");
    const newMessages = [...messages, { role: "user", content }];
    setMessages(newMessages);
    setLoading(true);

    // Build history for API (exclude first welcome message)
    const history = newMessages.slice(1, -1).map((m) => ({
      role:    m.role === "assistant" ? "assistant" : "user",
      content: m.content,
    }));

    try {
      const res = await axios.post(
        "http://localhost:5000/api/agent/chat",
        {
          message:      content,
          skills:       skills     || [],
          atsScore:     atsScore   || 0,
          atsBreakdown: atsBreakdown || {},
          bestRole:     bestRole   || {},
          match:        matchData  || {},
          history,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 35000,
        }
      );

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.data.reply },
      ]);
    } catch (err) {
      const errMsg =
        err.response?.data?.reply ||
        (err.code === "ECONNABORTED" ? "Request timed out. Try again." : "Something went wrong.");
      setError(errMsg);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `⚠️ ${errMsg}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const clearChat = () => {
    setMessages([{
      role:    "assistant",
      content: `Chat cleared. I still have your resume data — **${skills?.length || 0} skills**, ATS **${atsScore || 0}/100**. What would you like to know?`,
    }]);
    setError("");
  };

  return (
    <>
      {/* ── Floating toggle button ── */}
      <button
        onClick={() => setOpen(!open)}
        title="AI Career Coach"
        style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 1000,
          width: 52, height: 52, borderRadius: 16,
          background: open ? "rgba(239,68,68,0.12)" : "linear-gradient(135deg,#3b6ef8,#6c63ff)",
          border: open ? "1px solid rgba(239,68,68,0.25)" : "none",
          boxShadow: open ? "none" : "0 8px 28px rgba(59,110,248,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", transition: "all 0.25s",
          fontSize: "1.2rem",
        }}
      >
        {open
          ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
        }
      </button>

      {/* ── Chat panel ── */}
      {open && (
        <div style={{
          position: "fixed", bottom: 88, right: 24, zIndex: 999,
          width: 360, borderRadius: 20,
          background: "rgba(240,242,247,0.92)",
          backdropFilter: "blur(24px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.75)",
          boxShadow: "0 20px 60px rgba(60,80,160,0.18)",
          display: "flex", flexDirection: "column",
          overflow: "hidden",
          maxHeight: "min(560px, calc(100vh - 120px))",
        }}>

          {/* Header */}
          <div style={{
            padding: "14px 16px",
            borderBottom: "1px solid rgba(180,190,220,0.35)",
            display: "flex", alignItems: "center", gap: 10,
            background: "rgba(255,255,255,0.5)",
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10, flexShrink: 0,
              background: "linear-gradient(135deg,#3b6ef8,#6c63ff)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a10 10 0 110 20A10 10 0 0112 2z"/>
                <path d="M12 16v-4M12 8h.01"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{
                fontSize: "0.82rem", fontWeight: 700, color: "var(--text)",
                fontFamily: "Plus Jakarta Sans, sans-serif", lineHeight: 1.2,
              }}>AI Career Coach</p>
              <p style={{ fontSize: "0.65rem", color: "#10b981", fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                ● Online · Powered by GPT-3.5
              </p>
            </div>
            <button onClick={clearChat} title="Clear chat" style={{
              background: "transparent", border: "none", cursor: "pointer",
              padding: 4, borderRadius: 6, color: "var(--text-3)",
              fontSize: "0.65rem", fontFamily: "Plus Jakarta Sans, sans-serif",
            }}>Clear</button>
          </div>

          {/* Context pills */}
          <div style={{
            padding: "8px 14px",
            borderBottom: "1px solid rgba(180,190,220,0.25)",
            display: "flex", gap: 6, flexWrap: "wrap",
            background: "rgba(255,255,255,0.3)",
          }}>
            {[
              { label: `${skills?.length || 0} skills`, color: "#3b6ef8" },
              { label: `ATS ${atsScore || 0}/100`,      color: atsScore >= 75 ? "#10b981" : atsScore >= 50 ? "#3b6ef8" : "#f59e0b" },
              { label: bestRole?.role || "—",            color: "#6c63ff" },
            ].map((p) => (
              <span key={p.label} style={{
                fontSize: "0.65rem", fontWeight: 600, padding: "2px 8px",
                borderRadius: 999, background: `${p.color}12`,
                border: `1px solid ${p.color}25`, color: p.color,
                fontFamily: "Plus Jakarta Sans, sans-serif",
              }}>{p.label}</span>
            ))}
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: "auto", padding: "14px 14px 4px",
            scrollbarWidth: "thin",
          }}>
            {messages.map((m, i) => <Message key={i} msg={m} />)}
            {loading && <TypingDots />}
            <div ref={bottomRef} />
          </div>

          {/* Suggestion chips (only when no user messages yet) */}
          {messages.length === 1 && !loading && (
            <div style={{
              padding: "0 12px 10px",
              display: "flex", flexWrap: "wrap", gap: 5,
            }}>
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => send(s)} style={{
                  fontSize: "0.67rem", fontWeight: 500,
                  padding: "4px 10px", borderRadius: 999,
                  background: "rgba(59,110,248,0.07)",
                  border: "1px solid rgba(59,110,248,0.18)",
                  color: "#3b6ef8", cursor: "pointer",
                  fontFamily: "Plus Jakarta Sans, sans-serif",
                  transition: "background 0.15s",
                }}>{s}</button>
              ))}
            </div>
          )}

          {/* Input bar */}
          <div style={{
            padding: "10px 12px",
            borderTop: "1px solid rgba(180,190,220,0.35)",
            display: "flex", gap: 8, alignItems: "flex-end",
            background: "rgba(255,255,255,0.5)",
          }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask about your gaps, roadmap, ATS…"
              rows={1}
              style={{
                flex: 1, resize: "none", border: "1px solid rgba(180,190,220,0.45)",
                borderRadius: 12, padding: "9px 12px",
                background: "rgba(255,255,255,0.7)",
                fontSize: "0.78rem", color: "var(--text)",
                fontFamily: "Plus Jakarta Sans, sans-serif",
                outline: "none", lineHeight: 1.45,
                maxHeight: 90, overflowY: "auto",
              }}
            />
            <button
              onClick={() => send()}
              disabled={loading || !input.trim()}
              style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: loading || !input.trim()
                  ? "rgba(180,190,220,0.3)"
                  : "linear-gradient(135deg,#3b6ef8,#6c63ff)",
                border: "none", cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke={loading || !input.trim() ? "rgba(100,110,140,0.5)" : "#fff"}
                strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/>
              </svg>
            </button>
          </div>

          {/* Token note */}
          <p style={{
            textAlign: "center", fontSize: "0.58rem", color: "var(--text-3)",
            fontFamily: "Plus Jakarta Sans, sans-serif",
            padding: "4px 0 8px", background: "rgba(255,255,255,0.3)",
          }}>
            GPT-3.5 · ~$0.001 per message · your OpenAI key
          </p>
        </div>
      )}
    </>
  );
}