import React, { useState } from "react";
import { useHealthStore } from "../store/useHealthStore";
import { useUserData } from "../context/UserDataContext";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { 
    Sparkles, Utensils, Dumbbell, Clock, Flame, 
    CheckCircle2, Circle, ArrowRight 
} from "lucide-react";

export default function AIPlanDisplay() {
  const { weeklyPlan, addMeal } = useHealthStore();
  const [completedItems, setCompletedItems] = useState([]);

  // --- INTERACTION LOGIC ---
  const handleComplete = (item, category) => {
    if (completedItems.includes(item.name)) return;

    if (category === 'meal') {
        // Log to database/store automatically
        addMeal({
            name: item.name,
            calories: Number(item.calories),
            type: item.type,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        toast.success(`Logged ${item.name}!`, {
            style: { background: '#10B981', color: '#fff' }
        });
    } else {
        toast.success("Workout Marked Complete!", {
            style: { background: '#3B82F6', color: '#fff' }
        });
    }

    setCompletedItems([...completedItems, item.name]);
  };

  if (!weeklyPlan) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* LEFT: TODAY'S FOCUS (Motivation) */}
      <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                      <Sparkles className="text-yellow-400" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Today's Focus</h2>
                  <p className="text-slate-300 text-lg leading-relaxed">"{weeklyPlan.summary}"</p>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/30 rounded-full blur-[60px]"></div>
          </div>

          <div className="bg-blue-600 text-white p-8 rounded-[2.5rem] shadow-xl flex flex-col justify-between h-64 relative overflow-hidden">
              <div className="relative z-10">
                  <h3 className="font-bold text-blue-100 uppercase text-xs tracking-widest mb-1">Training</h3>
                  <h2 className="text-2xl font-bold">{weeklyPlan.workout.type}</h2>
                  <div className="flex gap-3 mt-4">
                      <span className="bg-white/20 px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-1"><Clock size={14}/> {weeklyPlan.workout.duration}</span>
                      <span className="bg-white/20 px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-1"><Flame size={14}/> High</span>
                  </div>
              </div>
              
              {/* Workout List */}
              <div className="relative z-10 space-y-2">
                  {weeklyPlan.workout.exercises.map((ex, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-blue-100">
                          <CheckCircle2 size={16} className="opacity-50" /> {ex}
                      </div>
                  ))}
              </div>
              <Dumbbell className="absolute -bottom-6 -right-6 text-blue-500 opacity-50" size={140} />
          </div>
      </div>

      {/* RIGHT: INTERACTIVE CHECKLIST (Diet) */}
      <div className="lg:col-span-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm h-full">
              <div className="flex items-center justify-between mb-8">
                  <h3 className="font-bold text-slate-800 text-2xl flex items-center gap-3">
                      <Utensils className="text-orange-500" /> Nutrition Roadmap
                  </h3>
                  <span className="text-xs font-bold bg-slate-100 text-slate-500 px-3 py-1 rounded-full">3 Meals</span>
              </div>

              <div className="space-y-4">
                  {weeklyPlan.meals.map((meal, index) => {
                      const isDone = completedItems.includes(meal.name);
                      
                      return (
                        <motion.div 
                            layout
                            key={index} 
                            onClick={() => !isDone && handleComplete(meal, 'meal')}
                            className={`group flex items-center gap-6 p-6 rounded-[2rem] border-2 transition-all cursor-pointer ${
                                isDone 
                                ? 'bg-slate-50 border-transparent opacity-60' 
                                : 'bg-white border-slate-100 hover:border-indigo-600 hover:shadow-lg hover:shadow-indigo-100'
                            }`}
                        >
                            {/* Icon */}
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-sm transition-colors ${
                                isDone ? 'bg-slate-200 grayscale' : 'bg-orange-50'
                            }`}>
                                {meal.type === 'Breakfast' ? '🍳' : meal.type === 'Lunch' ? '🥗' : '🍲'}
                            </div>

                            {/* Content */}
                            <div className="flex-grow">
                                <div className="flex justify-between items-center mb-1">
                                    <p className="text-xs font-bold text-indigo-600 uppercase tracking-wide">{meal.type}</p>
                                    {isDone && <span className="text-xs font-bold text-emerald-600 flex items-center gap-1"><CheckCircle2 size={12}/> DONE</span>}
                                </div>
                                <h4 className={`text-lg font-bold ${isDone ? 'text-slate-500 line-through' : 'text-slate-900'}`}>{meal.name}</h4>
                                <p className="text-sm text-slate-500 mt-1 font-medium">
                                    {meal.calories} kcal • {meal.protein} protein
                                </p>
                            </div>

                            {/* Checkbox Action */}
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                                isDone 
                                ? 'bg-emerald-500 text-white' 
                                : 'bg-slate-100 text-slate-300 group-hover:bg-indigo-600 group-hover:text-white'
                            }`}>
                                {isDone ? <CheckCircle2 size={20} /> : <ArrowRight size={20} />}
                            </div>
                        </motion.div>
                      )
                  })}
              </div>
          </div>
      </div>

    </div>
  );
}