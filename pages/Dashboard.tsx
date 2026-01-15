
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Car, AlertCircle, CheckCircle, Clock, Building, ArrowLeft, X, LockKeyhole } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Role } from '../types';
import { SuperAdminDashboard } from './SuperAdminDashboard';
import { ChatPopup } from '../components/ChatPopup';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { vehicles, user, currentCompany, setCurrentCompany, enterPartsMode } = useApp();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [isPartsAuthOpen, setIsPartsAuthOpen] = useState(false);
  const [partsPin, setPartsPin] = useState('');
  const [pinError, setPinError] = useState(false);

  // --- AUTOMATIC PIN MODAL FOR PARTS ROLE ---
  useEffect(() => {
    if (user?.role === Role.PARTS_OPERATOR) {
        setIsPartsAuthOpen(true);
    }
  }, [user]);

  // --- PARTS AUTH HANDLER ---
  const handlePartsAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (enterPartsMode(partsPin)) {
      setIsPartsAuthOpen(false);
      setPartsPin('');
      setPinError(false);
      navigate('/parts/search');
    } else {
      setPinError(true);
      setPartsPin('');
    }
  };

  // --- SUPER ADMIN LOGIC ---
  if (user?.role === Role.SUPER_ADMIN && !currentCompany) {
    return (
      <>
        <SuperAdminDashboard />
        <ChatPopup />
      </>
    );
  }

  // --- PARTS OPERATOR (Show only modal backdrop if stuck) ---
  if (user?.role === Role.PARTS_OPERATOR) {
      return (
        <div className="fixed inset-0 bg-slate-900 z-50 flex items-center justify-center">
            {isPartsAuthOpen && (
                <div className="bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl relative">
                    <div className="flex flex-col items-center mb-6">
                        <div className="bg-slate-100 p-4 rounded-full mb-4">
                            <LockKeyhole size={32} className="text-slate-900" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 uppercase">Acceso Repuestos</h3>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Ingrese Clave Operativa (6789)</p>
                    </div>

                    <form onSubmit={handlePartsAuth} className="space-y-4">
                        <input 
                        type="password" 
                        value={partsPin}
                        onChange={(e) => { setPartsPin(e.target.value); setPinError(false); }}
                        maxLength={4}
                        className="w-full text-center text-3xl font-mono font-black py-4 border-b-4 border-slate-200 focus:border-emerald-500 outline-none transition-colors"
                        placeholder="****"
                        autoFocus
                        />
                        
                        {pinError && (
                            <div className="bg-red-50 text-red-600 text-xs font-bold p-3 rounded-xl text-center animate-in shake">
                            Clave incorrecta. Intente nuevamente.
                            </div>
                        )}

                        <button type="submit" className="w-full bg-emerald-500 text-white font-black uppercase tracking-widest py-4 rounded-xl shadow-lg hover:bg-emerald-600 transition-all active:scale-95">
                            Ingresar al Módulo
                        </button>
                    </form>
                </div>
            )}
        </div>
      );
  }

  // --- STANDARD DASHBOARD LOGIC (Fleet Operators) ---

  const statusData = [
    { name: 'Available', value: vehicles.filter(v => v.status === 'AVAILABLE').length },
    { name: 'In Transit', value: vehicles.filter(v => v.status === 'IN_TRANSIT').length },
    { name: 'Sold', value: vehicles.filter(v => v.status === 'SOLD').length },
  ];

  const pdiData = [
    { name: 'Pending', value: vehicles.filter(v => v.type === 'NEW' && !v.preDeliveryConfirmed).length },
    { name: 'Confirmed', value: vehicles.filter(v => v.type === 'NEW' && v.preDeliveryConfirmed).length },
  ];

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white p-4 lg:p-6 rounded-xl shadow-md flex items-center justify-between border-l-4" style={{ borderColor: color }}>
      <div>
        <p className="text-slate-500 text-xs lg:text-sm font-semibold uppercase">{title}</p>
        <p className="text-2xl lg:text-3xl font-bold text-slate-800 mt-1">{value}</p>
      </div>
      <div className={`p-2 lg:p-3 rounded-full opacity-20`} style={{ backgroundColor: color, color: color }}>
        <Icon size={28} className="lg:w-8 lg:h-8" style={{ color: color, opacity: 1 }} />
      </div>
    </div>
  );

  return (
    // PADDING TOP AUMENTADO (pt-20 md:pt-24)
    <div className="space-y-6 lg:space-y-8 relative pt-20 md:pt-24">
      
      {/* Super Admin Back Button */}
      {user?.role === Role.SUPER_ADMIN && (
        <div className="bg-slate-900 text-white p-4 rounded-xl flex items-center justify-between shadow-lg mb-8 no-print">
           <div className="flex items-center gap-3">
              <Building size={20} className="text-emerald-400" />
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Visualizando como Admin</p>
                <p className="font-bold text-lg leading-none">{currentCompany?.name}</p>
              </div>
           </div>
           <button 
             onClick={() => setCurrentCompany(null)}
             className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors"
           >
             <ArrowLeft size={14} />
             Volver al Global
           </button>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-xl lg:text-2xl font-bold text-slate-800">{t('dashboard')}</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatCard title={t('total_fleet')} value={vehicles.length} icon={Car} color="#0284c7" />
        <StatCard title={t('pending_pdi')} value={pdiData[0].value} icon={AlertCircle} color="#ef4444" />
        <StatCard title={t('in_transit')} value={statusData[1].value} icon={Clock} color="#f59e0b" />
        <StatCard title={t('available')} value={statusData[0].value} icon={CheckCircle} color="#10b981" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        <div className="bg-white p-4 lg:p-6 rounded-xl shadow-md">
          <h3 className="text-base lg:text-lg font-bold text-slate-800 mb-6">Estado de Flota</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="value" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 lg:p-6 rounded-xl shadow-md">
          <h3 className="text-base lg:text-lg font-bold text-slate-800 mb-6">Progreso PDI (Nuevas)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pdiData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pdiData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#ef4444' : '#10b981'} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
             <div className="flex items-center gap-2 text-sm text-slate-600">
                <div className="w-3 h-3 rounded-full bg-red-500"></div> Pendiente
             </div>
             <div className="flex items-center gap-2 text-sm text-slate-600">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div> Confirmado
             </div>
          </div>
        </div>
      </div>
      
      <ChatPopup />
    </div>
  );
};
