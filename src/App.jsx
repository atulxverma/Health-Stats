import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserDataProvider } from "./context/UserDataContext";
import { SignIn } from "@clerk/clerk-react"; // Login component

import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Workouts from "./pages/Workouts";
import Nutrition from "./pages/Nutrition";
import Progress from "./pages/Progress";
import Profile from "./pages/Profile";

function App() {
  return (
    <UserDataProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Navbar />
          <div className="flex-grow">
            <Routes>
              {/* Public Routes - Sabke liye khule hain */}
              <Route path="/" element={<Dashboard />} />
              <Route path="/workouts" element={<Workouts />} />
              <Route path="/nutrition" element={<Nutrition />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/profile" element={<Profile />} />

              {/* Dedicated Login Page */}
              <Route 
                path="/sign-in" 
                element={
                  <div className="flex justify-center items-center h-[80vh]">
                    <SignIn /> 
                  </div>
                } 
              />
            </Routes>
          </div>
        </div>
      </Router>
    </UserDataProvider>
  );
}

export default App;