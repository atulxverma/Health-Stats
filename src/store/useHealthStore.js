import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// ⚠️ API KEY KI ZAROORAT NAHI HAI ABHI
// Hum local logic use karenge taaki app ruke nahi.

export const useHealthStore = create(
  persist(
    (set, get) => ({
      
      userProfile: null,
      weeklyPlan: null,
      isLoading: false,
      error: null,

      setProfile: (profileData) => set({ userProfile: profileData }),

      generatePlan: async () => {
        const { userProfile } = get();
        if (!userProfile) return;

        set({ isLoading: true, error: null });

        // --- MOCK AI SIMULATION (Fake Delay to feel like AI) ---
        setTimeout(() => {
            
            // 1. Logic based on User Input
            const isVeg = userProfile.dietType === 'Vegetarian' || userProfile.dietType === 'Vegan';
            const isMuscle = userProfile.goal === 'Build Muscle';
            
            // 2. Dynamic Data Construction
            const plan = {
                summary: isMuscle 
                    ? `Focus on hypertrophy! Since you are ${userProfile.dietType}, we increased your protein intake.`
                    : `Time to shred! We kept your carbs low to help you with ${userProfile.goal}.`,
                
                meals: [
                    { 
                        type: "Breakfast", 
                        name: isVeg ? "Oatmeal with Almonds & Banana" : "3 Boiled Eggs & Toast", 
                        calories: 350, 
                        protein: isVeg ? "12g" : "20g" 
                    },
                    { 
                        type: "Lunch", 
                        name: isVeg ? "Paneer/Tofu Salad & Brown Rice" : "Grilled Chicken Breast & Quinoa", 
                        calories: 550, 
                        protein: isVeg ? "18g" : "35g" 
                    },
                    { 
                        type: "Dinner", 
                        name: isVeg ? "Lentil Soup (Dal) & Veggies" : "Baked Fish with Asparagus", 
                        calories: 400, 
                        protein: isVeg ? "14g" : "28g" 
                    }
                ],
                
                workout: {
                    type: isMuscle ? "Hypertrophy Strength" : "HIIT Cardio Burn",
                    duration: isMuscle ? "60 min" : "45 min",
                    exercises: isMuscle 
                        ? ["Bench Press (3x10)", "Squats (3x12)", "Deadlifts (3x8)"] 
                        : ["Burpees (30s)", "Mountain Climbers (30s)", "Jump Rope (1 min)"]
                }
            };

            // 3. Save "AI" Result
            set({ weeklyPlan: plan, isLoading: false });
            console.log("✅ Mock Plan Generated based on:", userProfile.goal);

        }, 2500); // 2.5 Seconds ka delay taaki user ko lage AI soch raha hai
      },
      
      reset: () => {
        set({ userProfile: null, weeklyPlan: null });
        localStorage.removeItem('health-storage');
        window.location.reload();
      }

    }),
    {
      name: 'health-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);