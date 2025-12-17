import { Link, useLocation } from "react-router-dom";
import { UserButton, useUser } from "@clerk/clerk-react";

export default function Navbar() {
  const location = useLocation();
  const { isSignedIn, user } = useUser(); // Check karo banda logged in hai ya nahi
  
  const linkClasses = (path) => 
    `px-4 py-2 rounded-md font-medium transition-colors ${
      location.pathname === path 
        ? "bg-blue-600 text-white" 
        : "text-gray-600 hover:bg-gray-200"
    }`;

  return (
    <nav className="bg-white shadow-sm p-4 mb-6 sticky top-0 z-50">
      <div className="container mx-auto flex flex-wrap justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600 mr-8">
          <Link to="/">Health Stats</Link>
        </h1>
        
        <div className="flex gap-2 overflow-x-auto items-center">
          <Link to="/" className={linkClasses("/")}>Dashboard</Link>
          <Link to="/workouts" className={linkClasses("/workouts")}>Workouts</Link>
          <Link to="/nutrition" className={linkClasses("/nutrition")}>Nutrition</Link>
          <Link to="/profile" className={linkClasses("/profile")}>Profile</Link>
          <Link to="/progress"  className={linkClasses("/progress")}>Progress</Link>
        </div>

        <div className="flex items-center gap-4 ml-auto">
            {/* LOGIC: Agar Signed In hai toh Profile, nahi toh Login Button */}
            {isSignedIn ? (
              <>
                <span className="text-sm text-gray-500 hidden md:block">Hi, {user.firstName}</span>
                <UserButton afterSignOutUrl="/" />
              </>
            ) : (
              <Link to="/sign-in">
                <button className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition">
                  Sign In
                </button>
              </Link>
            )}
        </div>
      </div>
    </nav>
  );
}