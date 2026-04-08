import React, { useState } from 'react';
import { X, Camera, CheckCircle, Loader2, MapPin, Star } from 'lucide-react';
import axios from 'axios';

const ComplaintModal = ({ item, isOpen, onClose, isAuthority, onUpdate }) => {
  const [resImage, setResImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [starAwarded, setStarAwarded] = useState(false);

  if (!isOpen || !item) return null;

  const handleResolve = async () => {
    if (!resImage) return alert("Please upload proof of resolution");
    setUploading(true);
    const data = new FormData();
    data.append('image', resImage);

    try {
      await axios.patch(`http://localhost:3000/api/complaints/${item._id}/resolve`, data);
      if (onUpdate) onUpdate(); 
      onClose();
    } catch (err) {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // ✨ Handle Star Awarding
  const handleGiveStar = async () => {
    try {
      const userId = item.user?._id || item.user;
      if (!userId) return alert("Guests cannot receive stars.");
      
      // Assuming you have a backend route to increment stars
      await axios.patch(`http://localhost:3000/api/users/${userId}/award-star`);
      setStarAwarded(true);
      alert("Impact Point awarded to the citizen!");
    } catch (err) {
      alert("Could not award star. Ensure the user is registered.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl relative flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-50 flex justify-between items-start">
          <div>
            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${item.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
              {item.status}
            </span>
            <h2 className="text-lg font-black text-slate-900 mt-1 leading-tight truncate w-64">{item.title}</h2>
          </div>
          <button onClick={onClose} className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-4 custom-scrollbar">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Before</p>
              <img src={item.image} className="w-full h-28 object-cover rounded-2xl bg-slate-100 border border-slate-100" alt="Before" />
            </div>
            <div className="space-y-1">
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest text-center">After (Proof)</p>
              {item.resolvedImage ? (
                <img src={item.resolvedImage} className="w-full h-28 object-cover rounded-2xl bg-emerald-50 border border-emerald-100" alt="After" />
              ) : (
                <div className="w-full h-28 flex items-center justify-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl">
                  <p className="text-[8px] font-black text-slate-300 uppercase italic">Pending</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
             <p className="text-xs font-medium text-slate-600 leading-snug italic truncate">
              "{item.description}"
            </p>
          </div>

          {/* ✨ Star Reward Section (Only for Authorities & Registered Users) */}
          {isAuthority && item.status === 'Resolved' && item.userType === 'User' && (
            <div className="bg-yellow-50 p-4 rounded-2xl border border-yellow-100 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-yellow-700 uppercase tracking-widest">Reward Citizen</p>
                <p className="text-xs font-bold text-yellow-600">Give +1 Star for this report</p>
              </div>
              <button 
                onClick={handleGiveStar}
                disabled={starAwarded}
                className={`p-3 rounded-full transition-all shadow-md active:scale-90 ${starAwarded ? 'bg-yellow-400 text-white' : 'bg-white text-yellow-500 hover:bg-yellow-400 hover:text-white'}`}
              >
                <Star size={20} fill={starAwarded ? "currentColor" : "none"} />
              </button>
            </div>
          )}
        </div>

        {/* Footer Action Area */}
        {isAuthority && item.status !== 'Resolved' && (
          <div className="p-6 bg-slate-50 rounded-b-[2rem] border-t border-slate-100">
            <label className="flex items-center justify-center gap-2 w-full py-4 mb-4 bg-white text-blue-600 rounded-2xl cursor-pointer hover:bg-blue-50 transition-all font-bold text-xs border-2 border-dashed border-blue-100 shadow-sm">
              <Camera size={18} />
              {resImage ? "Proof Ready ✅" : "Upload Fix Image"}
              <input type="file" className="hidden" onChange={(e) => setResImage(e.target.files[0])} />
            </label>
            
            <button 
              onClick={handleResolve}
              disabled={uploading || !resImage}
              className="w-full py-4 bg-blue-600 text-white rounded-xl font-black text-sm shadow-lg shadow-blue-200 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {uploading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
              {uploading ? "Processing..." : "Confirm Fix"}
            </button>
          </div>
        )}

        {item.status === 'Resolved' && (
          <div className="p-5 bg-emerald-50 rounded-b-[2rem] text-center border-t border-emerald-100">
             <p className="text-[10px] font-black text-emerald-700 uppercase tracking-[0.2em] flex items-center justify-center gap-2">
               <CheckCircle size={16} /> Issue Successfully Resolved
             </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintModal;