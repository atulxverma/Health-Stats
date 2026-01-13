import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useHealthStore = create(
  persist(
    (set, get) => ({
      
      // --- STATE ---
      userProfile: null,
      weeklyPlan: null,
      dailyStats: { steps: 2500, water: 0, calories: 0 },
      goals: { stepsGoal: 8000, waterGoal: 3000, caloriesGoal: 2000 },
      workouts: [],
      meals: [],
      history: [],
      isLoading: false,
      error: null,

      // --- ACTIONS ---
      setProfile: (data) => set({ userProfile: data }),
      
      updateGoals: (newGoals) => set((state) => ({ goals: { ...state.goals, ...newGoals } })),
      
      addWater: (amount) => set((state) => ({ 
        dailyStats: { ...state.dailyStats, water: (state.dailyStats.water || 0) + amount } 
      })),

      // ADD WORKOUT (Updates Calories)
      addWorkout: (workout) => set((state) => {
        const burned = Number(workout.calories) || 0;
        return {
          workouts: [workout, ...state.workouts],
          // Note: Usually burned calories are separate, but for UI simplicity we might add to dailyStats if that's the logic
          // If you want 'Calories' on dashboard to be 'Burned', use this line:
          // dailyStats: { ...state.dailyStats, calories: (state.dailyStats.calories || 0) + burned } 
        };
      }),

      deleteWorkout: (id) => set((state) => ({ 
        workouts: state.workouts.filter((w) => w.id !== id) 
      })),

      // ADD MEAL (Updates Calories Consumed)
      addMeal: (meal) => set((state) => {
        const consumed = Number(meal.calories) || 0;
        return {
          meals: [meal, ...state.meals],
          dailyStats: { 
            ...state.dailyStats, 
            calories: (state.dailyStats.calories || 0) + consumed 
          }
        };
      }),

      // DELETE MEAL (Fixed Logic)
      deleteMeal: (id) => set((state) => {
        const mealToDelete = state.meals.find((m) => m.id === id);
        if (!mealToDelete) return state;

        const consumed = Number(mealToDelete.calories) || 0;
        return {
          meals: state.meals.filter((m) => m.id !== id),
          dailyStats: { 
            ...state.dailyStats, 
            calories: Math.max(0, (state.dailyStats.calories || 0) - consumed) 
          }
        };
      }),

      // --- SMART LOGIC GENERATOR (No Server Needed) ---
      generatePlan: async () => {
        const { userProfile } = get();
        if (!userProfile) return;

        set({ isLoading: true });

        // Simulate AI Thinking
        setTimeout(() => {
            const isVeg = userProfile.dietType === 'Vegetarian' || userProfile.dietType === 'Vegan';
            const isMuscle = userProfile.goal === 'Build Muscle';
            const isLoss = userProfile.goal === 'Lose Weight';

            const plan = {
                summary: isMuscle 
                    ? `Hypertrophy Focus: High protein & progressive overload.`
                    : `Fat Loss Focus: Calorie deficit & high intensity cardio.`,
                
                meals: [
                    { 
                        type: "Breakfast", 
                        name: isVeg ? "Oatmeal & Protein Shake" : "3 Eggs & Toast", 
                        calories: 400, protein: isVeg ? "15g" : "20g" 
                    },
                    { 
                        type: "Lunch", 
                        name: isVeg ? "Paneer/Tofu Curry & Rice" : "Grilled Chicken & Quinoa", 
                        calories: 600, protein: isVeg ? "20g" : "35g" 
                    },
                    { 
                        type: "Dinner", 
                        name: isVeg ? "Lentil Soup & Salad" : "Baked Fish & Veggies", 
                        calories: 450, protein: isVeg ? "15g" : "28g" 
                    }
                ],
                workout: {
                    type: isMuscle ? "Strength Training" : "HIIT Cardio",
                    duration: isMuscle ? "60 min" : "40 min",
                    exercises: isMuscle 
                        ? ["Bench Press", "Squats", "Deadlifts"] 
                        : ["Burpees", "Mountain Climbers", "Sprints"]
                }
            };

            set({ weeklyPlan: plan, isLoading: false });
        }, 1500);
      },
      
      reset: () => {
          set({ 
            userProfile: null, 
            weeklyPlan: null, 
            dailyStats: { steps: 0, water: 0, calories: 0 }, 
            workouts: [], 
            meals: [] 
          });
          localStorage.removeItem('health-storage');
          window.location.reload();
      },

      // Empty function to prevent crash if App.jsx calls it
      initializeUser: () => {} 

    }),
    {
      name: 'health-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);