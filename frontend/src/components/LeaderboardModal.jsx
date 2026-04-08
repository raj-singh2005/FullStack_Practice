import React, { useState, useEffect } from 'react';
import { X, Trophy, Star, Medal, Loader2 } from 'lucide-react';
import axios from 'axios';

const LeaderboardModal = ({ isOpen, onClose }) => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      const fetchLeaders = async () => {
        try {
          const res = await axios.get('http://localhost:3000/api/users');
          // Sort users by stars descending and take top 10
          const sorted = res.data
            .filter(u => !u.isAuthority) // Only show citizens
            .sort((a, b) => (b.stars || 0) - (a.stars || 0))
            .slice(0, 10);
          setLeaders(sorted);
        } catch (err) {
          console.error("Leaderboard fetch error", err);
        } finally {
          setLoading(false);
        }
      };
      fetchLeaders();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm rounded-[2.5rem] overflow-hidden shadow-2xl relative flex flex-col max-h-[70vh]">
        
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Trophy className="text-yellow-400" size={24} />
            <h2 className="text-xl font-black uppercase tracking-tight">Top Citizens</h2>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700">
            <X size={18} />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="animate-spin text-blue-600" /></div>
          ) : (
            leaders.map((leader, index) => (
              <div key={leader._id} className={`flex items-center justify-between p-4 rounded-3xl border ${index === 0 ? 'bg-yellow-50 border-yellow-200' : 'bg-slate-50 border-slate-100'}`}>
                <div className="flex items-center gap-4">
                  <span className="w-6 font-black text-slate-400 text-sm">#{index + 1}</span>
                  <div>
                    <p className="font-black text-slate-900 leading-none">{leader.username}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Jamshedpur Hero</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-full shadow-sm">
                  <Star size={14} className="text-yellow-500" fill="currentColor" />
                  <span className="font-black text-slate-900">{leader.stars || 0}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardModal;