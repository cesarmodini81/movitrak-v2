
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import { Check, AlertTriangle, FileText } from 'lucide-react';

export const PDI: React.FC = () => {
  const { vehicles, confirmPDI } = useApp();
  const { t } = useTranslation();
  
  // Only show NEW vehicles that haven't been confirmed
  const pendingVehicles = vehicles.filter(v => v.type === 'NEW' && !v.preDeliveryConfirmed);

  const [comments, setComments] = useState<Record<string, string>>({});

  const handleConfirm = (vin: string) => {
    confirmPDI(vin, comments[vin] || '');
    // Toast
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-emerald-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right duration-300 z-50';
    toast.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> <span class="font-bold">${t('pdi_confirmed')}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  return (
    // PADDING TOP AUMENTADO (pt-20 md:pt-24)
    <div className="space-y-6 pt-20 md:pt-24">
      <div className="flex items-center justify-between">
         <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
           <FileText className="text-brand-600" /> 
           {t('pdi_sheet')}
         </h2>
         <span className="bg-brand-100 text-brand-800 px-4 py-2 rounded-full font-bold text-sm">
           {pendingVehicles.length} Pendientes
         </span>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-bold border-b border-slate-200">
            <tr>
              <th className="p-4">VIN</th>
              <th className="p-4">Modelo</th>
              <th className="p-4">Color</th>
              <th className="p-4">Ubicación</th>
              <th className="p-4 w-1/3">Comentarios</th>
              <th className="p-4 text-center">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {pendingVehicles.length > 0 ? (
              pendingVehicles.map(v => (
                <tr key={v.vin} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-mono font-medium text-brand-600">{v.vin}</td>
                  <td className="p-4 text-slate-700">{v.model}</td>
                  <td className="p-4 text-slate-600">{v.color}</td>
                  <td className="p-4 text-slate-600">{v.locationId}</td>
                  <td className="p-4">
                    <input 
                      type="text" 
                      placeholder="Sin novedades..."
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-50 outline-none"
                      onChange={(e) => setComments({...comments, [v.vin]: e.target.value})}
                    />
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => handleConfirm(v.vin)}
                      className="bg-white border border-slate-200 text-slate-400 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 px-4 py-2 rounded-lg transition-all flex items-center gap-2 mx-auto font-medium shadow-sm hover:shadow-emerald-200"
                    >
                      <Check size={16} />
                      OK
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-12 text-center">
                  <div className="flex flex-col items-center gap-3 text-slate-400">
                    <Check className="w-12 h-12 text-emerald-200" />
                    <p className="text-lg">¡Todo al día! No hay unidades pendientes de PDI.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
