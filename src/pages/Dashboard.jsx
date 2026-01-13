import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useHealthStore } from "../store/useHealthStore"; 
import { motion, AnimatePresence } from "framer-motion";
import OnboardingModal from "../components/OnboardingModal"; 
import AIPlanDisplay from "../components/AIPlanDisplay"; 

import { 
  Activity, Flame, Droplets, Footprints, Moon, Sparkles, RefreshCcw, Loader2, ChevronDown, ChevronUp
} from "lucide-react";
import { AreaChart, Area, Tooltip, ResponsiveContainer, CartesianGrid, XAxis } from "recharts";

// Mock Data for Graph (In future we can make this real too)
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
  const { weeklyPlan, userProfile, generatePlan, isLoading, reset, dailyStats, goals } = useHealthStore();
  const { user } = useUser();
  const userName = user ? user.firstName : "Champ";
  const [showModal, setShowModal] = useState(false);
  const [expandPlan, setExpandPlan] = useState(false); // Widget State

  useEffect(() => {
    if (!userProfile) setShowModal(true);
  }, [userProfile]);

  // Safe Calculations
  const safeCalories = Number(dailyStats?.calories) || 0;
  const safeSteps = Number(dailyStats?.steps) || 0;
  const safeWater = Number(dailyStats?.water) || 0;
  
  const goalCalories = Number(goals?.caloriesGoal) || 2000;
  const goalSteps = Number(goals?.stepsGoal) || 8000;
  const goalWater = Number(goals?.waterGoal) || 3000;

  const caloriesPercent = Math.min((safeCalories / goalCalories) * 100, 100);
  const stepsPercent = Math.min((safeSteps / goalSteps) * 100, 100);
  const waterPercent = Math.min((safeWater / goalWater) * 100, 100);
  
  const healthScore = Math.round((stepsPercent + caloriesPercent + waterPercent) / 3);

  const handleReset = () => {
    if(window.confirm("Reset all AI data?")) {
        reset();
        window.location.reload();
    }
  }

  return (
    <div className="container mx-auto max-w-7xl relative pb-20 p-6">
      
      <OnboardingModal isOpen={showModal} onClose={() => setShowModal(false)} />

      {/* Dev Reset Button */}
      <button onClick={handleReset} className="fixed bottom-4 right-4 z-50 bg-slate-900 text-slate-500 hover:text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 transition-all">
        <RefreshCcw size={14} /> Reset System
      </button>

      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
        <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Overview</p>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                Health Status
            </h1>
            <p className="text-slate-500 mt-2">Real-time biometrics for {userName}.</p>
        </div>
        
        {/* Health Score Badge */}
        <div className="bg-white pl-6 pr-8 py-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6">
            <div className="text-right">
                <p className="text-xs font-bold text-slate-400 uppercase">Daily Score</p>
                <p className={`text-3xl font-black ${healthScore > 70 ? 'text-emerald-600' : 'text-indigo-600'}`}>
                    {healthScore}<span className="text-sm text-slate-300">/100</span>
                </p>
            </div>
            <div className="relative w-16 h-16">
                <svg className="w-full h-full -rotate-90">
                    <circle cx="32" cy="32" r="28" stroke="#F1F5F9" strokeWidth="6" fill="none" />
                    <circle 
                        cx="32" cy="32" r="28" 
                        stroke="currentColor" strokeWidth="6" fill="none" 
                        strokeDasharray="175" strokeDashoffset={175 - (175 * healthScore) / 100} 
                        strokeLinecap="round" 
                        className={healthScore > 70 ? 'text-emerald-500' : 'text-indigo-500'}
                    />
                </svg>
            </div>
        </div>
      </div>

      {/* 2. AI PLAN WIDGET (Redesigned & Seamless) */}
      <div className="mb-10 bg-slate-900 rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-800">
          
          {/* Widget Header (Always Visible) */}
          <div 
            className="p-8 flex items-center justify-between cursor-pointer hover:bg-slate-800 transition-colors"
            onClick={() => setExpandPlan(!expandPlan)}
          >
              <div className="flex items-center gap-6">
                  <div className="bg-indigo-600 p-4 rounded-2xl shadow-lg shadow-indigo-900/50">
                      {isLoading ? <Loader2 className="animate-spin text-white" /> : <Sparkles className="text-white" />}
                  </div>
                  <div>
                      <h3 className="text-xl font-bold text-white mb-1">AI Daily Mission</h3>
                      <p className="text-slate-400 text-sm">
                          {isLoading ? "Generating your routine..." : weeklyPlan ? "Your personalized plan is active." : "Tap to generate your plan."}
                      </p>
                  </div>
              </div>
              <div className={`p-3 rounded-full bg-slate-800 text-slate-400 transition-transform duration-300 ${expandPlan ? 'rotate-180' : ''}`}>
                  <ChevronDown />
              </div>
          </div>

          {/* Widget Body (Collapsible) */}
          <AnimatePresence>
              {(expandPlan || !weeklyPlan) && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }} 
                    animate={{ height: 'auto', opacity: 1 }} 
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="bg-slate-900 border-t border-slate-800"
                  >
                      <div className="p-8 pt-0">
                          {isLoading ? (
                              <div className="py-10 text-center text-slate-500">Processing biometrics...</div>
                          ) : weeklyPlan ? (
                              // Pass dark mode prop to AIPlanDisplay if needed, or style it to match
                              <div className="mt-6 bg-slate-800/50 rounded-[2rem] p-2 border border-slate-700">
                                  <AIPlanDisplay />
                              </div>
                          ) : userProfile ? (
                              <div className="py-10 flex flex-col items-center">
                                  <button onClick={generatePlan} className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-500 transition-all shadow-lg hover:shadow-indigo-500/20">
                                      Generate Plan Now
                                  </button>
                              </div>
                          ) : (
                              <p className="text-center py-6 text-slate-500">Complete your profile first.</p>
                          )}
                      </div>
                  </motion.div>
              )}
          </AnimatePresence>
      </div>

      {/* 3. METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard label="Steps" value={safeSteps} target={goalSteps} unit="steps" icon={Footprints} color="blue" percent={stepsPercent} />
          <MetricCard label="Active Burn" value={safeCalories} target={500} unit="kcal" icon={Flame} color="orange" percent={(safeCalories/500)*100} />
          <MetricCard label="Intake" value={safeCalories} target={goalCalories} unit="kcal" icon={Activity} color="rose" percent={caloriesPercent} inverse />
          <MetricCard label="Hydration" value={safeWater} target={goalWater} unit="ml" icon={Droplets} color="cyan" percent={waterPercent} />
      </div>

      {/* 4. ACTIVITY GRAPH */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm h-[350px]">
              <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-slate-900">Activity Trend</h3>
                  <div className="px-4 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-500">Last 7 Days</div>
              </div>
              <ResponsiveContainer width="100%" height="80%">
                  <AreaChart data={chartData}>
                      <defs>
                          <linearGradient id="colorAct" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                      <Tooltip contentStyle={{borderRadius: '16px', border:'none', boxShadow:'0 10px 30px rgba(0,0,0,0.1)'}} />
                      <Area type="monotone" dataKey="activity" stroke="#6366f1" strokeWidth={4} fill="url(#colorAct)" />
                  </AreaChart>
              </ResponsiveContainer>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-indigo-900 text-white p-8 rounded-[2.5rem] relative overflow-hidden shadow-xl flex flex-col justify-between">
              <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-white/10 rounded-2xl"><Moon size={24} /></div>
                      <h3 className="font-bold text-lg">Sleep Quality</h3>
                  </div>
                  <p className="text-indigo-200 text-sm leading-relaxed">
                      Your sleep pattern is consistent. Recovery score is optimal for high intensity training.
                  </p>
              </div>
              <div className="mt-8 relative z-10">
                  <div className="flex justify-between text-xs font-bold text-indigo-300 mb-2"><span>Avg</span><span>7h 12m</span></div>
                  <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: '85%' }} className="h-full bg-indigo-500" /></div>
              </div>
              <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/30 rounded-full blur-[60px]"></div>
          </div>
      </div>

    </div>
  );
}

function MetricCard({ label, value, target, unit, icon: Icon, color, percent, inverse = false }) {
    const p = Math.min(percent, 100);
    const colors = { blue: "text-blue-600 bg-blue-500", orange: "text-orange-600 bg-orange-500", cyan: "text-cyan-600 bg-cyan-500", rose: "text-rose-600 bg-rose-500" };
    return (
        <motion.div whileHover={{ y: -5 }} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between h-48 relative overflow-hidden">
            <div className="flex justify-between items-start z-10">
                <Icon size={24} className={colors[color].split(" ")[0]} />
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${inverse && p > 100 ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'}`}>{Math.round(p)}%</span>
            </div>
            <div className="z-10"><h3 className="text-3xl font-black text-slate-900">{value}</h3><p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">{label} <span className="font-normal normal-case">/ {target} {unit}</span></p></div>
            <div className="w-full h-2 bg-slate-100 rounded-full mt-4 overflow-hidden z-10"><motion.div initial={{ width: 0 }} animate={{ width: `${p}%` }} className={`h-full ${colors[color].split(" ")[1]}`} /></div>
        </motion.div>
    );
}