import { useUserData } from "../context/UserDataContext";
import WaterTracker from "../components/WaterTracker";

export default function Nutrition() {
  const { dailyStats, updateDailyStats, goals } = useUserData();

  const handleAddWater = (amount) => {
    updateDailyStats({ water: dailyStats.water + amount });
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Nutrition & Hydration</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <WaterTracker 
          current={dailyStats.water} 
          goal={goals.waterGoal} 
          onAdd={handleAddWater} 
        />
        
        {/* Placeholder for future Meal Tracking logic */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 md:col-span-2">
            <h3 className="text-lg font-semibold mb-4 text-green-700">Meal Summary</h3>
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg mb-2">
                <span>Breakfast</span>
                <span className="font-bold text-gray-600">450 kcal</span>
            </div>
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg mb-2">
                <span>Lunch</span>
                <span className="font-bold text-gray-600">--</span>
            </div>
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                <span>Dinner</span>
                <span className="font-bold text-gray-600">--</span>
            </div>
        </div>
      </div>
    </div>
  );
}