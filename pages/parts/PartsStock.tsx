
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Package, ArrowRightLeft, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PartsStock: React.FC = () => {
  const { parts, currentCompany } = useApp();
  const companyParts = parts.filter(p => p.companyId === currentCompany?.id);
  const locations = currentCompany?.locations || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-200">
            <Package size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase leading-none">Stock Multisede</h2>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-2">Inventario en tiempo real</p>
          </div>
        </div>
        
        <Link 
          to="/parts/transfer"
          className="bg-slate-900 text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-slate-800 transition-all flex items-center gap-3 active:scale-95"
        >
           <ArrowRightLeft size={18} />
           Nueva Transferencia
        </Link>
      </div>

      <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
               <tr className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em]">
                  <th className="p-6 w-32">Código</th>
                  <th className="p-6 w-64">Descripción</th>
                  {locations.map(loc => (
                     <th key={loc.id} className="p-6 text-center min-w-[120px]">{loc.name.replace('Predio', '').replace('Nation', '').replace('Escobar', '')}</th>
                  ))}
                  <th className="p-6 text-center bg-slate-800">Total</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {companyParts.map(part => {
                  // Explicitly cast Object.values to number[] to fix reduce type error
                  const total = (Object.values(part.stock) as number[]).reduce((a: number, b: number) => a + b, 0);
                  return (
                    <tr key={part.id} className="hover:bg-slate-50 transition-colors">
                       <td className="p-6 font-mono font-black text-xs text-slate-500">{part.code}</td>
                       <td className="p-6">
                          <p className="font-bold text-slate-900 text-sm uppercase">{part.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">{part.brand} - {part.locationInCar}</p>
                       </td>
                       {locations.map(loc => {
                          const qty = part.stock[loc.id] || 0;
                          return (
                             <td key={loc.id} className="p-6 text-center">
                                <span className={`font-mono font-bold text-sm ${qty === 0 ? 'text-slate-200' : 'text-slate-700'}`}>
                                   {qty}
                                </span>
                             </td>
                          );
                       })}
                       <td className="p-6 text-center bg-slate-50 font-black text-slate-900 border-l border-slate-200">
                          {total}
                       </td>
                    </tr>
                  );
               })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
