import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ onNavigate, currentPage }) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const link = (page, label) => (
    <button
      onClick={() => { onNavigate(page); setMenuOpen(false); }}
      className="text-sm font-medium transition-colors"
      style={{
        color: currentPage === page ? "#3b6ef8" : "var(--text-2)",
        fontFamily: "Plus Jakarta Sans, sans-serif",
      }}>
      {label}
    </button>
  );

  return (
    <nav
      className="sticky top-0 z-50 px-6 py-3.5"
      style={{
        background: "rgba(240,242,247,0.8)",
        backdropFilter: "blur(20px) saturate(180%)",
        borderBottom: "1px solid rgba(180,190,220,0.35)",
      }}>
      <div className="max-w-6xl mx-auto flex justify-between items-center">

        {/* Logo */}
        <button
          onClick={() => onNavigate(user ? "dashboard" : "home")}
          className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow"
            style={{ background: "linear-gradient(135deg,#3b6ef8,#6c63ff)", fontFamily: "Plus Jakarta Sans, sans-serif" }}>
            C
          </div>
          <span
            className="font-bold text-base"
            style={{ color: "var(--text)", fontFamily: "Plus Jakarta Sans, sans-serif" }}>
            CareerCompass AI
          </span>
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-7">

          {/* Logged in links */}
          {user && link("dashboard", "Dashboard")}
          {user && link("analyze",   "Analyze"  )}
          {user && link("history",   "History"  )}

          {/* Always visible */}
          {link("about", "About")}

          {/* User badge + logout OR Get Started */}
          {user ? (
            <div className="flex items-center gap-3">
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
                style={{
                  background: "rgba(59,110,248,0.07)",
                  border: "1px solid rgba(59,110,248,0.15)",
                }}>
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: "linear-gradient(135deg,#3b6ef8,#6c63ff)", fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium" style={{ color: "var(--text-2)" }}>
                  {user.name.split(" ")[0]}
                </span>
              </div>
              <button
                onClick={logout}
                className="text-xs px-3 py-1.5 rounded-lg font-medium transition"
                style={{
                  color: "#e11d6a",
                  background: "rgba(244,63,126,0.07)",
                  border: "1px solid rgba(244,63,126,0.18)",
                }}>
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => document.getElementById("auth-section")?.scrollIntoView({ behavior: "smooth" })}
              className="btn-primary px-5 py-2 rounded-xl text-sm">
              Get Started
            </button>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg transition"
          style={{
            color: "var(--text-2)",
            background: menuOpen ? "rgba(59,110,248,0.08)" : "transparent",
          }}
          onClick={() => setMenuOpen(!menuOpen)}>
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            {menuOpen
              ? <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden mt-3 mx-2 mb-2 glass rounded-2xl p-4 flex flex-col gap-3">
          {user && link("dashboard", "Dashboard")}
          {user && link("analyze",   "Analyze"  )}
          {user && link("history",   "History"  )}
          {link("about", "About")}
          {user && (
            <button
              onClick={() => { logout(); setMenuOpen(false); }}
              className="text-sm font-medium text-left"
              style={{ color: "#e11d6a" }}>
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
