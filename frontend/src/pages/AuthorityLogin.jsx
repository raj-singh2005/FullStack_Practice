import React, { useState } from 'react';
import { ShieldAlert, Lock, Mail, ChevronRight, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { loginAuthority } from '../api/authorityAuth'; // Importing your API helper

const AuthorityLogin = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await loginAuthority({ email, password });
      
      if (data && data.authority) {
        // ✅ CHANGE 1: Create a combined object that includes the flag
        // This ensures the Navbar sees 'isAuthority: true' AND 'designation'
        const authorityUser = { 
          ...data.authority, 
          isAuthority: true 
        };

        // ✅ CHANGE 2: Save this combined object
        localStorage.setItem('user', JSON.stringify(authorityUser));
        setUser(authorityUser);
        
        alert("Welcome back, Pal!");
        navigate('/authority'); 
      }
    } catch (err) {
      alert(err || "Login failed. Please check your official credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl border border-slate-800 text-white">
        
        <div className="text-center mb-10">
          <div className="bg-amber-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/20">
            <ShieldAlert className="text-slate-900 w-8 h-8" />
          </div>
          <h2 className="text-3xl font-black tracking-tight">Authority Portal</h2>
          <p className="text-slate-400 font-medium mt-2">Organization Personnel Only</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="relative">
            <Mail className="absolute left-4 top-4 text-slate-500 w-5 h-5" />
            <input 
              type="email" 
              placeholder="Officer Email" 
              required
              className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500 text-white transition placeholder:text-slate-600"
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-4 text-slate-500 w-5 h-5" />
            <input 
              type="password" 
              placeholder="Secure Password" 
              required
              className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500 text-white transition placeholder:text-slate-600"
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-black text-lg transition mt-4 flex items-center justify-center gap-2 ${
              loading 
                ? "bg-slate-700 text-slate-500 cursor-not-allowed" 
                : "bg-amber-500 text-slate-900 hover:bg-amber-400 active:scale-[0.98]"
            }`}
          >
            {loading ? (
              <>Verifying... <Loader2 className="animate-spin ml-2" /></>
            ) : (
              <>Access Dashboard <ChevronRight size={20} /></>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <p className="text-slate-500 font-medium text-sm">
            Not registered in the system?{" "}
            <Link to="/authority-signup" className="text-amber-500 font-bold hover:underline">
              Register here
            </Link>
          </p>
        </div>
        
        
      </div>
    </div>
  );
};

export default AuthorityLogin;