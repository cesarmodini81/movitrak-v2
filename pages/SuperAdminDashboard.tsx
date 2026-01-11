import React from 'react';
import { useApp } from '../context/AppContext';
import { Company } from '../types';
import { Building2, ArrowRight, ShieldCheck, Activity, Users, MessageSquare } from 'lucide-react';

export const SuperAdminDashboard: React.FC = () => {
  const { companies, setCurrentCompany, chatMessages, setActiveChatCompanyId } = useApp();

  const handleAccessCompany = (company: Company) => {
    setCurrentCompany(company);
  };

  const handleOpenChat = (e: React.MouseEvent, companyId: string) => {
    e.stopPropagation();
    setActiveChatCompanyId(companyId);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-8 animate-in fade-in duration-500">
      
      {/* Header Global */}
      <div className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
           <div className="p-4 bg-slate-900 text-white rounded-2xl shadow-2xl shadow-slate-200">
             <ShieldCheck size={32} />
           </div>
           <div>
             <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">SuperAdmin Global</h1>
             <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Panel de Control Multi-Empresa</p>
           </div>
        </div>
        <div className="bg-white px-6 py-3 rounded-xl shadow-sm border border-slate-200 flex items-center gap-3">
           <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
           <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Sistema Operativo</span>
        </div>
      </div>

      {/* Grid Companies */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {companies.map(company => {
          // Calculate notifications for this company
          const unreadCount = chatMessages.filter(
            m => m.companyId === company.id && !m.isRead && m.senderId !== 'u1' // Assuming u1 is superadmin
          ).length;

          return (
            <div 
              key={company.id}
              onClick={() => handleAccessCompany(company)}
              className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 cursor-pointer group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-500">
                 <Building2 size={120} />
              </div>

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center text-slate-700 shadow-inner">
                    <Building2 size={32} strokeWidth={1.5} />
                  </div>
                  {unreadCount > 0 && (
                    <button 
                      onClick={(e) => handleOpenChat(e, company.id)}
                      className="bg-red-50 text-red-600 px-3 py-1.5 rounded-full flex items-center gap-2 text-[10px] font-black uppercase tracking-wider border border-red-100 shadow-sm hover:bg-red-100 transition-colors animate-pulse"
                    >
                      <MessageSquare size={12} fill="currentColor" />
                      {unreadCount} Nuevos
                    </button>
                  )}
                </div>
                
                <h2 className="text-xl font-black text-slate-900 mb-2 group-hover:text-brand-600 transition-colors">{company.name}</h2>
                <div className="space-y-1 mb-8">
                  {company.locations.slice(0, 2).map(loc => (
                    <p key={loc.id} className="text-xs font-medium text-slate-500 flex items-center gap-2">
                       <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                       {loc.name}
                    </p>
                  ))}
                  {company.locations.length > 2 && (
                    <p className="text-[10px] font-bold text-slate-400 pl-3">+ {company.locations.length - 2} sucursales más</p>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-6">
                   <div className="flex items-center gap-4 text-slate-400">
                      <div className="flex items-center gap-1" title="Actividad">
                         <Activity size={14} />
                         <span className="text-[10px] font-bold">98%</span>
                      </div>
                      <div className="flex items-center gap-1" title="Usuarios">
                         <Users size={14} />
                         <span className="text-[10px] font-bold">12</span>
                      </div>
                   </div>
                   
                   <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider group-hover:gap-3 transition-all">
                     Gestionar
                     <ArrowRight size={14} />
                   </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};