
import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, Search } from 'lucide-react';

export const PartsAudit: React.FC = () => {
  const { auditLogs } = useApp();
  // Filter logs related to parts operations
  const partLogs = auditLogs.filter(l => 
    l.action.includes('PART') || 
    l.details.toLowerCase().includes('repuestos') ||
    l.details.toLowerCase().includes('stock')
  );

  return (
    // Padding aumentado
    <div className="space-y-8 animate-in fade-in duration-500 pt-24 pb-12">
      <div className="flex items-center gap-4">
        <div className="p-4 bg-orange-500 text-white rounded-2xl shadow-lg shadow-orange-200">
           <ShieldAlert size={32} />
        </div>
        <div>
           <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase leading-none">Auditoría de Repuestos</h2>
           <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-2">Movimientos y Control de Stock</p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em]">
                <th className="p-6">Timestamp</th>
                <th className="p-6">Usuario</th>
                <th className="p-6">Tipo Acción</th>
                <th className="p-6">Detalle Operación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {partLogs.length > 0 ? partLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-6 font-mono font-bold text-slate-500 text-xs">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="p-6">
                    <span className="font-black text-slate-800 uppercase text-xs">{log.username}</span>
                  </td>
                  <td className="p-6">
                    <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                      log.action.includes('SALE') ? 'bg-emerald-100 text-emerald-700' :
                      log.action.includes('TRANSFER') ? 'bg-blue-100 text-blue-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {log.action.replace('PART_', '')}
                    </span>
                  </td>
                  <td className="p-6 font-medium text-slate-600 text-xs">
                    {log.details}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="p-20 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-40">
                       <Search size={48} className="text-slate-300" />
                       <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No hay registros de auditoría disponibles</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
