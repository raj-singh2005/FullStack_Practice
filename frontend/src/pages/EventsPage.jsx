import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import EventCard from '../components/EventCard';
import CreateEventModal from '../components/CreateEventModal';
import { Loader2, Plus, Info } from 'lucide-react';

const EventsPage = ({ user }) => {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('active');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Stable user ID
  const stableUserId = useMemo(() => user?._id || user?.id, [user]);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);

      // Build params safely
      const params = { type: filter };

      // Attach userId only if available
      if (stableUserId) {
        params.userId = stableUserId;
      }

      const res = await axios.get('http://localhost:3000/api/events', {
        params
      });

      setEvents(res.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, [filter, stableUserId]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Loader while user is initializing
  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 pb-32">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
            Community Pulse
          </h1>
          <p className="text-slate-500 font-bold text-sm flex items-center gap-2 mt-1">
            <Info size={14} className="text-blue-500"/>
            Community drives & impact points.
          </p>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto bg-blue-600 text-white px-8 py-4 rounded-[1.5rem] font-black shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <Plus size={20} strokeWidth={3} /> Host Event
        </button>
      </header>

      {/* FILTER TABS */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 mb-8 pb-2">
        {['active', 'closed', 'hosted', 'joined'].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`whitespace-nowrap capitalize px-6 py-2.5 rounded-2xl text-[10px] font-black tracking-widest transition-all ${
              filter === type 
              ? 'bg-slate-900 text-white shadow-lg' 
              : 'bg-white text-slate-400 border border-slate-200'
            }`}
          >
            {type.toUpperCase()}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-300">
           <Loader2 className="animate-spin mb-2" size={40} />
           <p className="font-bold text-[10px] uppercase tracking-widest">Syncing...</p>
        </div>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <EventCard 
              key={event._id} 
              event={event} 
              currentUserId={stableUserId} 
              onUpdate={fetchEvents}
              isAuthorityUser={user?.isAuthority || false}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200">
           <p className="text-slate-400 font-bold italic">No events found.</p>
        </div>
      )}

      <CreateEventModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        user={user} 
        onEventCreated={fetchEvents} 
      />
    </div>
  );
};

export default EventsPage;