
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Company } from '../types';
import { Building2, ArrowRight, ShieldCheck, Activity, Users, MessageSquare, Plus, X, Globe, Lock } from 'lucide-react';
import { CompanyUsersSection } from '../components/CompanyUsersSection';

export const SuperAdminDashboard: React.FC = () => {
  const { companies, setCurrentCompany, chatMessages, setActiveChatCompanyId, createCompany } = useApp();
  
  // State for modals
  const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [managingUsersCompany, setManagingUsersCompany] = useState<Company | null>(null);

  const handleAccessCompany = (company: Company) => {
    setCurrentCompany(company);
  };

  const handleOpenChat = (e: React.MouseEvent, companyId: string) => {
    e.stopPropagation();
    setActiveChatCompanyId(companyId);
  };

  const handleCreateCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyName.trim()) return;
    createCompany(newCompanyName);
    setNewCompanyName('');
    setIsAddCompanyOpen(false);
  };

  const handleManageUsers = (e: React.MouseEvent, company: Company) => {
    e.stopPropagation();
    setManagingUsersCompany(company);
  };

  return (
    // PADDING TOP AUMENTADO (pt-24) y ajuste de padding horizontal/inferior
    <div className="min-h-screen bg-slate-50 font-sans px-8 pb-8 pt-24 animate-in fade-in duration-500">
      
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
        <div className="flex items-center gap-4">
           <div className="bg-white px-6 py-3 rounded-xl shadow-sm border border-slate-200 flex items-center gap-3">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Sistema Operativo</span>
           </div>
        </div>
      </div>

      {/* Grid Companies */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Add Company Card */}
        <button 
          onClick={() => setIsAddCompanyOpen(true)}
          className="bg-white/50 border-2 border-dashed border-slate-300 rounded-3xl p-8 flex flex-col items-center justify-center gap-4 hover:bg-white hover:border-brand-500 hover:shadow-xl transition-all group min-h-[300px]"
        >
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-brand-500 group-hover:text-white transition-colors shadow-inner">
             <Plus size={40} />
          </div>
          <p className="font-black text-slate-400 uppercase tracking-widest group-hover:text-brand-600">Agregar Nueva Empresa</p>
        </button>

        {companies.map(company => {
          // Calculate notifications for this company
          const unreadCount = chatMessages.filter(
            m => m.companyId === company.id && !m.isRead && m.senderId !== 'u1'
          ).length;

          return (
            <div 
              key={company.id}
              onClick={() => handleAccessCompany(company)}
              className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 cursor-pointer group relative overflow-hidden flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
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
              </div>

              <div className="relative z-10 flex items-center justify-between border-t border-slate-100 pt-6">
                 <button 
                   onClick={(e) => handleManageUsers(e, company)}
                   className="flex items-center gap-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 px-3 py-2 rounded-lg transition-all"
                   title="Administrar Usuarios"
                 >
                    <Users size={16} />
                    <span className="text-[10px] font-bold uppercase">Usuarios</span>
                 </button>
                 
                 <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider group-hover:gap-3 transition-all">
                   Ingresar
                   <ArrowRight size={14} />
                 </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Company Modal */}
      {isAddCompanyOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
           <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 border border-slate-200 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-brand-600"></div>
              <button onClick={() => setIsAddCompanyOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"><X size={20} /></button>
              
              <div className="mb-6">
                 <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 mb-4">
                    <Globe size={24} />
                 </div>
                 <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Alta de Empresa</h2>
                 <p className="text-sm text-slate-500 font-medium mt-1">Se generará el entorno y usuarios iniciales.</p>
              </div>

              <form onSubmit={handleCreateCompany} className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-slate-400 ml-1">Nombre Comercial</label>
                    <input 
                      type="text" 
                      value={newCompanyName}
                      onChange={(e) => setNewCompanyName(e.target.value)}
                      placeholder="Ej: Motors Group S.A."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-50 transition-all"
                      autoFocus
                    />
                 </div>
                 
                 <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
                    <Lock size={16} className="text-blue-500 shrink-0 mt-0.5" />
                    <div>
                       <p className="text-[10px] font-black uppercase text-blue-700 mb-1">Configuración Automática</p>
                       <p className="text-xs text-blue-600/80 leading-relaxed">
                          Se crearán 4 usuarios (Admin, Operador, Programador, Usados) con la contraseña por defecto <span className="font-mono font-bold bg-blue-100 px-1 rounded">1234</span>.
                       </p>
                    </div>
                 </div>

                 <button 
                   type="submit" 
                   disabled={!newCompanyName.trim()}
                   className="w-full bg-slate-900 text-white py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                    Crear Empresa
                 </button>
              </form>
           </div>
        </div>
      )}

      {/* Manage Users Modal */}
      {managingUsersCompany && (
        <CompanyUsersSection 
          company={managingUsersCompany} 
          onClose={() => setManagingUsersCompany(null)} 
        />
      )}

    </div>
  );
};
