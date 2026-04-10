import React, { useState } from 'react';
import { Camera, MapPin, Send, Loader2, ChevronLeft, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ComplaintForm = ({ user }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    category: 'Garbage Collection',
    description: '',
    image: null,
    previewUrl: null,
    location: { lat: null, lng: null, address: "" }
  });

  // 📸 1. Handle Image Selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ 
        ...formData, 
        image: file, 
        previewUrl: URL.createObjectURL(file) 
      });
    }
  };

  // 📍 2. Handle GPS Location
  const getGeoLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: "Jamshedpur, Jharkhand" 
          }
        }));
        setLoading(false);
      },
      () => {
        alert("Please enable location to verify the issue address.");
        setLoading(false);
      }
    );
  };

  // 🚀 3. Submit to Backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image || !formData.location.lat) {
      return alert("Photo and Location are mandatory!");
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append('image', formData.image); 
      data.append('title', formData.category);
      data.append('description', formData.description);
      
      // Handle Guest vs User identity
      if (user && (user._id || user.id)) {
        data.append('user', user._id || user.id);
        data.append('userType', 'User');
      } else {
        data.append('user', null); 
        data.append('userType', 'Guest');
      }
      
      data.append('location', JSON.stringify({
        lat: formData.location.lat,
        lng: formData.location.lng,
        address: formData.location.address || "Jamshedpur"
      }));

      const response = await axios.post('http://localhost:3000/api/complaints', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 201 || response.data.message.includes("success")) {
        
        // ✨ THE FIX: Reset state to clear the form fields and preview
        setFormData({
          category: 'Garbage Collection',
          description: '',
          image: null,
          previewUrl: null,
          location: { lat: null, lng: null, address: "" }
        });

        // ✅ SMART NAVIGATION
        if (user) {
          alert("🚀 Report submitted to your dashboard!");
          navigate('/dashboard');
        } else {
          alert("✅ Anonymous report sent! Thank you for helping Jamshedpur.");
          navigate('/'); 
        }
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Internal Server Error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white pb-10 px-4">
      {/* Header */}
      <div className="flex items-center gap-4 py-6 border-b border-slate-50">
        <button 
          onClick={() => navigate(user ? '/dashboard' : '/')} 
          className="p-2 hover:bg-slate-100 rounded-full transition"
        >
          <ChevronLeft size={24} className="text-slate-900" />
        </button>
        <h1 className="text-xl font-black text-slate-900">New Report</h1>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-8">
        
        <div className="space-y-4">
          <label className="block text-sm font-black text-slate-400 uppercase tracking-widest">Step 1: Evidence</label>
          <div className="grid grid-cols-2 gap-4">
            <label className={`relative h-40 flex flex-col items-center justify-center rounded-[2rem] border-2 border-dashed transition-all cursor-pointer ${formData.previewUrl ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-slate-50 text-slate-400'}`}>
              {formData.previewUrl ? (
                <img src={formData.previewUrl} alt="Preview" className="h-full w-full object-cover rounded-[2rem]" />
              ) : (
                <>
                  <Camera size={32} className="mb-2" />
                  <span className="text-xs font-bold text-center px-2">Take/Upload Photo</span>
                </>
              )}
              <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImageChange} disabled={loading} />
            </label>

            <button 
              type="button"
              onClick={getGeoLocation}
              disabled={loading}
              className={`h-40 flex flex-col items-center justify-center rounded-[2rem] border-2 border-dashed transition-all ${formData.location.lat ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-slate-200 bg-slate-50 text-slate-400'}`}
            >
              {formData.location.lat ? <CheckCircle size={32} className="mb-2" /> : <MapPin size={32} className="mb-2" />}
              <span className="text-xs font-bold">{formData.location.lat ? "Pinned" : "Get Location"}</span>
            </button>
          </div>
        </div>

        <div className="space-y-5">
          <label className="block text-sm font-black text-slate-400 uppercase tracking-widest">Step 2: Details</label>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 ml-1">Issue Category</label>
            <select 
              value={formData.category}
              className="w-full p-4 bg-slate-100 border-none rounded-2xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-600"
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              disabled={loading}
            >
              <option value="Garbage Collection">Garbage Collection</option>
              <option value="Pothole Repair">Pothole Repair</option>
              <option value="Streetlight Issue">Streetlight Issue</option>
              <option value="Water Leakage">Water Leakage</option>
              <option value="Encroachment">other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 ml-1">Brief Description</label>
            <textarea 
              value={formData.description}
              placeholder="Tell us exactly what's wrong..."
              required
              className="w-full p-4 bg-slate-100 border-none rounded-2xl font-medium text-slate-900 h-32 outline-none focus:ring-2 focus:ring-blue-600 resize-none"
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              disabled={loading}
            />
          </div>
        </div>

        <button 
          disabled={loading || !formData.image || !formData.location.lat}
          className={`w-full py-5 rounded-3xl font-black text-lg shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95 ${
            loading || !formData.image || !formData.location.lat
            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
            : 'bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700'
          }`}
        >
          {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
          {loading ? "Uploading Evidence..." : "Submit Report"}
        </button>

      </form>
    </div>
  );
};

export default ComplaintForm;