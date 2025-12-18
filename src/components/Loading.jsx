import React from "react";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center relative overflow-hidden font-sans">
      
      {/* 1. AMBIENT BACKGROUND GLOWS (Breathing) */}
      <div className="absolute inset-0 pointer-events-none">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[120px]"
          />
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[120px]"
          />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        
        {/* 2. THE CORE (Central Animated Element) */}
        <div className="relative w-32 h-32 flex items-center justify-center">
            
            {/* Outer Spinning Ring */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-indigo-500 border-r-indigo-500/30"
            ></motion.div>

            {/* Inner Reverse Spinning Ring */}
            <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                className="absolute inset-2 rounded-full border-[3px] border-transparent border-b-blue-500 border-l-blue-500/30"
            ></motion.div>

            {/* Central Glowing Orb */}
            <motion.div 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-blue-500 rounded-full shadow-[0_0_30px_rgba(79,70,229,0.5)] flex items-center justify-center text-white"
            >
                <Activity size={32} />
            </motion.div>

            {/* Orbiting Dot */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[-10px]"
            >
                <div className="w-3 h-3 bg-indigo-600 rounded-full shadow-lg shadow-indigo-400 absolute top-0 left-1/2 -translate-x-1/2"></div>
            </motion.div>
        </div>

        {/* 3. TYPOGRAPHY & STATUS */}
        <div className="mt-12 text-center">
            <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xl font-bold text-slate-800 tracking-tight"
            >
                Health<span className="text-indigo-600">OS</span>
            </motion.h2>
            
            <div className="flex items-center gap-2 mt-2 justify-center">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">Synchronizing Biometrics</p>
            </div>
        </div>

        {/* 4. PROGRESS LINE (Apple Style) */}
        <div className="mt-8 w-48 h-1 bg-slate-200 rounded-full overflow-hidden">
            <motion.div 
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-full h-full bg-gradient-to-r from-transparent via-indigo-600 to-transparent"
            />
        </div>

      </div>
    </div>
  );
}