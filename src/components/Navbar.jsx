import { Link, useLocation } from "react-router-dom";
import { UserButton, useUser } from "@clerk/clerk-react";
import { LayoutDashboard, Dumbbell, Utensils, User, LogIn, Home } from "lucide-react";

export default function Navbar() {
  const location = useLocation();
  const { isSignedIn } = useUser();

  // Mobile Bottom Bar Item Component
  const NavItem = ({ to, icon: Icon }) => {
    const isActive = location.pathname === to;
    return (
      <Link to={to} className="relative group flex flex-col items-center justify-center p-2">
        <div className={`p-2 rounded-xl transition-all duration-300 ${isActive ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "text-slate-400 group-hover:bg-slate-100 group-hover:text-indigo-500"}`}>
            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
        </div>
      </Link>
    );
  };

  return (
    <>
      {/* 
         --- DESKTOP TOP BAR --- 
         Full width, Fixed Position, Glass Effect
      */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/60 backdrop-blur-md border-b border-white/20 transition-all duration-300">
        
        {/* Container centers content but allows background to stretch full width */}
        <div className="container mx-auto px-6 py-4 max-w-7xl flex justify-between items-center">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-gradient-to-tr from-indigo-600 to-blue-600 w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">H</div>
              <span className="font-bold text-xl tracking-tight text-slate-800">Health<span className="text-indigo-600">Tracker</span></span>
          </Link>

          {/* Desktop Links (Center Pill) */}
          <div className="hidden md:flex items-center gap-1 bg-slate-100/50 px-2 py-1.5 rounded-full border border-white/50">
            <Link 
              to={isSignedIn ? "/dashboard" : "/"} 
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                location.pathname === (isSignedIn ? '/dashboard' : '/') 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {isSignedIn ? 'Dashboard' : 'Home'}
            </Link>
            
            {isSignedIn && (
              <>
                <Link to="/workouts" className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${location.pathname === '/workouts' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>Workouts</Link>
                <Link to="/nutrition" className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${location.pathname === '/nutrition' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>Nutrition</Link>
                <Link to="/profile" className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${location.pathname === '/profile' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>Profile</Link>
              </>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
              {isSignedIn ? (
                <UserButton afterSignOutUrl="/" />
              ) : (
                <Link to="/sign-in" className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-black transition-all shadow-lg hover:shadow-xl">
                  <LogIn size={16} /> <span className="hidden sm:inline">Sign In</span>
                </Link>
              )}
          </div>
        </div>
      </nav>

      {/* 
         --- MOBILE BOTTOM BAR --- 
         Visible only on small screens
      */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 bg-white/90 backdrop-blur-xl border border-white/40 shadow-2xl rounded-2xl flex justify-around p-2 z-50">
        <NavItem to="/" icon={Home} />
        {isSignedIn && <NavItem to="/dashboard" icon={LayoutDashboard} />}
        {isSignedIn && <NavItem to="/workouts" icon={Dumbbell} />}
        {isSignedIn && <NavItem to="/nutrition" icon={Utensils} />}
        {isSignedIn && <NavItem to="/profile" icon={User} />}
      </div>
    </>
  );
}