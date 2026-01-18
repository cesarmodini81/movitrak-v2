
import React from 'react';
import { Vehicle, Company } from '../types';
import { Truck, MapPin } from 'lucide-react';

interface TravelSheetItem extends Vehicle {
  deliveryDate: string;
  deliveryLocationName: string;
}

interface Props {
  items: TravelSheetItem[];
  company: Company;
}

export const PlanillaViajesDocument: React.FC<Props> = ({ items, company }) => {
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
           <h1 className="text-[120px] font-black uppercase -rotate-45 tracking-widest text-slate-900 select-none">LOGÍSTICA</h1>
        </div>

        <div className="relative z-10 flex flex-col h-full">
          
          {/* HEADER */}
          <header className="flex justify-between items-start border-b-[3px] border-slate-900 pb-5 mb-6">
            <div className="w-[50%]">
              <h1 className="text-2xl font-black tracking-tighter text-slate-900 uppercase leading-none">{company.name}</h1>
              <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">Gerencia de Logística y Distribución</p>
            </div>
            <div className="w-[50%] text-right">
               <div className="flex items-center justify-end gap-3 mb-1">
                  <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">PLANILLA DE VIAJES</h2>
                  <div className="p-1.5 bg-slate-900 text-white rounded">
                     <Truck size={16} />
                  </div>
               </div>
               <p className="text-[8px] font-bold text-slate-400 uppercase">Orden de Carga y Despacho</p>
               <p className="text-[9px] font-bold text-slate-900 uppercase mt-2">
                  Fecha Emisión: <span className="font-mono">{new Date().toLocaleDateString('es-AR')}</span>
               </p>
            </div>
          </header>

          {/* TABLE */}
          <div className="flex-1">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b-2 border-slate-900">
                  <th className="py-2 px-2 text-[9px] font-black text-slate-900 uppercase tracking-wider w-[5%] text-center">#</th>
                  <th className="py-2 px-2 text-[9px] font-black text-slate-900 uppercase tracking-wider w-[20%]">VIN / Chasis</th>
                  <th className="py-2 px-2 text-[9px] font-black text-slate-900 uppercase tracking-wider w-[25%]">Unidad</th>
                  <th className="py-2 px-2 text-[9px] font-black text-slate-900 uppercase tracking-wider w-[25%] text-center">Destino</th>
                  <th className="py-2 px-2 text-[9px] font-black text-slate-900 uppercase tracking-wider w-[15%] text-center">Fecha Entrega</th>
                  <th className="py-2 px-2 text-[9px] font-black text-slate-900 uppercase tracking-wider w-[10%] text-center">Check</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.length > 0 ? items.map((v, idx) => (
                  <tr key={v.vin}>
                    <td className="py-2 px-2 text-center text-[10px] font-bold text-slate-400">{idx + 1}</td>
                    <td className="py-2 px-2">
                       <span className="font-mono text-[11px] font-black text-slate-900 tracking-wider bg-slate-50 px-1.5 py-0.5 rounded">{v.vin}</span>
                    </td>
                    <td className="py-2 px-2">
                      <div className="text-[10px] font-black text-slate-800 uppercase leading-tight">{v.brand} {v.model}</div>
                      <div className="text-[8px] font-bold text-slate-500 uppercase mt-0.5">{v.color} • {v.year}</div>
                    </td>
                    <td className="py-2 px-2 text-center">
                       <div className="inline-flex items-center gap-1.5 text-[9px] font-bold text-slate-700 uppercase bg-slate-50 px-2 py-1 rounded-lg">
                          <MapPin size={10} /> {v.deliveryLocationName}
                       </div>
                    </td>
                    <td className="py-2 px-2 text-center">
                       <span className="font-mono text-[10px] font-bold text-slate-900">{new Date(v.deliveryDate).toLocaleDateString('es-AR')}</span>
                    </td>
                    <td className="py-2 px-2 text-center align-middle">
                       <div className="w-4 h-4 border-2 border-slate-300 rounded mx-auto"></div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="p-12 text-center border-b border-slate-100">
                       <p className="text-xs font-bold text-slate-400 uppercase italic">Sin asignaciones de viaje activas</p>
                    </td>
                  </tr>
                )}
                
                {/* Visual filler */}
                {items.length > 0 && items.length < 15 && Array.from({ length: 15 - items.length }).map((_, i) => (
                  <tr key={`fill-${i}`} className="h-8">
                    <td colSpan={6} className="border-b border-dashed border-slate-50"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* FOOTER */}
          <div className="footer-mt-auto">
             <div className="grid grid-cols-2 gap-12 mb-6">
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg min-h-[60px]">
                   <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Notas de Carga</p>
                </div>
                <div className="flex items-end justify-between">
                   <div className="text-center w-full">
                      <div className="border-b border-slate-400 mb-2 h-8 w-32 mx-auto"></div>
                      <p className="text-[8px] font-black text-slate-900 uppercase">Coordinador Logístico</p>
                   </div>
                </div>
             </div>

             <div className="flex items-center justify-between border-t-2 border-slate-900 pt-3">
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">
                   MOVITRAK LOGISTICS • DOCUMENTO INTERNO DE CONTROL
                </p>
                <p className="text-[9px] font-black text-slate-900 uppercase tracking-widest">PÁGINA 1 DE 1</p>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};
