import { useState } from "react";
import { useUserData } from "../context/UserDataContext";
import { useUser } from "@clerk/clerk-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { 
  User, 
  Settings, 
  Target, 
  Bell, 
  LogOut, 
  Save, 
  ShieldCheck, 
  Crown, 
  ChevronRight 
} from "lucide-react";

export default function Profile() {
  const { goals, updateGoals, dailyStats } = useUserData();
  const { user, signOut } = useUser();
  const [activeTab, setActiveTab] = useState("goals");
  const [form, setForm] = useState(goals);
  const [isSaved, setIsSaved] = useState(false);

  const saveGoals = () => {
    updateGoals(form);
    setIsSaved(true);
    toast.success("Preferences updated!");
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="container mx-auto max-w-6xl">
      
      <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-500 mt-1">Manage your account and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* === LEFT COLUMN: USER CARD & NAV === */}
        <div className="lg:col-span-1 space-y-6">
            
            {/* 1. Glass ID Card */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-200">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                
                <div className="flex items-center gap-4 mb-6 relative z-10">
                    <img 
                        src={user?.imageUrl} 
                        alt="Profile" 
                        className="w-16 h-16 rounded-2xl border-2 border-white/20 shadow-md" 
                    />
                    <div>
                        <h2 className="font-bold text-xl">{user?.fullName}</h2>
                        <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-lg flex items-center gap-1 w-fit mt-1">
                            <Crown size={12} /> PRO MEMBER
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
                    <div>
                        <p className="text-indigo-200 text-xs font-bold uppercase">Join Date</p>
                        <p className="font-medium">Oct 2023</p>
                    </div>
                    <div>
                        <p className="text-indigo-200 text-xs font-bold uppercase">Status</p>
                        <p className="font-medium flex items-center gap-1"><span className="w-2 h-2 bg-green-400 rounded-full"></span> Active</p>
                    </div>
                </div>
            </div>

            {/* 2. Navigation Menu */}
            <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm">
                {[
                    { id: 'goals', label: 'Health Goals', icon: Target },
                    { id: 'account', label: 'Account', icon: User },
                    { id: 'notif', label: 'Notifications', icon: Bell },
                    { id: 'privacy', label: 'Privacy & Security', icon: ShieldCheck },
                ].map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all mb-2 ${
                            activeTab === item.id 
                            ? 'bg-slate-900 text-white shadow-lg' 
                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <item.icon size={20} />
                            <span className="font-bold text-sm">{item.label}</span>
                        </div>
                        {activeTab === item.id && <ChevronRight size={16} />}
                    </button>
                ))}
                
                <button 
                    onClick={() => signOut()}
                    className="w-full flex items-center gap-3 p-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all mt-4 font-bold text-sm"
                >
                    <LogOut size={20} /> Sign Out
                </button>
            </div>
        </div>


        {/* === RIGHT COLUMN: DYNAMIC CONTENT === */}
        <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm min-h-[500px]">
                
                {activeTab === 'goals' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Daily Targets</h3>
                                <p className="text-slate-500 text-sm">Adjust your daily goals to fit your lifestyle.</p>
                            </div>
                            <button 
                                onClick={saveGoals}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                                    isSaved ? "bg-green-500 text-white" : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200"
                                }`}
                            >
                                {isSaved ? "Saved!" : <><Save size={16} /> Save Changes</>}
                            </button>
                        </div>

                        <div className="space-y-8">
                            {/* Steps Slider */}
                            <GoalSlider 
                                label="Daily Steps" 
                                value={form.stepsGoal} 
                                max={20000} 
                                unit="steps" 
                                onChange={(v) => setForm({...form, stepsGoal: v})} 
                                color="accent-blue-500"
                            />
                            
                            {/* Calories Slider */}
                            <GoalSlider 
                                label="Calorie Intake" 
                                value={form.caloriesGoal} 
                                max={4000} 
                                unit="kcal" 
                                onChange={(v) => setForm({...form, caloriesGoal: v})} 
                                color="accent-orange-500"
                            />

                            {/* Water Slider */}
                            <GoalSlider 
                                label="Water Intake" 
                                value={form.waterGoal} 
                                max={5000} 
                                unit="ml" 
                                onChange={(v) => setForm({...form, waterGoal: v})} 
                                color="accent-cyan-500"
                            />
                        </div>

                        {/* Summary Stats */}
                        <div className="grid grid-cols-3 gap-4 mt-10 pt-10 border-t border-slate-100">
                            <div className="text-center">
                                <p className="text-xs font-bold text-slate-400 uppercase">Lifetime Steps</p>
                                <p className="text-2xl font-black text-slate-800">124k</p>
                            </div>
                            <div className="text-center border-l border-slate-100">
                                <p className="text-xs font-bold text-slate-400 uppercase">Avg Sleep</p>
                                <p className="text-2xl font-black text-slate-800">7h 12m</p>
                            </div>
                            <div className="text-center border-l border-slate-100">
                                <p className="text-xs font-bold text-slate-400 uppercase">Workouts</p>
                                <p className="text-2xl font-black text-slate-800">42</p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'account' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full text-center py-20">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                            <Settings size={32} className="text-slate-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">Account Settings</h3>
                        <p className="text-slate-500 max-w-xs mx-auto mt-2">Update your email, password, and profile details via Clerk.</p>
                        <button className="mt-6 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm">Manage Clerk Account</button>
                    </motion.div>
                )}

                {activeTab === 'notif' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <h3 className="text-xl font-bold text-slate-900 mb-6">Notification Preferences</h3>
                        <div className="space-y-4">
                            <ToggleItem label="Daily Summary Email" desc="Get a summary of your stats every morning." />
                            <ToggleItem label="Workout Reminders" desc="Nudges to keep you active." defaultChecked />
                            <ToggleItem label="Achievement Badges" desc="Celebrate when you hit a goal." defaultChecked />
                        </div>
                    </motion.div>
                )}

            </div>
        </div>

      </div>
    </div>
  );
}

// 🧩 Helper: Range Slider Component
function GoalSlider({ label, value, max, unit, onChange, color }) {
    return (
        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
            <div className="flex justify-between mb-4">
                <label className="font-bold text-slate-700">{label}</label>
                <span className="font-black text-slate-900 bg-white px-3 py-1 rounded-lg shadow-sm">{value} <span className="text-xs text-slate-400 font-bold uppercase">{unit}</span></span>
            </div>
            <input 
                type="range" 
                min="0" 
                max={max} 
                step="50"
                value={value} 
                onChange={(e) => onChange(Number(e.target.value))}
                className={`w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer ${color}`}
            />
            <div className="flex justify-between mt-2 text-xs font-bold text-slate-400 uppercase">
                <span>0</span>
                <span>{max/2}</span>
                <span>{max}+</span>
            </div>
        </div>
    );
}

// 🧩 Helper: Toggle Switch Item
function ToggleItem({ label, desc, defaultChecked }) {
    const [checked, setChecked] = useState(defaultChecked || false);
    return (
        <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors">
            <div>
                <p className="font-bold text-slate-800">{label}</p>
                <p className="text-xs text-slate-500">{desc}</p>
            </div>
            <button 
                onClick={() => setChecked(!checked)}
                className={`w-12 h-7 rounded-full p-1 transition-colors ${checked ? 'bg-indigo-600' : 'bg-slate-200'}`}
            >
                <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`}></div>
            </button>
        </div>
    );
}