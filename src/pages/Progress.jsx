import React, { useState } from "react";
import { useHealthStore } from "../store/useHealthStore";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  CartesianGrid 
} from "recharts";
import { 
  TrendingUp, 
  Calendar, 
  Activity, 
  Footprints, 
  Flame 
} from "lucide-react";
import { motion } from "framer-motion";

export default function Progress() {
  const { dailyStats, goals, history } = useHealthStore(); // history array added to store previously
  const [range, setRange] = useState("Weekly");

  // --- DATA PREPARATION ---
  // If history exists, use it. Otherwise, generate last 7 days mock based on current stats for visual if empty.
  // In a real app, 'history' would be populated daily. 
  // Let's create a derived dataset: History + Today
  
  const todayData = {
      date: new Date().toLocaleDateString('en-US', { weekday: 'short' }),
      steps: dailyStats.steps,
      calories: dailyStats.calories,
      water: dailyStats.water,
      score: Math.round(((dailyStats.steps/goals.stepsGoal)*100 + (dailyStats.calories/goals.caloriesGoal)*100)/2)
  };

  // Combine history (if any) with today. 
  // For demo, if history is empty, we show today + some placeholders
  const chartData = history.length > 0 
    ? [...history.slice(-6).map(h => ({
        day: new Date(h.date).toLocaleDateString('en-US', { weekday: 'short' }),
        steps: h.steps,
        calories: h.calories,
        score: Math.round(((h.steps/goals.stepsGoal)*100 + (h.calories/goals.caloriesGoal)*100)/2)
      })), todayData]
    : [
        { day: "Mon", steps: 4000, calories: 1800, score: 65 }, // Placeholders
        { day: "Tue", steps: 7500, calories: 2200, score: 80 },
        { day: "Wed", steps: 5000, calories: 1950, score: 70 },
        { day: "Thu", steps: 9200, calories: 2400, score: 95 },
        { day: "Fri", steps: 8100, calories: 2100, score: 85 },
        { day: "Sat", steps: 6000, calories: 1800, score: 75 },
        { day: todayData.date, steps: todayData.steps, calories: todayData.calories, score: todayData.score } // Today
      ];

  // Calculations
  const currentSteps = Number(dailyStats?.steps) || 0;
  const currentCalories = Number(dailyStats?.calories) || 0;
  
  const stepScore = Math.min((currentSteps / (goals?.stepsGoal || 8000)) * 100, 100);
  const calScore = Math.min((currentCalories / (goals?.caloriesGoal || 2000)) * 100, 100);
  const totalScore = Math.round((stepScore + calScore) / 2);

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
    <div className="container mx-auto max-w-7xl p-6">
      
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

      {/* 1. TOP METRICS GRID (REAL DATA) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
            title="Total Steps" 
            value={currentSteps.toLocaleString()} 
            unit="steps" 
            icon={Footprints} 
            color="bg-blue-500" 
            trend={12} 
        />
        <StatCard 
            title="Total Burn" 
            value={currentCalories.toLocaleString()} 
            unit="kcal" 
            icon={Flame} 
            color="bg-orange-500" 
            trend={-5} 
        />
        <StatCard 
            title="Activity Score" 
            value={totalScore} 
            unit="/ 100" 
            icon={Activity} 
            color="bg-indigo-500" 
            trend={8} 
        />
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
                            <defs>
                                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis 
                                dataKey="day" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{fill: '#64748b', fontSize: 12}} 
                                dy={10}
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{fill: '#64748b', fontSize: 12}} 
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Area 
                                type="monotone" 
                                dataKey="score" 
                                name="Health Score"
                                stroke="#6366f1" 
                                strokeWidth={4} 
                                fillOpacity={1} 
                                fill="url(#colorScore)" 
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </motion.div>

        {/* Bar Chart (Steps) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm h-full">
                <div className="mb-6">
                    <h3 className="text-xl font-bold text-slate-900">Steps Analysis</h3>
                    <p className="text-sm text-slate-500 font-medium">Daily step count.</p>
                </div>
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
                <div className="mb-6">
                    <h3 className="text-xl font-bold text-slate-900">Calorie Burn</h3>
                    <p className="text-sm text-slate-500 font-medium">Energy expenditure per day.</p>
                </div>
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

      {/* 3. INSIGHTS ROW */}
      <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-[80px]"></div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-emerald-400">
                      <TrendingUp size={32} />
                  </div>
                  <div>
                      <h3 className="text-xl font-bold">Weekly Insight</h3>
                      <p className="text-slate-400 mt-1 max-w-md">
                          You've been <span className="text-white font-bold">12% more active</span> this week compared to last week. Your heart rate recovery has improved by 5%.
                      </p>
                  </div>
              </div>
              <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20">
                  View Full Report
              </button>
          </div>
      </div>

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
        {trend && (
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