import React, { useState } from "react";
import { useHealthStore } from "../store/useHealthStore";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { 
  Dumbbell, Clock, Flame, Trash2, Plus, X, 
  Trophy, Calendar, Activity, Search, Sparkles
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function Workouts() {
  const { workouts, addWorkout, deleteWorkout, weeklyPlan } = useHealthStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", duration: "", calories: "", intensity: "Medium" });
  const [searchTerm, setSearchTerm] = useState("");
  
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]); // YYYY-MM-DD format

  const totalSessions = workouts.length;
  const totalCalories = workouts.reduce((acc, curr) => acc + Number(curr.calories || 0), 0);
  const totalMinutes = workouts.reduce((acc, curr) => acc + Number(curr.duration || 0), 0);

  const intensityData = [
    { name: 'Low', value: workouts.filter(w => w.intensity === 'Low').length, color: '#10B981' },
    { name: 'Medium', value: workouts.filter(w => w.intensity === 'Medium').length, color: '#F59E0B' },
    { name: 'High', value: workouts.filter(w => w.intensity === 'High').length, color: '#EF4444' },
  ].filter(d => d.value > 0);

  const getWeeklyConsistency = () => {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    startOfWeek.setHours(0,0,0,0);
    const activeDays = new Set(workouts.filter(w => new Date(w.date) >= startOfWeek).map(w => w.date));
    return activeDays.size;
  };
  const activeDaysCount = getWeeklyConsistency();
  const consistencyPercent = Math.min((activeDaysCount / 5) * 100, 100);
  
  const filteredWorkouts = workouts.filter(w => {
      const wDate = new Date(w.date).toISOString().split('T')[0];
      const isDateMatch = filterDate ? wDate === filterDate : true;
      
      const selected = new Date(filterDate);
      const current = new Date(w.date);
      const isSameMonth = selected.getMonth() === current.getMonth() && selected.getFullYear() === current.getFullYear();

      const matchesSearch = w.name.toLowerCase().includes(searchTerm.toLowerCase());
      return isSameMonth && matchesSearch;
  }).reverse();

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name) return;
    addWorkout({ 
        ...form, 
        id: Date.now(), 
        date: new Date().toLocaleDateString('en-US') 
    });
    setForm({ name: "", duration: "", calories: "", intensity: "Medium" });
    setIsModalOpen(false);
    toast.success("Workout Recorded! 🔥");
  };

  const logAIWorkout = () => {
      if(!weeklyPlan) return;
    
      const dur = parseInt(weeklyPlan.workout.duration) || 45; 
      
      addWorkout({
          id: Date.now(), 
          date: new Date().toLocaleDateString('en-US'),
          name: weeklyPlan.workout.type, 
          duration: dur, 
          calories: 350,
          intensity: "High"
      });
      toast.success("AI Session Logged! 💪");
  };

  const handleDelete = (id) => {
    deleteWorkout(id);
    toast.success("Entry deleted.");
  };

  const getActivityMetadata = (name) => {
    const n = name.toLowerCase();
    if (n.includes('run') || n.includes('jog')) return { icon: '🏃‍♂️', color: 'bg-blue-50 text-blue-500' };
    if (n.includes('cycl') || n.includes('bike')) return { icon: '🚴', color: 'bg-orange-50 text-orange-500' };
    if (n.includes('swim')) return { icon: '🏊', color: 'bg-cyan-50 text-cyan-500' };
    if (n.includes('yoga')) return { icon: '🧘', color: 'bg-rose-50 text-rose-500' };
    if (n.includes('lift') || n.includes('gym')) return { icon: '🏋️', color: 'bg-indigo-50 text-indigo-500' };
    return { icon: '⚡', color: 'bg-slate-100 text-slate-600' };
  };

  return (
    <div className="container mx-auto max-w-7xl p-6">
      
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
            <h1 className="text-3xl font-bold text-slate-900">Activity Hub</h1>
            <p className="text-slate-500 mt-1">Track every move, count every rep.</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search logs..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none w-full md:w-64 text-sm font-bold text-slate-700 bg-white shadow-sm"
                />
            </div>

            <button onClick={() => setIsModalOpen(true)} className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-black transition-all shadow-xl hover:scale-105 active:scale-95">
                <Plus size={20} /> <span className="hidden sm:inline">Log</span>
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="space-y-6">
            
            {weeklyPlan && (
                <div className="bg-slate-900 text-white p-6 rounded-[2rem] shadow-xl relative overflow-hidden group">
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                <Sparkles className="text-yellow-400" size={18}/> AI Session
                            </h3>
                            <button onClick={logAIWorkout} className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">Log It</button>
                        </div>
                        <h2 className="text-2xl font-bold mb-3">{weeklyPlan.workout.type}</h2>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                            {weeklyPlan.workout.exercises.map((ex, i) => (
                                <span key={i} className="text-xs bg-black/40 border border-white/10 px-2.5 py-1 rounded-md text-slate-300">
                                    {ex}
                                </span>
                            ))}
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs font-medium text-indigo-300 border-t border-white/10 pt-3">
                            <span className="flex items-center gap-1"><Clock size={12}/> {weeklyPlan.workout.duration}</span>
                            <span>•</span>
                            <span>High Intensity</span>
                        </div>
                    </div>
                    <Dumbbell className="absolute -bottom-4 -right-4 text-indigo-500 opacity-20 group-hover:scale-110 transition-transform duration-500" size={100} />
                </div>
            )}

            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                        <div><p className="text-indigo-200 text-xs font-bold uppercase tracking-wider mb-1">Weekly Goal</p><h3 className="text-2xl font-bold">Consistency</h3></div>
                        <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm"><Trophy className="text-yellow-300" size={24} /></div>
                    </div>
                    <div className="flex items-end gap-2 mb-2"><span className="text-5xl font-black">{activeDaysCount}</span><span className="text-xl text-indigo-200 font-medium mb-1">/ 5 days</span></div>
                    <div className="w-full h-3 bg-black/20 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${consistencyPercent}%` }} className="h-full bg-yellow-400 rounded-full" /></div>
                </div>
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
            </div>

            <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm min-h-[250px] flex flex-col items-center justify-center relative">
                <div className="w-full flex justify-between items-center mb-2"><h4 className="text-slate-800 font-bold">Intensity</h4><Activity size={18} className="text-slate-400"/></div>
                {intensityData.length > 0 ? (
                    <div className="w-full h-40 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={intensityData} innerRadius={45} outerRadius={65} paddingAngle={5} dataKey="value" stroke="none">{intensityData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}</Pie>
                                <Tooltip contentStyle={{borderRadius:'12px', border:'none'}} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"><span className="text-2xl font-bold text-slate-900">{totalSessions}</span><span className="text-[10px] text-slate-400 font-bold uppercase">Total</span></div>
                    </div>
                ) : <div className="text-center text-slate-400 text-sm py-8">No data yet</div>}
                <div className="flex gap-3 mt-2">{intensityData.map((d) => (<div key={d.name} className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></div>{d.name}</div>))}</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border border-slate-200 shadow-sm p-5 rounded-[2rem] flex flex-col justify-center items-center text-center"><Flame className="text-orange-500 mb-2" size={24} /><p className="text-2xl font-black text-slate-900">{totalCalories}</p><p className="text-xs font-bold text-slate-400 uppercase">Kcal Burned</p></div>
                <div className="bg-white border border-slate-200 shadow-sm p-5 rounded-[2rem] flex flex-col justify-center items-center text-center"><Clock className="text-blue-500 mb-2" size={24} /><p className="text-2xl font-black text-slate-900">{Math.round(totalMinutes/60)}<span className="text-sm">h</span> {totalMinutes%60}<span className="text-sm">m</span></p><p className="text-xs font-bold text-slate-400 uppercase">Time Active</p></div>
            </div>
        </div>


        <div className="lg:col-span-2 space-y-6">
            
            <div className="flex items-center justify-between">
                <h3 className="font-bold text-xl text-slate-800 flex items-center gap-2">
                    <Calendar className="text-slate-400" size={20} /> History
                </h3>
                
                <div className="relative">
                    <input 
                        type="date" 
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                        className="bg-white border border-slate-200 text-slate-700 font-bold text-sm rounded-xl px-4 py-2 shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
                    />
                </div>
            </div>

            <div className="space-y-4">
                {filteredWorkouts.length === 0 ? (
                    <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2rem] p-16 text-center">
                        <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"><Dumbbell className="text-slate-300" size={32} /></div>
                        <h3 className="text-lg font-bold text-slate-700">No logs found</h3>
                        <p className="text-slate-400 mt-1 max-w-xs mx-auto text-sm">
                            No workouts found for {new Date(filterDate).toLocaleString('default', { month: 'long' })}.
                        </p>
                    </div>
                ) : (
                    filteredWorkouts.map((w) => {
                        const meta = getActivityMetadata(w.name);
                        return (
                            <motion.div key={w.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group flex flex-col md:flex-row items-center gap-6">
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-sm ${meta.color}`}>{meta.icon}</div>
                                <div className="flex-grow text-center md:text-left">
                                    <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                                        <h4 className="font-bold text-lg text-slate-900">{w.name}</h4>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${w.intensity === 'High' ? 'bg-red-100 text-red-600' : w.intensity === 'Medium' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>{w.intensity}</span>
                                    </div>
                                    <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-slate-500 font-medium">
                                        <span className="flex items-center gap-1"><Clock size={14} className="text-slate-400" /> {w.duration} min</span>
                                        <span className="flex items-center gap-1"><Flame size={14} className="text-slate-400" /> {w.calories} kcal</span>
                                        <span className="text-slate-300">•</span>
                                        <span>{w.date}</span>
                                    </div>
                                </div>
                                <button onClick={() => handleDelete(w.id)} className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"><Trash2 size={18} /></button>
                            </motion.div>
                        );
                    })
                )}
            </div>

        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/40 backdrop-blur-sm">
                <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white w-full max-w-md rounded-[2rem] p-8 shadow-2xl relative">
                    <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 w-8 h-8 bg-slate-50 hover:bg-slate-100 rounded-full flex items-center justify-center text-slate-400 transition-colors"><X size={18} /></button>
                    <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">Record Activity</h2>
                    <form onSubmit={handleAdd} className="space-y-4">
                        <input autoFocus className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800" placeholder="e.g. Morning Run" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                        <div className="grid grid-cols-2 gap-4">
                            <input type="number" className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800" placeholder="Minutes" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} />
                            <input type="number" className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800" placeholder="Calories" value={form.calories} onChange={e => setForm({...form, calories: e.target.value})} />
                        </div>
                        <div className="grid grid-cols-3 gap-2 mt-1">
                            {['Low', 'Medium', 'High'].map(level => (
                                <button type="button" key={level} onClick={() => setForm({...form, intensity: level})} className={`py-2 rounded-xl text-xs font-bold border transition-all ${form.intensity === level ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}>{level}</button>
                            ))}
                        </div>
                        <button className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg hover:bg-indigo-700 transition-all mt-2">Save Record</button>
                    </form>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

    </div>
  );
}