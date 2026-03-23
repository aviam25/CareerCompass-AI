import React, { useState, useRef, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import UploadResume from "./pages/UploadResume";
import Stats from "./components/Stats";
import Features from "./components/Features";
import History from "./pages/History";
import AuthPage from "./pages/AuthPage";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";

function AppInner() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState("home");
  const uploadRef = useRef(null);

  // Scroll to top whenever page changes
  const navigate = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Scroll to top immediately when user logs in
  useEffect(() => {
    if (user) {
      window.scrollTo({ top: 0, behavior: "instant" });
      setCurrentPage("dashboard");
    }
  }, [user]);

  // Show nothing while checking token
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div style={{
          width: 40, height: 40, borderRadius: "50%",
          border: "3px solid rgba(59,110,248,0.2)",
          borderTopColor: "#3b6ef8",
          animation: "spin 0.8s linear infinite"
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ── Not logged in → Auth page first, landing below ────────
  if (!user) {
    return (
      <div className="min-h-screen" style={{ position: "relative" }}>

        {/* Minimal public navbar */}
        <nav className="sticky top-0 z-50 px-6 py-3.5"
          style={{
            background: "rgba(240,242,247,0.8)",
            backdropFilter: "blur(20px) saturate(180%)",
            borderBottom: "1px solid rgba(180,190,220,0.35)"
          }}>
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow"
                style={{ background: "linear-gradient(135deg,#3b6ef8,#6c63ff)", fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                C
              </div>
              <span className="font-bold text-base"
                style={{ color: "var(--text)", fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                CareerCompass AI
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => document.getElementById("auth-section")?.scrollIntoView({ behavior: "smooth" })}
                className="text-sm font-medium"
                style={{ color: "var(--text-2)", fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                Sign In
              </button>
              <button
                onClick={() => document.getElementById("auth-section")?.scrollIntoView({ behavior: "smooth" })}
                className="btn-primary px-5 py-2 rounded-xl text-sm">
                Get Started
              </button>
            </div>
          </div>
        </nav>

        <Hero onAnalyze={() => document.getElementById("auth-section")?.scrollIntoView({ behavior: "smooth" })}
              onHowItWorks={() => document.getElementById("landing-features")?.scrollIntoView({ behavior: "smooth" })} />

        <div id="auth-section">
          <AuthPage />
        </div>

        <div id="landing-features">
          <Stats />
          <Features />
        </div>

        <footer className="text-center py-10"
          style={{ borderTop: "1px solid rgba(180,190,220,0.3)" }}>
          <p className="text-xs"
            style={{ color: "var(--text-3)", fontFamily: "Plus Jakarta Sans, sans-serif" }}>
            © 2026 CareerCompass AI · Built by Avi Mishra
          </p>
        </footer>
      </div>
    );
  }

  // ── Logged in ─────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ position: "relative" }}>
      <Navbar onNavigate={navigate} currentPage={currentPage} />

      {(currentPage === "home" || currentPage === "dashboard") &&
        <Dashboard onNavigate={navigate} />
      }

      {currentPage === "analyze" &&
        <div>
          <div className="px-8 pt-10 pb-2 max-w-5xl mx-auto">
            <h1 className="text-2xl font-extrabold"
              style={{ color: "var(--text)", fontFamily: "Plus Jakarta Sans, sans-serif" }}>
              Resume Analysis
            </h1>
            <p className="text-sm mt-1 mb-2"
              style={{ color: "var(--text-2)", fontFamily: "Plus Jakarta Sans, sans-serif" }}>
              Upload your PDF resume and get your career match report instantly.
            </p>
          </div>
          <div ref={uploadRef}>
            <UploadResume />
          </div>
        </div>
      }

      {currentPage === "history" && <History />}
      {currentPage === "about"   && <About   />}
    </div>
  );
}

export default function App() {
  return <AuthProvider><AppInner /></AuthProvider>;
}