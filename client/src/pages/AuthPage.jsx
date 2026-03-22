import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AuthPage() {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm]   = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      if (isRegister) await register(form.name, form.email, form.password);
      else await login(form.email, form.password);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      <div className="w-full max-w-md relative z-10">

        {/* Brand mark */}
        <div className="text-center mb-8 fade-up">
          <div className="inline-flex items-center gap-2.5 mb-5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-lg"
              style={{ background: "linear-gradient(135deg,#3b6ef8,#6c63ff)", fontFamily:'Plus Jakarta Sans,sans-serif' }}>C</div>
            <span className="font-bold text-xl" style={{ color:"var(--text)", fontFamily:'Plus Jakarta Sans,sans-serif' }}>CareerCompass AI</span>
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ color:"var(--text)", fontFamily:'Plus Jakarta Sans,sans-serif' }}>
            {isRegister ? "Create your account" : "Welcome back"}
          </h1>
          <p style={{ color:"var(--text-2)", fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:'0.9rem' }}>
            {isRegister ? "Start discovering your career path today" : "Sign in to continue your journey"}
          </p>
        </div>

        {/* Card */}
        <div className="glass rounded-3xl p-8 fade-up-1">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{color:"var(--text-3)"}}>Full Name</label>
                <input name="name" type="text" required value={form.name} onChange={handleChange}
                  placeholder="Avi Mishra"
                  className="input-glass w-full rounded-xl px-4 py-3 text-sm" />
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{color:"var(--text-3)"}}>Email</label>
              <input name="email" type="email" required value={form.email} onChange={handleChange}
                placeholder="you@example.com"
                className="input-glass w-full rounded-xl px-4 py-3 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{color:"var(--text-3)"}}>Password</label>
              <input name="password" type="password" required value={form.password} onChange={handleChange}
                placeholder={isRegister ? "Min. 6 characters" : "••••••••"}
                className="input-glass w-full rounded-xl px-4 py-3 text-sm" />
            </div>

            {error && (
              <div className="rounded-xl px-4 py-3 text-sm"
                style={{ background:"rgba(244,63,126,0.08)", border:"1px solid rgba(244,63,126,0.2)", color:"#e11d6a" }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="btn-primary w-full py-3.5 rounded-xl text-sm mt-1 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? "Please wait…" : isRegister ? "Create Account" : "Sign In"}
            </button>
          </form>

          <div className="mt-6 pt-5 text-center" style={{ borderTop:"1px solid var(--border-subtle)" }}>
            <p className="text-sm" style={{color:"var(--text-2)"}}>
              {isRegister ? "Already have an account?" : "Don't have an account?"}
              <button onClick={() => { setIsRegister(!isRegister); setError(""); setForm({ name:"",email:"",password:"" }); }}
                className="ml-2 font-semibold" style={{color:"#3b6ef8"}}>
                {isRegister ? "Sign in" : "Register"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
