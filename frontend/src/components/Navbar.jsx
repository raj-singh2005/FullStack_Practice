import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, User, LogIn, LayoutDashboard, LogOut, Star, Briefcase } from 'lucide-react';

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  // 🎯 DYNAMIC REDIRECT LOGIC
  const getLogoRedirectPath = () => {
    if (!user) return "/report-issue"; // Redirect Guests to the Form
    if (user.isAuthority) return "/authority"; // Redirect JMC to Authority Dashboard
    return "/dashboard"; // Redirect Citizens to User Dashboard
  };

  return (
    <nav className="bg-slate-900 text-white shadow-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* 🚀 UPDATED Logo Section with Dynamic Link */}
          <Link to={getLogoRedirectPath()} className="flex items-center gap-2 group">
            <div className="bg-blue-600 p-2 rounded-lg group-hover:bg-blue-500 transition shadow-lg shadow-blue-900/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xl font-black tracking-tighter leading-none uppercase">JAMSHEDPUR</span>
              <span className="text-[10px] font-bold text-blue-400 tracking-[0.2em] uppercase">Civic Connect</span>
            </div>
          </Link>

          {/* Right Section */}
          <div className="flex items-center gap-6">
            
            {/* Authority Portal Link (Hidden if any user is logged in) */}
            {!user && (
              <Link 
                to="/authority-login" 
                className="hidden md:flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-blue-400 transition border-r border-slate-700 pr-6"
              >
                <LayoutDashboard size={18} />
                Authority Portal
              </Link>
            )}

            {/* CONDITIONAL RENDERING: User Auth vs User Profile */}
            <div className="flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-bold text-white">Hi, {user.username}</span>
                    
                    {user.isAuthority ? (
                      <span className="text-[10px] text-amber-400 font-bold flex items-center gap-1 uppercase tracking-widest bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                        <Briefcase size={10} /> {user.designation || 'Officer'}
                      </span>
                    ) : (
                      <span className="text-[10px] text-yellow-400 font-bold flex items-center gap-1 uppercase tracking-widest">
                        <Star size={10} fill="currentColor" /> {user.stars || 0} Points
                      </span>
                    )}
                  </div>
                  
                  <button 
                    onClick={handleLogout}
                    className="p-2 bg-slate-800 hover:bg-red-600/20 hover:text-red-400 text-slate-400 rounded-xl transition-all border border-slate-700"
                    title="Logout"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-bold hover:bg-slate-800 rounded-xl transition"
                  >
                    <LogIn size={18} />
                    Login
                  </Link>
                  
                  <Link 
                    to="/signup" 
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-500 transition"
                  >
                    <User size={18} />
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;