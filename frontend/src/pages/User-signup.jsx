import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, User, Mail, Lock, Phone, ChevronRight } from 'lucide-react';
import { signupUser } from '../api/auth';

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phoneNumber: '',
    gender: 'Male' // Default based on your Enum
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Call your API helper
      const result = await signupUser(formData);
      console.log("Success:", result);
      
      alert("Account created successfully!");
      
      // 2. Send them to login page
      navigate('/login');
    } catch (err) {
      // 3. Show the specific error from your Backend/Joi/Mongoose
      alert(err || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[85vh] px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-[2.5rem] shadow-2xl border border-blue-50">
        
        <div className="text-center mb-8">
          <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
            <UserPlus className="text-white w-8 h-8" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Create Account</h2>
          <p className="text-slate-500 font-medium">Join the Community Civic Network</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div className="relative">
            <User className="absolute left-4 top-4 text-slate-400 w-5 h-5" />
            <input 
              name="username" type="text" placeholder="Full Name" required 
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition"
              onChange={handleChange}
            />
          </div>

          {/* Phone Number */}
          <div className="relative">
            <Phone className="absolute left-4 top-4 text-slate-400 w-5 h-5" />
            <input 
              name="phoneNumber" type="number" placeholder="Phone Number" required 
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition"
              onChange={handleChange}
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-4 top-4 text-slate-400 w-5 h-5" />
            <input 
              name="email" type="email" placeholder="Email Address" required 
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition"
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-4 top-4 text-slate-400 w-5 h-5" />
            <input 
              name="password" type="password" placeholder="Password (Min. 6 chars)" required minLength={6}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition"
              onChange={handleChange}
            />
          </div>

          {/* Gender Selection (Enum) */}
          <div className="py-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Select Gender</p>
            <div className="flex gap-3">
              {['Male', 'Female', 'Other'].map((g) => (
                <label key={g} className="flex-1">
                  <input 
                    type="radio" name="gender" value={g} 
                    className="hidden peer" 
                    checked={formData.gender === g}
                    onChange={handleChange}
                  />
                  <div className="text-center py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 font-bold text-sm cursor-pointer peer-checked:bg-blue-600 peer-checked:text-white peer-checked:border-blue-600 transition-all">
                    {g}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button 
      type="submit"
      disabled={loading}
      className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition shadow-lg transition-all active:scale-[0.98] ${
        loading 
          ? "bg-slate-400 cursor-not-allowed" 
          : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100"
      }`}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </span>
      ) : (
        <>Sign Up <ChevronRight size={20} /></>
      )}
    </button>
        </form>
        
        <p className="text-center mt-6 text-slate-500 font-medium text-sm">
          Already a member? <Link to="/login" className="text-blue-600 font-bold hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;