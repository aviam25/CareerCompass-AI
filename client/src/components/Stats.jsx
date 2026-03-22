import React from "react";
const stats = [
  { value:"3",    label:"Service Architecture", sub:"React · Node · Python",   icon:"🏗️" },
  { value:"100+", label:"Skills Detected",       sub:"Across all domains",       icon:"🧠" },
  { value:"JWT",  label:"Secured Auth",          sub:"Bcrypt + MongoDB",         icon:"🔐" },
  { value:"3+",   label:"Career Roles",          sub:"& expanding",              icon:"🎯" },
];
export default function Stats() {
  return (
    <section className="py-10 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s,i) => (
          <div key={i} className="glass rounded-2xl p-5 text-center">
            <div className="text-xl mb-2">{s.icon}</div>
            <div className="text-2xl font-extrabold gradient-text mb-0.5" style={{fontFamily:'Plus Jakarta Sans,sans-serif'}}>{s.value}</div>
            <div className="text-sm font-semibold mb-0.5" style={{color:"var(--text)",fontFamily:'Plus Jakarta Sans,sans-serif'}}>{s.label}</div>
            <div className="text-xs" style={{color:"var(--text-3)",fontFamily:'Plus Jakarta Sans,sans-serif'}}>{s.sub}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
