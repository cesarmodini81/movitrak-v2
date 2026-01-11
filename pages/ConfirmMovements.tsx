import React from 'react';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import { LOCATION_MAP } from '../constants';
import { ClipboardList, ArrowRight, Truck, CheckCircle } from 'lucide-react';

export const ConfirmMovements: React.FC = () => {
  const { movements, completeMovement, currentCompany } = useApp();
  const { t } = useTranslation();

  const pendingMovements = movements.filter(m => 
    m.status === 'PENDING' && 
    (currentCompany ? currentCompany.locations.some(l => l.id === m.destinationId) : true)
  );

  const handleConfirm = (id: string) => {
    completeMovement(id);
    const toast = document.createElement('div');
    toast.className = 'fixed top-8 right-8 bg-emerald-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right duration-300 z-50';
    toast.innerHTML = `<span class="font-bold">Recepción Confirmada - Stock Liberado</span>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
        <ClipboardList className="text-brand-600" />
        {t('confirm_movement')}
      </h2>

      <div className="grid grid-cols-1 gap-6">
        {pendingMovements.length > 0 ? (
          pendingMovements.map(mov => (
            <div key={mov.id} className="bg-white rounded-xl shadow-md border border-slate-100 p-6 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-500 font-mono">
                   <span className="bg-slate-100 px-2 py-1 rounded">{mov.id}</span>
                   <span>{new Date(mov.date).toLocaleString()}</span>
                </div>
                
                <div className="flex items-center gap-4 text-lg font-bold text-slate-800">
                  <span className="text-slate-600">{LOCATION_MAP[mov.originId] || mov.originId}</span>
                  <ArrowRight className="text-brand-400" />
                  <span className="text-brand-700">{LOCATION_MAP[mov.destinationId] || mov.destinationId}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-600">
                  <Truck size={16} />
                  <span className="uppercase text-sm font-semibold">{mov.transporter}</span>
                  {mov.driverName && <span className="text-xs">({mov.driverName})</span>}
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                 <div className="bg-brand-50 border border-brand-100 rounded-lg p-3 text-right">
                    <p className="text-xs text-brand-600 uppercase font-bold">Unidades en Tránsito</p>
                    <p className="text-2xl font-bold text-brand-800">{mov.vehicleVins.length}</p>
                 </div>
                 <div className="text-xs text-slate-400 font-mono max-w-[200px] text-right truncate">
                    {mov.vehicleVins.join(', ')}
                 </div>
              </div>

              <button 
                onClick={() => handleConfirm(mov.id)}
                className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-emerald-700 hover:scale-105 transition-all flex items-center gap-2"
              >
                <CheckCircle size={20} />
                Confirmar Arribo (Desbloquear)
              </button>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border-2 border-dashed border-slate-200">
             <div className="inline-flex bg-slate-50 p-4 rounded-full mb-4">
                <Truck className="text-slate-300 w-12 h-12" />
             </div>
             <p className="text-xl font-medium text-slate-500">No hay movimientos pendientes de recepción.</p>
             <p className="text-sm text-slate-400 mt-2">Los envíos en curso aparecerán aquí cuando se emita el remito.</p>
          </div>
        )}
      </div>
    </div>
  );
};