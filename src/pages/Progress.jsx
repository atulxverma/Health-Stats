import React, { useState } from "react";
import { useHealthStore } from "../store/useHealthStore";
import { motion, AnimatePresence } from "framer-motion";
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid 
} from "recharts";
import { 
  TrendingUp, Calendar, Activity, Footprints, Flame, X, ArrowUpRight, ArrowDownRight 
} from "lucide-react";

export default function Progress() {
  const { dailyStats, goals, history } = useHealthStore();
  const [showReport, setShowReport] = useState(false);

  // --- 🛠️ FIX: GENERATE LAST 7 DAYS DATA (WITH ZEROS) ---
  
  // 1. Get Array of Last 7 Days Dates
  const getLast7Days = () => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(d);
    }
    return dates;
  };

  // 2. Combine History + Today into one raw list
  const rawHistory = [...history, { ...dailyStats, date: new Date().toLocaleDateString() }];

  // 3. Map Last 7 Days to Data (Fill 0 if missing)
  const chartData = getLast7Days().map((dateObj) => {
    // Compare dates ignoring time
    const dateStr = dateObj.toLocaleDateString();
    
    // Find if we have data for this specific date
    const foundDay = rawHistory.find(h => 
      new Date(h.date || new Date()).toLocaleDateString() === dateStr
    );

    const steps = Number(foundDay?.steps) || 0;
    const calories = Number(foundDay?.calories) || 0;
    
    // Calculate Score for that specific day
    const sScore = Math.min((steps / (goals.stepsGoal || 1)) * 100, 100);
    const cScore = Math.min((calories / (goals.caloriesGoal || 1)) * 100, 100);
    const score = Math.round((sScore + cScore) / 2);

    return {
      day: dateObj.toLocaleDateString('en-US', { weekday: 'short' }), // Mon, Tue...
      fullDate: dateStr,
      steps: steps,
      calories: calories,
      score: score
    };
  });

  // --- METRICS FOR CARDS ---
  const currentSteps = Number(dailyStats?.steps) || 0;
  const currentCalories = Number(dailyStats?.calories) || 0;
  
  const todayScore = chartData[chartData.length - 1].score;
  const yesterdayScore = chartData[chartData.length - 2].score;
  
  // Calculate Trend
  const improvement = yesterdayScore > 0 
    ? Math.round(((todayScore - yesterdayScore) / yesterdayScore) * 100) 
    : 0;

  const insightText = improvement > 0 
    ? `You are ${improvement}% more active today compared to yesterday.` 
    : improvement < 0 
    ? `Activity dropped by ${Math.abs(improvement)}% compared to yesterday.` 
    : "Activity levels are consistent.";

  // Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-4 rounded-xl shadow-xl border border-slate-700">
          <p className="font-bold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: <span className="font-bold">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container mx-auto max-w-7xl p-6 relative">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
            <h1 className="text-3xl font-bold text-slate-900">Analytics</h1>
            <p className="text-slate-500 mt-1">Deep dive into your performance metrics.</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm text-sm font-bold text-slate-600">
            <Calendar size={16} />
            <span>Last 7 Days</span>
        </div>
      </div>

      {/* 1. TOP METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Steps" value={currentSteps.toLocaleString()} unit="steps" icon={Footprints} color="bg-blue-500" trend={improvement} />
        <StatCard title="Total Burn" value={currentCalories.toLocaleString()} unit="kcal" icon={Flame} color="bg-orange-500" trend={improvement} />
        <StatCard title="Activity Score" value={todayScore} unit="/ 100" icon={Activity} color="bg-indigo-500" trend={improvement} />
      </div>

      {/* 2. CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        {/* Main Area Chart (Activity Score) */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
        >
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm h-full">
                <div className="mb-6">
                    <h3 className="text-xl font-bold text-slate-900">Performance Trend</h3>
                    <p className="text-sm text-slate-500 font-medium">Your overall activity score calculated from steps & workouts.</p>
                </div>
                <div className="w-full h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs><linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/></linearGradient></defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10}/>
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} domain={[0, 100]} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="score" name="Health Score" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorScore)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </motion.div>

        {/* Bar Chart (Steps) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm h-full">
                <div className="mb-6"><h3 className="text-xl font-bold text-slate-900">Steps Analysis</h3><p className="text-sm text-slate-500 font-medium">Daily step count.</p></div>
                <div className="w-full h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                            <Tooltip cursor={{fill: '#f1f5f9'}} content={<CustomTooltip />} />
                            <Bar dataKey="steps" name="Steps" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </motion.div>

        {/* Bar Chart (Calories) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm h-full">
                <div className="mb-6"><h3 className="text-xl font-bold text-slate-900">Calorie Burn</h3><p className="text-sm text-slate-500 font-medium">Energy expenditure per day.</p></div>
                <div className="w-full h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                            <Tooltip cursor={{fill: '#f1f5f9'}} content={<CustomTooltip />} />
                            <Bar dataKey="calories" name="Calories" fill="#f97316" radius={[6, 6, 0, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </motion.div>

      </div>

      {/* INSIGHTS BANNER */}
      <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-[80px]"></div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-emerald-400">
                      <TrendingUp size={32} />
                  </div>
                  <div>
                      <h3 className="text-xl font-bold">Smart Insight</h3>
                      <p className="text-slate-400 mt-1 max-w-md">{insightText}</p>
                  </div>
              </div>
              <button onClick={() => setShowReport(true)} className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20">
                  View Full Report
              </button>
          </div>
      </div>

      {/* FULL REPORT MODAL */}
      <AnimatePresence>
        {showReport && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/60 backdrop-blur-sm">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-2xl rounded-[2.5rem] p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
                    <button onClick={() => setShowReport(false)} className="absolute top-6 right-6 w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center"><X /></button>
                    
                    <h2 className="text-2xl font-black text-slate-900 mb-6">Detailed Health Report</h2>
                    
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-slate-50 p-6 rounded-3xl text-center">
                            <p className="text-xs font-bold text-slate-400 uppercase">Avg Score</p>
                            <p className="text-4xl font-black text-indigo-600">
                                {Math.round(chartData.reduce((a,b)=>a+b.score,0)/7)}
                            </p>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-3xl text-center">
                            <p className="text-xs font-bold text-slate-400 uppercase">Total Calories</p>
                            <p className="text-4xl font-black text-orange-500">
                                {chartData.reduce((a,b)=>a+b.calories,0).toLocaleString()}
                            </p>
                        </div>
                    </div>

                    <h3 className="font-bold text-lg mb-4">Daily Breakdown (Last 7 Days)</h3>
                    <div className="space-y-3">
                        {chartData.slice().reverse().map((day, i) => (
                            <div key={i} className="flex justify-between items-center p-4 border border-slate-100 rounded-2xl hover:bg-slate-50">
                                <div>
                                    <p className="font-bold text-slate-800">{day.fullDate}</p>
                                    <p className="text-xs text-slate-400">{day.steps} steps • {day.calories} kcal</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`text-sm font-bold ${day.score >= 80 ? 'text-green-600' : 'text-orange-500'}`}>{day.score}/100</span>
                                    {day.score >= 80 ? <ArrowUpRight size={16} className="text-green-600"/> : <ArrowDownRight size={16} className="text-orange-500"/>}
                                </div>
                            </div>
                        ))}
                    </div>

                    <button onClick={() => setShowReport(false)} className="w-full mt-8 bg-slate-900 text-white py-4 rounded-2xl font-bold">Close Report</button>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

    </div>
  );
}

// --- HELPER COMPONENT ---
const StatCard = ({ title, value, unit, icon: Icon, color, trend }) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between h-full"
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl text-white shadow-md ${color}`}>
          <Icon size={24} />
        </div>
        {trend !== 0 && (
          <div className={`text-xs font-bold px-2 py-1 rounded-full ${trend > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </div>
        )}
      </div>
      
      <div>
        <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">{title}</p>
        <div className="flex items-baseline gap-1">
          <h3 className="text-3xl font-black text-slate-900">{value}</h3>
          <span className="text-sm font-medium text-slate-400">{unit}</span>
        </div>
      </div>
    </motion.div>
  );
};