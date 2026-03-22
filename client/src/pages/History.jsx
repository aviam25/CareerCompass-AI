import React, { useEffect, useState } from "react";
import axios from "axios";

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/history", {
          headers: { Authorization:`Bearer ${token}` },
        });
        setHistory(Array.isArray(res.data) ? res.data : []);
      } catch { setError("Failed to load history."); }
      finally   { setLoading(false); }
    })();
  }, []);

  const deleteEntry = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/history/${id}`, {
        headers: { Authorization:`Bearer ${token}` },
      });
      setHistory(p => p.filter(h => h._id !== id));
    } catch { alert("Failed to delete."); }
  };

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 fade-up">
          <h1 className="text-3xl font-bold mb-1" style={{color:"var(--text)",fontFamily:'Plus Jakarta Sans,sans-serif'}}>
            Analysis{" "}
            <span style={{fontFamily:"'Instrument Serif',serif",fontStyle:"italic"}} className="gradient-text">History</span>
          </h1>
          <p className="text-sm" style={{color:"var(--text-2)"}}>Your past resume analyses, stored securely.</p>
        </div>

        {loading && (
          <div className="flex justify-center py-24">
            <svg className="animate-spin h-8 w-8" style={{color:"#3b6ef8"}} viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
          </div>
        )}

        {error && <div className="glass rounded-2xl p-6 text-center text-sm" style={{color:"#e11d6a"}}>{error}</div>}

        {!loading && !error && history.length === 0 && (
          <div className="glass rounded-3xl p-16 text-center fade-up">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="font-bold text-lg mb-1" style={{color:"var(--text)",fontFamily:'Plus Jakarta Sans,sans-serif'}}>No analyses yet</h3>
            <p className="text-sm" style={{color:"var(--text-2)"}}>Upload your first resume to get started.</p>
          </div>
        )}

        <div className="space-y-4">
          {history.map((entry, i) => (
            <div key={entry._id} className="glass rounded-2xl p-6 fade-up" style={{animationDelay:`${i*0.06}s`,opacity:0}}>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2.5 mb-1">
                    <span className="font-bold text-sm capitalize" style={{color:"var(--text)",fontFamily:'Plus Jakarta Sans,sans-serif'}}>
                      {entry.bestRole?.role || "Unknown Role"}
                    </span>
                    {entry.bestRole?.score >= 0 && (
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold skill-pill">
                        {entry.bestRole.score}% match
                      </span>
                    )}
                  </div>
                  <p className="text-xs" style={{color:"var(--text-3)"}}>
                    {entry.resumeName} · {new Date(entry.createdAt).toLocaleDateString("en-US",{day:"numeric",month:"short",year:"numeric"})}
                  </p>
                </div>
                <button onClick={() => deleteEntry(entry._id)}
                  className="text-xs px-3 py-1.5 rounded-lg font-medium transition"
                  style={{color:"#e11d6a",background:"rgba(244,63,126,0.06)",border:"1px solid rgba(244,63,126,0.15)"}}>
                  Delete
                </button>
              </div>

              {entry.skills?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {entry.skills.slice(0,10).map((s,j) => <span key={j} className="skill-pill">{s}</span>)}
                  {entry.skills.length > 10 && <span className="skill-pill">+{entry.skills.length-10}</span>}
                </div>
              )}

              {entry.match && Object.keys(entry.match).length > 0 && (
                <div className="grid sm:grid-cols-3 gap-3">
                  {Object.entries(entry.match).map(([role,data]) => (
                    <div key={role}>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs capitalize" style={{color:"var(--text-2)"}}>{role}</span>
                        <span className="text-xs font-semibold" style={{color:"var(--text)"}}>{data.score}%</span>
                      </div>
                      <div className="progress-track">
                        <div className="progress-fill" style={{width:`${data.score}%`}} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
