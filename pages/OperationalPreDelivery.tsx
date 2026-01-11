import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import { LOCATION_MAP } from '../constants';
import { Check, ClipboardCheck, Printer, AlertCircle, Info, Trash2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { PreDeliveryDocument } from '../components/PreDeliveryDocument';
import { PrintPreviewModal } from '../components/PrintPreviewModal';

export const OperationalPreDelivery: React.FC = () => {
  const { vehicles, confirmPDI, currentCompany, pdiQueue, clearPdiQueue } = useApp();
  const { t } = useTranslation();
  
  const queuedVehicles = vehicles.filter(v => pdiQueue.includes(v.vin) && v.type === 'NEW');
  const [localComments, setLocalComments] = useState<Record<string, string>>({});
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleConfirm = (vin: string) => {
    const comment = localComments[vin] || 'Sin novedades técnicas';
    confirmPDI(vin, comment);
    
    const toast = document.createElement('div');
    toast.className = 'fixed top-8 right-8 bg-slate-900 text-white px-8 py-5 rounded-[2rem] shadow-2xl flex items-center gap-4 animate-in slide-in-from-right duration-500 z-[100] border border-white/20';
    toast.innerHTML = `
      <div class="bg-emerald-500 text-white p-2 rounded-full ring-4 ring-emerald-500/20">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
      </div>
      <div>
        <p class="font-black text-sm uppercase tracking-tight">Certificación PDI Exitosa</p>
        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Unidad ${vin} enviada a Planilla de Viajes</p>
      </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('animate-out', 'fade-out', 'slide-out-to-right');
      setTimeout(() => toast.remove(), 500);
    }, 3500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 min-h-screen pb-20">
      
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 no-print">
         <div className="flex items-center gap-4">
           <div className="p-2 bg-slate-900 text-white rounded-lg">
             <ShieldCheck size={20} strokeWidth={2.5} />
           </div>
           <h2 className="text-sm font-black text-slate-900 tracking-tight uppercase">Planilla Técnica PDI · Protocolo de Pre-Entrega</h2>
         </div>
         
         <div className="flex items-center gap-3">
           {queuedVehicles.length > 0 && (
             <button 
               onClick={clearPdiQueue}
               className="flex items-center gap-2 text-slate-400 hover:text-red-600 font-bold text-[10px] uppercase tracking-widest px-4 py-2 hover:bg-red-50 rounded-lg transition-all"
             >
               <Trash2 size={14} />
               Limpiar
             </button>
           )}
           <div className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-black text-[10px] uppercase tracking-widest border border-slate-200 flex items-center gap-2">
             <AlertCircle size={14} className="text-slate-400" />
             {queuedVehicles.length} Unidades
           </div>
           <button 
             onClick={() => setIsPreviewOpen(true)}
             disabled={queuedVehicles.length === 0}
             className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-xl hover:bg-slate-800 transition-all shadow-md disabled:opacity-30 disabled:cursor-not-allowed font-black text-[10px] uppercase tracking-widest active:scale-95"
           >
             <Printer size={16} />
             Imprimir
           </button>
         </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden no-print">
        <div className="overflow-x-auto max-h-[70vh]">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-20">
              <tr className="bg-slate-900 text-white uppercase text-[10px] font-black tracking-[0.2em]">
                <th className="p-6">Identificación Chasis / VIN</th>
                <th className="p-6">Unidad / Modelo</th>
                <th className="p-6">Ingreso</th>
                <th className="p-6">Ubicación</th>
                <th className="p-6 w-1/3">Observaciones Técnicas</th>
                <th className="p-6 text-center">Certificación</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-50">
              {queuedVehicles.length > 0 ? (
                queuedVehicles.map(v => (
                  <tr key={v.vin} className={`group transition-all ${v.preDeliveryConfirmed ? 'bg-emerald-50/20' : 'hover:bg-slate-50/50'}`}>
                    <td className="p-6">
                      <div className="flex flex-col gap-2">
                        <span className="font-mono font-black text-brand-700 bg-brand-50 border-2 border-brand-100 px-3 py-1.5 rounded-lg text-lg tracking-[0.1em] w-fit shadow-sm">
                          {v.vin}
                        </span>
                        {v.preDeliveryConfirmed && (
                          <span className="flex items-center gap-1.5 text-emerald-600 font-black text-[9px] uppercase tracking-widest px-1">
                            <CheckCircle2 size={12} /> Certificado PDI OK
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="font-black text-slate-900 uppercase text-sm leading-none tracking-tight">{v.brand} {v.model}</div>
                      <div className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">{v.color} — {v.year}</div>
                    </td>
                    <td className="p-6">
                      <div className="text-slate-600 font-black text-xs font-mono bg-slate-100/50 px-3 py-1 rounded-lg w-fit">
                        {new Date(v.entryDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="text-slate-500 font-bold text-xs uppercase tracking-tight flex items-center gap-2">
                        {LOCATION_MAP[v.locationId] || v.locationId}
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="relative group/input">
                         <input 
                          type="text" 
                          placeholder="Reportar novedades del taller..."
                          defaultValue={v.pdiComment}
                          disabled={v.preDeliveryConfirmed}
                          className="w-full border-2 border-slate-100 bg-slate-50 rounded-xl px-4 py-3 text-sm focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-50 outline-none transition-all font-bold text-slate-700 placeholder:font-medium placeholder:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          onChange={(e) => setLocalComments({...localComments, [v.vin]: e.target.value})}
                        />
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      {v.preDeliveryConfirmed ? (
                        <div className="inline-flex items-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-emerald-100/50 cursor-default">
                          <Check size={16} strokeWidth={3} />
                          Validado
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleConfirm(v.vin)}
                          className="bg-white border-4 border-slate-100 text-slate-400 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 px-6 py-3 rounded-xl transition-all flex items-center gap-2 mx-auto font-black text-[10px] uppercase tracking-[0.2em] shadow-sm active:scale-95 group/btn"
                        >
                          <Check size={16} strokeWidth={3} className="group-hover/btn:scale-125 transition-transform" />
                          Validar OK
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-32 text-center">
                    <div className="flex flex-col items-center gap-8 animate-pulse">
                      <div className="p-12 bg-slate-50 rounded-full border-4 border-dashed border-slate-200">
                         <Info size={100} strokeWidth={1} className="text-slate-200" />
                      </div>
                      <div className="max-w-md">
                         <p className="text-3xl font-black uppercase text-slate-900 italic tracking-tighter leading-none mb-4">Planilla Vacía</p>
                         <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] leading-relaxed">
                           Seleccione unidades 0km desde el <span className="text-brand-600 underline underline-offset-4">Calendario Logístico</span> para habilitar el protocolo de inspección técnica.
                         </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <PrintPreviewModal 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
        title="Protocolo Oficial PDI"
      >
        {currentCompany && (
          <PreDeliveryDocument vehicles={queuedVehicles} company={currentCompany} />
        )}
      </PrintPreviewModal>
    </div>
  );
};