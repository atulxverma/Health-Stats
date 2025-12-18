import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, MapPinOff, Activity } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 text-center"
      >
        {/* Animated Icon */}
        <div className="relative w-32 h-32 mx-auto mb-8 flex items-center justify-center">
            <div className="absolute inset-0 bg-indigo-100 rounded-full animate-ping opacity-75"></div>
            <div className="relative z-10 bg-white p-6 rounded-full shadow-xl shadow-indigo-200">
                <MapPinOff size={48} className="text-indigo-600" />
            </div>
        </div>

        <h1 className="text-8xl font-black text-slate-900 tracking-tighter mb-2">404</h1>
        <h2 className="text-2xl font-bold text-slate-700 mb-4">Off the grid?</h2>
        <p className="text-slate-500 max-w-md mx-auto mb-8 text-lg">
          It looks like you've wandered into uncharted territory. This page doesn't exist in our training plan.
        </p>

        <div className="flex justify-center gap-4">
            <Link to="/">
                <button className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 hover:scale-105 transition-all shadow-xl shadow-indigo-200">
                    <Home size={20} /> Back to Home
                </button>
            </Link>
        </div>

        {/* Fun Footer Stats */}
        <div className="mt-12 bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-white/50 flex items-center gap-8 justify-center shadow-sm max-w-sm mx-auto">
            <div className="text-center">
                <p className="text-xs font-bold text-slate-400 uppercase">Steps Lost</p>
                <p className="text-xl font-black text-slate-800">0</p>
            </div>
            <div className="w-px h-8 bg-slate-200"></div>
            <div className="text-center">
                <p className="text-xs font-bold text-slate-400 uppercase">Confusion Level</p>
                <p className="text-xl font-black text-rose-500">High</p>
            </div>
        </div>

      </motion.div>
    </div>
  );
}