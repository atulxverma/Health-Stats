import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  
  const linkClasses = (path) => 
    `px-4 py-2 rounded-md font-medium transition-colors ${
      location.pathname === path 
        ? "bg-blue-600 text-white" 
        : "text-gray-600 hover:bg-gray-200"
    }`;

  return (
    <nav className="bg-white shadow-sm p-4 mb-6">
      <div className="container mx-auto flex flex-wrap justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600 mr-8">Health Stats</h1>
        <div className="flex gap-2 overflow-x-auto">
          <Link to="/" className={linkClasses("/")}>Dashboard</Link>
          <Link to="/workouts" className={linkClasses("/workouts")}>Workouts</Link>
          <Link to="/nutrition" className={linkClasses("/nutrition")}>Nutrition</Link>
          <Link to="/progress" className={linkClasses("/progress")}>Progress</Link>
          <Link to="/profile" className={linkClasses("/profile")}>Profile</Link>
        </div>
      </div>
    </nav>
  );
}