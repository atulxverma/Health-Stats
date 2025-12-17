export default function WorkoutList({ workouts, onDelete }) {
  if (workouts.length === 0) {
    return <div className="text-center text-gray-400 py-10">No workouts logged yet.</div>;
  }

  return (
    <div className="space-y-3">
      {workouts.map((w) => (
        <div key={w.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
          <div>
            <h4 className="font-bold text-gray-800">{w.name}</h4>
            <p className="text-sm text-gray-500">
              {w.duration} mins • <span className="text-orange-500 font-medium">{w.calories} kcal</span>
            </p>
          </div>
          <button 
            onClick={() => onDelete(w.id)}
            className=" h-11 w-11 text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition-colors"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}