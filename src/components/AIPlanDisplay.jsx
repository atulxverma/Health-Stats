import React, { useState } from "react";
import { useHealthStore } from "../store/useHealthStore";
import { useUserData } from "../context/UserDataContext";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Sparkles, Utensils, Dumbbell, Clock, Flame, CheckCircle2 } from "lucide-react";

export default function AIPlanDisplay() {
  const { weeklyPlan, isLoading } = useHealthStore();
  const { updateDailyStats, dailyStats } = useUserData();
  
  // Track which items are completed locally
  const [completedItems, setCompletedItems] = useState([]);

  // --- HANDLE COMPLETION ---
  const handleComplete = (item, category) => {
    // 1. Check if already done
    if (completedItems.includes(item.name)) return;

    // 2. Add to stats
    if (category === 'meal') {
        updateDailyStats({ calories: dailyStats.calories + Number(item.calories) });
        toast.success(`Logged ${item.calories} kcal! 🥗`);
    } else {
        // Workout logic (Optional: add calorie burn if you want)
        toast.success("Workout Completed! 💪");
    }

    // 3. Mark as done visually
    setCompletedItems([...completedItems, item.name]);
  };

  if (isLoading) return null; // Parent component handles loading UI
  if (!weeklyPlan) return null;

  return (
    <div className="space-y-8">
      
      {/* MOTIVATION BANNER */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-600 to-violet-600 p-8 rounded-[2rem] text-white shadow-xl relative overflow-hidden"
      >
        <div className="relative z-10">
            <h2 className="text-2xl font-bold flex items-center gap-2">
                <Sparkles className="text-yellow-300" /> Today's AI Focus
            </h2>
            <p className="text-indigo-100 mt-2 text-lg italic">"{weeklyPlan.summary}"</p>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10">
            <Dumbbell size={150} />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* DIET PLAN */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
              <h3 className="font-bold text-slate-800 text-xl mb-6 flex items-center gap-2">
                  <Utensils className="text-orange-500" /> Nutrition Plan
              </h3>
              <div className="space-y-4">
                  {weeklyPlan.meals.map((meal, index) => {
                      const isDone = completedItems.includes(meal.name);
                      return (
                        <div 
                            key={index} 
                            onClick={() => handleComplete(meal, 'meal')}
                            className={`flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${
                                isDone 
                                ? 'bg-slate-50 border-slate-100 opacity-60 grayscale' 
                                : 'bg-white border-indigo-50 hover:border-indigo-200 hover:shadow-md'
                            }`}
                        >
                            <div className="bg-white p-3 rounded-xl shadow-sm text-2xl">
                                {isDone ? '✅' : (meal.type === 'Breakfast' ? '🍳' : meal.type === 'Lunch' ? '🥗' : '🍲')}
                            </div>
                            <div className="flex-grow">
                                <div className="flex justify-between">
                                    <p className="text-xs font-bold text-indigo-600 uppercase tracking-wide">{meal.type}</p>
                                    {isDone && <span className="text-xs font-bold text-green-600">COMPLETED</span>}
                                </div>
                                <h4 className={`font-bold ${isDone ? 'text-slate-500 line-through' : 'text-slate-800'}`}>{meal.name}</h4>
                                <p className="text-xs text-slate-500 mt-1 flex gap-3">
                                    <span>🔥 {meal.calories} kcal</span>
                                    <span>🥩 {meal.protein} protein</span>
                                </p>
                            </div>
                            {!isDone && (
                                <button className="p-2 rounded-full hover:bg-indigo-50 text-indigo-300 hover:text-indigo-600">
                                    <CheckCircle2 size={20} />
                                </button>
                            )}
                        </div>
                      )
                  })}
              </div>
          </div>

          {/* WORKOUT PLAN */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
              <h3 className="font-bold text-slate-800 text-xl mb-6 flex items-center gap-2">
                  <Dumbbell className="text-blue-500" /> Workout Routine
              </h3>
              
              <div className="bg-blue-50 p-5 rounded-2xl mb-6 border border-blue-100">
                  <div className="flex justify-between items-center mb-2">
                      <h4 className="font-bold text-blue-900 text-lg">{weeklyPlan.workout.type}</h4>
                      <span className="bg-white text-blue-600 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                          {weeklyPlan.workout.duration}
                      </span>
                  </div>
                  <div className="flex gap-2 text-sm text-blue-700">
                      <span className="flex items-center gap-1"><Clock size={14}/> Duration</span>
                      <span className="flex items-center gap-1"><Flame size={14}/> High Burn</span>
                  </div>
              </div>

              <div className="space-y-3">
                  {weeklyPlan.workout.exercises.map((ex, index) => {
                      const isDone = completedItems.includes(ex);
                      return (
                        <div 
                            key={index} 
                            onClick={() => handleComplete({ name: ex }, 'workout')}
                            className={`flex items-center gap-3 p-3 rounded-xl transition-colors cursor-pointer ${
                                isDone ? 'bg-slate-100 text-slate-400 line-through' : 'hover:bg-slate-50 text-slate-700'
                            }`}
                        >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                                isDone ? 'bg-slate-300 text-white' : 'bg-slate-900 text-white'
                            }`}>
                                {isDone ? '✓' : index + 1}
                            </div>
                            <p className="font-medium">{ex}</p>
                        </div>
                      )
                  })}
              </div>
          </div>

      </div>
    </div>
  );
}