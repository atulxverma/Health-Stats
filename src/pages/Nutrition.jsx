import { useState } from "react";
import { useUserData } from "../context/UserDataContext";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { 
  Droplets, 
  Plus, 
  Flame, 
  Utensils, 
  X, 
  ChevronRight,
  Coffee,
  Sun,
  Moon,
  Cookie
} from "lucide-react";

export default function Nutrition() {
  const { dailyStats, updateDailyStats, goals } = useUserData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMealType, setActiveMealType] = useState("Breakfast");
  
  // Local state for the form
  const [foodForm, setFoodForm] = useState({ name: "", calories: "" });

  // Fake "Recent Meals" list (In a real app, this would be in Context/DB)
  // We initialize it empty or with dummy data if you want to see UI immediately
  const [mealsLog, setMealsLog] = useState([]);

  // --- 1. WATER LOGIC ---
  const addWater = (amount) => {
    const newValue = dailyStats.water + amount;
    updateDailyStats({ water: newValue });
    
    // Fun Toast messages based on amount
    if (amount >= 500) toast.success("Hydration Boost! 💧");
    else toast("Sip added", { icon: '💧' });
  };

  // --- 2. FOOD LOGIC ---
  const handleAddFood = (e) => {
    e.preventDefault();
    if (!foodForm.name || !foodForm.calories) return;

    // 1. Update Global Calories
    const newCalories = dailyStats.calories + Number(foodForm.calories);
    updateDailyStats({ calories: newCalories });

    // 2. Add to Local Log for display
    const newMeal = {
      id: Date.now(),
      type: activeMealType,
      name: foodForm.name,
      calories: Number(foodForm.calories)
    };
    setMealsLog([newMeal, ...mealsLog]);

    toast.success(`${activeMealType} logged! 🥗`);
    setFoodForm({ name: "", calories: "" });
    setIsModalOpen(false);
  };

  // Calculate percentages
  const waterPercent = Math.min((dailyStats.water / goals.waterGoal) * 100, 100);
  const caloriePercent = Math.min((dailyStats.calories / goals.caloriesGoal) * 100, 100);

  // Helper for Meal Icons
  const getMealIcon = (type) => {
    if (type === 'Breakfast') return <Coffee size={18} />;
    if (type === 'Lunch') return <Sun size={18} />;
    if (type === 'Dinner') return <Moon size={18} />;
    return <Cookie size={18} />;
  };

  return (
    <div className="container mx-auto max-w-6xl">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
            <h1 className="text-3xl font-bold text-slate-900">Nutrition & Fuel</h1>
            <p className="text-slate-500 mt-1">You are what you eat. Track your macros.</p>
        </div>
        <button 
            onClick={() => { setActiveMealType("Breakfast"); setIsModalOpen(true); }}
            className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95"
        >
            <Plus size={20} /> Log Meal
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: HYDRATION TANK */}
        <div className="lg:col-span-1">
            <div className="bg-gradient-to-b from-cyan-400 to-blue-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-cyan-200 h-full min-h-[400px] flex flex-col justify-between">
                
                {/* Background Waves (Decorative) */}
                <div className="absolute inset-0 opacity-20">
                     <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M0 50 Q 50 60 100 50 L 100 100 L 0 100 Z" fill="white" />
                     </svg>
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                            <Droplets size={24} />
                        </div>
                        <h2 className="text-xl font-bold">Hydration</h2>
                    </div>
                    <p className="text-cyan-100 text-sm">Daily Goal: {goals.waterGoal}ml</p>
                </div>

                {/* The "Water Level" Visual */}
                <div className="relative flex-grow flex items-center justify-center my-8">
                    <div className="relative w-40 h-64 bg-white/10 border-2 border-white/30 rounded-3xl overflow-hidden backdrop-blur-sm">
                         {/* Water Fill */}
                         <motion.div 
                            initial={{ height: 0 }}
                            animate={{ height: `${waterPercent}%` }}
                            transition={{ type: "spring", bounce: 0, duration: 1.5 }}
                            className="absolute bottom-0 left-0 w-full bg-white/90"
                         />
                         {/* Text overlay */}
                         <div className="absolute inset-0 flex items-center justify-center flex-col z-10 mix-blend-difference">
                             <span className="text-4xl font-black text-cyan-500">{Math.round(waterPercent)}%</span>
                         </div>
                    </div>
                </div>

                {/* Quick Add Buttons */}
                <div className="grid grid-cols-2 gap-3 relative z-10">
                    <button onClick={() => addWater(250)} className="bg-white/20 hover:bg-white/30 backdrop-blur-md py-3 rounded-xl font-bold text-sm transition-all flex flex-col items-center">
                        <span className="text-xs opacity-70">Glass</span>
                        +250ml
                    </button>
                    <button onClick={() => addWater(500)} className="bg-white text-blue-600 hover:bg-cyan-50 py-3 rounded-xl font-bold text-sm transition-all shadow-lg flex flex-col items-center">
                        <span className="text-xs opacity-70">Bottle</span>
                        +500ml
                    </button>
                </div>
            </div>
        </div>

        {/* RIGHT COLUMN: MACROS & MEALS */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* 1. MACRO SUMMARY CARD */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <Flame className="text-orange-500" /> Calories Consumed
                    </h3>
                    <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-4xl font-black text-slate-900">{dailyStats.calories}</span>
                        <span className="text-slate-400 font-medium">/ {goals.caloriesGoal} kcal</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full md:w-64 bg-slate-100 h-3 rounded-full mt-4 overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }} animate={{ width: `${caloriePercent}%` }} 
                            className="bg-orange-500 h-full rounded-full"
                        />
                    </div>
                </div>

                {/* Macro Rings (Visual Only - Simulated based on Calorie goal) */}
                <div className="flex gap-4">
                     <MacroRing label="Carbs" percent={Math.min(caloriePercent * 1.1, 100)} color="#F59E0B" amount="120g" />
                     <MacroRing label="Protein" percent={Math.min(caloriePercent * 0.9, 100)} color="#6366F1" amount="85g" />
                     <MacroRing label="Fat" percent={Math.min(caloriePercent * 0.6, 100)} color="#EF4444" amount="45g" />
                </div>
            </div>

            {/* 2. MEAL JOURNAL */}
            <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-6 px-2">Today's Meals</h3>
                
                <div className="space-y-4">
                    {['Breakfast', 'Lunch', 'Dinner', 'Snack'].map((mealType) => {
                        // Filter logs for this meal type
                        const items = mealsLog.filter(m => m.type === mealType);
                        const totalCal = items.reduce((acc, curr) => acc + curr.calories, 0);

                        return (
                            <div key={mealType} className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100/50">
                                <div className="flex justify-between items-center mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-xl ${
                                            mealType === 'Breakfast' ? 'bg-orange-50 text-orange-500' :
                                            mealType === 'Lunch' ? 'bg-yellow-50 text-yellow-500' :
                                            mealType === 'Dinner' ? 'bg-indigo-50 text-indigo-500' : 'bg-green-50 text-green-500'
                                        }`}>
                                            {getMealIcon(mealType)}
                                        </div>
                                        <span className="font-bold text-slate-700">{mealType}</span>
                                    </div>
                                    <button 
                                        onClick={() => { setActiveMealType(mealType); setIsModalOpen(true); }}
                                        className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>

                                {/* List of food items */}
                                {items.length > 0 ? (
                                    <div className="space-y-2 pl-12">
                                        {items.map((item) => (
                                            <div key={item.id} className="flex justify-between text-sm group">
                                                <span className="text-slate-600 font-medium">{item.name}</span>
                                                <span className="text-slate-400">{item.calories} kcal</span>
                                            </div>
                                        ))}
                                        <div className="border-t border-slate-50 mt-2 pt-2 flex justify-between text-xs font-bold text-slate-400 uppercase">
                                            <span>Total</span>
                                            <span>{totalCal} kcal</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="pl-12 text-xs text-slate-300 italic">No food logged</div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

        </div>
      </div>

      {/* FOOD MODAL */}
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
                    className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative z-10"
                >
                    <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 w-10 h-10 bg-slate-50 hover:bg-slate-100 rounded-full flex items-center justify-center text-slate-500 transition-colors">
                        <X size={20} />
                    </button>
                    
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-orange-50 p-3 rounded-2xl text-orange-500">
                            <Utensils size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Add to {activeMealType}</h2>
                            <p className="text-xs text-slate-400">What did you eat?</p>
                        </div>
                    </div>

                    <form onSubmit={handleAddFood} className="space-y-4">
                        <div>
                            <label className="text-sm font-bold text-slate-700 ml-1">Food Name</label>
                            <input 
                                autoFocus
                                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium mt-1" 
                                placeholder="e.g. Avocado Toast" 
                                value={foodForm.name} 
                                onChange={e => setFoodForm({...foodForm, name: e.target.value})} 
                            />
                        </div>
                        <div>
                            <label className="text-sm font-bold text-slate-700 ml-1">Calories</label>
                            <input 
                                type="number"
                                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium mt-1" 
                                placeholder="350" 
                                value={foodForm.calories} 
                                onChange={e => setFoodForm({...foodForm, calories: e.target.value})} 
                            />
                        </div>

                        <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all mt-2">
                            Add Entry
                        </button>
                    </form>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

    </div>
  );
}

// 🧩 Helper Component: Macro Ring
function MacroRing({ label, percent, color, amount }) {
    return (
        <div className="flex flex-col items-center">
             <div className="relative w-16 h-16 md:w-20 md:h-20 mb-2">
                <svg className="w-full h-full -rotate-90">
                    <circle cx="50%" cy="50%" r="40%" stroke="#f1f5f9" strokeWidth="6" fill="none" />
                    <circle 
                        cx="50%" cy="50%" r="40%" 
                        stroke={color} strokeWidth="6" fill="none" 
                        strokeDasharray="100" strokeDashoffset={100 - percent} 
                        strokeLinecap="round" 
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-bold text-xs text-slate-600">
                    {Math.round(percent)}%
                </div>
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase">{label}</p>
            <p className="text-[10px] text-slate-400">{amount}</p>
        </div>
    );
}