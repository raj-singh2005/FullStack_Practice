import React, { useState } from 'react';
import { MessageCircle, Send, X, Bot, Loader2 } from 'lucide-react';
import axios from 'axios';

const CivicBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([{ role: 'bot', text: 'Hi! I am your Jamshedpur Assistant. How can I help you today?' }]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:3000/api/ai/chat', { message: input });
      setMessages(prev => [...prev, { role: 'bot', text: res.data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: "Sorry, I'm having trouble connecting." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-6 z-[200]">
      {/* 🟢 The Bubble */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 p-4 rounded-full shadow-2xl text-white hover:scale-110 transition-all animate-bounce"
        >
          <MessageCircle size={28} />
        </button>
      )}

      {/* 🟢 The Chat Window */}
      {isOpen && (
        <div className="bg-white w-80 h-[450px] rounded-[2rem] shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10">
          <div className="bg-slate-900 p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bot size={20} className="text-blue-400" />
              <span className="font-black text-xs uppercase tracking-widest">CivicBot</span>
            </div>
            <button onClick={() => setIsOpen(false)}><X size={18} /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-xs font-medium ${
                  m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-100 text-slate-700 rounded-tl-none'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && <Loader2 className="animate-spin text-blue-500 mx-auto" size={20} />}
          </div>

          <div className="p-4 border-t border-slate-100 flex gap-2">
            <input 
              value={input} 
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask anything..." 
              className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-blue-500"
            />
            <button onClick={handleSend} className="bg-blue-600 p-2 rounded-xl text-white">
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CivicBot;