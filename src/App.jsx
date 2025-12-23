import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { UserDataProvider } from "./context/UserDataContext";
import { Toaster } from "react-hot-toast";
import { SignIn, useUser } from "@clerk/clerk-react";
import React, { Suspense } from "react"; // 1. Import Suspense

// Components
import Navbar from "./components/Navbar";
import Loading from "./components/Loading";

// 2. LAZY IMPORT PAGES (Fast Loading)
const LandingPage = React.lazy(() => import("./pages/LandingPage"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Workouts = React.lazy(() => import("./pages/Workouts"));
const Nutrition = React.lazy(() => import("./pages/Nutrition"));
const Progress = React.lazy(() => import("./pages/Progress"));
const Profile = React.lazy(() => import("./pages/Profile"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const ErrorPage = React.lazy(() => import("./pages/ErrorPage"));

// ... (ClerkLoader, ProtectedRoute, Layout code SAME rahega) ...

function App() {
  return (
    <UserDataProvider>
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      <Router>
        <ClerkLoader>
          <div className="min-h-screen bg-[#F3F6FD] text-gray-800 font-sans selection:bg-indigo-100 selection:text-indigo-700 relative overflow-x-hidden">
            
            {/* ... Background Mesh ... */}

            {/* 3. Wrap Routes in Suspense with Loading Fallback */}
            <Suspense fallback={<Loading />}>
              <Routes>
                <Route path="/" element={<><Navbar /><LandingPage /></>} />
                <Route path="/sign-in" element={<><Navbar /><div className="pt-24 flex justify-center items-center h-[90vh]"><SignIn /></div></>} />
                <Route path="/error" element={<ErrorPage />} />

                {/* Protected Routes */}
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
    </UserDataProvider>
  );
}

export default App;