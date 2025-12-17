import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";

const UserDataContext = createContext();

export const useUserData = () => useContext(UserDataContext);

export const UserDataProvider = ({ children }) => {
  const { user, isLoaded } = useUser();

  // 🔑 LOGIC CHANGE: Agar user hai toh ID lo, nahi toh "guest" use karo
  const userId = user ? user.id : "guest_user";

  const [goals, setGoals] = useState({
    stepsGoal: 8000,
    waterGoal: 3000,
    caloriesGoal: 2000,
  });

  const [dailyStats, setDailyStats] = useState({
    steps: 0,
    calories: 0,
    water: 0,
    sleep: 6,
    heartRate: 75,
  });

  const [workouts, setWorkouts] = useState([]);

  // 1️⃣ Load Data (Guest ya User)
  useEffect(() => {
    if (isLoaded) { // Wait for Clerk to check if user exists
      const savedGoals = JSON.parse(localStorage.getItem(`goals_${userId}`));
      const savedStats = JSON.parse(localStorage.getItem(`stats_${userId}`));
      const savedWorkouts = JSON.parse(localStorage.getItem(`workouts_${userId}`));

      if (savedGoals) setGoals(savedGoals);
      // Agar guest hai aur naya hai, toh default rehne do, purana data mat dikhao
      else if (userId !== "guest_user") setGoals({ stepsGoal: 8000, waterGoal: 3000, caloriesGoal: 2000 });
      
      if (savedStats) setDailyStats(savedStats);
      else setDailyStats({ steps: 0, calories: 0, water: 0, sleep: 6, heartRate: 75 });
      
      if (savedWorkouts) setWorkouts(savedWorkouts);
      else setWorkouts([]);
    }
  }, [isLoaded, userId]);

  // 2️⃣ Save Data
  useEffect(() => {
    if (isLoaded) localStorage.setItem(`goals_${userId}`, JSON.stringify(goals));
  }, [goals, userId, isLoaded]);

  useEffect(() => {
    if (isLoaded) localStorage.setItem(`stats_${userId}`, JSON.stringify(dailyStats));
  }, [dailyStats, userId, isLoaded]);

  useEffect(() => {
    if (isLoaded) localStorage.setItem(`workouts_${userId}`, JSON.stringify(workouts));
  }, [workouts, userId, isLoaded]);

  // ... (Baaki functions same rahenge: addWorkout, deleteWorkout etc.)
  const addWorkout = (workout) => {
    setWorkouts((prev) => [...prev, { id: Date.now(), ...workout }]);
    updateDailyStats({ calories: dailyStats.calories + Number(workout.calories) });
  };

  const deleteWorkout = (id) => {
    setWorkouts((prev) => prev.filter((w) => w.id !== id));
  };

  const updateWorkout = (id, updatedWorkout) => {
    setWorkouts((prev) =>
      prev.map((w) => (w.id === id ? { ...w, ...updatedWorkout } : w))
    );
  };

  const updateGoals = (newGoals) => {
    setGoals((prev) => ({ ...prev, ...newGoals }));
  };

  const updateDailyStats = (newStats) => {
    setDailyStats((prev) => ({ ...prev, ...newStats }));
  };
  // ... (End of functions)

  const value = {
    goals, dailyStats, workouts,
    addWorkout, deleteWorkout, updateWorkout, updateGoals, updateDailyStats,
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
};