import React, { useState } from "react";

// ─── ATS score colour thresholds ─────────────────────────────
function scoreColor(n) {
  if (n >= 75) return { text: "#10b981", bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.2)" };
  if (n >= 50) return { text: "#3b6ef8", bg: "rgba(59,110,248,0.08)", border: "rgba(59,110,248,0.2)" };
  if (n >= 30) return { text: "#f59e0b", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)" };
  return       { text: "#ef4444", bg: "rgba(239,68,68,0.08)",  border: "rgba(239,68,68,0.2)"  };
}

function scoreLabel(n) {
  if (n >= 75) return "Strong";
  if (n >= 50) return "Good";
  if (n >= 30) return "Average";
  return "Weak";
}

// ─── Circular gauge ───────────────────────────────────────────
function Gauge({ score }) {
  const r       = 52;
  const circ    = 2 * Math.PI * r;
  const offset  = circ - (score / 100) * circ;
  const col     = scoreColor(score);

  return (
    <div style={{ position: "relative", width: 136, height: 136, flexShrink: 0 }}>
      <svg width="136" height="136" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="68" cy="68" r={r} fill="none"
          stroke="rgba(180,190,220,0.2)" strokeWidth="10" />
        <circle cx="68" cy="68" r={r} fill="none"
          stroke={col.text} strokeWidth="10"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)" }} />
      </svg>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
      }}>
        <span style={{
          fontSize: "1.75rem", fontWeight: 800,
          color: col.text, fontFamily: "Plus Jakarta Sans, sans-serif",
          lineHeight: 1,
        }}>{score}</span>
        <span style={{
          fontSize: "0.65rem", color: "var(--text-3)",
          fontFamily: "Plus Jakarta Sans, sans-serif",
          marginTop: 2,
        }}>/ 100</span>
      </div>
    </div>
  );
}

// ─── Single breakdown row ─────────────────────────────────────
function BreakdownRow({ label, score, max, detail }) {
  const pct = Math.round((score / max) * 100);
  const col = scoreColor(pct);

  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{
          fontSize: "0.78rem", fontWeight: 500,
          color: "var(--text-2)", fontFamily: "Plus Jakarta Sans, sans-serif",
        }}>{label}</span>
        <span style={{
          fontSize: "0.78rem", fontWeight: 700,
          color: col.text, fontFamily: "Plus Jakarta Sans, sans-serif",
        }}>{score}<span style={{ color: "var(--text-3)", fontWeight: 400 }}>/{max}</span></span>
      </div>
      <div style={{
        background: "rgba(180,190,220,0.15)", borderRadius: 999,
        height: 6, overflow: "hidden",
      }}>
        <div style={{
          height: "100%", borderRadius: 999,
          background: `linear-gradient(90deg, ${col.text}, #6c63ff)`,
          width: `${pct}%`,
          transition: "width 1s cubic-bezier(.4,0,.2,1)",
        }} />
      </div>
      {detail && (
        <p style={{
          fontSize: "0.68rem", color: "var(--text-3)",
          fontFamily: "Plus Jakarta Sans, sans-serif",
          marginTop: 3,
        }}>{detail}</p>
      )}
    </div>
  );
}

// ─── Tip cards ────────────────────────────────────────────────
function getTips(breakdown, score) {
  const tips = [];

  if ((breakdown?.verbs?.score || 0) < 12) {
    tips.push({
      icon: "✍️",
      title: "Add action verbs",
      desc: "Start bullet points with: Developed, Built, Optimised, Led, Delivered, Reduced…",
    });
  }
  if ((breakdown?.quantified?.score || 0) < 12) {
    tips.push({
      icon: "📊",
      title: "Quantify achievements",
      desc: 'Add numbers: "Reduced load time by 40%", "Managed team of 5", "Served 10k+ users"',
    });
  }
  if ((breakdown?.sections?.score || 0) < 12) {
    tips.push({
      icon: "📋",
      title: "Add missing sections",
      desc: "Include: Summary, Experience, Education, Skills, Projects, Certifications",
    });
  }
  if ((breakdown?.skills?.score || 0) < 18) {
    tips.push({
      icon: "🧠",
      title: "List more skills",
      desc: "Add a dedicated Technical Skills section with all tools, languages, and frameworks you know",
    });
  }
  if ((breakdown?.length?.words || 0) < 300) {
    tips.push({
      icon: "📝",
      title: "Expand your resume",
      desc: "Your resume is too short. ATS prefers 400–700 words. Add project descriptions and responsibilities.",
    });
  }
  if (score >= 75) {
    tips.push({
      icon: "🎉",
      title: "Great ATS score!",
      desc: "Your resume is well-optimised. Focus on tailoring keywords for each specific job description.",
    });
  }

  return tips.slice(0, 3);
}

// ─── Main component ───────────────────────────────────────────
export default function ATSReport({ atsScore, atsBreakdown }) {
  const [expanded, setExpanded] = useState(false);

  if (atsScore == null) return null;

  const col  = scoreColor(atsScore);
  const tips = getTips(atsBreakdown, atsScore);
  const bd   = atsBreakdown || {};

  return (
    <div className="glass rounded-3xl p-6" style={{ marginBottom: 0 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <p style={{
            fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.08em",
            textTransform: "uppercase", color: "var(--text-3)",
            fontFamily: "Plus Jakarta Sans, sans-serif", marginBottom: 3,
          }}>ATS Resume Score</p>
          <h3 style={{
            fontSize: "1.1rem", fontWeight: 700,
            color: "var(--text)", fontFamily: "Plus Jakarta Sans, sans-serif",
          }}>Applicant Tracking System Analysis</h3>
        </div>
        <span style={{
          fontSize: "0.72rem", fontWeight: 600,
          padding: "4px 12px", borderRadius: 999,
          background: col.bg, border: `1px solid ${col.border}`,
          color: col.text, fontFamily: "Plus Jakarta Sans, sans-serif",
        }}>{scoreLabel(atsScore)}</span>
      </div>

      {/* Gauge + quick stats */}
      <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap", marginBottom: 20 }}>
        <Gauge score={atsScore} />
        <div style={{ flex: 1, minWidth: 180 }}>
          <p style={{
            fontSize: "0.82rem", color: "var(--text-2)",
            fontFamily: "Plus Jakarta Sans, sans-serif", lineHeight: 1.6, marginBottom: 12,
          }}>
            {atsScore >= 75
              ? "Your resume passes most ATS filters. Strong chance of reaching a human recruiter."
              : atsScore >= 50
              ? "Decent ATS score. A few improvements will significantly boost your visibility."
              : atsScore >= 30
              ? "Your resume may get filtered out. Apply the tips below to improve your score."
              : "High risk of ATS rejection. Follow the recommendations below carefully."}
          </p>
          {/* Mini metric pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {[
              { label: "Skills",    v: `${bd.skills?.score || 0}/30`   },
              { label: "Verbs",     v: `${bd.verbs?.score  || 0}/20`   },
              { label: "Numbers",   v: `${bd.quantified?.score || 0}/20`},
              { label: "Sections",  v: `${bd.sections?.score  || 0}/20` },
              { label: "Length",    v: `${bd.length?.words || 0}w`      },
            ].map((m) => (
              <div key={m.label} style={{
                background: "rgba(255,255,255,0.5)",
                border: "1px solid rgba(180,190,220,0.4)",
                borderRadius: 8, padding: "4px 10px",
                display: "flex", flexDirection: "column", alignItems: "center",
              }}>
                <span style={{
                  fontSize: "0.75rem", fontWeight: 700,
                  color: "var(--text)", fontFamily: "Plus Jakarta Sans, sans-serif",
                }}>{m.v}</span>
                <span style={{
                  fontSize: "0.6rem", color: "var(--text-3)",
                  fontFamily: "Plus Jakarta Sans, sans-serif",
                }}>{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Expandable full breakdown */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: "100%", padding: "10px 16px",
          background: "rgba(59,110,248,0.05)",
          border: "1px solid rgba(59,110,248,0.15)",
          borderRadius: 12, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: expanded ? 16 : 0,
          transition: "all 0.2s",
        }}>
        <span style={{
          fontSize: "0.78rem", fontWeight: 600, color: "#3b6ef8",
          fontFamily: "Plus Jakarta Sans, sans-serif",
        }}>
          {expanded ? "Hide detailed breakdown" : "View detailed breakdown"}
        </span>
        <span style={{
          fontSize: "0.7rem", color: "#3b6ef8",
          transform: expanded ? "rotate(180deg)" : "none",
          transition: "transform 0.2s", display: "inline-block",
        }}>▼</span>
      </button>

      {expanded && (
        <div style={{
          background: "rgba(255,255,255,0.4)",
          borderRadius: 16, padding: "16px 18px", marginBottom: 16,
        }}>
          <BreakdownRow label="Skill coverage"     score={bd.skills?.score || 0}     max={30}
            detail={`${Math.round((bd.skills?.score || 0) / 30 * 100)}% of possible skill points`} />
          <BreakdownRow label="Action verbs"        score={bd.verbs?.score || 0}      max={20}
            detail={bd.verbs?.found?.length ? `Found: ${bd.verbs.found.join(", ")}` : "No action verbs detected"} />
          <BreakdownRow label="Quantified results"  score={bd.quantified?.score || 0} max={20}
            detail="Numbers, percentages, monetary values, team sizes" />
          <BreakdownRow label="Section structure"   score={bd.sections?.score || 0}   max={20}
            detail="Experience, Education, Skills, Projects, Summary detected" />
          <BreakdownRow label="Length & density"    score={bd.length?.score || 0}     max={10}
            detail={`${bd.length?.words || 0} words · Ideal range: 400–700 words`} />
        </div>
      )}

      {/* Tips */}
      {tips.length > 0 && (
        <div>
          <p style={{
            fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.06em",
            textTransform: "uppercase", color: "var(--text-3)",
            fontFamily: "Plus Jakarta Sans, sans-serif", marginBottom: 10,
          }}>Improvement tips</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {tips.map((tip, i) => (
              <div key={i} style={{
                display: "flex", gap: 12, alignItems: "flex-start",
                background: "rgba(255,255,255,0.45)",
                border: "1px solid rgba(180,190,220,0.3)",
                borderRadius: 12, padding: "10px 14px",
              }}>
                <span style={{ fontSize: "1rem", flexShrink: 0, marginTop: 1 }}>{tip.icon}</span>
                <div>
                  <p style={{
                    fontSize: "0.78rem", fontWeight: 600,
                    color: "var(--text)", fontFamily: "Plus Jakarta Sans, sans-serif",
                    marginBottom: 2,
                  }}>{tip.title}</p>
                  <p style={{
                    fontSize: "0.72rem", color: "var(--text-2)",
                    fontFamily: "Plus Jakarta Sans, sans-serif", lineHeight: 1.5,
                  }}>{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}