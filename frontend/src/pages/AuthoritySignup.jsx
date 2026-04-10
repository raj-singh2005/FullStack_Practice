import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldPlus, User, Mail, Lock, Phone, Building2, Briefcase, BadgeCheck, Loader2 } from 'lucide-react';
import { registerAuthority } from '../api/authorityAuth'; // Importing the API helper

const AuthoritySignup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phoneNumber: '',
    organization: '',
    designation: '',
    idProofNumber: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Calling the API function
      const data = await registerAuthority(formData);
      
      alert(data.message || "Official Account Created Successfully!");
      navigate('/authority-login'); // Redirect to login after success
    } catch (err) {
      // Showing the actual error from the backend
      alert(err || "Registration failed. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen py-10 px-4 bg-slate-50">
      <div className="w-full max-w-2xl bg-slate-900 p-8 md:p-12 rounded-[3rem] shadow-2xl border border-slate-800 text-white">
        
        <div className="text-center mb-10">
          <div className="bg-amber-500/10 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-amber-500/30">
            <ShieldPlus className="text-amber-500 w-10 h-10" />
          </div>
          <h2 className="text-3xl font-black tracking-tight">Authority Registration</h2>
          <p className="text-slate-400 font-medium mt-2 text-sm uppercase tracking-widest">Official Civic Connect Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Personal Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <User className="absolute left-4 top-4 text-slate-500 w-5 h-5" />
              <input 
                name="username" type="text" placeholder="Full Name" required 
                className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500 text-white transition placeholder:text-slate-600"
                onChange={handleChange} 
                disabled={loading}
              />
            </div>
            <div className="relative">
              <Phone className="absolute left-4 top-4 text-slate-500 w-5 h-5" />
              <input 
                name="phoneNumber" type="text" placeholder="Contact Number" required 
                className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500 text-white transition placeholder:text-slate-600"
                onChange={handleChange} 
                disabled={loading}
              />
            </div>
          </div>

          <div className="relative">
            <Mail className="absolute left-4 top-4 text-slate-500 w-5 h-5" />
            <input 
              name="email" type="email" placeholder="Official Email Address" required 
              className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500 text-white transition placeholder:text-slate-600"
              onChange={handleChange} 
              disabled={loading}
            />
          </div>

          {/* Section 2: Professional Proof */}
          <div className="p-6 bg-slate-800/30 rounded-3xl border border-slate-700/50 space-y-4">
            <p className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">Professional Credentials</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Building2 className="absolute left-4 top-4 text-slate-500 w-5 h-5" />
                <input 
                  name="organization" type="text" placeholder="Org (e.g. JMC)" required 
                  className="w-full pl-12 pr-4 py-4 bg-slate-800 border border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500 text-white transition placeholder:text-slate-600"
                  onChange={handleChange} 
                  disabled={loading}
                />
              </div>
              <div className="relative">
                <Briefcase className="absolute left-4 top-4 text-slate-500 w-5 h-5" />
                <input 
                  name="designation" type="text" placeholder="Designation" required 
                  className="w-full pl-12 pr-4 py-4 bg-slate-800 border border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500 text-white transition placeholder:text-slate-600"
                  onChange={handleChange} 
                  disabled={loading}
                />
              </div>
            </div>

            <div className="relative">
              <BadgeCheck className="absolute left-4 top-4 text-slate-500 w-5 h-5" />
              <input 
                name="idProofNumber" type="text" placeholder=" UID Number" required 
                className="w-full pl-12 pr-4 py-4 bg-slate-800 border border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500 text-white transition placeholder:text-slate-600"
                onChange={handleChange} 
                disabled={loading}
              />
            </div>
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-4 text-slate-500 w-5 h-5" />
            <input 
              name="password" type="password" placeholder="Secure Password" required 
              className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500 text-white transition placeholder:text-slate-600"
              onChange={handleChange} 
              disabled={loading}
            />
          </div>

          <button 
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-black text-lg transition mt-4 flex items-center justify-center gap-2 ${
              loading 
              ? "bg-slate-700 text-slate-500 cursor-not-allowed" 
              : "bg-amber-500 text-slate-900 hover:bg-amber-400 active:scale-[0.98]"
            }`}
          >
            {loading ? <Loader2 className="animate-spin" /> : "Create Official Account"}
          </button>
        </form>
        
        <p className="text-center mt-8 text-slate-500 font-medium text-sm">
          Already verified? <Link to="/authority-login" className="text-amber-500 font-bold hover:underline">Sign In Here</Link>
        </p>
      </div>
    </div>
  );
};

export default AuthoritySignup;