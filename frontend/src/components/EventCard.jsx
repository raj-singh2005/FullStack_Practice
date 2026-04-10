import React, { useState } from 'react';
import axios from 'axios';
import { Landmark, Users, Heart } from 'lucide-react';

const EventCard = ({ event, currentUserId, onUpdate, isAuthorityUser }) => {
    const [fundingAmount, setFundingAmount] = useState('');
    const [showFundInput, setShowFundInput] = useState(false);

    const isJoined = event.volunteers?.some(v => 
        String(v._id || v) === String(currentUserId)
    );

    const handleJoin = async () => {
        try {
            // Updated to port 5000
            await axios.post('http://localhost:3000/api/events/join', {
                eventId: event._id,
                userId: currentUserId
            });
            if (typeof onUpdate === 'function') onUpdate();
        } catch (err) {
            console.error("Join Error:", err);
            alert("Error joining event");
        }
    };

    const handleFund = async () => {
        if (!fundingAmount || fundingAmount <= 0) return;
        try {
            // Updated to port 5000
            await axios.post('http://localhost:3000/api/events/fund', {
                eventId: event._id,
                userId: currentUserId,
                amount: Number(fundingAmount)
            });
            setFundingAmount('');
            setShowFundInput(false);
            if (typeof onUpdate === 'function') onUpdate();
        } catch (err) {
            console.error("Funding Error:", err);
            alert("Error processing funding");
        }
    };

    return (
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="p-7">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-black text-slate-900 leading-tight">{event.title}</h3>
                    <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                        event.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                        {event.status}
                    </span>
                </div>

                <div className="flex items-center gap-2 mb-4">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg uppercase tracking-tighter ${
                        event.onModel === 'Authority' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                        {event.onModel === 'Authority' ? 'Official' : 'Community'}
                    </span>
                    <p className="text-[11px] text-slate-400 font-bold italic">
                        By {event.creator?.organization || event.creator?.username || 'Jamshedpur Citizen'}
                    </p>
                </div>

                <p className="text-slate-500 text-sm mb-6 line-clamp-2 leading-relaxed">{event.description}</p>

                {/* DETAILS GRID: Added Total Raised Display */}
                <div className="grid grid-cols-2 gap-4 text-[11px] font-bold text-slate-400 mb-6">
                    <div className="flex items-center gap-2">📍 {event.location}</div>
                    <div className="flex items-center gap-2">📅 {new Date(event.date).toLocaleDateString()}</div>
                    
                    {/* 💰 Displays dynamic fund from DB */}
                    <div className="flex items-center gap-2 text-emerald-600 font-black">
                        💰 ₹{event.totalFund || 0} Raised
                    </div>

                    <div className="flex items-center gap-2 text-blue-600">
                        👥 {event.volunteers?.length || 0} Joined
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    {isAuthorityUser ? (
                        <button 
                            onClick={() => setShowFundInput(!showFundInput)}
                            className="w-full bg-slate-900 text-white py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-xl shadow-slate-200 active:scale-95 transition-all"
                        >
                            <Landmark size={16} strokeWidth={2.5} /> Official Funding
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button 
                                onClick={handleJoin}
                                disabled={isJoined || event.status === 'closed'}
                                className={`flex-1 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${
                                    isJoined 
                                    ? 'bg-slate-50 text-slate-300 cursor-not-allowed border border-slate-100' 
                                    : 'bg-blue-600 text-white hover:bg-slate-900 shadow-xl shadow-blue-100 active:scale-95'
                                }`}
                            >
                                <Users size={16} /> {isJoined ? 'ALREADY JOINED' : 'VOLUNTEER'}
                            </button>
                            
                            <button 
                                onClick={() => setShowFundInput(!showFundInput)}
                                className="px-5 bg-slate-50 text-slate-600 rounded-[1.5rem] hover:bg-slate-100 transition-all flex items-center justify-center border border-slate-100"
                            >
                                <Heart size={18} fill={showFundInput ? "currentColor" : "none"} />
                            </button>
                        </div>
                    )}

                    {showFundInput && (
                        <div className="flex gap-2 mt-1 animate-in slide-in-from-top-2 duration-300">
                            <input 
                                type="number" 
                                placeholder="Amount (₹)" 
                                value={fundingAmount}
                                onChange={(e) => setFundingAmount(e.target.value)}
                                className="flex-1 bg-slate-50 border-none rounded-2xl px-5 py-3 text-sm font-black outline-none focus:ring-2 ring-blue-500"
                            />
                            <button 
                                onClick={handleFund}
                                className="bg-emerald-600 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase shadow-lg shadow-emerald-100"
                            >
                                PAY
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventCard;