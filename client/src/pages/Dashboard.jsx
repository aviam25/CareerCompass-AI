import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

export default function Dashboard({ onNavigate }) {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, topRole: null, lastAnalysis: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get("http://localhost:5000/api/history", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(({ data }) => {
      const analyses = Array.isArray(data) ? data : [];
      const total = analyses.length;

      // Find most frequent best role
      const roleCount = {};
      analyses.forEach(a => {
        const r = a.bestRole?.role;
        if (r) roleCount[r] = (roleCount[r] || 0) + 1;
      });
      const topRole = Object.entries(roleCount).sort((a,b) => b[1]-a[1])[0]?.[0] || null;
      const lastAnalysis = analyses[0] || null;

      setStats({ total, topRole, lastAnalysis });
    })
    .catch(() => {})
    .finally(() => setLoading(false));
  }, []);

  const firstName = user?.name?.split(" ")[0] || "there";

  const featureCards = [
    { emoji: "🧠", title: "NLP Skill Extraction", desc: "spaCy + TF-IDF ranks your skills by relevance from your resume text." },
    { emoji: "🎯", title: "Role Matching", desc: "Your skills are matched against 10 career roles with compatibility scores." },
    { emoji: "⚠️", title: "Skill Gap Analysis", desc: "See exactly which skills you're missing for each career path." },
    { emoji: "⭐", title: "Best Role Recommendation", desc: "The role with the highest compatibility is highlighted as your best match." },
    { emoji: "🕓", title: "Analysis History", desc: "Every analysis is saved so you can track your growth over time." },
    { emoji: "🔐", title: "Secure & Private", desc: "Your data is protected with JWT auth and stored under your account only." },
  ];

  const sampleSkills = ["react", "python", "node", "mongodb", "express", "git", "javascript", "flask"];
  const sampleRoles  = [
    { emoji: "💻", role: "Fullstack Developer", score: 84 },
    { emoji: "⚙️", role: "Backend Developer",  score: 72 },
    { emoji: "📊", role: "Data Scientist",      score: 45 },
  ];

  return (
    <div className="px-6 py-10 max-w-6xl mx-auto space-y-10">

      {/* ── Welcome Header ── */}
      <div className="glass rounded-3xl p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-2"
            style={{ color: "var(--text-3)", fontFamily: "Plus Jakarta Sans, sans-serif" }}>
            Welcome back
          </p>
          <h1 className="text-3xl font-extrabold mb-2"
            style={{ color: "var(--text)", fontFamily: "Plus Jakarta Sans, sans-serif" }}>
            Hey, {firstName} 👋
          </h1>
          <p className="text-sm" style={{ color: "var(--text-2)", fontFamily: "Plus Jakarta Sans, sans-serif" }}>
            Ready to discover your best career path? Upload your resume and get instant AI-powered insights.
          </p>
        </div>
        <button
          onClick={() => onNavigate("analyze")}
          className="btn-primary px-8 py-3.5 rounded-xl text-sm whitespace-nowrap">
          Analyze My Resume →
        </button>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-5 text-center">
          <p className="text-3xl font-extrabold gradient-text"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
            {loading ? "—" : stats.total}
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--text-3)", fontFamily: "Plus Jakarta Sans, sans-serif" }}>
            Analyses Done
          </p>
        </div>
        <div className="glass rounded-2xl p-5 text-center">
          <p className="text-lg font-extrabold gradient-text capitalize"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
            {loading ? "—" : stats.topRole || "None yet"}
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--text-3)", fontFamily: "Plus Jakarta Sans, sans-serif" }}>
            Top Matched Role
          </p>
        </div>
        <div className="glass rounded-2xl p-5 text-center col-span-2 md:col-span-1">
          <p className="text-lg font-extrabold gradient-text"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
            {loading ? "—" : stats.lastAnalysis
              ? new Date(stats.lastAnalysis.createdAt).toLocaleDateString("en-IN", { day:"numeric", month:"short" })
              : "Never"}
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--text-3)", fontFamily: "Plus Jakarta Sans, sans-serif" }}>
            Last Analysis
          </p>
        </div>
      </div>

      {/* ── Preview Section ── */}
      <div className="glass rounded-3xl p-8">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1"
          style={{ color: "var(--text-3)", fontFamily: "Plus Jakarta Sans, sans-serif" }}>
          Sample Result Preview
        </p>
        <h2 className="text-xl font-bold mb-6"
          style={{ color: "var(--text)", fontFamily: "Plus Jakarta Sans, sans-serif" }}>
          Here's what your analysis will look like
        </h2>

        <div className="grid md:grid-cols-2 gap-6">

          {/* Sample Skills */}
          <div style={{ background: "rgba(255,255,255,0.5)", borderRadius: "16px", padding: "20px" }}>
            <p className="text-sm font-bold mb-3 flex items-center gap-2"
              style={{ color: "var(--text)", fontFamily: "Plus Jakarta Sans, sans-serif" }}>
              🧠 Extracted Skills
              <span className="ml-auto text-xs font-normal" style={{ color: "var(--text-3)" }}>
                {sampleSkills.length} found
              </span>
            </p>
            <div className="flex flex-wrap gap-2">
              {sampleSkills.map((s, i) => (
                <span key={i} className="skill-pill">{s}</span>
              ))}
            </div>
          </div>

          {/* Sample Roles */}
          <div style={{ background: "rgba(255,255,255,0.5)", borderRadius: "16px", padding: "20px" }}>
            <p className="text-sm font-bold mb-4"
              style={{ color: "var(--text)", fontFamily: "Plus Jakarta Sans, sans-serif" }}>
              🎯 Career Match
            </p>
            <div className="space-y-4">
              {sampleRoles.map(({ emoji, role, score }) => (
                <div key={role}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-sm font-medium capitalize"
                      style={{ color: "var(--text)", fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                      {emoji} {role}
                    </span>
                    <span className="text-sm font-bold" style={{ color: "#3b6ef8" }}>{score}%</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill"
                      style={{ width: `${score}%`, background: "linear-gradient(90deg,#3b6ef8,#6c63ff)" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        <button
          onClick={() => onNavigate("analyze")}
          className="btn-primary w-full mt-6 py-3.5 rounded-xl text-sm">
          Get Your Real Analysis →
        </button>
      </div>

      {/* ── Feature Cards ── */}
      <div>
        <h2 className="text-xl font-bold mb-6"
          style={{ color: "var(--text)", fontFamily: "Plus Jakarta Sans, sans-serif" }}>
          What CareerCompass AI does for you
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {featureCards.map(({ emoji, title, desc }) => (
            <div key={title} className="glass rounded-2xl p-5">
              <div className="text-2xl mb-3">{emoji}</div>
              <h3 className="font-bold text-sm mb-2"
                style={{ color: "var(--text)", fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                {title}
              </h3>
              <p className="text-xs leading-relaxed"
                style={{ color: "var(--text-2)", fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Quick Links ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Analyze Resume", emoji: "📄", page: "analyze" },
          { label: "View History",   emoji: "🕓", page: "history" },
          { label: "About Project",  emoji: "ℹ️",  page: "about"   },
          { label: "My Profile",     emoji: "👤", page: "profile"  },
        ].map(({ label, emoji, page }) => (
          <button key={page}
            onClick={() => onNavigate(page)}
            className="glass rounded-2xl p-5 text-center hover:scale-105 transition-transform duration-200">
            <div className="text-2xl mb-2">{emoji}</div>
            <p className="text-xs font-semibold"
              style={{ color: "var(--text)", fontFamily: "Plus Jakarta Sans, sans-serif" }}>
              {label}
            </p>
          </button>
        ))}
      </div>

      {/* Footer */}
      <footer className="text-center py-6" style={{ borderTop: "1px solid rgba(180,190,220,0.3)" }}>
        <p className="text-xs" style={{ color: "var(--text-3)", fontFamily: "Plus Jakarta Sans, sans-serif" }}>
          © 2026 CareerCompass AI · Built by Avi Mishra
        </p>
      </footer>

    </div>
  );
}
