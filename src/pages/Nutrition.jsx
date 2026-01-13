import { useState } from "react";
import { useHealthStore } from "../store/useHealthStore";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { 
  Plus, X, Droplet, Flame, Utensils, Coffee, Sun, Moon, Cookie, Trash2, Sparkles 
} from "lucide-react";

export default function Nutrition() {
  // ✅ 1. 'weeklyPlan' ko bhi import kiya
  const { dailyStats, addWater, addMeal, deleteMeal, goals, meals, weeklyPlan } = useHealthStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMealType, setActiveMealType] = useState("Breakfast");
  const [foodForm, setFoodForm] = useState({ name: "", calories: "" });

  // --- ACTIONS ---
  const handleAddWater = (amount) => {
    addWater(amount);
    toast.success(`Hydration +${amount}ml`);
  };

  const handleAddFood = (e) => {
    e.preventDefault();
    if (!foodForm.name || !foodForm.calories) return;

    addMeal({
      id: Date.now(),
      type: activeMealType,
      name: foodForm.name,
      calories: Number(foodForm.calories),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    toast.success(`${activeMealType} logged`);
    setFoodForm({ name: "", calories: "" });
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
      deleteMeal(id);
      toast.success("Meal removed");
  }

  // ✅ 2. AI MEAL QUICK LOG FUNCTION
  const logAIMeal = (aiMeal) => {
      addMeal({
          id: Date.now(),
          type: aiMeal.type,
          name: aiMeal.name,
          calories: Number(aiMeal.calories),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      toast.success("AI Meal Added! 🥗");
  }

  const waterPercent = Math.min((Number(dailyStats.water || 0) / (goals.waterGoal || 1)) * 100, 100);
  const caloriePercent = Math.min((Number(dailyStats.calories || 0) / (goals.caloriesGoal || 1)) * 100, 100);

  const getMealIcon = (type) => {
    if (type === "Breakfast") return <Coffee size={18} />;
    if (type === "Lunch") return <Sun size={18} />;
    if (type === "Dinner") return <Moon size={18} />;
    return <Cookie size={18} />;
  };

  return (
    <div className="container mx-auto max-w-6xl relative p-6">
      
      {/* HEADER */}
      <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Nutrition</h1>
          <p className="text-slate-500 mt-1">Track your fuel and hydration.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* LEFT: STATS & LOG */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* HERO CARD */}
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/30 rounded-full blur-[80px] -z-10"></div>
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-2"><Flame className="text-orange-500" fill="currentColor" size={20} /><h2 className="font-bold text-lg">Calories</h2></div>
                        <div className="flex items-baseline gap-2"><span className="text-5xl font-black">{dailyStats.calories}</span><span className="text-slate-400 font-medium">/ {goals.caloriesGoal} kcal</span></div>
                    </div>
                    <div className="relative w-24 h-24">
                        <svg className="w-full h-full -rotate-90"><circle cx="50%" cy="50%" r="40%" stroke="#334155" strokeWidth="8" fill="none" /><motion.circle initial={{ strokeDashoffset: 251 }} animate={{ strokeDashoffset: 251 - (251 * caloriePercent) / 100 }} cx="50%" cy="50%" r="40%" stroke="#F97316" strokeWidth="8" fill="none" strokeDasharray="251" strokeLinecap="round" /></svg>
                        <div className="absolute inset-0 flex items-center justify-center font-bold text-sm">{Math.round(caloriePercent)}%</div>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <MacroBar label="Protein" val="85g" color="bg-indigo-500" percent={60} />
                    <MacroBar label="Carbs" val="120g" color="bg-blue-500" percent={45} />
                    <MacroBar label="Fat" val="45g" color="bg-rose-500" percent={70} />
                </div>
            </div>

            {/* ✅ 3. AI SUGGESTIONS SECTION (ADDED BACK) */}
            {weeklyPlan && (
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-[2.5rem] border border-indigo-100">
                    <h3 className="font-bold text-indigo-900 mb-4 flex items-center gap-2">
                        <Sparkles size={18} className="text-indigo-600" fill="currentColor"/> AI Recommended for Today
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {weeklyPlan.meals.map((m, i) => (
                            <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-transparent hover:border-indigo-200 transition-all group relative">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{m.type}</p>
                                    <p className="font-bold text-slate-800 text-sm leading-tight line-clamp-2">{m.name}</p>
                                </div>
                                <div className="flex justify-between items-end mt-3 border-t border-slate-50 pt-3">
                                    <span className="text-xs font-bold text-slate-500">{m.calories} kcal</span>
                                    {/* Quick Add Button */}
                                    <button onClick={() => logAIMeal(m)} className="bg-indigo-50 text-indigo-600 p-1.5 rounded-lg hover:bg-indigo-600 hover:text-white transition-colors cursor-pointer">
                                        <Plus size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* LOG LIST */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-xl text-slate-800">Timeline</h3>
                    <span className="text-xs font-bold bg-slate-100 text-slate-500 px-3 py-1 rounded-full">Today</span>
                </div>

                <div className="space-y-6">
                    {['Breakfast', 'Lunch', 'Dinner', 'Snack'].map((type) => {
                        const items = meals.filter(m => m.type === type);
                        
                        return (
                            <div key={type}>
                                <div className="flex justify-between items-center mb-3 px-2">
                                    <h4 className="font-bold text-slate-700 text-sm uppercase tracking-wider">{type}</h4>
                                    <button 
                                        onClick={() => { setActiveMealType(type); setIsModalOpen(true); }}
                                        className="text-indigo-600 text-xs font-bold hover:underline"
                                    >
                                        + Add Item
                                    </button>
                                </div>
                                
                                {items.length > 0 ? (
                                    <div className="space-y-3">
                                        {items.map(item => (
                                            <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors group">
                                                <div className="flex items-center gap-4">
                                                    <div className="bg-white p-2.5 rounded-xl text-slate-500 shadow-sm">
                                                        {getMealIcon(type)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-800 text-sm">{item.name}</p>
                                                        <p className="text-xs text-slate-400">{item.time}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="font-bold text-slate-900 text-sm">{item.calories} kcal</span>
                                                    <button onClick={() => handleDelete(item.id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Trash2 size={16}/>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-4 rounded-2xl border-2 border-dashed border-slate-100 text-center text-slate-400 text-sm">
                                        No food logged
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>

        {/* RIGHT: HYDRATION */}
        <div className="lg:col-span-1 sticky top-24">
            <div className="bg-white p-2 rounded-[2.5rem] border border-slate-100 shadow-xl h-[600px] flex flex-col">
                <div className="bg-blue-50 rounded-[2rem] flex-grow p-6 flex flex-col relative overflow-hidden">
                    <div className="flex items-center justify-between mb-6 relative z-10"><h3 className="font-bold text-blue-900 text-lg flex items-center gap-2"><Droplet size={20} fill="currentColor" /> Hydration</h3><span className="text-xs font-bold text-blue-400 uppercase">{goals.waterGoal}ml Goal</span></div>
                    <div className="relative flex-grow flex items-center justify-center my-4">
                        <div className="relative w-32 h-64 bg-white/40 border-4 border-white rounded-[3rem] overflow-hidden shadow-inner">
                            <motion.div animate={{ height: `${waterPercent}%` }} transition={{ type: "spring", bounce: 0, duration: 1.5 }} className="absolute bottom-0 w-full bg-blue-500 opacity-80" />
                            <div className="absolute inset-0 flex items-center justify-center z-10 mix-blend-overlay"><span className="text-4xl font-black text-slate-900">{Math.round(waterPercent)}%</span></div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-auto relative z-10">
                        <button onClick={() => handleAddWater(250)} className="bg-white hover:bg-blue-100 py-3 rounded-xl font-bold text-sm text-blue-600 transition-all shadow-sm">+ 250ml</button>
                        <button onClick={() => handleAddWater(500)} className="bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-bold text-sm text-white transition-all shadow-md">+ 500ml</button>
                    </div>
                </div>
            </div>
        </div>

      </div>

      {/* MODAL */}
      <AnimatePresence>
        {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-slate-900/40 backdrop-blur-sm">
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0, y: 20 }} 
                    animate={{ scale: 1, opacity: 1, y: 0 }} 
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative z-10"
                >
                    <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 w-10 h-10 bg-slate-50 hover:bg-slate-100 rounded-full flex items-center justify-center text-slate-500 transition-colors">
                        <X size={20} />
                    </button>
                    
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                            <Utensils size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Add to {activeMealType}</h2>
                            <p className="text-xs text-slate-500 font-medium">Log your food intake</p>
                        </div>
                    </div>

                    <form onSubmit={handleAddFood} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Food Name</label>
                            <input 
                                autoFocus
                                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none font-medium transition-all" 
                                placeholder="e.g. Grilled Chicken" 
                                value={foodForm.name} 
                                onChange={e => setFoodForm({...foodForm, name: e.target.value})} 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Calories</label>
                            <input 
                                type="number"
                                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none font-medium transition-all" 
                                placeholder="450" 
                                value={foodForm.calories} 
                                onChange={e => setFoodForm({...foodForm, calories: e.target.value})} 
                            />
                        </div>

                        <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all mt-2">
                            Log Entry
                        </button>
                    </form>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

    </div>
  );
}

function MacroBar({ label, val, color, percent }) {
    return (
        <div>
            <div className="flex justify-between text-xs font-bold text-slate-400 mb-1">
                <span>{label}</span>
                <span className="text-white">{val}</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${color}`} style={{ width: `${percent}%` }}></div>
            </div>
        </div>
    );
}