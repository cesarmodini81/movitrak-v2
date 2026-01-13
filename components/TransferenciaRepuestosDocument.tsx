
import React from 'react';
import { PartTransfer, Company, Location } from '../types';

interface Props {
  transfer: PartTransfer;
  company: Company;
  locations: Location[];
}

export const TransferenciaRepuestosDocument: React.FC<Props> = ({ transfer, company, locations }) => {
  return (
    <div id="print-root" className="w-full bg-white print:block">
      <style>{`
        @page {
          size: A4 portrait;
          margin: 10mm 15mm;
        }
        @media print {
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            height: auto;
            overflow: visible;
          }
          body > * { display: none !important; }
          #print-root {
            display: block !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          #print-root * { visibility: visible !important; }
        }
      `}</style>

      <div className="w-[180mm] mx-auto font-sans text-slate-900 min-h-[270mm] flex flex-col justify-between">
        <div>
            <div className="border-b-4 border-slate-900 pb-4 mb-6 flex justify-between items-end">
               <div>
                  <h1 className="text-2xl font-black uppercase tracking-tight">Remito de Repuestos</h1>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{company.name}</p>
               </div>
               <div className="text-right">
                  <p className="text-lg font-mono font-black">{transfer.id}</p>
                  <p className="text-[10px] uppercase font-bold text-slate-400">{new Date(transfer.date).toLocaleString()}</p>
               </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mb-8">
               <div className="border border-slate-300 p-3 rounded print:border-black">
                  <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Origen</p>
                  <p className="font-bold text-sm">{locations.find(l => l.id === transfer.originId)?.name}</p>
               </div>
               <div className="border border-slate-300 p-3 rounded print:border-black">
                  <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Destino</p>
                  <p className="font-bold text-sm">{locations.find(l => l.id === transfer.destinationId)?.name}</p>
               </div>
            </div>

            <table className="w-full text-left text-xs border-collapse">
               <thead className="bg-slate-100 uppercase font-black text-[9px] print:bg-slate-200">
                  <tr>
                      <th className="p-2 border-b border-slate-300 w-24">Código</th>
                      <th className="p-2 border-b border-slate-300">Descripción</th>
                      <th className="p-2 border-b border-slate-300 text-right w-16">Cant.</th>
                  </tr>
               </thead>
               <tbody>
                  {transfer.items.map((i, idx) => (
                     <tr key={idx} className="border-b border-slate-100 break-inside-avoid">
                        <td className="p-2 font-mono font-bold text-[10px]">{i.partCode}</td>
                        <td className="p-2 font-medium">{i.name}</td>
                        <td className="p-2 text-right font-black">{i.quantity}</td>
                     </tr>
                  ))}
               </tbody>
            </table>
        </div>
        
        <div className="border-t border-slate-900 pt-4 mt-8">
           <div className="grid grid-cols-2 gap-10">
               <div>
                   <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">Transporte</p>
                   <p className="text-xs font-bold">{transfer.transporter}</p>
                   <p className="text-[10px]">{transfer.driverName} - {transfer.truckPlate}</p>
               </div>
               <div className="text-right pt-4">
                   <div className="border-t border-slate-400 inline-block px-10 pt-1">
                       <p className="text-[8px] font-black uppercase tracking-widest">Firma Conforme</p>
                   </div>
               </div>
           </div>
        </div>
      </div>
    </div>
  );
};
