import { useUserData } from "../context/UserDataContext";
import { useState } from "react";

export default function Profile() {
  const { goals, updateGoals } = useUserData();
  const [form, setForm] = useState(goals);
  const [isSaved, setIsSaved] = useState(false);

  const saveGoals = () => {
    updateGoals(form);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const InputGroup = ({ label, value, field, unit }) => (
    <div className="mb-4">
      <label className="block text-gray-600 font-medium mb-1">{label}</label>
      <div className="flex items-center">
        <input
          type="number"
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={value}
          onChange={(e) => setForm({ ...form, [field]: Number(e.target.value) })}
        />
        <span className="ml-2 text-gray-500 w-12">{unit}</span>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Goals</h2>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <InputGroup 
          label="Daily Steps Goal" 
          value={form.stepsGoal} 
          field="stepsGoal" 
          unit="steps" 
        />
        <InputGroup 
          label="Water Intake Goal" 
          value={form.waterGoal} 
          field="waterGoal" 
          unit="ml" 
        />
        <InputGroup 
          label="Calories Burn Goal" 
          value={form.caloriesGoal} 
          field="caloriesGoal" 
          unit="kcal" 
        />

        <button 
          onClick={saveGoals}
          className={`w-full py-2 rounded-lg font-medium transition-colors mt-4 ${
            isSaved ? "bg-green-500 text-white" : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {isSaved ? "Saved Successfully!" : "Update Goals"}
        </button>
      </div>
    </div>
  );
}