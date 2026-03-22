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

function AppInner() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState("home");
  const uploadRef = useRef(null);

  const navigate = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToUpload = () => {
    setCurrentPage("home");
    setTimeout(() => uploadRef.current?.scrollIntoView({ behavior:"smooth", block:"start" }), 50);
  };

  if (!user) return <AuthPage />;

  return (
    <div className="min-h-screen" style={{position:"relative"}}>
      <Navbar onNavigate={navigate} currentPage={currentPage} />

      {currentPage === "history" ? <History /> :
       currentPage === "about"   ? <About   /> :
       <>
         <Hero onAnalyze={scrollToUpload} onHowItWorks={() => navigate("about")} />
         <Stats />
         <div ref={uploadRef}><UploadResume /></div>
         <Features />
         <footer className="text-center py-10 mt-10"
           style={{ borderTop:"1px solid rgba(180,190,220,0.3)" }}>
           <p className="text-xs" style={{color:"var(--text-3)",fontFamily:'Plus Jakarta Sans,sans-serif'}}>
             © 2026 CareerCompass AI · Built by Avi Mishra
           </p>
         </footer>
       </>
      }
    </div>
  );
}

export default function App() {
  return <AuthProvider><AppInner /></AuthProvider>;
}