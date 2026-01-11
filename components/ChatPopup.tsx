import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { X, Send, MessageSquare, Building2, User } from 'lucide-react';

export const ChatPopup: React.FC = () => {
  const { 
    user, 
    currentCompany, 
    chatMessages, 
    sendChatMessage, 
    markChatAsRead,
    activeChatCompanyId,
    setActiveChatCompanyId 
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Determine which company chat we are viewing
  // If SuperAdmin: Uses activeChatCompanyId (selected from dashboard/list)
  // If Regular User: Uses their currentCompany.id
  const targetCompanyId = user?.role === 'SUPER_ADMIN' ? activeChatCompanyId : currentCompany?.id;
  
  // Find company info for header
  const targetCompanyName = user?.role === 'SUPER_ADMIN' 
    ? (activeChatCompanyId ? `Admin ${activeChatCompanyId === 'comp_1' ? 'Nation' : activeChatCompanyId === 'comp_2' ? 'Escobar' : 'Uruguay'}` : 'Seleccionar Empresa')
    : 'Soporte MOVITRAK';

  // Open chat automatically if SuperAdmin selects a company to chat from dashboard
  useEffect(() => {
    if (user?.role === 'SUPER_ADMIN' && activeChatCompanyId) {
      setIsOpen(true);
    }
  }, [activeChatCompanyId, user]);

  // Mark as read when opening
  useEffect(() => {
    if (isOpen && targetCompanyId) {
      markChatAsRead(targetCompanyId);
    }
  }, [isOpen, targetCompanyId, chatMessages]);

  // Scroll to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isOpen]);

  if (!user || (!targetCompanyId && user.role !== 'SUPER_ADMIN')) return null;

  const filteredMessages = chatMessages.filter(m => m.companyId === targetCompanyId);
  const hasUnread = chatMessages.some(m => m.companyId === currentCompany?.id && !m.isRead && m.senderId !== user.id);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !targetCompanyId) return;
    sendChatMessage(inputText, targetCompanyId);
    setInputText('');
  };

  const handleClose = () => {
    setIsOpen(false);
    if (user.role === 'SUPER_ADMIN') {
      setActiveChatCompanyId(null);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-slate-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-50 group border border-slate-700"
      >
        <MessageSquare size={24} />
        {hasUnread && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-slate-900 animate-pulse"></span>
        )}
        <div className="absolute right-16 bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl">
          Soporte & Chat
        </div>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-slate-200 animate-in slide-in-from-bottom-10 duration-300 font-sans">
      
      {/* Header */}
      <div className="bg-slate-900 text-white p-4 rounded-t-2xl flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
            {user.role === 'SUPER_ADMIN' ? <Building2 size={18} /> : <User size={18} />}
          </div>
          <div>
            <h3 className="font-bold text-sm">{targetCompanyName}</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-[10px] text-slate-300 uppercase tracking-wider">En línea</span>
            </div>
          </div>
        </div>
        <button onClick={handleClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <X size={18} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {!targetCompanyId ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 opacity-60">
            <MessageSquare size={40} />
            <p className="text-xs font-bold uppercase mt-2">Seleccione una empresa</p>
          </div>
        ) : (
          filteredMessages.map((msg) => {
            const isMe = msg.senderId === user.id;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-xs font-medium leading-relaxed shadow-sm ${
                  isMe 
                    ? 'bg-brand-600 text-white rounded-br-none' 
                    : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none'
                }`}>
                  {!isMe && <p className="text-[9px] font-black opacity-50 mb-1 uppercase tracking-wider">{msg.senderName}</p>}
                  {msg.text}
                  <p className={`text-[9px] mt-1 text-right ${isMe ? 'text-blue-200' : 'text-slate-400'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-3 border-t border-slate-200 bg-white rounded-b-2xl">
        <div className="relative">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Escriba un mensaje..."
            className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-50 outline-none text-xs font-medium transition-all"
            disabled={!targetCompanyId && user.role === 'SUPER_ADMIN'}
          />
          <button 
            type="submit"
            disabled={!inputText.trim() || (!targetCompanyId && user.role === 'SUPER_ADMIN')}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50 disabled:hover:bg-brand-600 transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};