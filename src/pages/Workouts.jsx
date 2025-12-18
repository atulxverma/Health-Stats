import { useState } from "react";
import { useUserData } from "../context/UserDataContext";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { 
  Dumbbell, 
  Clock, 
  Flame, 
  Trash2, 
  Plus, 
  X, 
  Trophy, 
  CalendarDays,
  Search,
  Zap,
  Filter
} from "lucide-react";

export default function Workouts() {
  const { workouts, addWorkout, deleteWorkout } = useUserData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // New Form State with Intensity
  const [form, setForm] = useState({ 
    name: "", 
    duration: "", 
    calories: "", 
    intensity: "Medium", // Default
    date: new Date().toLocaleDateString() 
  });

  // --- 1. SMART ICON LOGIC 🧠 ---
  const getActivityMetadata = (name) => {
    const n = name.toLowerCase();
    
    // Specific Sports
    if (n.includes('run') || n.includes('jog') || n.includes('sprint')) return { icon: '🏃‍♂️', color: 'bg-blue-50 text-blue-500', label: 'Cardio' };
    if (n.includes('cycl') || n.includes('bike') || n.includes('spin')) return { icon: '🚴', color: 'bg-orange-50 text-orange-500', label: 'Cycling' };
    if (n.includes('swim') || n.includes('pool')) return { icon: '🏊', color: 'bg-cyan-50 text-cyan-500', label: 'Swimming' };
    if (n.includes('yoga') || n.includes('pilates') || n.includes('stretch')) return { icon: '🧘', color: 'bg-rose-50 text-rose-500', label: 'Flexibility' };
    if (n.includes('box') || n.includes('fight') || n.includes('mma')) return { icon: '🥊', color: 'bg-red-50 text-red-500', label: 'Combat' };
    if (n.includes('walk') || n.includes('hike')) return { icon: '🚶', color: 'bg-green-50 text-green-500', label: 'Walking' };
    if (n.includes('lift') || n.includes('gym') || n.includes('press')) return { icon: '🏋️', color: 'bg-indigo-50 text-indigo-500', label: 'Strength' };
    
    // DEFAULT "Catch-All" Icon (The common one you asked for)
    return { icon: '⚡', color: 'bg-slate-100 text-slate-600', label: 'Activity' };
  };

  // --- 2. STATS CALCULATIONS ---
  const totalSessions = workouts.length;
  const totalCalories = workouts.reduce((acc, curr) => acc + Number(curr.calories || 0), 0);
  const totalMinutes = workouts.reduce((acc, curr) => acc + Number(curr.duration || 0), 0);

  // --- 3. HANDLERS ---
  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name || !form.duration) return;
    
    addWorkout({ ...form, id: Date.now() });
    setForm({ name: "", duration: "", calories: "", intensity: "Medium", date: new Date().toLocaleDateString() });
    setIsModalOpen(false);
    toast.success("Workout logged! Great job! 💪");
  };

  const handleDelete = (id) => {
    deleteWorkout(id);
    toast("Workout removed", { icon: '🗑️' });
  };

  // Filter Workouts based on Search
  const filteredWorkouts = workouts.filter(w => 
    w.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).reverse();

  return (
    <div className="container mx-auto max-w-6xl">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
            <h1 className="text-3xl font-bold text-slate-900">Training Log</h1>
            <p className="text-slate-500 mt-1">Track your consistency and intensity.</p>
        </div>
        <div className="flex gap-3">
             {/* Search Bar */}
            <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search activity..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none w-64 text-sm font-medium"
                />
            </div>
            <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95"
            >
                <Plus size={20} /> Log Workout
            </button>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
         {/* Sessions */}
         <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                <Dumbbell size={28} />
            </div>
            <div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Sessions</p>
                <p className="text-3xl font-black text-slate-800">{totalSessions}</p>
            </div>
         </div>
         {/* Duration */}
         <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600">
                <Clock size={28} />
            </div>
            <div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Duration</p>
                <p className="text-3xl font-black text-slate-800">{totalMinutes} <span className="text-sm font-medium text-slate-400">min</span></p>
            </div>
         </div>
         {/* Calories */}
         <div className="bg-slate-900 p-6 rounded-[2rem] border border-slate-800 shadow-xl flex items-center gap-5 text-white relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-orange-500/30 rounded-full blur-2xl"></div>
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-orange-400 relative z-10">
                <Flame size={28} fill="currentColor" />
            </div>
            <div className="relative z-10">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Burned</p>
                <p className="text-3xl font-black">{totalCalories} <span className="text-sm font-medium text-slate-500">kcal</span></p>
            </div>
         </div>
      </div>

      {/* CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LIST SECTION */}
        <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <CalendarDays size={20} className="text-slate-400" />
                    <h3 className="font-bold text-slate-700">History</h3>
                </div>
                <div className="md:hidden"> {/* Mobile Search */}
                   <Search size={20} className="text-slate-400" />
                </div>
            </div>

            <div className="space-y-4">
                {filteredWorkouts.length === 0 ? (
                    <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2rem] p-12 text-center flex flex-col items-center">
                        <div className="bg-slate-50 p-4 rounded-full mb-4">
                            <Dumbbell className="text-slate-300" size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-700">No workouts found</h3>
                        <p className="text-slate-400 mt-2">Log activity to see it here.</p>
                    </div>
                ) : (
                    <AnimatePresence>
                        {filteredWorkouts.map((w) => {
                            const meta = getActivityMetadata(w.name);
                            return (
                                <motion.div 
                                    key={w.id} 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, height: 0 }}
                                    layout
                                    className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                                >
                                    <div className="flex items-center gap-5">
                                        {/* Smart Icon Container */}
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm ${meta.color}`}>
                                            {meta.icon}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-bold text-slate-800 text-lg">{w.name}</h4>
                                                {/* Intensity Badge */}
                                                {w.intensity && (
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                                        w.intensity === 'High' ? 'bg-red-50 text-red-500' : 
                                                        w.intensity === 'Medium' ? 'bg-yellow-50 text-yellow-600' : 'bg-green-50 text-green-600'
                                                    }`}>
                                                        {w.intensity}
                                                    </span>
                                                )}
                                            </div>
                                            
                                            <div className="flex flex-wrap gap-3 text-xs font-bold text-slate-500 mt-1">
                                                <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md">
                                                    <Clock size={12} /> {w.duration}m
                                                </span>
                                                <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md">
                                                    <Flame size={12} /> {w.calories} cal
                                                </span>
                                                <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md">
                                                    {w.date || "Today"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleDelete(w.id)} 
                                        className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-300 hover:bg-red-50 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                )}
            </div>
        </div>
        
        {/* RIGHT: SIDEBAR */}
        <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 text-white p-8 rounded-[2rem] sticky top-28 shadow-xl shadow-indigo-200">
                <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                        <Trophy size={24} className="text-yellow-300" />
                    </div>
                    <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-bold">Week 42</span>
                </div>
                
                <h3 className="text-2xl font-bold mb-2">Keep it up! 🔥</h3>
                <p className="text-indigo-200 text-sm mb-6">You've logged {workouts.length} workouts. Consistency is key.</p>
                
                <div className="space-y-4">
                    <div className="bg-black/20 p-4 rounded-xl flex items-center gap-3">
                        <Zap size={20} className="text-yellow-400"/>
                        <div>
                            <p className="text-xs text-indigo-200 font-bold uppercase">Most Active</p>
                            <p className="font-bold">Cycling</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

      </div>

      {/* MODAL */}
      <AnimatePresence>
        {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onClick={() => setIsModalOpen(false)}
                    className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                ></motion.div>

                <motion.div 
                    initial={{ scale: 0.95, opacity: 0, y: 20 }} 
                    animate={{ scale: 1, opacity: 1, y: 0 }} 
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl relative z-10"
                >
                    <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 w-10 h-10 bg-slate-50 hover:bg-slate-100 rounded-full flex items-center justify-center text-slate-500 transition-colors">
                        <X size={20} />
                    </button>
                    
                    <h2 className="text-2xl font-bold text-slate-900 mb-1">Log Activity</h2>
                    <p className="text-slate-500 mb-6">Add details about your session.</p>

                    <form onSubmit={handleAdd} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Activity Name</label>
                            <input autoFocus className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium" placeholder="e.g. Cycling, Boxing, Yoga..." value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                        </div>
                        
                        {/* New Intensity Selector */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Intensity</label>
                            <div className="grid grid-cols-3 gap-3">
                                {['Low', 'Medium', 'High'].map((level) => (
                                    <button
                                        key={level}
                                        type="button"
                                        onClick={() => setForm({...form, intensity: level})}
                                        className={`py-3 rounded-xl text-sm font-bold border transition-all ${
                                            form.intensity === level 
                                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' 
                                            : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                                        }`}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Duration (min)</label>
                                <input type="number" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium" placeholder="45" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} />
                             </div>
                             <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Calories</label>
                                <input type="number" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium" placeholder="350" value={form.calories} onChange={e => setForm({...form, calories: e.target.value})} />
                             </div>
                        </div>

                        <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all mt-2">
                            Save Workout
                        </button>
                    </form>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </div>
  );
}