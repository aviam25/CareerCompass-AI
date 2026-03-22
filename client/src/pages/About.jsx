import React from "react";

const timeline = [
  { step:"01", title:"Upload Resume",  desc:"Drop your PDF — drag & drop supported." },
  { step:"02", title:"NLP Extraction", desc:"Python spaCy pipeline extracts every relevant skill." },
  { step:"03", title:"Role Matching",  desc:"Scored against Frontend, Backend and Data Science roles." },
  { step:"04", title:"Get Report",     desc:"Best match, compatibility scores, missing skills — all in one view." },
];
const techStack = [
  { layer:"Frontend", items:["React.js","Tailwind CSS","Axios"],         color:"#3b6ef8" },
  { layer:"Backend",  items:["Node.js","Express.js","JWT Auth"],         color:"#6c63ff" },
  { layer:"AI / NLP", items:["Python","Flask","spaCy","pdfminer"],       color:"#0ea5c9" },
  { layer:"Database", items:["MongoDB Atlas","Mongoose"],                 color:"#10b981" },
];

export default function About() {
  return (
    <div className="min-h-screen px-6 py-14">
      <div className="max-w-5xl mx-auto space-y-20">

        {/* Hero */}
        <div className="text-center fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 text-xs font-semibold uppercase tracking-wider" style={{color:"#3b6ef8"}}>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse inline-block"/>The Project
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-5" style={{color:"var(--text)",fontFamily:'Plus Jakarta Sans,sans-serif'}}>
            Built to solve a{" "}
            <span style={{fontFamily:"'Instrument Serif',serif",fontStyle:"italic"}} className="gradient-text">real problem</span>
          </h1>
          <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{color:"var(--text-2)",fontFamily:'Plus Jakarta Sans,sans-serif'}}>
            Most career platforms tell you what jobs exist. CareerCompass AI tells you where <em>you</em> stand —
            with real skill extraction, honest match scores, and a clear gap analysis.
          </p>
        </div>

        {/* How it works */}
        <div className="fade-up-1">
          <h2 className="text-2xl font-bold text-center mb-8" style={{color:"var(--text)",fontFamily:'Plus Jakarta Sans,sans-serif'}}>
            How it{" "}
            <span style={{fontFamily:"'Instrument Serif',serif",fontStyle:"italic"}} className="gradient-text">works</span>
          </h2>
          <div className="grid md:grid-cols-4 gap-4">
            {timeline.map((t,i) => (
              <div key={i} className="glass rounded-2xl p-6">
                <div className="text-4xl font-extrabold mb-3 leading-none" style={{color:"rgba(59,110,248,0.15)",fontFamily:'Plus Jakarta Sans,sans-serif'}}>{t.step}</div>
                <h3 className="font-bold text-sm mb-1.5" style={{color:"var(--text)",fontFamily:'Plus Jakarta Sans,sans-serif'}}>{t.title}</h3>
                <p className="text-xs leading-relaxed" style={{color:"var(--text-2)",fontFamily:'Plus Jakarta Sans,sans-serif'}}>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tech stack */}
        <div className="fade-up-2">
          <h2 className="text-2xl font-bold text-center mb-8" style={{color:"var(--text)",fontFamily:'Plus Jakarta Sans,sans-serif'}}>
            Tech <span style={{fontFamily:"'Instrument Serif',serif",fontStyle:"italic"}} className="gradient-text">stack</span>
          </h2>
          <div className="grid md:grid-cols-4 gap-4">
            {techStack.map((t,i) => (
              <div key={i} className="glass rounded-2xl p-5">
                <div className="text-xs font-bold uppercase tracking-widest mb-4" style={{color:t.color}}>{t.layer}</div>
                <div className="space-y-2">
                  {t.items.map((item,j) => (
                    <div key={j} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{background:t.color}} />
                      <span className="text-sm" style={{color:"var(--text-2)",fontFamily:'Plus Jakarta Sans,sans-serif'}}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Builder */}
        <div className="fade-up-3">
          <h2 className="text-2xl font-bold text-center mb-8" style={{color:"var(--text)",fontFamily:'Plus Jakarta Sans,sans-serif'}}>
            The <span style={{fontFamily:"'Instrument Serif',serif",fontStyle:"italic"}} className="gradient-text">builder</span>
          </h2>
          <div className="glass rounded-3xl p-8 flex flex-col md:flex-row items-center md:items-start gap-6 max-w-2xl mx-auto">
            <div className="w-18 h-18 w-[72px] h-[72px] rounded-2xl flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 shadow-lg"
              style={{background:"linear-gradient(135deg,#3b6ef8,#6c63ff)",fontFamily:'Plus Jakarta Sans,sans-serif'}}>A</div>
            <div>
              <h3 className="text-xl font-bold mb-0.5" style={{color:"var(--text)",fontFamily:'Plus Jakarta Sans,sans-serif'}}>Avi Mishra</h3>
              <p className="text-sm font-medium mb-3" style={{color:"#3b6ef8"}}>Full Stack Developer</p>
              <p className="text-sm leading-relaxed mb-4" style={{color:"var(--text-2)"}}>
                Built CareerCompass AI from scratch — frontend, backend, NLP pipeline and everything in between.
              </p>
              <a href="https://github.com/aviam25" target="_blank" rel="noreferrer"
                className="btn-ghost inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.577v-2.234c-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.3-5.467-1.332-5.467-5.93 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.51 11.51 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.22.694.824.576C20.565 21.795 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                GitHub
              </a>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pb-6 fade-up-4">
          <div className="glass rounded-3xl p-8 max-w-xl mx-auto">
            <div className="text-3xl mb-3">🚀</div>
            <h3 className="font-bold text-lg mb-2" style={{color:"var(--text)",fontFamily:'Plus Jakarta Sans,sans-serif'}}>Open Source & Growing</h3>
            <p className="text-sm leading-relaxed mb-5" style={{color:"var(--text-2)"}}>
              More roles, ATS scoring, PDF reports and an AI chatbot are coming. Star the repo to follow along.
            </p>
            <a href="https://github.com/aviam25/CareerCompass-AI" target="_blank" rel="noreferrer"
              className="btn-primary inline-block px-6 py-3 rounded-xl text-sm">
              View on GitHub →
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
