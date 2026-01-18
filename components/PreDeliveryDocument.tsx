
import React from 'react';
import { Vehicle, Company, CalendarEvent } from '../types';
import { ShieldCheck, CheckSquare, Square, FileText } from 'lucide-react';
import { LOCATION_MAP } from '../constants';

interface Props {
  vehicles: Vehicle[];
  company: Company;
  calendarEvents: CalendarEvent[];
  companies: Company[];
}

export const PreDeliveryDocument: React.FC<Props> = ({ vehicles, company, calendarEvents, companies }) => {
  
  const getLocationName = (id: string) => {
    if (LOCATION_MAP[id]) return LOCATION_MAP[id];
    for (const c of companies) {
      const loc = c.locations.find(l => l.id === id);
      if (loc) return loc.name;
    }
    return id;
  };

  const getDeliveryInfo = (vin: string) => {
    const event = calendarEvents.find(e => e.vehicleVin === vin && e.status === 'PROGRAMADO');
    if (event) {
      return {
        date: new Date(event.date + 'T12:00:00').toLocaleDateString('es-AR', {day: '2-digit', month: '2-digit'}),
        destination: getLocationName(event.destinationId)
      };
    }
    return { date: '-', destination: '-' };
  };

  return (
    <div className="w-full bg-white font-sans text-slate-900">
      <style>{`
        @media print {
          @page { size: A4 portrait; margin: 0; }
          body { margin: 0; padding: 0; background: white !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          .page-container { width: 210mm; height: 297mm; padding: 10mm 12mm; margin: 0 auto; display: flex; flex-direction: column; position: relative; }
          .footer-mt-auto { margin-top: auto; }
        }
      `}</style>

      <div className="page-container bg-white relative">
        {/* WATERMARK */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] z-0">
           <h1 className="text-[120px] font-black uppercase -rotate-45 tracking-widest text-slate-900 select-none">PDI CHECK</h1>
        </div>

        <div className="relative z-10 flex flex-col h-full">
          
          {/* HEADER */}
          <header className="flex justify-between items-start border-b-[3px] border-slate-900 pb-5 mb-6">
            <div className="w-[50%]">
              <h1 className="text-2xl font-black tracking-tighter text-slate-900 uppercase leading-none">{company.name}</h1>
              <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">Departamento de Servicios & Calidad</p>
            </div>
            <div className="w-[50%] text-right">
               <div className="flex items-center justify-end gap-3 mb-1">
                  <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">PLANILLA TÉCNICA PDI</h2>
                  <div className="p-1.5 bg-slate-900 text-white rounded">
                     <ShieldCheck size={16} />
                  </div>
               </div>
               <p className="text-[8px] font-bold text-slate-400 uppercase">Protocolo de Pre-Entrega 0KM • Control Diario</p>
               <p className="text-[9px] font-bold text-slate-900 uppercase mt-2">
                  Emisión: <span className="font-mono">{new Date().toLocaleDateString('es-AR')}</span>
               </p>
            </div>
          </header>

          {/* TABLE */}
          <div className="flex-1">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b-2 border-slate-900">
                  <th className="py-2 px-2 text-[9px] font-black text-slate-900 uppercase tracking-wider w-[5%] text-center">#</th>
                  <th className="py-2 px-2 text-[9px] font-black text-slate-900 uppercase tracking-wider w-[10%] text-center">Fecha</th>
                  <th className="py-2 px-2 text-[9px] font-black text-slate-900 uppercase tracking-wider w-[20%]">VIN / Chasis</th>
                  <th className="py-2 px-2 text-[9px] font-black text-slate-900 uppercase tracking-wider w-[25%]">Unidad</th>
                  <th className="py-2 px-2 text-[9px] font-black text-slate-900 uppercase tracking-wider w-[30%]">Observaciones PDI</th>
                  <th className="py-2 px-2 text-[9px] font-black text-slate-900 uppercase tracking-wider w-[10%] text-center">OK</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {vehicles.length > 0 ? vehicles.map((v, idx) => {
                  const delivery = getDeliveryInfo(v.vin);
                  return (
                    <tr key={v.vin}>
                      <td className="py-2 px-2 text-center text-[10px] font-bold text-slate-400">{idx + 1}</td>
                      <td className="py-2 px-2 text-center">
                         <span className="font-mono text-[10px] font-bold text-slate-700 bg-slate-50 px-1 rounded">{delivery.date}</span>
                      </td>
                      <td className="py-2 px-2">
                         <span className="font-mono text-[11px] font-black text-slate-900 tracking-wider">{v.vin}</span>
                      </td>
                      <td className="py-2 px-2">
                        <div className="text-[10px] font-black text-slate-800 uppercase leading-tight">{v.brand} {v.model}</div>
                        <div className="text-[8px] font-bold text-slate-500 uppercase mt-0.5">{v.color}</div>
                      </td>
                      <td className="py-2 px-2">
                         <span className="text-[9px] font-medium text-slate-600 italic uppercase leading-tight block">
                           {v.pdiComment || 'SIN NOVEDADES TÉCNICAS'}
                         </span>
                         {delivery.destination !== '-' && (
                            <span className="text-[7px] font-bold text-blue-600 uppercase mt-0.5 block">Destino: {delivery.destination}</span>
                         )}
                      </td>
                      <td className="py-2 px-2 text-center">
                         {v.preDeliveryConfirmed ? (
                           <CheckSquare size={14} className="mx-auto text-slate-900" />
                         ) : (
                           <Square size={14} className="mx-auto text-slate-300" />
                         )}
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={6} className="p-12 text-center border-b border-slate-100">
                       <p className="text-xs font-bold text-slate-400 uppercase italic">No hay unidades en lista de PDI</p>
                    </td>
                  </tr>
                )}
                
                {/* Visual filler */}
                {vehicles.length > 0 && vehicles.length < 15 && Array.from({ length: 15 - vehicles.length }).map((_, i) => (
                  <tr key={`fill-${i}`} className="h-8">
                    <td colSpan={6} className="border-b border-dashed border-slate-50"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* FOOTER */}
          <div className="footer-mt-auto">
             <div className="grid grid-cols-4 gap-6 mb-4">
                <div className="text-center pt-2 border-t border-slate-300">
                   <p className="text-[8px] font-black text-slate-900 uppercase">Mecánica Ligera</p>
                </div>
                <div className="text-center pt-2 border-t border-slate-300">
                   <p className="text-[8px] font-black text-slate-900 uppercase">Lavado / Estética</p>
                </div>
                <div className="text-center pt-2 border-t border-slate-300">
                   <p className="text-[8px] font-black text-slate-900 uppercase">Control Final</p>
                </div>
                <div className="text-center pt-2 border-t border-slate-300">
                   <p className="text-[8px] font-black text-slate-900 uppercase">Gerencia Servicio</p>
                </div>
             </div>

             <div className="flex items-center justify-between border-t-2 border-slate-900 pt-3">
                <div className="flex items-center gap-2">
                   <FileText size={12} className="text-slate-400" />
                   <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">
                      Este documento certifica la aptitud técnica para entrega.
                   </p>
                </div>
                <p className="text-[9px] font-black text-slate-900 uppercase tracking-widest">MOVITRAK SERVICE</p>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};
