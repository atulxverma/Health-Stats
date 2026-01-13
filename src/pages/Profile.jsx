import { useEffect, useState } from "react";
import { useHealthStore } from "../store/useHealthStore"; 
import { useUser, useClerk } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { 
  User, Settings, Target, Bell, LogOut, Save, ShieldCheck, Crown, ChevronRight, Mail, Lock, Download, Moon
} from "lucide-react";

export default function Profile() {
  const { goals, updateGoals, dailyStats } = useHealthStore();
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();

  const [activeTab, setActiveTab] = useState("goals");
  const [form, setForm] = useState(goals);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => { if (goals) setForm(goals); }, [goals]);

  const saveGoals = () => {
    updateGoals(form);
    setIsSaved(true);
    toast.success("Preferences updated! 🚀");
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleSignOut = async () => {
      await signOut();
      window.location.href = "/sign-in";
  }

  return (
    <div className="container mx-auto max-w-6xl p-6">
      
      <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Account & Settings</h1>
          <p className="text-slate-500 mt-1">Manage your personal preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* === LEFT: FIXED PROFILE CARD === */}
        <div className="lg:col-span-1 space-y-6">
            
            {/* 1. Improved Identity Card */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200 overflow-hidden relative">
                
                {/* Header Background */}
                <div className="h-28 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                
                <div className="px-6 pb-8 text-center relative">
                    {/* Avatar - Centered & Overlapping Header */}
                    <div className="-mt-12 mb-4 flex justify-center">
                        <div className="w-24 h-24 rounded-full p-1 bg-white shadow-md">
                            <img 
                                src={user?.imageUrl} 
                                alt="Profile" 
                                className="w-full h-full rounded-full object-cover" 
                            />
                        </div>
                    </div>
                    
                    {/* User Info */}
                    <h2 className="text-xl font-bold text-slate-900">{user?.fullName}</h2>
                    <p className="text-sm text-slate-500 mb-4 truncate">{user?.primaryEmailAddress?.emailAddress}</p>
                    
                    {/* Badge */}
                    <div className="flex justify-center">
                        <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1">
                            <Crown size={14} /> Pro Member
                        </span>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-100">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Joined</p>
                            <p className="font-medium text-slate-800 text-sm">
                                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Status</p>
                            <p className="font-medium text-emerald-600 text-sm flex justify-center items-center gap-1">
                                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span> Active
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu (Same as before) */}
            <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm">
                {[
                    { id: 'goals', label: 'Health Targets', icon: Target },
                    { id: 'account', label: 'Account Details', icon: User },
                    { id: 'privacy', label: 'Security & Data', icon: ShieldCheck },
                    { id: 'app', label: 'App Preferences', icon: Settings },
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
                
                <button onClick={handleSignOut} className="w-full flex items-center gap-3 p-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all mt-4 font-bold text-sm">
                    <LogOut size={20} /> Sign Out
                </button>
            </div>
        </div>


        {/* === RIGHT: CONTENT AREA === */}
        <div className="lg:col-span-2">
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm min-h-[600px] relative">
                
                {/* 1. HEALTH GOALS TAB */}
                {activeTab === 'goals' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Daily Targets</h3>
                                <p className="text-slate-500 text-sm">Adjust your daily goals to fit your lifestyle.</p>
                            </div>
                            <button onClick={saveGoals} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${isSaved ? "bg-green-500 text-white" : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200"}`}>
                                {isSaved ? "Saved!" : <><Save size={16} /> Save Changes</>}
                            </button>
                        </div>

                        <div className="space-y-8">
                            <GoalSlider label="Daily Steps" value={form.stepsGoal} max={20000} unit="steps" onChange={(v) => setForm({...form, stepsGoal: v})} color="accent-blue-500" />
                            <GoalSlider label="Calorie Intake" value={form.caloriesGoal} max={4000} unit="kcal" onChange={(v) => setForm({...form, caloriesGoal: v})} color="accent-orange-500" />
                            <GoalSlider label="Water Intake" value={form.waterGoal} max={5000} unit="ml" onChange={(v) => setForm({...form, waterGoal: v})} color="accent-cyan-500" />
                        </div>
                    </motion.div>
                )}

                {/* 2. ACCOUNT DETAILS */}
                {activeTab === 'account' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <h3 className="text-xl font-bold text-slate-900 mb-6">Personal Information</h3>
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase">Full Name</label>
                                    <div className="p-4 bg-slate-50 rounded-xl font-bold text-slate-700 flex items-center gap-3">
                                        <User size={18} /> {user?.fullName}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase">Email Address</label>
                                    <div className="p-4 bg-slate-50 rounded-xl font-bold text-slate-700 flex items-center gap-3">
                                        <Mail size={18} /> {user?.primaryEmailAddress?.emailAddress}
                                    </div>
                                </div>
                            </div>
                            <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 flex justify-between items-center">
                                <div><h4 className="font-bold text-indigo-900">Manage Profile</h4><p className="text-indigo-600 text-sm">Update password, email, and avatar.</p></div>
                                <button onClick={() => openUserProfile()} className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all">Open Settings</button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* 3. SECURITY & DATA */}
                {activeTab === 'privacy' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <h3 className="text-xl font-bold text-slate-900 mb-6">Security & Data</h3>
                        <div className="space-y-4">
                            <div className="p-5 border border-slate-200 rounded-2xl flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => openUserProfile()}>
                                <div className="flex items-center gap-4"><div className="bg-rose-50 p-3 rounded-xl text-rose-500"><Lock size={20} /></div><div><h4 className="font-bold text-slate-800">Change Password</h4><p className="text-xs text-slate-500">Update your security credentials</p></div></div>
                                <ChevronRight className="text-slate-300" />
                            </div>
                            <div className="p-5 border border-slate-200 rounded-2xl flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer">
                                <div className="flex items-center gap-4"><div className="bg-blue-50 p-3 rounded-xl text-blue-500"><Download size={20} /></div><div><h4 className="font-bold text-slate-800">Export Data</h4><p className="text-xs text-slate-500">Download your health logs (JSON)</p></div></div>
                                <button className="text-xs font-bold bg-slate-200 px-3 py-1 rounded-lg">Download</button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* 4. APP PREFERENCES */}
                {activeTab === 'app' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <h3 className="text-xl font-bold text-slate-900 mb-6">App Preferences</h3>
                        <div className="space-y-4">
                            <ToggleItem label="Dark Mode" desc="Switch to dark theme (Coming Soon)" icon={Moon} disabled />
                            <ToggleItem label="Daily Reminders" desc="Get notified to log meals." defaultChecked icon={Bell} />
                            <ToggleItem label="Weekly Report" desc="Receive weekly analysis via email." defaultChecked icon={Mail} />
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
            <input type="range" min="0" max={max} step="50" value={value} onChange={(e) => onChange(Number(e.target.value))} className={`w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer ${color}`} />
            <div className="flex justify-between mt-2 text-xs font-bold text-slate-400 uppercase"><span>0</span><span>{max/2}</span><span>{max}+</span></div>
        </div>
    );
}

// 🧩 Helper: Toggle Switch Item
function ToggleItem({ label, desc, defaultChecked, icon: Icon, disabled }) {
    const [checked, setChecked] = useState(defaultChecked || false);
    return (
        <div className={`flex items-center justify-between p-4 rounded-2xl border border-slate-100 transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-50 cursor-pointer'}`} onClick={() => !disabled && setChecked(!checked)}>
            <div className="flex items-center gap-4">
                <div className="bg-white p-2 rounded-xl border border-slate-100 shadow-sm text-slate-500"><Icon size={18} /></div>
                <div><p className="font-bold text-slate-800">{label}</p><p className="text-xs text-slate-500">{desc}</p></div>
            </div>
            <div className={`w-12 h-7 rounded-full p-1 transition-colors duration-300 ${checked ? 'bg-indigo-600' : 'bg-slate-300'}`}><div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${checked ? 'translate-x-5' : 'translate-x-0'}`}></div></div>
        </div>
    );
}