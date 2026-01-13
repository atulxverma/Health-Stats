import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useHealthStore } from "../store/useHealthStore"; 
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Activity, 
  Zap, 
  BrainCircuit, 
  ShieldCheck,
  ChevronRight,
  Target,       // ✅ Added
  CheckCircle2, // ✅ Added (Fixes the crash)
  BarChart3     // ✅ Added
} from "lucide-react";
import Footer from "../components/Footer";

export default function LandingPage() {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();
  
  // Real Data from Store
  const { dailyStats, goals, weeklyPlan } = useHealthStore();

  const displayData = {
    calories: isSignedIn ? dailyStats.calories : 1240,
    calGoal: isSignedIn ? goals.caloriesGoal : 2000,
    steps: isSignedIn ? dailyStats.steps : 8500,
    stepsGoal: isSignedIn ? goals.stepsGoal : 10000,
    water: isSignedIn ? dailyStats.water : 1200,
    waterGoal: isSignedIn ? goals.waterGoal : 3000,
    aiSummary: (isSignedIn && weeklyPlan) ? weeklyPlan.summary : "Our AI analyzes your patterns to provide personalized recommendations."
  };

  const calPercent = Math.min((displayData.calories / displayData.calGoal) * 100, 100);
  const stepsPercent = Math.min((displayData.steps / displayData.stepsGoal) * 100, 100);
  const waterPercent = Math.min((displayData.water / displayData.waterGoal) * 100, 100);

  const handleNav = (path) => {
    if (isSignedIn) navigate(path);
    else navigate("/sign-in");
  };

  return (
    <div className="relative bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-700 overflow-hidden">
      
      {/* 1. BACKGROUND EFFECTS */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px]"></div>
      </div>

      {/* 2. HERO SECTION */}
      <section className="relative z-10 pt-24 pb-20 lg:pt-32 container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* LEFT: TEXT CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-bold uppercase tracking-wider text-indigo-600 mb-6">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              {isSignedIn ? "Live Sync Active" : "AI-Powered Health OS"}
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
              Your Body’s <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">
                Operating System.
              </span>
            </h1>

            <p className="text-lg text-slate-500 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Track nutrition, workouts, and sleep with medical-grade precision.
              Turn your daily habits into actionable data.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to={isSignedIn ? "/dashboard" : "/sign-in"}>
                <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-black hover:scale-105 transition-all shadow-xl shadow-indigo-500/20 w-full sm:w-auto flex items-center justify-center gap-2">
                  {isSignedIn ? "Go to Dashboard" : "Start Tracking"}
                  <ArrowRight size={18} />
                </button>
              </Link>
              {!isSignedIn && (
                <button className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all w-full sm:w-auto">
                  How it Works
                </button>
              )}
            </div>
          </motion.div>

          {/* RIGHT: FLOATING 3D GLASS CARDS */}
          <div className="lg:w-1/2 w-full relative flex justify-center items-center py-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-full blur-[80px] -z-10 animate-pulse"></div>

            <div className="relative w-full max-w-[500px] aspect-square">
              
              {/* 1. MAIN CARD */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="absolute top-[10%] left-[10%] right-[10%] bottom-[10%] bg-white/60 backdrop-blur-xl border border-white/50 rounded-[2.5rem] shadow-2xl p-6 md:p-8 flex flex-col justify-between z-10"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">Daily Activity</h3>
                    <p className="text-sm text-slate-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short' })}</p>
                  </div>
                  <div className="bg-indigo-100 p-2 rounded-xl text-indigo-600">
                    <Activity size={24} />
                  </div>
                </div>

                <div className="flex justify-center items-center py-4 relative">
                  <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border-[12px] md:border-[16px] border-indigo-100 flex items-center justify-center relative">
                    <svg className="absolute inset-0 w-full h-full -rotate-90 text-indigo-600 drop-shadow-lg">
                      <circle cx="50%" cy="50%" r="40%" stroke="currentColor" strokeWidth="12%" fill="none" strokeDasharray="250" strokeDashoffset={250 - (250 * stepsPercent) / 100} strokeLinecap="round" />
                    </svg>
                    <div className="w-20 h-20 md:w-28 md:h-28 rounded-full border-[12px] md:border-[16px] border-orange-100 flex items-center justify-center relative">
                      <svg className="absolute inset-0 w-full h-full -rotate-90 text-orange-500 drop-shadow-lg">
                        <circle cx="50%" cy="50%" r="40%" stroke="currentColor" strokeWidth="12%" fill="none" strokeDasharray="180" strokeDashoffset={180 - (180 * calPercent) / 100} strokeLinecap="round" />
                      </svg>
                      <div className="text-center">
                        <span className="text-2xl font-bold text-slate-800">{Math.round(stepsPercent)}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm font-semibold text-slate-600 bg-white/50 p-4 rounded-2xl">
                  <span>Calories</span>
                  <span className="text-slate-900">{displayData.calories} / {displayData.calGoal}</span>
                </div>
              </motion.div>

              {/* 2. FLOATING HEART CARD */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-4 top-0 bg-white p-4 md:p-5 rounded-3xl shadow-xl border border-slate-100 w-40 md:w-48 z-20"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-rose-50 p-2 rounded-full text-rose-500"><Activity size={18} /></div>
                  <span className="font-bold text-slate-700 text-sm">Heart Rate</span>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-black text-slate-800">102</span>
                  <span className="text-xs text-slate-400 font-medium mb-1">bpm</span>
                </div>
                <div className="flex items-end gap-1 h-6 mt-2 opacity-80">
                  {[40, 70, 50, 90, 60, 80, 50].map((h, i) => (<div key={i} className="w-full bg-rose-400 rounded-t-sm" style={{ height: `${h}%` }}></div>))}
                </div>
              </motion.div>

              {/* 3. FLOATING SLEEP CARD */}
              <motion.div
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -left-4 bottom-10 bg-indigo-900 text-white p-4 md:p-5 rounded-3xl shadow-2xl shadow-indigo-500/20 w-36 md:w-44 z-20"
              >
                <p className="text-xs text-indigo-300 font-bold uppercase mb-1">Sleep Score</p>
                <div className="flex items-center gap-2 mb-2"><span className="text-4xl font-bold">92</span><span className="text-lg">😴</span></div>
                <div className="text-xs font-medium bg-white/20 px-2 py-1 rounded-md inline-block">Excellent</div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURES (Bento Grid) */}
      <section className="py-24 bg-white relative z-10">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-20">
            <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 mb-4">Complete Health Visibility</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">Your health isn't just one number. It's a complex system.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* ANALYTICS */}
            <div onClick={() => handleNav('/progress')} className="md:col-span-2 bg-slate-50 p-8 rounded-[2rem] border border-slate-100 hover:shadow-xl transition-all duration-300 group cursor-pointer">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm mb-4"><BarChart3 size={24} /></div>
                  <h3 className="text-2xl font-bold text-slate-900">Performance Analytics</h3>
                  <p className="text-slate-500 mt-2">Track trends over time.</p>
                </div>
                <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors"><ChevronRight size={20} /></button>
              </div>
              <div className="flex items-end gap-2 h-32 w-full mt-auto opacity-70">
                {[30, 45, 35, 60, 50, 80, 55, 70, 65, 90, 75, 60].map((h, i) => (<motion.div key={i} initial={{ height: 0 }} whileInView={{ height: `${h}%` }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className={`flex-1 rounded-t-lg ${i === 9 ? "bg-indigo-500" : "bg-slate-200"}`} />))}
              </div>
            </div>

            {/* NUTRITION */}
            <div onClick={() => handleNav('/nutrition')} className="bg-slate-900 text-white p-8 rounded-[2rem] hover:shadow-xl transition-all duration-300 cursor-pointer group">
              <div className="flex justify-between">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-orange-400 mb-6 group-hover:scale-110 transition-transform"><Zap size={24} /></div>
                <ChevronRight className="text-slate-500 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold mb-2">Macro Tracking</h3>
              <p className="text-slate-400 text-sm mb-8">Log food and water seamlessly.</p>
              <div className="flex justify-center gap-4">
                <div className="relative w-20 h-20">
                  <svg className="w-full h-full -rotate-90"><circle cx="40" cy="40" r="36" stroke="#334155" strokeWidth="6" fill="none"/><circle cx="40" cy="40" r="36" stroke="#f97316" strokeWidth="6" fill="none" strokeDasharray="226" strokeDashoffset={226 - (226 * calPercent/100)} strokeLinecap="round"/></svg>
                  <div className="absolute inset-0 flex items-center justify-center font-bold text-xs">Cals</div>
                </div>
                <div className="relative w-20 h-20">
                  <svg className="w-full h-full -rotate-90"><circle cx="40" cy="40" r="36" stroke="#334155" strokeWidth="6" fill="none"/><circle cx="40" cy="40" r="36" stroke="#3b82f6" strokeWidth="6" fill="none" strokeDasharray="226" strokeDashoffset={226 - (226 * waterPercent/100)} strokeLinecap="round"/></svg>
                  <div className="absolute inset-0 flex items-center justify-center font-bold text-xs">H2O</div>
                </div>
              </div>
            </div>

            {/* GOALS */}
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mb-6"><Target size={24} /></div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Daily Goals</h3>
              <div className="space-y-3 mt-4">
                <div className="flex items-center gap-3 text-sm text-slate-700"><CheckCircle2 size={18} className={stepsPercent >= 100 ? "text-green-500" : "text-slate-300"} /> {displayData.stepsGoal} Steps</div>
                <div className="flex items-center gap-3 text-sm text-slate-700"><CheckCircle2 size={18} className={calPercent >= 100 ? "text-green-500" : "text-slate-300"} /> {displayData.calGoal} kcal</div>
                <div className="flex items-center gap-3 text-sm text-slate-700"><CheckCircle2 size={18} className="text-slate-300" /> 8h Sleep</div>
              </div>
            </div>

            {/* AI INSIGHTS */}
            <div onClick={() => handleNav('/dashboard')} className="md:col-span-2 bg-gradient-to-br from-indigo-600 to-blue-700 p-8 rounded-[2rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group cursor-pointer">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
              <div className="z-10">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white mb-6"><BrainCircuit size={24} /></div>
                <h3 className="text-2xl font-bold">AI Health Insights</h3>
                <p className="text-indigo-100 mt-2 max-w-sm line-clamp-2">"{displayData.aiSummary}"</p>
              </div>
              <div className="z-10 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 w-full md:w-64 group-hover:scale-105 transition-transform">
                <div className="mt-4 text-xs font-bold text-center text-indigo-200">TAP TO VIEW PLAN</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}