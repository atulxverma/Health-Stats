import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// 1. Config
const API_KEY = "TERI_GEMINI_KEY";
const SUPABASE_URL = "TERI_SUPABASE_URL";
const SUPABASE_KEY = "TERI_SUPABASE_ANON_KEY";

const genAI = new GoogleGenerativeAI(API_KEY);
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 2. Route: Generate & Save Plan
app.post('/generate-plan', async (req, res) => {
  try {
    const { userProfile, userId } = req.body; // UserId bhi bhejna padega frontend se

    // A. AI Generate Karega
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Create a 1-day JSON diet/workout plan for: ${userProfile.gender}, ${userProfile.goal}. strict JSON.`;
    
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleanJson = text.replace(/```json|```/g, '').trim();
    const plan = JSON.parse(cleanJson);

    // B. Supabase mein Save Karega
    if (userId) {
        const { error } = await supabase
            .from('plans')
            .insert({ user_id: userId, plan_data: plan });
        
        if (error) console.error("Supabase Error:", error);
    }

    // C. Frontend ko bhejega
    res.json(plan);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed" });
  }
});

app.listen(5000, () => console.log("Backend Ready"));