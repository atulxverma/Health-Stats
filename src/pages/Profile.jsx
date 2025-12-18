import { useUserData } from "../context/UserDataContext";
import { useState } from "react";
import { Target, Save, User } from "lucide-react";

export default function Profile() {
  const { goals, updateGoals } = useUserData();
  const [form, setForm] = useState(goals);
  const [isSaved, setIsSaved] = useState(false);

  const saveGoals = () => {
    updateGoals(form);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">Profile & Settings</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Sidebar / User Info (Static) */}
        <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center text-gray-400">
                    <User size={40} />
                </div>
                <h3 className="font-bold text-lg">User Settings</h3>
                <p className="text-gray-500 text-sm mb-6">Manage your health goals</p>
                <div className="text-left space-y-2">
                    <div className="bg-blue-50 text-blue-700 p-3 rounded-lg text-sm font-medium">🎯 Goals Config</div>
                    <div className="text-gray-500 p-3 rounded-lg text-sm hover:bg-gray-50 cursor-pointer">🔒 Account Privacy</div>
                </div>
            </div>
        </div>

        {/* Main Form */}
        <div className="md:col-span-2">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
                    <Target className="text-blue-600" />
                    <div>
                        <h3 className="font-bold text-lg text-gray-800">Daily Goals</h3>
                        <p className="text-sm text-gray-500">Adjust your targets to suit your lifestyle.</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Steps Target</label>
                        <input
                            type="number"
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            value={form.stepsGoal}
                            onChange={(e) => setForm({ ...form, stepsGoal: Number(e.target.value) })}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Water Intake (ml)</label>
                        <input
                            type="number"
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            value={form.waterGoal}
                            onChange={(e) => setForm({ ...form, waterGoal: Number(e.target.value) })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Calories Burn (kcal)</label>
                        <input
                            type="number"
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            value={form.caloriesGoal}
                            onChange={(e) => setForm({ ...form, caloriesGoal: Number(e.target.value) })}
                        />
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                    <button 
                        onClick={saveGoals}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                            isSaved 
                            ? "bg-green-500 text-white shadow-green-200 shadow-lg" 
                            : "bg-gray-900 text-white hover:bg-black shadow-lg hover:shadow-xl"
                        }`}
                    >
                        {isSaved ? "Saved!" : <><Save size={18} /> Save Changes</>}
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}