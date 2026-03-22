import React from "react";

export default function Hero({ onAnalyze, onHowItWorks }) {
  return (
    <section className="relative min-h-[88vh] flex items-center justify-center text-center px-6 overflow-hidden">
      <div className="relative z-10 max-w-3xl mx-auto">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 fade-up glass"
          style={{ fontSize:"0.72rem", fontWeight:600, letterSpacing:"0.08em", color:"#3b6ef8", textTransform:"uppercase" }}>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse inline-block" />
          AI-Powered Career Guidance
        </div>

        {/* Headline — mix serif italic with sans */}
        <h1 className="font-bold leading-tight mb-6 fade-up-1"
          style={{ fontSize:"clamp(2.8rem,7vw,5rem)", color:"var(--text)", fontFamily:'Plus Jakarta Sans,sans-serif' }}>
          Find your{" "}
          <span style={{ fontFamily:"'Instrument Serif',serif", fontStyle:"italic" }}
            className="gradient-text">perfect career</span>
          <br />with AI
        </h1>

        <p className="text-lg max-w-xl mx-auto mb-10 leading-relaxed fade-up-2"
          style={{ color:"var(--text-2)", fontFamily:'Plus Jakarta Sans,sans-serif' }}>
          Drop your resume. Discover your skills, gaps, and the career path built for you..
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center fade-up-3">
          <button onClick={onAnalyze} className="btn-primary px-8 py-3.5 rounded-xl text-sm">
            Analyze My Resume →
          </button>
          <button onClick={onHowItWorks} className="btn-ghost px-8 py-3.5 rounded-xl text-sm">
            See How It Works
          </button>
        </div>

        {/* Trust strip */}
        <div className="flex flex-wrap justify-center gap-3 mt-14 fade-up-4">
          {["⚡ Instant results","🎯 Role matching","🔐 JWT secured","📊 Skill gap report"].map((t,i) => (
            <span key={i} className="glass text-xs px-4 py-2 rounded-full font-medium"
              style={{ color:"var(--text-2)", fontFamily:'Plus Jakarta Sans,sans-serif' }}>{t}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
