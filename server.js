import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// --- SMART LOGIC GENERATOR ---
const generateSmartPlan = (profile) => {
  const { gender, goal, dietType } = profile;
  const isVeg = dietType === 'Vegetarian' || dietType === 'Vegan';
  const isMuscle = goal === 'Build Muscle';
  const isLoss = goal === 'Lose Weight';

  // 1. DYNAMIC MOTIVATION
  let summary = "Stay consistent and trust the process!";
  if (isMuscle) summary = `Focus on high protein intake and progressive overload to build size.`;
  if (isLoss) summary = `Maintain a caloric deficit and keep your heart rate up today!`;

  // 2. DYNAMIC MEALS
  let meals = [];

  if (isVeg) {
    meals = [
      { 
        type: "Breakfast", 
        name: isMuscle ? "Paneer Bhurji & Multigrain Toast" : "Oatmeal with Walnuts & Apple", 
        calories: isMuscle ? 450 : 300, 
        protein: isMuscle ? "18g" : "10g" 
      },
      { 
        type: "Lunch", 
        name: "Dal Tadka, Brown Rice & Cucumber Salad", 
        calories: 550, 
        protein: "22g" 
      },
      { 
        type: "Dinner", 
        name: isLoss ? "Grilled Tofu & Steamed Broccoli" : "Mixed Vegetable Curry & Roti", 
        calories: isLoss ? 350 : 500, 
        protein: isLoss ? "15g" : "12g" 
      }
    ];
  } else {
    // Non-Veg
    meals = [
      { 
        type: "Breakfast", 
        name: isMuscle ? "3 Whole Eggs & Toast" : "Egg White Omelet with Spinach", 
        calories: isMuscle ? 400 : 250, 
        protein: isMuscle ? "20g" : "18g" 
      },
      { 
        type: "Lunch", 
        name: "Grilled Chicken Breast with Quinoa", 
        calories: 600, 
        protein: "35g" 
      },
      { 
        type: "Dinner", 
        name: isLoss ? "Lemon Garlic Fish & Asparagus" : "Chicken Curry & Rice", 
        calories: isLoss ? 400 : 600, 
        protein: "30g" 
      }
    ];
  }

  // 3. DYNAMIC WORKOUT
  let workout = {};
  if (isMuscle) {
    workout = {
      type: "Strength & Hypertrophy",
      duration: "60 min",
      exercises: ["Bench Press (3x10)", "Squats (3x12)", "Deadlifts (3x8)"]
    };
  } else if (isLoss) {
    workout = {
      type: "HIIT Cardio Burn",
      duration: "45 min",
      exercises: ["Burpees (30s)", "Mountain Climbers (45s)", "Jump Rope (2 min)"]
    };
  } else {
    workout = {
      type: "Full Body Tone",
      duration: "40 min",
      exercises: ["Pushups", "Lunges", "Plank Hold"]
    };
  }

  return { summary, meals, workout };
};

// --- API ROUTE ---
app.post('/generate-plan', async (req, res) => {
  try {
    const { userProfile } = req.body;
    console.log("🤖 Generating Plan for:", userProfile.goal);

    // 2 Second Delay to Simulate AI Processing (User ko real lagega)
    setTimeout(() => {
      const plan = generateSmartPlan(userProfile);
      console.log("✅ Plan Sent Successfully!");
      res.json(plan);
    }, 2000);

  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ error: "Server Failed" });
  }
});

app.listen(5000, () => console.log("🚀 Logic Engine running on http://localhost:5000"));