import React, { useState, useRef } from "react";
import axios from "axios";

export default function UploadResume() {
  const [file, setFile]           = useState(null);
  const [isDragging, setDragging] = useState(false);
  const [skills, setSkills]       = useState([]);
  const [matchData, setMatchData] = useState({});
  const [bestRole, setBestRole]   = useState(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const fileRef = useRef();
  const token   = localStorage.getItem("token");

  const handleFile = (f) => {
    if (f?.type === "application/pdf") { setFile(f); setError(""); }
    else setError("Please upload a valid PDF file.");
  };

  const handleUpload = async () => {
    if (!file) { setError("Please select a resume first."); return; }
    const fd = new FormData();
    fd.append("resume", file);
    try {
      setLoading(true); setError("");
      setSkills([]); setMatchData({}); setBestRole(null);
      const res = await axios.post("http://localhost:5000/upload", fd, {
        headers: token ? { Authorization:`Bearer ${token}` } : {},
      });
      setSkills(res.data.skills || []);
      setMatchData(res.data.match || {});
      setBestRole(res.data.bestRole);
    } catch (err) {
      if (err.response?.status === 401) { localStorage.removeItem("token"); window.location.reload(); }
      setError("Upload failed. Is the NLP server running?");
    } finally { setLoading(false); }
  };

  const scoreColor = (s) => {
    const n = parseInt(s);
    if (n >= 70) return "#3b6ef8";
    if (n >= 40) return "#6c63ff";
    return "#94a3b8";
  };

  const hasResults = skills.length > 0 || Object.keys(matchData).length > 0;

  return (
    <section className="py-8 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Upload card */}
        <div className="glass rounded-3xl p-8 mb-6">
          <h2 className="text-xl font-bold mb-1" style={{color:"var(--text)",fontFamily:'Plus Jakarta Sans,sans-serif'}}>Analyze Your Resume</h2>
          <p className="text-sm mb-6" style={{color:"var(--text-2)",fontFamily:'Plus Jakarta Sans,sans-serif'}}>Upload a PDF and get your career match report in seconds.</p>

          {/* Drop zone */}
          <div
            onClick={() => fileRef.current.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
            className="cursor-pointer rounded-2xl p-10 text-center transition-all duration-200"
            style={{
              border: `2px dashed ${isDragging ? "#3b6ef8" : file ? "rgba(59,110,248,0.4)" : "rgba(180,190,220,0.5)"}`,
              background: isDragging ? "rgba(59,110,248,0.04)" : "rgba(255,255,255,0.4)",
              boxShadow: isDragging ? "0 0 0 4px rgba(59,110,248,0.08)" : "none",
            }}>
            <input ref={fileRef} type="file" accept=".pdf" className="hidden"
              onChange={(e) => handleFile(e.target.files[0])} />
            <div className="text-3xl mb-3">{file ? "📄" : "☁️"}</div>
            {file ? (
              <>
                <p className="text-sm font-semibold" style={{color:"#3b6ef8",fontFamily:'Plus Jakarta Sans,sans-serif'}}>{file.name}</p>
                <p className="text-xs mt-1" style={{color:"var(--text-3)"}}>{(file.size/1024).toFixed(1)} KB · Click to change</p>
              </>
            ) : (
              <>
                <p className="text-sm font-medium" style={{color:"var(--text-2)",fontFamily:'Plus Jakarta Sans,sans-serif'}}>Drop your resume here</p>
                <p className="text-xs mt-1" style={{color:"var(--text-3)"}}>or click to browse · PDF only</p>
              </>
            )}
          </div>

          {error && (
            <div className="mt-4 rounded-xl px-4 py-3 text-sm"
              style={{ background:"rgba(244,63,126,0.07)", border:"1px solid rgba(244,63,126,0.18)", color:"#e11d6a" }}>{error}</div>
          )}

          <button onClick={handleUpload} disabled={loading || !file}
            className="btn-primary w-full mt-4 py-3.5 rounded-xl text-sm disabled:opacity-40 disabled:cursor-not-allowed">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Analyzing…
              </span>
            ) : "Analyze Resume →"}
          </button>
        </div>

        {/* Results */}
        {hasResults && (
          <div className="space-y-5">

            {/* Best match banner */}
            {bestRole && (
              <div className="glass rounded-3xl p-6 flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{color:"var(--text-3)"}}>Best Career Match</p>
                  <h3 className="text-xl font-bold capitalize gradient-text" style={{fontFamily:'Plus Jakarta Sans,sans-serif'}}>
                    {matchData[bestRole.role]?.emoji} {bestRole.role}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-4xl font-extrabold gradient-text" style={{fontFamily:'Plus Jakarta Sans,sans-serif'}}>{bestRole.score}%</span>
                  <p className="text-xs mt-0.5" style={{color:"var(--text-3)"}}>compatibility</p>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-5">

              {/* Skills */}
              {skills.length > 0 && (
                <div className="glass rounded-2xl p-6">
                  <h3 className="font-bold text-sm mb-3 flex items-center gap-2" style={{color:"var(--text)",fontFamily:'Plus Jakarta Sans,sans-serif'}}>
                    🧠 Extracted Skills
                    <span className="ml-auto text-xs font-normal" style={{color:"var(--text-3)"}}>{skills.length} found</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((s,i) => <span key={i} className="skill-pill">{s}</span>)}
                  </div>
                </div>
              )}

              {/* Career Match */}
              {Object.keys(matchData).length > 0 && (
                <div className="glass rounded-2xl p-6">
                  <h3 className="font-bold text-sm mb-4" style={{color:"var(--text)",fontFamily:'Plus Jakarta Sans,sans-serif'}}>🎯 Career Match</h3>
                  <div className="space-y-4">
                    {Object.entries(matchData)
                      .sort((a, b) => parseInt(b[1].score) - parseInt(a[1].score))
                      .map(([role, data]) => (
                      <div key={role}>
                        <div className="flex justify-between mb-1.5">
                          <span className="text-sm font-medium capitalize" style={{color:"var(--text)",fontFamily:'Plus Jakarta Sans,sans-serif'}}>
                            {data.emoji} {role}
                          </span>
                          <span className="text-sm font-bold" style={{color:scoreColor(data.score)}}>{data.score}%</span>
                        </div>
                        <div className="progress-track">
                          <div className="progress-fill" style={{width:`${data.score}%`, background:`linear-gradient(90deg, ${scoreColor(data.score)}, #6c63ff)`}} />
                        </div>
                        {data.missing?.length > 0 && (
                          <p className="text-xs mt-1" style={{color:"var(--text-3)"}}>
                            Missing: {data.missing.slice(0, 4).join(", ")}{data.missing.length > 4 ? ` +${data.missing.length - 4} more` : ""}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}
      </div>
    </section>
  );
}
