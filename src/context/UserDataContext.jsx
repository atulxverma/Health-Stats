import { createContext, useContext, useEffect, useState } from "react";

const UserDataContext = createContext();

export const useUserData = () => useContext(UserDataContext);

export const UserDataProvider = ({ children }) => {
  const [goals, setGoals] = useState({
    stepsGoal: 8000,
    waterGoal: 3000, 
    caloriesGoal: 2000,
  });

  const [dailyStats, setDailyStats] = useState({
    steps: 2500,
    calories: 450,
    water: 800,
    sleep: 6,
    heartRate: 75,
  });

  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    const savedGoals = JSON.parse(localStorage.getItem("goals"));
    const savedStats = JSON.parse(localStorage.getItem("dailyStats"));
    const savedWorkouts = JSON.parse(localStorage.getItem("workouts"));

    if (savedGoals) setGoals(savedGoals);
    if (savedStats) setDailyStats(savedStats);
    if (savedWorkouts) setWorkouts(savedWorkouts);
  }, []);

  useEffect(() => {
    localStorage.setItem("goals", JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem("dailyStats", JSON.stringify(dailyStats));
  }, [dailyStats]);

  useEffect(() => {
    localStorage.setItem("workouts", JSON.stringify(workouts));
  }, [workouts]);

  const addWorkout = (workout) => {
    setWorkouts((prev) => [...prev, { id: Date.now(), ...workout }]);
    // Optional: Auto-add calories to daily stats when workout is added
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

  const value = {
    goals,
    dailyStats,
    workouts,
    addWorkout,
    deleteWorkout,
    updateWorkout,
    updateGoals,
    updateDailyStats,
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
};