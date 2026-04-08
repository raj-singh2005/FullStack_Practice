import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogIn, Mail, Lock } from 'lucide-react';
import { loginUser } from '../api/auth';
import { useNavigate } from 'react-router-dom';

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Login started for:", email); // DEBUG: Check browser console
    setLoading(true);

    try {
      const response = await loginUser({ email, password });
      console.log("Backend Response Received:", response); // DEBUG

      if (response && response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
        alert(`Success! Logging in as ${response.user.username}`);
        setUser(response.user);
        navigate('/dashboard');
      }
    } catch (err) {
  console.error("DEBUG - Full Error Object:", err);

  // 1. Try to get the message from the Backend JSON (err.response.data.message)
  // 2. Try to get the standard Axios message (err.message)
  // 3. Fallback to a string version of the whole error
  const errorMessage = 
    err.response?.data?.message || 
    err.message || 
    String(err);

  alert(`Login Error: ${errorMessage}`);
} finally {
  setLoading(false);
}
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl border border-slate-100">
        <div className="text-center mb-8">
          <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <LogIn className="text-blue-600 w-8 h-8" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Welcome Back</h2>
          <p className="text-slate-500 font-medium">Access your Jamshedpur Civic account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="relative">
            <Mail className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
            <input 
              type="email" placeholder="Email Address" required
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition"
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
            <input 
              type="password" placeholder="Password" required
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition"
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button 
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold text-lg transition shadow-lg active:scale-[0.98] ${
              loading ? "bg-slate-400 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200"
            }`}
          >
            {loading ? "Verifying..." : "Sign In"}
          </button>
        </form>

        <p className="text-center mt-8 text-slate-600 font-medium">
          New to Civic Connect? <Link to="/signup" className="text-blue-600 font-bold hover:underline">Create Account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;