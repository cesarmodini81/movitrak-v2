import React from 'react';
import { CalendarModalItem } from '../pages/Calendar';
import { X, MapPin, Truck, CheckCircle, Plus, Info, Calendar as CalendarIcon, ShieldCheck, Ban } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { LOCATION_MAP } from '../constants';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  items: CalendarModalItem[];
}

export const DayUnitsModal: React.FC<Props> = ({ isOpen, onClose, date, items }) => {
  const { t } = useTranslation();
  const { pdiQueue, addToPdiQueue } = useApp();

  if (!isOpen) return null;

  const handleAddToPDI = (vin: string) => {
    addToPdiQueue(vin);
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-8 right-8 bg-emerald-50 border-2 border-emerald-500 text-emerald-900 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-right duration-300 z-[100]';
    toast.innerHTML = `
      <div class="bg-emerald-500 text-white p-2 rounded-full">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
      </div>
      <div>
        <p class="font-black text-sm uppercase tracking-tight">Unidad Agregada a PDI</p>
        <p class="text-xs font-bold text-emerald-700 font-mono">${vin}</p>
      </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('animate-out', 'fade-out', 'slide-out-to-right');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  const formattedDate = new Date(date + 'T12:00:00Z').toLocaleDateString('es-ES', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-5xl rounded-[2.5rem] shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] flex flex-col max-h-[90vh] overflow-hidden border border-white/20">
        
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-4">
             <div className="p-4 bg-slate-900 text-white rounded-2xl shadow-xl">
                <CalendarIcon size={28} />
             </div>
             <div>
               <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase italic">
                 {formattedDate}
               </h2>
               <p className="text-slate-500 text-sm font-bold tracking-widest mt-1 uppercase">Control de Ingresos y Entregas Diarias</p>
             </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-brand-50 text-brand-700 px-4 py-2 rounded-xl border border-brand-100 font-black text-xs uppercase tracking-widest">
              {items.length} Unidades Programadas
            </div>
            <button 
              onClick={onClose} 
              className="w-12 h-12 flex items-center justify-center bg-white border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-100 rounded-2xl transition-all shadow-sm text-slate-400"
            >
              <X size={24} strokeWidth={3} />
            </button>
          </div>
        </div>

        <div className="p-8 flex-1 overflow-y-auto">
          <div className="bg-white rounded-3xl border-2 border-slate-100 overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em]">
                  <th className="px-8 py-5">Identificación VIN</th>
                  <th className="px-8 py-5">Unidad / Modelo</th>
                  <th className="px-8 py-5">Ubicación Actual</th>
                  <th className="px-8 py-5">Punto de Entrega</th>
                  <th className="px-8 py-5">Horario Est.</th>
                  <th className="px-8 py-5 text-center">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-50">
                {items.length > 0 ? (
                  items.map(({ vehicle: v, time, type }) => (
                    <tr key={v.vin} className="hover:bg-slate-50/80 transition-all group">
                      <td className="px-8 py-6">
                        <span className="font-mono font-black text-slate-900 text-lg tracking-widest block bg-slate-100 px-3 py-1 rounded-lg w-fit group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-slate-200 transition-all">
                          {v.vin}
                        </span>
                        <span className={`mt-2 inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${v.type === 'NEW' ? 'bg-brand-100 text-brand-700' : 'bg-amber-100 text-amber-700'}`}>
                           {v.type === 'NEW' ? '0KM Stock' : 'Usado Selección'}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="font-black text-slate-800 uppercase text-sm leading-tight">{v.brand} {v.model}</div>
                        <div className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-tighter">{v.color} • {v.year}</div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-slate-600 font-bold text-sm uppercase italic">
                           <MapPin size={14} className="text-slate-400" />
                           {LOCATION_MAP[v.locationId] || v.locationId}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-brand-600 font-black text-sm uppercase">
                           <Truck size={14} className="text-brand-400" />
                           {type === 'ENTREGA' ? LOCATION_MAP['loc_1_pred'] : 'Destino Externo'}
                        </div>
                      </td>
                      <td className="px-8 py-6 font-mono font-black text-slate-500 text-xs">
                        {time} HS
                      </td>
                      <td className="px-8 py-6 text-center">
                        {v.type !== 'NEW' ? (
                          <div className="inline-flex items-center gap-2 text-slate-300 font-bold text-[10px] uppercase tracking-widest bg-slate-50 px-3 py-2 rounded-lg cursor-not-allowed">
                             <Ban size={14} />
                             No Aplica
                          </div>
                        ) : pdiQueue.includes(v.vin) ? (
                          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 border border-emerald-200 px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest">
                             <CheckCircle size={16} />
                             Agregado
                          </div>
                        ) : (
                          <button 
                            onClick={() => handleAddToPDI(v.vin)}
                            className="inline-flex items-center gap-2 bg-white border-2 border-emerald-500 text-emerald-700 px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-500 hover:text-white hover:shadow-lg transition-all active:scale-95 group"
                          >
                            <Plus size={16} strokeWidth={3} className="text-emerald-500 group-hover:text-white" />
                            AGR A PDI
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-6 opacity-30">
                        <Info size={80} strokeWidth={1} />
                        <div>
                          <p className="text-2xl font-black uppercase text-slate-900 italic">Sin Actividad Registrada</p>
                          <p className="text-sm font-bold text-slate-500 uppercase tracking-[0.2em] mt-2">No se detectaron movimientos para esta fecha</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-8 border-t border-slate-100 bg-slate-50/30 flex justify-between items-center">
          <div className="flex items-center gap-3 text-slate-400">
             <ShieldCheck size={20} />
             <span className="text-[10px] font-black uppercase tracking-[0.3em]">Auditoría de Procesos MOVITRAK</span>
          </div>
          <button 
            onClick={onClose}
            className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-brand-700 transition-all shadow-xl active:scale-95"
          >
            Cerrar Ventana
          </button>
        </div>
      </div>
    </div>
  );
};