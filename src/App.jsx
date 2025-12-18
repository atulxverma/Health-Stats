import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { UserDataProvider } from "./context/UserDataContext";
import { Toaster } from "react-hot-toast";
import { SignIn, useUser } from "@clerk/clerk-react";

// Components
import Navbar from "./components/Navbar";
import Loading from "./components/Loading";

// Pages
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Workouts from "./pages/Workouts";
import Nutrition from "./pages/Nutrition";
import Progress from "./pages/Progress";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import ErrorPage from "./pages/ErrorPage";

// --- 1. CLERK LOADER (Handles "Loading..." state globally) ---
function ClerkLoader({ children }) {
  const { isLoaded } = useUser();
  // If Clerk is still loading data, show the Loading Screen
  if (!isLoaded) {
    return <Loading />;
  }
  return children;
}

// --- 2. PROTECTED ROUTE (Redirects if not logged in) ---
const ProtectedRoute = ({ children }) => {
  const { isSignedIn, isLoaded } = useUser();
  
  if (!isLoaded) return <Loading />;
  if (!isSignedIn) return <Navigate to="/sign-in" />;
  
  return children;
};

// --- 3. LAYOUT WRAPPER (Adds Navbar & Padding to App Pages) ---
const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      {/* Pushes content down so it's not hidden behind the fixed Navbar */}
      <div className="pt-24 pb-20 px-4 md:px-0">
        {children}
      </div>
    </>
  );
};

function App() {
  return (
    <UserDataProvider>
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      
      <Router>
        {/* Wrap everything in ClerkLoader to prevent flashing/crashes */}
        <ClerkLoader>
          
          <div className="min-h-screen bg-[#F3F6FD] text-gray-800 font-sans selection:bg-indigo-100 selection:text-indigo-700 relative overflow-x-hidden">
            
            {/* Background Gradient Mesh */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
              <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-200/40 rounded-full blur-[100px] mix-blend-multiply opacity-70 animate-blob"></div>
              <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-200/40 rounded-full blur-[100px] mix-blend-multiply opacity-70 animate-blob animation-delay-2000"></div>
              <div className="absolute bottom-[-20%] left-[20%] w-[500px] h-[500px] bg-pink-200/40 rounded-full blur-[100px] mix-blend-multiply opacity-70 animate-blob animation-delay-4000"></div>
            </div>

            <Routes>
              
              {/* --- PUBLIC ROUTES --- */}
              <Route 
                path="/" 
                element={
                  <>
                    <Navbar />
                    <LandingPage />
                  </>
                } 
              />

              <Route 
                path="/sign-in" 
                element={
                  <>
                    <Navbar />
                    <div className="pt-24 flex justify-center items-center h-[90vh]">
                      <SignIn />
                    </div>
                  </>
                } 
              />

              <Route path="/error" element={<ErrorPage />} />

              {/* --- PROTECTED APP ROUTES (With Layout) --- */}
              <Route 
                path="/dashboard" 
                element={
                  <Layout>
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  </Layout>
                } 
              />
              
              <Route 
                path="/workouts" 
                element={
                  <Layout>
                    <ProtectedRoute>
                      <Workouts />
                    </ProtectedRoute>
                  </Layout>
                } 
              />
              
              <Route 
                path="/nutrition" 
                element={
                  <Layout>
                    <ProtectedRoute>
                      <Nutrition />
                    </ProtectedRoute>
                  </Layout>
                } 
              />
              
              <Route 
                path="/progress" 
                element={
                  <Layout>
                    <ProtectedRoute>
                      <Progress />
                    </ProtectedRoute>
                  </Layout>
                } 
              />
              
              <Route 
                path="/profile" 
                element={
                  <Layout>
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  </Layout>
                } 
              />

              {/* --- 404 CATCH-ALL (Must be last) --- */}
              <Route path="*" element={<NotFound />} />

            </Routes>
          </div>
        </ClerkLoader>
      </Router>
    </UserDataProvider>
  );
}

export default App;