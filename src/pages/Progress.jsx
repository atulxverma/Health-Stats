import ChartCard from "../components/ChartCard";

// Mock Data for Charts (Since context only holds daily data currently)
const stepsData = [
  { day: "Mon", steps: 4000 },
  { day: "Tue", steps: 7500 },
  { day: "Wed", steps: 5000 },
  { day: "Thu", steps: 9200 },
  { day: "Fri", steps: 8100 },
  { day: "Sat", steps: 6000 },
  { day: "Sun", steps: 7200 },
];

const caloriesData = [
  { day: "Mon", cal: 1800 },
  { day: "Tue", cal: 2200 },
  { day: "Wed", cal: 1950 },
  { day: "Thu", cal: 2400 },
  { day: "Fri", cal: 2100 },
  { day: "Sat", cal: 1800 },
  { day: "Sun", cal: 2300 },
];

export default function Progress() {
  return (
    <div className="container mx-auto p-4 md:p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Weekly Progress</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard 
          title="Steps History" 
          data={stepsData} 
          dataKey="steps" 
          color="#3B82F6" 
        />
        <ChartCard 
          title="Calories Burned" 
          data={caloriesData} 
          dataKey="cal" 
          color="#F97316" 
        />
      </div>
    </div>
  );
}