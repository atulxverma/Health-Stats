import { useUserData } from "../context/UserDataContext";
import StatCard from "../components/StatCard";

export default function Dashboard() {
  const { dailyStats, goals } = useUserData();

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Today's Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Steps" 
          value={dailyStats.steps} 
          goal={goals.stepsGoal} 
        />
        <StatCard 
          title="Calories Burned" 
          value={dailyStats.calories} 
          goal={goals.caloriesGoal} 
          unit="kcal"
        />
        <StatCard 
          title="Water Intake" 
          value={dailyStats.water} 
          goal={goals.waterGoal} 
          unit="ml"
        />
        {/* Simple card for non-progress data */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-md">
          <h3 className="text-indigo-100 font-medium mb-1">Heart Rate</h3>
          <p className="text-3xl font-bold">{dailyStats.heartRate} <span className="text-sm font-normal">bpm</span></p>
          <div className="mt-4 text-indigo-100 text-sm">Avg Resting: 72 bpm</div>
        </div>
      </div>
    </div>
  );
}