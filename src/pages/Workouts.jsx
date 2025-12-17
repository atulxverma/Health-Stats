import { useUserData } from "../context/UserDataContext";
import WorkoutForm from "../components/WorkoutForm";
import WorkoutList from "../components/WorkoutList";

export default function Workouts() {
  const { workouts, addWorkout, deleteWorkout } = useUserData();

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-4xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Workouts</h2>
      
      <WorkoutForm onAdd={addWorkout} />
      
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Recent Activity</h3>
        <WorkoutList workouts={workouts} onDelete={deleteWorkout} />
      </div>
    </div>
  );
}