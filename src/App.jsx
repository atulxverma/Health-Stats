import React, { Suspense, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { SignIn, useUser } from "@clerk/clerk-react";
import { useHealthStore } from "./store/useHealthStore"; // Store

// Components
import Navbar from "./components/Navbar";
import Loading from "./components/Loading";

// Pages
const LandingPage = React.lazy(() => import("./pages/LandingPage"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Workouts = React.lazy(() => import("./pages/Workouts"));
const Nutrition = React.lazy(() => import("./pages/Nutrition"));
const Progress = React.lazy(() => import("./pages/Progress"));
const Profile = React.lazy(() => import("./pages/Profile"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const ErrorPage = React.lazy(() => import("./pages/ErrorPage"));

// --- DATABASE LOADER ---
function ClerkLoader({ children }) {
  const { isLoaded, isSignedIn, user } = useUser();
  const { initializeUser } = useHealthStore();

  useEffect(() => {
    // Login hote hi Supabase se data uthao
    if (isLoaded && isSignedIn && user) {
      initializeUser(user.id);
    }
  }, [isLoaded, isSignedIn, user]);

  if (!isLoaded) return <Loading />;
  return children;
}

const ProtectedRoute = ({ children }) => {
  const { isSignedIn, isLoaded } = useUser();
  if (!isLoaded) return <Loading />;
  if (!isSignedIn) return <Navigate to="/sign-in" />;
  return children;
};

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <div className="pt-24 pb-20 px-4 md:px-0">{children}</div>
    </>
  );
};

function App() {
  return (
    <>
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      <Router>
        <ClerkLoader>
          <div className="min-h-screen bg-[#F3F6FD] text-gray-800 font-sans selection:bg-indigo-100 selection:text-indigo-700 relative overflow-x-hidden">
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
              <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-200/40 rounded-full blur-[100px] mix-blend-multiply opacity-70 animate-blob"></div>
              <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-200/40 rounded-full blur-[100px] mix-blend-multiply opacity-70 animate-blob animation-delay-2000"></div>
              <div className="absolute bottom-[-20%] left-[20%] w-[500px] h-[500px] bg-pink-200/40 rounded-full blur-[100px] mix-blend-multiply opacity-70 animate-blob animation-delay-4000"></div>
            </div>

            <Suspense fallback={<Loading />}>
              <Routes>
                <Route path="/" element={<><Navbar /><LandingPage /></>} />
                <Route path="/sign-in" element={<><Navbar /><div className="pt-24 flex justify-center items-center h-[90vh]"><SignIn /></div></>} />
                <Route path="/error" element={<ErrorPage />} />

                <Route path="/dashboard" element={<Layout><ProtectedRoute><Dashboard /></ProtectedRoute></Layout>} />
                <Route path="/workouts" element={<Layout><ProtectedRoute><Workouts /></ProtectedRoute></Layout>} />
                <Route path="/nutrition" element={<Layout><ProtectedRoute><Nutrition /></ProtectedRoute></Layout>} />
                <Route path="/progress" element={<Layout><ProtectedRoute><Progress /></ProtectedRoute></Layout>} />
                <Route path="/profile" element={<Layout><ProtectedRoute><Profile /></ProtectedRoute></Layout>} />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </div>
        </ClerkLoader>
      </Router>
    </>
  );
}

export default App;