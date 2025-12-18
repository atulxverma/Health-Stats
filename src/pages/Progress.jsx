import React from "react";
import { useUserData } from "../context/UserDataContext";
import { motion } from "framer-motion";
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

import StatCard from "../components/StatCard";
import ChartCard from "../components/ChartCard";

// --- MOCK DATA FOR CHARTS ---
const weeklyData = [
  { day: "Mon", steps: 4000, calories: 1800, score: 65 },
  { day: "Tue", steps: 7500, calories: 2200, score: 80 },
  { day: "Wed", steps: 5000, calories: 1950, score: 70 },
  { day: "Thu", steps: 9200, calories: 2400, score: 95 },
  { day: "Fri", steps: 8100, calories: 2100, score: 85 },
  { day: "Sat", steps: 6000, calories: 1800, score: 75 },
  { day: "Sun", steps: 10500, calories: 2600, score: 100 },
];

export default function Progress() {
  const { dailyStats } = useUserData();

  // Custom Tooltip for Recharts
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
    <div className="container mx-auto max-w-7xl">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
            <h1 className="text-3xl font-bold text-slate-900">Analytics</h1>
            <p className="text-slate-500 mt-1">Deep dive into your performance metrics.</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm text-sm font-bold text-slate-600">
            <Calendar size={16} />
            <span>This Week</span>
        </div>
      </div>

      {/* 1. TOP METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
            title="Avg Steps" 
            value="7,840" 
            unit="steps/day" 
            icon={Footprints} 
            color="bg-blue-500" 
            trend={12} 
        />
        <StatCard 
            title="Avg Burn" 
            value="2,150" 
            unit="kcal/day" 
            icon={Flame} 
            color="bg-orange-500" 
            trend={-5} 
        />
        <StatCard 
            title="Activity Score" 
            value="82" 
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
            <ChartCard title="Performance Trend" subtitle="Your overall activity score calculated from steps & workouts.">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weeklyData}>
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
            </ChartCard>
        </motion.div>

        {/* Bar Chart (Steps vs Calories) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <ChartCard title="Steps Analysis" subtitle="Daily step count vs goal.">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                        <Tooltip cursor={{fill: '#f1f5f9'}} content={<CustomTooltip />} />
                        <Bar dataKey="steps" name="Steps" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={20} />
                    </BarChart>
                </ResponsiveContainer>
            </ChartCard>
        </motion.div>

        {/* Bar Chart (Calories) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <ChartCard title="Calorie Burn" subtitle="Energy expenditure per day.">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                        <Tooltip cursor={{fill: '#f1f5f9'}} content={<CustomTooltip />} />
                        <Bar dataKey="calories" name="Calories" fill="#f97316" radius={[6, 6, 0, 0]} barSize={20} />
                    </BarChart>
                </ResponsiveContainer>
            </ChartCard>
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