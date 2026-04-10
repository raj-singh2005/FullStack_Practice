import React, { useState, useEffect, useCallback } from 'react';
import {  
  CheckCircle2, Clock, AlertTriangle, MapPin,  
  ExternalLink, Loader2, Camera, Eye,
  Calendar,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ComplaintModal from '../components/ComplaintModal'; 

const AuthorityDashboard = ({ user, setUser }) => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [selectedItem, setSelectedItem] = useState(null);
  const navigate = useNavigate();

  const fetchComplaints = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/complaints');
      setComplaints(response.data);
    } catch (err) {
      console.error("Error fetching reports:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await axios.patch(`http://localhost:3000/api/complaints/${id}/status`, { status: newStatus });
      fetchComplaints();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/authority-login');
  };

  const filteredComplaints = filter === 'All' 
    ? complaints 
    : complaints.filter(c => c.status === filter);

  if (!user) return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
      <Loader2 className="animate-spin text-blue-600" size={40} />
      <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Authenticating Official...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 pb-20">
      
      {/* Header with Logout */}
      <div className="max-w-6xl mx-auto mb-8 pt-4 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Command Center</h1>
          <div className="flex items-center gap-2 mt-2">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
             <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">
               Official: {user.organization || 'Jamshedpur Authority'}
             </p>
          </div>
        </div>
       
      </div>

      {/* --- COMMUNITY EVENTS ACCESS --- */}
      <div className="max-w-6xl mx-auto mb-8">
        <Link 
          to="/events" 
          className="bg-slate-900 text-white p-6 rounded-[2.5rem] flex items-center justify-between group hover:bg-blue-600 transition-all shadow-2xl shadow-slate-200"
        >
          <div className="flex items-center gap-4">
            <div className="bg-white/10 p-4 rounded-3xl text-blue-400 backdrop-blur-md">
              <Calendar size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h4 className="font-black text-xl tracking-tight">Manage Community Pulse</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 group-hover:text-blue-100">Launch drives & verification</p>
            </div>
          </div>
          <div className="bg-white/10 p-2 rounded-full group-hover:translate-x-1 transition-transform">
             <ChevronRight size={20} />
          </div>
        </Link>
      </div>

      {/* Stats Section */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center justify-between">
          <div className="leading-none">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Pending</p>
            <p className="text-4xl font-black text-slate-900">{complaints.filter(c => c.status === 'Pending').length}</p>
          </div>
          <div className="bg-amber-50 p-4 rounded-3xl text-amber-500"><Clock size={28} /></div>
        </div>
        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center justify-between">
          <div className="leading-none">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Ongoing</p>
            <p className="text-4xl font-black text-slate-900">{complaints.filter(c => c.status === 'In Progress').length}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-3xl text-blue-500"><AlertTriangle size={28} /></div>
        </div>
        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center justify-between">
          <div className="leading-none">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Closed</p>
            <p className="text-4xl font-black text-slate-900">{complaints.filter(c => c.status === 'Resolved').length}</p>
          </div>
          <div className="bg-emerald-50 p-4 rounded-3xl text-emerald-500"><CheckCircle2 size={28} /></div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-6xl mx-auto mb-8 flex gap-2 overflow-x-auto no-scrollbar pb-2">
        {['All', 'Pending', 'In Progress', 'Resolved'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
              filter === tab ? 'bg-slate-900 text-white shadow-xl translate-y-[-2px]' : 'bg-white text-slate-400 border border-slate-200 hover:border-slate-400'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Reports Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredComplaints.length > 0 ? filteredComplaints.map((item) => (
          <div key={item._id} className="bg-white rounded-[3rem] p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all group flex flex-col md:flex-row gap-6">
            <div className="relative shrink-0 cursor-pointer w-full md:w-40" onClick={() => setSelectedItem(item)}>
              <img src={item.image} alt="Issue" className="w-full h-40 md:h-full rounded-[2rem] object-cover bg-slate-50" />
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem] flex items-center justify-center">
                 <Eye className="text-white" size={32} />
              </div>
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex flex-col gap-1 min-w-0">
                    <h3 className="font-black text-xl text-slate-900 truncate pr-2">{item.title}</h3>
                    {/* RESTORED USER/GUEST BADGE HERE */}
                    <span className={`w-fit px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-tighter ${
                      item.userType === 'Guest' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {item.userType}
                    </span>
                  </div>
                  <a 
                    href={`https://www.google.com/maps?q=${item.location?.lat},${item.location?.lng}`} 
                    target="_blank" rel="noreferrer"
                    className="p-2 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-xl transition-colors"
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>
                
                <p className="text-slate-500 text-sm line-clamp-2 mb-4 font-medium leading-relaxed">
                  {item.description}
                </p>

                <div className="flex items-center gap-2 text-slate-400 mb-6">
                    <MapPin size={14} />
                    <span className="text-[11px] font-bold truncate">
                        {item.location?.address || 'Jamshedpur District'}
                    </span>
                </div>
              </div>

              <div className="flex gap-3">
                {item.status === 'Pending' && (
                  <button 
                    onClick={() => handleUpdateStatus(item._id, 'In Progress')}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-blue-100"
                  >
                    Accept
                  </button>
                )}
                
                <button 
                  onClick={() => setSelectedItem(item)}
                  className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    item.status === 'Resolved' 
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                    : 'bg-emerald-600 text-white shadow-lg shadow-emerald-100'
                  }`}
                >
                  {item.status === 'Resolved' ? 'View Details' : 'Resolve Task'}
                </button>
              </div>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
             <p className="text-slate-300 font-black uppercase tracking-widest text-sm">No tasks in this category</p>
          </div>
        )}
      </div>

      {selectedItem && (
        <ComplaintModal 
          item={selectedItem}
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          isAuthority={true}
          onUpdate={fetchComplaints}
        />
      )}
    </div>
  );
};

export default AuthorityDashboard;