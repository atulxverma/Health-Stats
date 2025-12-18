import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";

export default function ErrorPage() {
  const handleReload = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 relative">
      
      <div className="text-center max-w-md relative z-10">
        
        {/* Error Icon */}
        <motion.div 
          initial={{ rotate: 0 }}
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-xl"
        >
            <AlertTriangle size={40} className="text-rose-500" />
        </motion.div>

        <h1 className="text-3xl font-bold text-slate-900 mb-2">System Malfunction</h1>
        <p className="text-slate-500 mb-8">
          Something went wrong while processing your health data. Our systems have flagged this issue.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
                onClick={handleReload}
                className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg"
            >
                <RefreshCcw size={18} /> Reload App
            </button>
            
            <button 
                onClick={handleGoHome}
                className="bg-white text-slate-700 border border-slate-200 px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"
            >
                <Home size={18} /> Go Home
            </button>
        </div>

        {/* Technical Code (Just for looks) */}
        <div className="mt-12 bg-slate-900 rounded-xl p-4 text-left shadow-inner overflow-hidden relative">
            <div className="flex gap-1.5 mb-3">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <p className="font-mono text-[10px] text-green-400">
                <span className="text-blue-400">Error:</span> Uncaught Exception<br/>
                <span className="text-slate-500">{`at App.render (<anonymous>:12:4)`}</span><br/>
                <span className="text-slate-500">{`at React.crash (main.chunk.js:5)`}</span>
            </p>
        </div>

      </div>
    </div>
  );
}