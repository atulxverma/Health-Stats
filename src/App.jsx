import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { UserDataProvider } from "./context/UserDataContext";
import { Toaster } from "react-hot-toast";
import { SignIn, useUser } from "@clerk/clerk-react";

import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Workouts from "./pages/Workouts";
import Nutrition from "./pages/Nutrition";
import Progress from "./pages/Progress";
import Profile from "./pages/Profile";
import Footer from "./components/Footer"; // Footer bhi import kar le agar hataya tha

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
    const { isSignedIn, isLoaded } = useUser();
    if (!isLoaded) return null;
    if (!isSignedIn) return <Navigate to="/sign-in" />;
    return children;
};

// Layout Component to handle Navbar + Spacing
const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      {/* 
          🔴 MAIN FIX HERE: 'pt-24'
          Ye content ko Navbar ke neeche push karega (approx 96px) 
      */}
      <div className="pt-24 pb-20 px-4 md:px-0">
        {children}
      </div>
      {/* Footer sirf Landing Page pe dikhana hai ya sabpe, wo teri marzi */}
      {/* Agar sabpe dikhana hai to <Footer /> yahan laga de */}
    </>
  );
};

function App() {
  return (
    <UserDataProvider>
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      <Router>
        <div className="min-h-screen bg-[#F3F6FD] text-gray-800 font-sans selection:bg-indigo-100 selection:text-indigo-700 relative overflow-x-hidden">
          
          {/* Background Gradient Mesh */}
          <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
             <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-200/40 rounded-full blur-[100px] mix-blend-multiply opacity-70 animate-blob"></div>
             <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-200/40 rounded-full blur-[100px] mix-blend-multiply opacity-70 animate-blob animation-delay-2000"></div>
             <div className="absolute bottom-[-20%] left-[20%] w-[500px] h-[500px] bg-pink-200/40 rounded-full blur-[100px] mix-blend-multiply opacity-70 animate-blob animation-delay-4000"></div>
          </div>

          <Routes>
            {/* 
                CASE 1: LANDING PAGE 
                Iska layout alag hai kyunki isme 'pt' humne file ke andar diya tha.
                Isliye isko Layout wrapper se bahar rakha hai taaki double padding na ho.
            */}
            <Route path="/" element={
              <>
                <Navbar />
                <LandingPage />
              </>
            } />
            
            {/* Login Page */}
            <Route path="/sign-in" element={
              <>
                <Navbar />
                <div className="pt-24 flex justify-center items-center h-[90vh]">
                  <SignIn />
                </div>
              </>
            } />

            {/* 
                CASE 2: APP PAGES (Dashboard, Workouts, etc.)
                In sabko 'Layout' mein wrap kiya hai jo 'pt-24' dega.
            */}
            <Route path="/dashboard" element={<Layout><ProtectedRoute><Dashboard /></ProtectedRoute></Layout>} />
            <Route path="/workouts" element={<Layout><ProtectedRoute><Workouts /></ProtectedRoute></Layout>} />
            <Route path="/nutrition" element={<Layout><ProtectedRoute><Nutrition /></ProtectedRoute></Layout>} />
            <Route path="/progress" element={<Layout><ProtectedRoute><Progress /></ProtectedRoute></Layout>} />
            <Route path="/profile" element={<Layout><ProtectedRoute><Profile /></ProtectedRoute></Layout>} />
          
          </Routes>
        </div>
      </Router>
    </UserDataProvider>
  );
}

export default App;