import React, { useState, useRef } from "react";
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
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState("home");
  const uploadRef = useRef(null);

  const navigate = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Not logged in → show public landing + auth ─────────────
  if (!user) {
    return (
      <div className="min-h-screen" style={{ position: "relative" }}>
        <Hero onAnalyze={() => {}} onHowItWorks={() => {}} />
        <Stats />
        <Features />
        <div id="auth-section">
          <AuthPage />
        </div>
        <footer className="text-center py-10 mt-10"
          style={{ borderTop: "1px solid rgba(180,190,220,0.3)" }}>
          <p className="text-xs"
            style={{ color: "var(--text-3)", fontFamily: "Plus Jakarta Sans, sans-serif" }}>
            © 2026 CareerCompass AI · Built by Avi Mishra
          </p>
        </footer>
      </div>
    );
  }

  // ── Logged in → dashboard is default landing ───────────────
  return (
    <div className="min-h-screen" style={{ position: "relative" }}>
      <Navbar onNavigate={navigate} currentPage={currentPage} />

      {/* Dashboard — default after login */}
      {(currentPage === "home" || currentPage === "dashboard") &&
        <Dashboard onNavigate={navigate} />
      }

      {/* Resume Analysis — separate page */}
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

      {/* History */}
      {currentPage === "history" && <History />}

      {/* About */}
      {currentPage === "about" && <About />}

    </div>
  );
}

export default function App() {
  return <AuthProvider><AppInner /></AuthProvider>;
}