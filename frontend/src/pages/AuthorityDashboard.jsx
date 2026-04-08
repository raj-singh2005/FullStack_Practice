import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, Clock, AlertTriangle, MapPin, 
  ExternalLink, Loader2, Camera, Eye
} from 'lucide-react';
import axios from 'axios';
import ComplaintModal from '../components/ComplaintModal'; 

const AuthorityDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/complaints');
      setComplaints(response.data);
    } catch (err) {
      console.error("Error fetching reports:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await axios.patch(`http://localhost:3000/api/complaints/${id}/status`, { status: newStatus });
      fetchComplaints();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const filteredComplaints = filter === 'All' 
    ? complaints 
    : complaints.filter(c => c.status === filter);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 pb-20">
      <div className="max-w-6xl mx-auto mb-8 pt-4">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Jamshedpur Command Center</h1>
        <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mt-1">Official Authority Portal</p>
      </div>

      {/* Stats Bar */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-black uppercase tracking-tighter">New Issues</p>
            <p className="text-3xl font-black text-amber-500">{complaints.filter(c => c.status === 'Pending').length}</p>
          </div>
          <Clock className="text-amber-100" size={48} />
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-black uppercase tracking-tighter">In Progress</p>
            <p className="text-3xl font-black text-blue-500">{complaints.filter(c => c.status === 'In Progress').length}</p>
          </div>
          <AlertTriangle className="text-blue-100" size={48} />
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-black uppercase tracking-tighter">Resolved</p>
            <p className="text-3xl font-black text-emerald-500">{complaints.filter(c => c.status === 'Resolved').length}</p>
          </div>
          <CheckCircle2 className="text-emerald-100" size={48} />
        </div>
      </div>

      {/* Filter Controls */}
      <div className="max-w-6xl mx-auto mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {['All', 'Pending', 'In Progress', 'Resolved'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
              filter === tab ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-200 hover:border-slate-400'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Grid of Reports */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredComplaints.map((item) => (
          <div key={item._id} className="bg-white rounded-[2.5rem] p-5 shadow-sm border border-slate-100 hover:shadow-xl transition-all group">
            <div className="flex gap-5">
              <div className="relative shrink-0 cursor-pointer" onClick={() => setSelectedItem(item)}>
                <img src={item.image} alt="Issue" className="w-32 h-32 rounded-3xl object-cover bg-slate-100" />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl flex items-center justify-center">
                   <Eye className="text-white" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-black text-lg text-slate-900 truncate pr-2">{item.title}</h3>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-tighter ${
                      item.userType === 'Guest' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {item.userType}
                    </span>
                    {/* 📍 REDIRECT BUTTON ADDED HERE */}
                    <a 
                      href={`https://www.google.com/maps?q=${item.location?.lat},${item.location?.lng}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="p-1.5 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Open in Google Maps"
                    >
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
                
                <p className="text-slate-500 text-sm line-clamp-2 mb-2 font-medium cursor-pointer" onClick={() => setSelectedItem(item)}>
                  {item.description}
                </p>

                <div className="flex items-center gap-1.5 text-slate-400 mb-4">
                    <MapPin size={12} className="shrink-0" />
                    <span className="text-[10px] font-bold truncate">
                        {item.location?.address || 'Jamshedpur'}
                    </span>
                </div>

                <div className="flex gap-2">
                  {item.status === 'Pending' && (
                    <button 
                      onClick={() => handleUpdateStatus(item._id, 'In Progress')}
                      className="flex-1 bg-blue-50 text-blue-700 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-blue-600 hover:text-white transition-all"
                    >
                      Accept Task
                    </button>
                  )}
                  
                  {item.status !== 'Resolved' ? (
                    <button 
                      onClick={() => setSelectedItem(item)}
                      className="flex-1 bg-emerald-50 text-emerald-700 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center gap-1"
                    >
                      <Camera size={12} /> Resolve Issue
                    </button>
                  ) : (
                    <div className="flex-1 flex items-center justify-center gap-2 text-emerald-600 bg-emerald-50 py-2 rounded-xl text-[10px] font-black uppercase cursor-pointer" onClick={() => setSelectedItem(item)}>
                      <CheckCircle2 size={14} /> View Resolution
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
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