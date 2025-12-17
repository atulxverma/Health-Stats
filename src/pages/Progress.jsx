import React from "react";
import ChartCard from "../components/ChartCard";

// 1. Fake Data banaya (Real app mein ye database se aayega)
const stepsData = [
  { day: "Mon", steps: 4500 },
  { day: "Tue", steps: 7200 },
  { day: "Wed", steps: 5100 },
  { day: "Thu", steps: 9800 },
  { day: "Fri", steps: 8400 },
  { day: "Sat", steps: 6500 },
  { day: "Sun", steps: 3000 },
];

const caloriesData = [
  { day: "Mon", calories: 1800 },
  { day: "Tue", calories: 2300 },
  { day: "Wed", calories: 1950 },
  { day: "Thu", calories: 2500 },
  { day: "Fri", calories: 2200 },
  { day: "Sat", calories: 1700 },
  { day: "Sun", calories: 1500 },
];

export default function Progress() {
  return (
    <div className="container mx-auto p-4 md:p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Weekly Progress</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Steps Chart */}
        <ChartCard 
          title="Steps History" 
          data={stepsData} 
          dataKey="steps"    // Object mein key ka naam 'steps' hai
          color="#3B82F6"    // Blue Color
        />

        {/* Calories Chart */}
        <ChartCard 
          title="Calories Burned" 
          data={caloriesData} 
          dataKey="calories" // Object mein key ka naam 'calories' hai
          color="#F97316"    // Orange Color
        />
      </div>
    </div>
  );
}