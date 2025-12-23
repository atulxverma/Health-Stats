import React, { useState, useEffect } from "react";
import { useUserData } from "../context/UserDataContext";
import { useUser } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { useHealthStore } from "../store/useHealthStore"; 
import OnboardingModal from "../components/OnboardingModal"; 
import AIPlanDisplay from "../components/AIPlanDisplay"; 

import { 
  Activity, 
  Flame, 
  Droplets, 
  Footprints, 
  ArrowUpRight,
  Sparkles,
  RefreshCcw,
  Loader2
} from "lucide-react";
import { AreaChart, Area, Tooltip, ResponsiveContainer } from "recharts";

const chartData = [
  { day: "Mon", activity: 400 },
  { day: "Tue", activity: 650 },
  { day: "Wed", activity: 300 },
  { day: "Thu", activity: 800 },
  { day: "Fri", activity: 500 },
  { day: "Sat", activity: 900 },
  { day: "Sun", activity: 450 },
];

export default function Dashboard() {
  // Zustand Store se saari cheezein nikalo
  const { weeklyPlan, userProfile, generatePlan, isLoading, reset } = useHealthStore();
  
  const { dailyStats, goals } = useUserData();
  const { user } = useUser();
  const userName = user ? user.firstName : "Champ";

  const [showModal, setShowModal] = useState(false);

  // Modal tabhi dikhao jab User Profile hi gayab ho
  useEffect(() => {
    if (!userProfile) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [userProfile]);

  // Calculations
  const caloriesPercent = Math.min((dailyStats.calories / goals.caloriesGoal) * 100, 100);
  const stepsPercent = Math.min((dailyStats.steps / goals.stepsGoal) * 100, 100);
  const healthScore = Math.round((stepsPercent + caloriesPercent) / 2);

  // DEBUGGING FUNCTION: Sab kuch clear karne ke liye
  const handleReset = () => {
    if(window.confirm("Are you sure you want to reset all AI data?")) {
        reset(); // Store clear karega
        window.location.reload(); // Page refresh
    }
  }

  return (
    <div className="container mx-auto max-w-7xl relative">
      
      {/* Onboarding Modal */}
      <OnboardingModal isOpen={showModal} onClose={() => setShowModal(false)} />

      {/* --- DEV BUTTON: RESET (Right Bottom) --- */}
      <button 
        onClick={handleReset}
        className="fixed bottom-4 right-4 z-50 bg-red-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg hover:bg-red-700 flex items-center gap-2"
      >
        <RefreshCcw size={14} /> Reset AI Data
      </button>

      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                Good Morning, <span className="text-indigo-600">{userName}!</span>
            </h1>
            <p className="text-slate-500 mt-2">Let's crush your goals today.</p>
        </motion.div>

        <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100"
        >
            <div className="text-right">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Health Score</p>
                <p className="text-2xl font-black text-indigo-600">{healthScore}<span className="text-sm text-slate-300">/100</span></p>
            </div>
            <div className="h-10 w-10 relative">
                 <svg className="w-full h-full -rotate-90">
                    <circle cx="20" cy="20" r="16" stroke="#f1f5f9" strokeWidth="4" fill="none" />
                    <circle 
                        cx="20" cy="20" r="16" 
                        stroke="#4f46e5" strokeWidth="4" fill="none" 
                        strokeDasharray="100" strokeDashoffset={100 - healthScore} 
                        strokeLinecap="round" 
                    />
                </svg>
            </div>
        </motion.div>
      </div>

      {/* --- 2. AI PLAN SECTION (Smart Logic Here) --- */}
      <div className="mb-10">
         {isLoading ? (
             // CASE A: Loading ho raha hai
             <div className="bg-indigo-50 p-8 rounded-[2rem] border border-indigo-100 flex flex-col items-center justify-center min-h-[200px] animate-pulse">
                <Loader2 className="text-indigo-600 animate-spin mb-3" size={32} />
                <p className="text-indigo-800 font-bold">Creating your personalized plan...</p>
             </div>
         ) : weeklyPlan ? (
             // CASE B: Plan maujood hai -> Display karo
             <AIPlanDisplay />
         ) : userProfile ? (
             // CASE C: Profile hai, par Plan nahi hai -> Generate Button dikhao
             <div className="bg-slate-900 p-8 rounded-[2rem] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                <div>
                    <h3 className="text-2xl font-bold flex items-center gap-2">
                        <Sparkles className="text-yellow-400" /> Ready to Plan?
                    </h3>
                    <p className="text-slate-400 mt-1">Your profile is set. Generate your daily nutrition & workout plan now.</p>
                </div>
                <button 
                    onClick={() => generatePlan()}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-indigo-500/50 flex items-center gap-2"
                >
                    <Sparkles size={18} /> Generate AI Plan
                </button>
             </div>
         ) : (
             // CASE D: Profile hi nahi hai -> Kuch mat dikhao (Modal apne aap khulega)
             null
         )}
      </div>

      {/* 3. MAIN BENTO GRID (Graphs etc.) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Graph */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="md:col-span-2 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden"
        >
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                        <Activity size={20} className="text-indigo-500" /> Activity Trends
                    </h3>
                    <p className="text-sm text-slate-400">Your calorie burn over the last 7 days</p>
                </div>
                <div className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <ArrowUpRight size={14} /> +12% vs last week
                </div>
            </div>
            
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <Tooltip />
                        <Area type="monotone" dataKey="activity" stroke="#6366f1" strokeWidth={3} fill="#e0e7ff" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </motion.div>

        {/* Calories Ring */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-slate-900 text-white p-6 rounded-[2rem] flex flex-col items-center justify-center relative overflow-hidden"
        >
             <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl"></div>
             <h3 className="text-slate-300 font-medium mb-6 flex items-center gap-2"><Flame size={18} className="text-orange-500"/> Calories Burned</h3>
             <div className="relative w-40 h-40">
                <svg className="w-full h-full -rotate-90">
                    <circle cx="80" cy="80" r="70" stroke="#334155" strokeWidth="12" fill="none" />
                    <circle cx="80" cy="80" r="70" stroke="#f97316" strokeWidth="12" fill="none" strokeDasharray="440" strokeDashoffset={440 - (440 * caloriesPercent) / 100} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold">{dailyStats.calories}</span>
                    <span className="text-xs text-slate-400">/ {goals.caloriesGoal} kcal</span>
                </div>
             </div>
        </motion.div>
      </div>

      {/* 4. SECONDARY STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Steps" value={dailyStats.steps} goal={goals.stepsGoal} icon={Footprints} color="bg-blue-500" percent={stepsPercent} unit="steps" />
          <StatCard title="Hydration" value={dailyStats.water} goal={goals.waterGoal} icon={Droplets} color="bg-cyan-500" percent={(dailyStats.water / goals.waterGoal) * 100} unit="ml" />
      </div>

    </div>
  );
}

// Helper Component
function StatCard({ title, value, goal, icon: Icon, color, percent, unit }) {
    return (
        <motion.div whileHover={{ y: -5 }} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between">
             <div className="flex justify-between items-start mb-4">
                 <div className={`p-3 rounded-2xl text-white shadow-md ${color}`}><Icon size={24} /></div>
                 <div className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-full">{Math.round(percent)}%</div>
             </div>
             <div>
                 <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
                 <div className="flex items-baseline gap-1">
                     <p className="text-2xl font-bold text-slate-800">{value}</p>
                     <p className="text-xs text-slate-400">/ {goal} {unit}</p>
                 </div>
             </div>
             <div className="w-full bg-slate-100 h-2 rounded-full mt-4 overflow-hidden">
                 <div className={`h-full rounded-full ${color}`} style={{ width: `${percent}%` }}></div>
             </div>
        </motion.div>
    );
}