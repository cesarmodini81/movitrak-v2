
import React from 'react';
import { Vehicle, Company, CalendarEvent } from '../types';
import { ShieldCheck, CheckSquare, Square } from 'lucide-react';
import { LOCATION_MAP } from '../constants';

interface Props {
  vehicles: Vehicle[];
  company: Company;
  calendarEvents: CalendarEvent[];
  companies: Company[];
}

export const PreDeliveryDocument: React.FC<Props> = ({ vehicles, company, calendarEvents, companies }) => {
  
  // Helper functions (Synchronous)
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
    <div className="w-full h-full bg-slate-100 flex justify-center print:bg-white print:m-0 print:p-0">
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page {
            size: A4 landscape;
            margin: 0; /* Managed by container padding */
          }
          html, body {
            width: 100%;
            height: 100%;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          /* Hide everything outside the print root */
          body > *:not(#root) { display: none !important; }
          
          #print-content-root {
            width: 297mm !important;
            height: 210mm !important; /* Force A4 Landscape height */
            padding: 10mm 15mm !important;
            margin: 0 auto !important;
            box-shadow: none !important;
            border: none !important;
            overflow: hidden !important;
            page-break-after: always;
            position: absolute;
            top: 0;
            left: 0;
          }
          
          /* Ensure table rows don't break awkwardly if list is long */
          tr { page-break-inside: avoid; }
        }
      `}} />

      {/* Paper Representation (Screen & Print) */}
      <div 
        id="print-content-root" 
        className="bg-white w-[297mm] min-h-[210mm] p-[10mm] shadow-xl print:shadow-none relative flex flex-col font-sans text-slate-900 mx-auto my-8 print:my-0"
      >
        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden opacity-[0.04]">
           <div className="transform -rotate-12 text-[150px] font-black uppercase tracking-widest whitespace-nowrap text-slate-900 select-none">
             MOVITRAK PDI
           </div>
        </div>

        <div className="relative z-10 flex flex-col h-full border-[2px] border-slate-900 p-4">
          
          {/* Header */}
          <div className="flex justify-between items-center border-b-[2px] border-slate-900 pb-3 mb-3 shrink-0">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-slate-900 text-white rounded print:text-black print:border-[2px] print:border-black print:bg-transparent">
                  <ShieldCheck size={24} strokeWidth={2.5} />
               </div>
               <div>
                 <h1 className="text-xl font-black uppercase tracking-tight leading-none text-slate-900">
                   Planilla Técnica PDI
                 </h1>
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-0.5 print:text-slate-700">Protocolo de Pre-Entrega 0KM</p>
               </div>
            </div>
            <div className="text-right">
               <p className="text-lg font-black uppercase text-slate-900 leading-none">{company.name}</p>
               <div className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mt-1 flex items-center justify-end gap-2 print:text-slate-700">
                  <span>Emisión:</span>
                  <span className="font-mono text-slate-900">{new Date().toLocaleDateString()}</span>
               </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="flex-1">
            <table className="w-full border-collapse border-[1px] border-slate-900 text-[9pt] table-fixed">
              <thead className="bg-slate-900 text-white uppercase text-[8pt] font-black tracking-[0.1em] text-left print:bg-slate-200 print:text-black print:border-b-2 print:border-black">
                <tr>
                  <th className="p-1.5 border-r border-white/20 w-[5%] text-center print:border-black">#</th>
                  <th className="p-1.5 border-r border-white/20 w-[8%] text-center print:border-black">Fecha</th>
                  <th className="p-1.5 border-r border-white/20 w-[15%] text-center print:border-black">VIN / Chasis</th>
                  <th className="p-1.5 border-r border-white/20 w-[20%] print:border-black">Unidad / Modelo</th>
                  <th className="p-1.5 border-r border-white/20 w-[12%] print:border-black">Ubicación</th>
                  <th className="p-1.5 border-r border-white/20 w-[12%] print:border-black">Destino</th>
                  <th className="p-1.5 border-r border-white/20 w-[22%] print:border-black">Observaciones Técnicas</th>
                  <th className="p-1.5 w-[6%] text-center">V° B°</th>
                </tr>
              </thead>
              <tbody className="divide-y-[1px] divide-slate-300">
                {vehicles.length > 0 ? vehicles.map((v, idx) => {
                  const delivery = getDeliveryInfo(v.vin);
                  return (
                    <tr key={v.vin} className="break-inside-avoid">
                      <td className="p-1.5 border-x-[1px] border-slate-900 text-center font-bold text-slate-500">{idx + 1}</td>
                      <td className="p-1.5 border-r border-slate-300 font-mono font-bold text-center align-top">{delivery.date}</td>
                      <td className="p-1.5 border-r border-slate-300 font-mono font-black tracking-widest text-center align-top bg-slate-50 print:bg-transparent">
                        {v.vin}
                      </td>
                      <td className="p-1.5 border-r border-slate-300 align-top">
                        <div className="font-black uppercase text-[10px] leading-tight text-slate-900">{v.brand} {v.model}</div>
                        <div className="text-[8px] font-bold text-slate-500 uppercase">{v.color}</div>
                      </td>
                      <td className="p-1.5 border-r border-slate-300 align-top">
                        <div className="font-bold text-[8px] uppercase tracking-tight truncate text-slate-700">
                           {getLocationName(v.locationId)}
                        </div>
                      </td>
                      <td className="p-1.5 border-r border-slate-300 align-top">
                        <div className="font-bold text-[8px] uppercase tracking-tight truncate text-slate-900">
                           {delivery.destination}
                        </div>
                      </td>
                      <td className="p-1.5 border-r border-slate-300 relative min-h-[30px] align-top">
                         <span className="text-[9px] font-medium text-slate-800 italic leading-tight block uppercase">
                           {v.pdiComment || '---'}
                         </span>
                      </td>
                      <td className="p-1.5 border-x-[1px] border-slate-900 text-center align-middle">
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
                    <td colSpan={8} className="p-12 text-center border-x-[1px] border-b-[1px] border-slate-900">
                       <p className="italic font-bold text-slate-400 text-sm uppercase">Sin unidades en lista</p>
                    </td>
                  </tr>
                )}
                
                {/* Empty rows to fill page if needed (Visual stability) */}
                {vehicles.length > 0 && vehicles.length < 12 && Array.from({ length: 12 - vehicles.length }).map((_, i) => (
                  <tr key={`fill-${i}`} className="h-6">
                    <td className="border-x-[1px] border-slate-900"></td>
                    <td className="border-r border-slate-300"></td>
                    <td className="border-r border-slate-300"></td>
                    <td className="border-r border-slate-300"></td>
                    <td className="border-r border-slate-300"></td>
                    <td className="border-r border-slate-300"></td>
                    <td className="border-r border-slate-300"></td>
                    <td className="border-x-[1px] border-slate-900"></td>
                  </tr>
                ))}
                
                <tr className="h-1 border-t-[1px] border-slate-900"><td colSpan={8}></td></tr>
              </tbody>
            </table>
          </div>

          {/* Footer Signatures */}
          <div className="mt-auto pt-4 grid grid-cols-4 gap-6">
             <div className="text-center">
                <div className="h-12 border-b-[1px] border-slate-900 mb-1"></div>
                <p className="text-[7px] font-black uppercase tracking-widest text-slate-900">Mecánica Ligera</p>
             </div>
             <div className="text-center">
                <div className="h-12 border-b-[1px] border-slate-900 mb-1"></div>
                <p className="text-[7px] font-black uppercase tracking-widest text-slate-900">Lavado / Estética</p>
             </div>
             <div className="text-center">
                <div className="h-12 border-b-[1px] border-slate-900 mb-1"></div>
                <p className="text-[7px] font-black uppercase tracking-widest text-slate-900">Control Final</p>
             </div>
             <div className="text-center">
                <div className="h-12 border-b-[1px] border-slate-900 mb-1"></div>
                <p className="text-[7px] font-black uppercase tracking-widest text-slate-900">Gerencia Servicios</p>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};
