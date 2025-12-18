import React from "react";
import { useUserData } from "../context/UserDataContext";
import { useUser } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { 
  Activity, 
  Flame, 
  Droplets, 
  Moon, 
  Footprints, 
  ArrowUpRight, 
  Timer,
  ChevronRight
} from "lucide-react";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";

// Mock Data for the Graph (Real app mein ye database se aayega)
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
  const { dailyStats, goals, workouts } = useUserData();
  const { user } = useUser();
  const userName = user ? user.firstName : "Champ";

  // Calculations for UI
  const caloriesPercent = Math.min((dailyStats.calories / goals.caloriesGoal) * 100, 100);
  const stepsPercent = Math.min((dailyStats.steps / goals.stepsGoal) * 100, 100);
  const healthScore = Math.round((stepsPercent + caloriesPercent) / 2); // Fake Health Score Algorithm

  return (
    <div className="container mx-auto max-w-7xl">
      
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                Good Morning, <span className="text-indigo-600">{userName}!</span>
            </h1>
            <p className="text-slate-500 mt-2">You are on a <span className="font-bold text-slate-800">5 Day Streak</span>. Keep pushing!</p>
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

      {/* 2. MAIN BENTO GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* BIG GRAPH CARD (Spans 2 columns) */}
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
                        <defs>
                            <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="activity" 
                            stroke="#6366f1" 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorActivity)" 
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </motion.div>

        {/* CALORIES RING CARD */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-slate-900 text-white p-6 rounded-[2rem] flex flex-col items-center justify-center relative overflow-hidden"
        >
             {/* Background Glow */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl"></div>

             <h3 className="text-slate-300 font-medium mb-6 flex items-center gap-2"><Flame size={18} className="text-orange-500"/> Calories Burned</h3>
             
             <div className="relative w-40 h-40">
                <svg className="w-full h-full -rotate-90">
                    {/* Background Ring */}
                    <circle cx="80" cy="80" r="70" stroke="#334155" strokeWidth="12" fill="none" />
                    {/* Progress Ring */}
                    <circle 
                        cx="80" cy="80" r="70" 
                        stroke="#f97316" strokeWidth="12" fill="none" 
                        strokeDasharray="440" 
                        strokeDashoffset={440 - (440 * caloriesPercent) / 100} 
                        strokeLinecap="round" 
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold">{dailyStats.calories}</span>
                    <span className="text-xs text-slate-400">/ {goals.caloriesGoal} kcal</span>
                </div>
             </div>
             
             <div className="mt-6 w-full flex justify-between px-4">
                 <div className="text-center">
                    <p className="text-xs text-slate-400">Fat Burn</p>
                    <p className="font-bold text-orange-400">High</p>
                 </div>
                 <div className="text-center">
                    <p className="text-xs text-slate-400">Carbs</p>
                    <p className="font-bold text-blue-400">Normal</p>
                 </div>
             </div>
        </motion.div>
      </div>

      {/* 3. SECONDARY STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          {/* Steps Card */}
          <StatCard 
             title="Steps Taken"
             value={dailyStats.steps}
             goal={goals.stepsGoal}
             icon={Footprints}
             color="bg-blue-500"
             percent={stepsPercent}
             unit="steps"
          />

          {/* Water Card */}
          <StatCard 
             title="Hydration"
             value={dailyStats.water}
             goal={goals.waterGoal}
             icon={Droplets}
             color="bg-cyan-500"
             percent={(dailyStats.water / goals.waterGoal) * 100}
             unit="ml"
          />

           {/* Heart Card */}
           <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start">
                  <div className="bg-rose-50 p-3 rounded-2xl text-rose-500">
                      <Activity size={24} />
                  </div>
                  <span className="text-xs font-bold bg-rose-100 text-rose-600 px-2 py-1 rounded-full animate-pulse">Live</span>
              </div>
              <div className="mt-4">
                  <p className="text-slate-500 text-sm font-medium">Heart Rate</p>
                  <p className="text-3xl font-bold text-slate-800">{dailyStats.heartRate} <span className="text-base font-normal text-slate-400">bpm</span></p>
              </div>
              <div className="mt-2 flex gap-1 h-1">
                  <div className="flex-1 bg-rose-200 rounded-full"></div>
                  <div className="flex-1 bg-rose-300 rounded-full"></div>
                  <div className="flex-1 bg-rose-500 rounded-full"></div>
                  <div className="flex-1 bg-rose-200 rounded-full"></div>
              </div>
           </div>

           {/* Sleep Card */}
           <div className="bg-indigo-900 text-white p-6 rounded-[2rem] border border-indigo-800 shadow-sm flex flex-col justify-between relative overflow-hidden">
              <div className="absolute -right-4 -top-4 text-indigo-800 opacity-50">
                  <Moon size={100} />
              </div>
              <div className="relative z-10">
                  <div className="bg-indigo-800/50 p-3 rounded-2xl w-fit text-indigo-300 mb-4">
                      <Moon size={24} />
                  </div>
                  <p className="text-indigo-300 text-sm font-medium">Sleep Duration</p>
                  <p className="text-3xl font-bold">7h 20m</p>
              </div>
              <p className="relative z-10 text-xs text-indigo-300 mt-2">Quality: <span className="text-white font-bold">Excellent</span></p>
           </div>
      </div>

      {/* 4. RECENT HISTORY LIST */}
      <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg text-slate-800">Recent Workouts</h3>
              <button className="text-sm font-bold text-indigo-600 hover:underline">View All</button>
          </div>

          <div className="space-y-4">
              {workouts.length > 0 ? workouts.slice(-3).reverse().map((w, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                      <div className="flex items-center gap-4">
                          <div className="bg-white p-3 rounded-xl shadow-sm text-orange-500">
                              <Activity size={20} />
                          </div>
                          <div>
                              <p className="font-bold text-slate-800">{w.name}</p>
                              <p className="text-xs text-slate-500 flex items-center gap-1"><Timer size={12}/> {w.duration} mins</p>
                          </div>
                      </div>
                      <div className="text-right">
                          <p className="font-bold text-slate-800">{w.calories} kcal</p>
                          <p className="text-xs text-slate-400">Burned</p>
                      </div>
                  </div>
              )) : (
                  <div className="text-center py-10 text-slate-400">
                      <p>No workouts logged today.</p>
                      <p className="text-sm">Get moving! 🏃‍♂️</p>
                  </div>
              )}
          </div>
      </div>

    </div>
  );
}

// Helper Component for the Small Stats
function StatCard({ title, value, goal, icon: Icon, color, percent, unit }) {
    return (
        <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between"
        >
             <div className="flex justify-between items-start mb-4">
                 <div className={`p-3 rounded-2xl text-white shadow-md ${color}`}>
                     <Icon size={24} />
                 </div>
                 <div className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                     {Math.round(percent)}%
                 </div>
             </div>
             <div>
                 <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
                 <div className="flex items-baseline gap-1">
                     <p className="text-2xl font-bold text-slate-800">{value}</p>
                     <p className="text-xs text-slate-400">/ {goal} {unit}</p>
                 </div>
             </div>
             
             {/* Simple Bar */}
             <div className="w-full bg-slate-100 h-2 rounded-full mt-4 overflow-hidden">
                 <div className={`h-full rounded-full ${color}`} style={{ width: `${percent}%` }}></div>
             </div>
        </motion.div>
    );
}