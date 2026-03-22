import React from "react";
const features = [
  { icon:"📄", title:"Resume Analysis",  desc:"Our NLP engine scans your PDF and extracts every relevant skill — no guesswork.",          accent:"#3b6ef8" },
  { icon:"🎯", title:"Career Matching",  desc:"Compatibility scores for Frontend, Backend, Data Science and more, calculated instantly.", accent:"#6c63ff" },
  { icon:"🔍", title:"Skill Gap Report", desc:"See exactly what's missing for your dream role and build a focused learning plan.",          accent:"#0ea5c9" },
];
export default function Features() {
  return (
    <section className="py-10 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2" style={{color:"var(--text)",fontFamily:'Plus Jakarta Sans,sans-serif'}}>
            What we <span style={{fontFamily:"'Instrument Serif',serif",fontStyle:"italic"}} className="gradient-text">offer</span>
          </h2>
          <p className="text-sm" style={{color:"var(--text-2)",fontFamily:'Plus Jakarta Sans,sans-serif'}}>Three powerful tools, one clean dashboard.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {features.map((f,i) => (
            <div key={i} className="glass rounded-2xl p-6">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-4"
                style={{ background:`${f.accent}14`, border:`1px solid ${f.accent}25` }}>{f.icon}</div>
              <h3 className="font-bold text-base mb-2" style={{color:"var(--text)",fontFamily:'Plus Jakarta Sans,sans-serif'}}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{color:"var(--text-2)",fontFamily:'Plus Jakarta Sans,sans-serif'}}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
