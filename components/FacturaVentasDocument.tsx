
import React from 'react';
import { PartSale, Company } from '../types';

interface Props {
  sale: PartSale;
  company: Company;
}

export const FacturaVentasDocument: React.FC<Props> = ({ sale, company }) => {
  return (
    <div className="w-full bg-white">
      <style>{`
        @page {
          size: A4 portrait;
          margin: 10mm 15mm;
        }
      `}</style>

      <div className="w-[180mm] mx-auto font-sans text-slate-900 min-h-[270mm] flex flex-col justify-between p-2 bg-white">
        <div>
            <div className="border-b-[4px] border-slate-900 pb-4 mb-6 flex justify-between">
               <div>
                  <h1 className="text-3xl font-black uppercase tracking-tighter text-slate-900">{company.name}</h1>
                  <p className="font-bold text-slate-500 uppercase tracking-widest text-[9px] mt-1">División Repuestos Originales</p>
               </div>
               <div className="text-right">
                  <div className="border-2 border-slate-900 p-1 w-10 h-10 flex items-center justify-center text-xl font-black mb-1 ml-auto">B</div>
                  <p className="text-lg font-mono font-black">{sale.id}</p>
                  <p className="text-[9px] font-bold text-slate-400">{new Date(sale.date).toLocaleString()}</p>
               </div>
            </div>

            <div className="bg-slate-50 p-4 mb-6 border border-slate-200 rounded-lg">
               <p className="text-[8px] font-black uppercase text-slate-400 mb-1">Datos del Cliente</p>
               <h2 className="text-lg font-black uppercase">{sale.clientName}</h2>
               <div className="flex gap-4 mt-1 text-xs">
                   <p className="font-mono font-bold">DNI/CUIT: {sale.clientDni}</p>
                   <p>{sale.clientPhone}</p>
               </div>
               <p className="text-xs mt-0.5">{sale.clientEmail}</p>
            </div>

            <table className="w-full text-left text-xs mb-8 border-collapse">
               <thead className="bg-slate-900 text-white uppercase font-black text-[9px]">
                  <tr>
                      <th className="p-2">Cod.</th>
                      <th className="p-2">Descripción</th>
                      <th className="p-2 text-right">Cant.</th>
                      <th className="p-2 text-right">P. Unit</th>
                      <th className="p-2 text-right">Subtotal</th>
                  </tr>
               </thead>
               <tbody>
                  {sale.items.map((i, idx) => (
                     <tr key={idx} className="border-b border-slate-100 break-inside-avoid">
                        <td className="p-2 font-mono font-bold text-[10px]">{i.partCode}</td>
                        <td className="p-2 font-medium">{i.name}</td>
                        <td className="p-2 text-right font-bold">{i.quantity}</td>
                        <td className="p-2 text-right">${i.price.toLocaleString()}</td>
                        <td className="p-2 text-right font-black">${(i.price * i.quantity).toLocaleString()}</td>
                     </tr>
                  ))}
               </tbody>
            </table>
        </div>

        <div className="flex justify-end border-t border-slate-900 pt-4">
           <div className="text-right">
              <p className="text-[9px] uppercase tracking-widest font-bold text-slate-500">Total Final</p>
              <p className="text-3xl font-black mt-1">${sale.total.toLocaleString()}</p>
           </div>
        </div>
      </div>
    </div>
  );
};
