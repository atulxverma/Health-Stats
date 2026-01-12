import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { useHealthStore } from "../store/useHealthStore"; 
import OnboardingModal from "../components/OnboardingModal"; 
import AIPlanDisplay from "../components/AIPlanDisplay"; 

import { 
  Flame, 
  Droplets, 
  Footprints, 
  Target,
  Sparkles,
  RefreshCcw,
  Loader2,
  CheckCircle2
} from "lucide-react";

export default function Dashboard() {
  const { weeklyPlan, userProfile, generatePlan, isLoading, reset, dailyStats, goals } = useHealthStore();
  const { user } = useUser();
  const userName = user ? user.firstName : "Champ";
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!userProfile) setShowModal(true);
    else setShowModal(false);
  }, [userProfile]);

  // Calculations
  const caloriesPercent = Math.min((dailyStats.calories / goals.caloriesGoal) * 100, 100);
  const stepsPercent = Math.min((dailyStats.steps / goals.stepsGoal) * 100, 100);
  const waterPercent = Math.min((dailyStats.water / goals.waterGoal) * 100, 100);
  
  // Overall Day Score (Kitne tasks complete hue vs Goals)
  const healthScore = Math.round((stepsPercent + caloriesPercent + waterPercent) / 3);

  const handleReset = () => {
    if(window.confirm("Start fresh? This will reset your profile & plan.")) {
        reset();
        window.location.reload();
    }
  }

  return (
    <div className="container mx-auto max-w-7xl relative pb-20">
      <OnboardingModal isOpen={showModal} onClose={() => setShowModal(false)} />

      {/* Reset (Dev Tool) */}
      <button onClick={handleReset} className="fixed bottom-4 right-4 z-50 bg-slate-900 text-slate-500 hover:text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 transition-all">
        <RefreshCcw size={14} /> Reset System
      </button>

      {/* 1. HERO HEADER: "Your Daily Mission" */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
        <div>
            <div className="flex items-center gap-2 mb-2">
                <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                    <Sparkles size={12} /> AI Pilot Active
                </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                {userName}'s <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">Mission</span>
            </h1>
            <p className="text-slate-500 mt-2 text-lg">Follow the plan below to hit your {userProfile?.goal || "goals"}.</p>
        </div>

        {/* Live Score Card */}
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4 pr-8">
            <div className="relative w-16 h-16">
                 <svg className="w-full h-full -rotate-90">
                    <circle cx="32" cy="32" r="28" stroke="#f1f5f9" strokeWidth="6" fill="none" />
                    <circle 
                        cx="32" cy="32" r="28" 
                        stroke="#4f46e5" strokeWidth="6" fill="none" 
                        strokeDasharray="175" strokeDashoffset={175 - (175 * healthScore) / 100} 
                        strokeLinecap="round" 
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-black text-slate-800">
                    {healthScore}
                </div>
            </div>
            <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Daily Score</p>
                <p className="text-sm font-bold text-indigo-600">
                    {healthScore > 80 ? "Excellent" : healthScore > 50 ? "Good Pace" : "Let's Go!"}
                </p>
            </div>
        </div>
      </div>

      {/* 2. THE AI PLAN (The Main Focus) */}
      <div className="mb-12">
         {isLoading ? (
             <div className="bg-white p-12 rounded-[2.5rem] border border-slate-100 flex flex-col items-center justify-center text-center shadow-sm">
                <Loader2 className="text-indigo-600 animate-spin mb-4" size={40} />
                <h3 className="text-xl font-bold text-slate-800">Analyzing your biometrics...</h3>
                <p className="text-slate-500">Building the perfect routine for you.</p>
             </div>
         ) : weeklyPlan ? (
             // PLAN EXISTS -> SHOW IT
             <AIPlanDisplay />
         ) : userProfile ? (
             // PLAN MISSING -> GENERATE BTN
             <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-10 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[100px]"></div>
                <div className="relative z-10">
                    <h3 className="text-3xl font-bold flex items-center gap-3">
                        <Target className="text-indigo-400" /> Mission Ready
                    </h3>
                    <p className="text-slate-300 mt-2 text-lg max-w-md">Your profile is set. Let AI create your personalized nutrition and training schedule.</p>
                </div>
                <button 
                    onClick={() => generatePlan()}
                    className="relative z-10 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-indigo-900/50 flex items-center gap-3 hover:scale-105"
                >
                    <Sparkles size={20} /> Generate Plan
                </button>
             </div>
         ) : null}
      </div>

      {/* 3. QUICK STATS (Secondary Info) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatPill label="Steps" val={dailyStats.steps} target={goals.stepsGoal} icon={Footprints} color="text-blue-500" />
          <StatPill label="Water" val={`${dailyStats.water}ml`} target={`${goals.waterGoal}ml`} icon={Droplets} color="text-cyan-500" />
          <StatPill label="Calories" val={dailyStats.calories} target={goals.caloriesGoal} icon={Flame} color="text-orange-500" />
          <div className="bg-slate-100 rounded-3xl flex items-center justify-center text-slate-400 font-bold text-sm cursor-pointer hover:bg-slate-200 transition-colors">
              See Full Analytics
          </div>
      </div>

    </div>
  );
}

// Minimal Stat Component
function StatPill({ label, val, target, icon: Icon, color }) {
    return (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between h-32">
            <Icon className={color} size={24} />
            <div>
                <p className="text-2xl font-bold text-slate-900">{val}</p>
                <p className="text-xs text-slate-400 font-bold uppercase">{label}</p>
            </div>
        </div>
    );
}