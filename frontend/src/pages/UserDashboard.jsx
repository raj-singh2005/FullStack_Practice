import React, { useState, useEffect } from 'react';
import { Star, MapPin, Clock, CheckCircle2, Plus, ChevronRight, Loader2, AlertCircle, Trophy, Calendar } from 'lucide-react'; // Added Calendar icon
import { Link } from 'react-router-dom';
import axios from 'axios';
import ComplaintModal from '../components/ComplaintModal'; 
import LeaderboardModal from '../components/LeaderboardModal';
import CivicBot from '../components/CivicBot';

const UserDashboard = ({ user }) => {
  const [myReports, setMyReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/complaints');
        const filteredData = response.data.filter(report => {
          const reportUserId = report.user?._id || report.user;
          const currentUserId = user?._id || user?.id;
          return String(reportUserId) === String(currentUserId);
        });
        setMyReports(filteredData);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchReports();
  }, [user]);

  const pendingCount = myReports.filter(r => r.status === 'Pending').length;
  const resolvedCount = myReports.filter(r => r.status === 'Resolved').length;

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
      <Loader2 className="animate-spin mb-2" size={32} />
      <p className="font-bold text-sm uppercase tracking-widest">Updating Dashboard...</p>
    </div>
  );

  return (
    <div className="max-w-md mx-auto pb-32 space-y-6 px-4 pt-4">
      
      {/* 1. Profile Summary Card */}
      <div className="bg-slate-900 rounded-[2.5rem] p-6 text-white shadow-2xl shadow-blue-900/20 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-1">
             <p className="text-blue-400 font-bold text-xs uppercase tracking-[0.2em]">Citizen Profile</p>
             <div className="flex gap-2">
                <button 
                  onClick={() => setIsLeaderboardOpen(true)}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all active:scale-90"
                >
                  <Trophy size={18} className="text-yellow-400" />
                </button>
             </div>
          </div>
          <h1 className="text-2xl font-black mb-4">Hi, {user?.username || 'Citizen'}</h1>
          
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-3xl font-black flex items-center gap-2">
                <Star className="text-yellow-400" size={24} fill="currentColor" />
                {user?.stars || 0}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Impact Points</span>
            </div>
            <div className="h-10 w-[1px] bg-slate-800"></div>
            <div className="flex flex-col">
              <span className="text-3xl font-black">{myReports.length}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Reports</span>
            </div>
          </div>
        </div>
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl"></div>
      </div>

      {/* ✨ NEW: Community Events Quick Access */}
      <Link 
        to="/events" 
        className="bg-blue-50 border border-blue-100 p-5 rounded-[2rem] flex items-center justify-between group hover:bg-blue-100 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-200">
            <Calendar size={20} />
          </div>
          <div>
            <h4 className="font-black text-slate-900">Volunteer & Events</h4>
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Earn more stars</p>
          </div>
        </div>
        <ChevronRight size={20} className="text-blue-400 group-hover:translate-x-1 transition-transform" />
      </Link>

      {/* 2. Stats Bar */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="bg-amber-100 p-2 rounded-xl text-amber-600"><Clock size={18}/></div>
          <div className="leading-tight">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Pending</p>
            <p className="text-lg font-black text-slate-900">{pendingCount}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="bg-emerald-100 p-2 rounded-xl text-emerald-600"><CheckCircle2 size={18}/></div>
          <div className="leading-tight">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Resolved</p>
            <p className="text-lg font-black text-slate-900">{resolvedCount}</p>
          </div>
        </div>
      </div>

      {/* 3. Recent Activity */}
      <div className="space-y-4">
        <h3 className="font-black text-lg text-slate-900 px-2">Recent Reports</h3>
        {myReports.length === 0 ? (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] p-10 text-center">
            <AlertCircle className="mx-auto text-slate-300 mb-2" size={32} />
            <p className="text-slate-500 font-bold text-sm">No reports filed yet.</p>
          </div>
        ) : (
          myReports.map((report) => (
            <div key={report._id} onClick={() => setSelectedReport(report)} className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md cursor-pointer flex items-center justify-between group">
               <div className="flex items-center gap-4 overflow-hidden">
                <img src={report.image} alt="issue" className="w-14 h-14 rounded-2xl object-cover bg-slate-100" />
                <div className="truncate">
                  <h4 className="font-bold text-slate-900 truncate">{report.title}</h4>
                  <p className="text-[10px] text-slate-500 font-medium flex items-center gap-1 truncate">
                    <MapPin size={10} /> {report.location?.address || 'Jamshedpur'}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                  report.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {report.status}
                </span>
                <ChevronRight size={16} />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modals */}
      <ComplaintModal 
        item={selectedReport}
        isOpen={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        isAuthority={false}
      />

      <LeaderboardModal 
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
      />

      {/* Bottom Action */}
      <div className="fixed bottom-6 left-0 right-0 px-6 max-w-md mx-auto z-50">
        <Link to="/report-issue" className="flex items-center justify-center gap-2 bg-blue-600 text-white w-full py-4 rounded-2xl font-black text-lg shadow-2xl shadow-blue-500/40">
          <Plus size={24} strokeWidth={3} />
          Report Issue
        </Link>
      </div>
      <CivicBot />
    </div>
  );
};

export default UserDashboard;