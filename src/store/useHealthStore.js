import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// TERI KEY
const API_KEY = "AIzaSyC0mFYEEoaiI04r4p4K1ezD9CTtylhsUtM";

export const useHealthStore = create(
  persist(
    (set, get) => ({
      
      // ... (State same rahega) ...
      userProfile: null,
      weeklyPlan: null,
      dailyStats: { steps: 2500, water: 0, calories: 0 },
      goals: { stepsGoal: 8000, waterGoal: 3000, caloriesGoal: 2000 },
      workouts: [],
      meals: [],
      isLoading: false,
      error: null,

      setProfile: (data) => set({ userProfile: data }),
      updateGoals: (newGoals) => set((state) => ({ goals: { ...state.goals, ...newGoals } })),
      addWater: (amount) => set((state) => ({ dailyStats: { ...state.dailyStats, water: (state.dailyStats.water || 0) + amount } })),
      deleteWorkout: (id) => set((state) => ({ workouts: state.workouts.filter((w) => w.id !== id) })),
      addWorkout: (workout) => set((state) => {
        const newCalories = (state.dailyStats.calories || 0) + Number(workout.calories);
        return { workouts: [workout, ...state.workouts], dailyStats: { ...state.dailyStats, calories: newCalories } };
      }),
      addMeal: (meal) => set((state) => {
        const newCalories = (state.dailyStats.calories || 0) + Number(meal.calories);
        return { meals: [meal, ...state.meals], dailyStats: { ...state.dailyStats, calories: newCalories } };
      }),

      // --- 🧠 AI LOGIC (DIRECT FETCH - NO SDK) ---
      generatePlan: async () => {
        const { userProfile } = get();
        if (!userProfile) return;

        set({ isLoading: true, error: null });

        try {
          console.log("🔵 Calling Gemini via Fetch...");

          const prompt = `
            Act as a fitness coach. Create a 1-day JSON plan for:
            ${userProfile.gender}, ${userProfile.age}yrs, ${userProfile.weight}kg, Goal: ${userProfile.goal}, Diet: ${userProfile.dietType}.
            
            Return ONLY strict JSON (No markdown):
            {
              "summary": "Short motivation.",
              "meals": [
                { "type": "Breakfast", "name": "Food Name", "calories": 350, "protein": "15g" },
                { "type": "Lunch", "name": "Food Name", "calories": 550, "protein": "25g" },
                { "type": "Dinner", "name": "Food Name", "calories": 450, "protein": "20g" }
              ],
              "workout": {
                "type": "Workout Name",
                "duration": "45 min",
                "exercises": ["Ex 1", "Ex 2", "Ex 3"]
              }
            }
          `;

          // DIRECT API CALL (Bypasses SDK issues)
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
              })
            }
          );

          if (!response.ok) {
            const errData = await response.json();
            throw new Error(`API Error: ${errData.error?.message || response.statusText}`);
          }

          const data = await response.json();
          const text = data.candidates[0].content.parts[0].text;
          
          console.log("🔹 AI Response:", text);

          // Clean JSON
          const cleanJson = text.replace(/```json|```/g, '').trim();
          const start = cleanJson.indexOf('{');
          const end = cleanJson.lastIndexOf('}');
          const plan = JSON.parse(cleanJson.substring(start, end + 1));

          set({ weeklyPlan: plan, isLoading: false });
          console.log("✅ AI Success!");

        } catch (err) {
          console.error("❌ AI Error:", err);
          
          // Fallback Plan
          const isVeg = userProfile.dietType === 'Vegetarian';
          set({ 
            weeklyPlan: {
                summary: "🔴 AI Connection Failed. Using Offline Plan.",
                meals: [
                    { type: "Breakfast", name: isVeg ? "Oats" : "Eggs", calories: 400, protein: "15g" },
                    { type: "Lunch", name: "Rice & Dal", calories: 600, protein: "20g" },
                    { type: "Dinner", name: "Salad", calories: 400, protein: "10g" }
                ],
                workout: { type: "Home Workout", duration: "30 min", exercises: ["Pushups", "Squats"] }
            }, 
            isLoading: false 
          });
        }
      },
      
      reset: () => {
        set({ userProfile: null, weeklyPlan: null, dailyStats: { steps: 0, water: 0, calories: 0 }, workouts: [], meals: [] });
        localStorage.removeItem('health-storage');
      }
    }),
    {
      name: 'health-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);