import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useHealthStore } from "../store/useHealthStore";
import { Loader2, CheckCircle2, ChevronRight } from "lucide-react";

export default function OnboardingModal({ isOpen, onClose }) {
  const { setProfile, generatePlan, isLoading } = useHealthStore();
  const [step, setStep] = useState(1);
  
  // Local form state
  const [data, setData] = useState({
    gender: "Male",
    age: "",
    weight: "",
    height: "",
    goal: "Lose Weight",
    dietType: "Vegetarian"
  });

  const handleNext = () => setStep(step + 1);

  const handleSubmit = async () => {
    // 1. Save to Store
    setProfile(data);
    
    // 2. Trigger AI Magic
    await generatePlan();
    
    // 3. Close Modal
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
        />

        {/* Modal Card */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl relative z-10 overflow-hidden"
        >
          {/* Progress Bar */}
          <div className="w-full bg-slate-100 h-1.5 rounded-full mb-8">
            <motion.div 
              animate={{ width: step === 1 ? '33%' : step === 2 ? '66%' : '100%' }} 
              className="h-full bg-indigo-600 rounded-full"
            />
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            {step === 1 && "About You"}
            {step === 2 && "Your Goals"}
            {step === 3 && "Diet Preferences"}
          </h2>
          <p className="text-slate-500 text-sm mb-6">
            Help AI customize your perfect plan.
          </p>

          {/* STEP 1: Personal Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <InputGroup label="Age" placeholder="25" value={data.age} onChange={v => setData({...data, age: v})} />
                <SelectGroup label="Gender" value={data.gender} options={['Male', 'Female']} onChange={v => setData({...data, gender: v})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputGroup label="Weight (kg)" placeholder="75" value={data.weight} onChange={v => setData({...data, weight: v})} />
                <InputGroup label="Height (cm)" placeholder="175" value={data.height} onChange={v => setData({...data, height: v})} />
              </div>
              <Button onClick={handleNext}>Next Step <ChevronRight size={18} /></Button>
            </div>
          )}

          {/* STEP 2: Goal */}
          {step === 2 && (
            <div className="space-y-4">
              <OptionCard 
                selected={data.goal === "Lose Weight"} 
                onClick={() => setData({...data, goal: "Lose Weight"})}
                title="Lose Weight" desc="Burn fat & get lean"
              />
              <OptionCard 
                selected={data.goal === "Build Muscle"} 
                onClick={() => setData({...data, goal: "Build Muscle"})}
                title="Build Muscle" desc="Gain size & strength"
              />
              <OptionCard 
                selected={data.goal === "Maintain"} 
                onClick={() => setData({...data, goal: "Maintain"})}
                title="Maintain" desc="Stay fit & healthy"
              />
              <div className="flex gap-3 pt-4">
                <BackButton onClick={() => setStep(1)} />
                <Button onClick={handleNext}>Next Step <ChevronRight size={18} /></Button>
              </div>
            </div>
          )}

          {/* STEP 3: Diet */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {['Vegetarian', 'Non-Veg', 'Vegan', 'Keto'].map(diet => (
                  <button
                    key={diet}
                    onClick={() => setData({...data, dietType: diet})}
                    className={`p-4 rounded-2xl border-2 font-bold text-sm transition-all ${
                      data.dietType === diet 
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-600' 
                      : 'border-slate-100 text-slate-500 hover:border-slate-200'
                    }`}
                  >
                    {diet}
                  </button>
                ))}
              </div>

              <div className="flex gap-3 pt-6">
                <BackButton onClick={() => setStep(2)} />
                <button 
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="flex-1 bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? <><Loader2 className="animate-spin" /> Generating Plan...</> : "Generate My Plan ✨"}
                </button>
              </div>
            </div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// --- HELPER COMPONENTS ---
function InputGroup({ label, placeholder, value, onChange }) {
  return (
    <div>
      <label className="text-xs font-bold text-slate-500 uppercase ml-1">{label}</label>
      <input 
        type="number" 
        className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-800"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}

function SelectGroup({ label, value, options, onChange }) {
  return (
    <div>
      <label className="text-xs font-bold text-slate-500 uppercase ml-1">{label}</label>
      <select 
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-800"
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function OptionCard({ selected, onClick, title, desc }) {
  return (
    <div 
      onClick={onClick}
      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
        selected ? 'border-indigo-600 bg-indigo-50' : 'border-slate-100 hover:border-slate-200'
      }`}
    >
      <div>
        <h4 className={`font-bold ${selected ? 'text-indigo-900' : 'text-slate-800'}`}>{title}</h4>
        <p className={`text-xs ${selected ? 'text-indigo-600' : 'text-slate-400'}`}>{desc}</p>
      </div>
      {selected && <CheckCircle2 className="text-indigo-600" size={20} />}
    </div>
  );
}

function Button({ children, onClick }) {
  return (
    <button onClick={onClick} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
      {children}
    </button>
  );
}

function BackButton({ onClick }) {
  return (
    <button onClick={onClick} className="px-6 bg-slate-100 text-slate-600 py-3 rounded-xl font-bold hover:bg-slate-200 transition-all">
      Back
    </button>
  );
}