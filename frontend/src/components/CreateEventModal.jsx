import React, { useState } from 'react';
import axios from 'axios';
import { X, Calendar, Clock, MapPin, AlignLeft, Loader2 } from 'lucide-react';

const CreateEventModal = ({ isOpen, onClose, user, onEventCreated }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const eventData = {
        ...formData,
        // Using stable ID from the user object
        creatorId: user?._id || user?.id,
        // Explicitly passing user type for the backend refPath
        onModel: user?.isAuthority ? 'Authority' : 'User'
      };
      
      // Ensure port 5000 matches your backend
      await axios.post('http://localhost:3000/api/events/create', eventData);
      
      onEventCreated(); // Refresh the list in EventsPage
      onClose();        // Close the modal
      
      // Reset form
      setFormData({ title: '', description: '', date: '', time: '', location: '' });
    } catch (err) {
      console.error("Error creating event:", err);
      alert("Failed to host event. Check if all fields are filled.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-t-[2.5rem] md:rounded-[3rem] p-8 shadow-2xl animate-in slide-in-from-bottom duration-300">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Host New Event</h2>
            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mt-1">JSR Community Pulse</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-3 bg-slate-100 rounded-2xl text-slate-500 hover:bg-slate-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Event Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Event Title</label>
            <input 
              type="text" placeholder="e.g. Jubilee Park Clean-up" required
              className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-blue-500 focus:bg-white font-bold transition-all"
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Description</label>
            <textarea 
              placeholder="What are we doing? Mention items to bring..." required
              className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-blue-500 focus:bg-white h-24 resize-none transition-all"
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Date</label>
              <input 
                type="date" required
                className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-blue-500 focus:bg-white text-sm font-bold"
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Time</label>
              <input 
                type="time" required
                className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-blue-500 focus:bg-white text-sm font-bold"
                onChange={(e) => setFormData({...formData, time: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Location</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-4 text-slate-400" size={18} />
              <input 
                type="text" placeholder="e.g. Sonari West" required
                className="w-full p-4 pl-12 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-blue-500 focus:bg-white font-bold transition-all"
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-5 rounded-[1.5rem] font-black text-lg shadow-2xl shadow-blue-500/40 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:active:scale-100"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                LAUNCHING...
              </>
            ) : (
              'LAUNCH EVENT'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEventModal;