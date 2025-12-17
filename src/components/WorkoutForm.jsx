import { useState } from "react";

export default function WorkoutForm({ onAdd }) {
  const [form, setForm] = useState({ name: "", duration: "", calories: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.duration || !form.calories) return;
    onAdd(form);
    setForm({ name: "", duration: "", calories: "" });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
      <h3 className="text-lg font-bold mb-4">Log Workout</h3>
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
        <input
          className="p-2 border border-gray-300 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Activity (e.g., Running)"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="p-2 border border-gray-300 rounded-lg w-full md:w-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="number"
          placeholder="Min"
          value={form.duration}
          onChange={(e) => setForm({ ...form, duration: e.target.value })}
        />
        <input
          className="p-2 border border-gray-300 rounded-lg w-full md:w-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="number"
          placeholder="Kcal"
          value={form.calories}
          onChange={(e) => setForm({ ...form, calories: e.target.value })}
        />
        <button 
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Add
        </button>
      </form>
    </div>
  );
}