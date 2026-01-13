
import React from 'react';
import { Movement, Vehicle, Company, Location } from '../types';
import { MapPin, ShieldCheck, Database, FileText, Truck, QrCode } from 'lucide-react';

interface Props {
  movement: Movement;
  company: Company;
  vehicles: Vehicle[];
  origin?: Location;
  destination?: Location;
  driverDni?: string;
  truckPlate?: string;
  trailerPlate?: string;
  unitObservations?: Record<string, string>;
}

export const RemitoDocument: React.FC<Props> = ({ 
  movement, 
  company, 
  vehicles, 
  origin, 
  destination, 
  driverDni, 
  truckPlate, 
  trailerPlate,
  unitObservations 
}) => {
  return (
    <div className="w-full bg-white text-slate-900 font-sans">
      <style>{`
        @page {
          size: A4 portrait;
          margin: 10mm 15mm;
        }
        @media print {
          /* Use global modal isolation instead of local hiding */
          * { box-sizing: border-box; }
          
          /* Ensure table fits */
          table { width: 100% !important; border-collapse: collapse; }
          td, th { word-break: break-word; }
          tr { break-inside: avoid; }
        }
      `}</style>

      {/* DOCUMENT CANVAS */}
      <div className="relative w-[210mm] min-h-[297mm] mx-auto bg-white p-[10mm] flex flex-col justify-between">
        
        {/* WATERMARK (Absolute Centered) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden opacity-[0.03]">
          <div className="transform -rotate-45 text-[100px] font-black uppercase tracking-widest whitespace-nowrap text-slate-900 select-none">
             {company.name}
          </div>
        </div>

        {/* CONTENT WRAPPER */}
        <div className="relative z-10 flex flex-col flex-1 h-full justify-between">
          
          {/* HEADER */}
          <header className="border-b-[4px] border-slate-900 pb-4 mb-6">
            <div className="flex justify-between items-start">
              
              {/* Company Info */}
              <div className="w-1/3">
                <div className="flex items-center gap-3 mb-2">
                   <div className="w-12 h-12 border-[3px] border-slate-900 flex items-center justify-center rounded-lg text-slate-900">
                      <ShieldCheck size={28} strokeWidth={2.5} />
                   </div>
                   <div>
                     <h1 className="text-lg font-black uppercase leading-none tracking-tight text-slate-900">{company.name}</h1>
                     <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.25em] mt-1">Logística Oficial</p>
                   </div>
                </div>
                <div className="text-[9px] font-bold text-slate-600 uppercase leading-relaxed pl-1">
                   <p>Ruta Nacional 11 KM 456</p>
                   <p>Santa Fe, Argentina</p>
                   <p>IVA RESPONSABLE INSCRIPTO</p>
                </div>
              </div>

              {/* R Code Box */}
              <div className="w-1/3 flex flex-col items-center justify-start pt-1">
                 <div className="w-16 h-16 border-[4px] border-slate-900 flex items-center justify-center mb-1 bg-white text-slate-900">
                    <span className="text-5xl font-black font-serif">R</span>
                 </div>
                 <p className="text-[8px] font-bold text-slate-900 uppercase tracking-widest text-center">CÓDIGO 91<br/>REMITO DE TRASLADO</p>
              </div>

              {/* Document Data */}
              <div className="w-1/3 text-right">
                 <p className="text-3xl font-black text-slate-900 leading-none mb-1 tracking-tight">REMITO</p>
                 <p className="text-sm font-mono font-bold text-slate-900 mb-3">Nº {movement.id}</p>
                 <div className="inline-block text-right border-b-2 border-slate-900 pb-1">
                   <p className="text-[8px] font-black uppercase text-slate-500 tracking-widest mb-0.5">Fecha de Emisión</p>
                   <p className="text-sm font-bold text-slate-900">
                     {new Date(movement.date).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                   </p>
                 </div>
              </div>
            </div>
          </header>

          {/* BODY */}
          <main className="flex-1 flex flex-col">
            
            {/* Route Grid */}
            <div className="grid grid-cols-2 gap-6 mb-6">
               {/* Origin/Dest */}
               <div className="border-2 border-slate-300 rounded-lg overflow-hidden">
                  <div className="p-3 border-b border-slate-300 bg-slate-50">
                     <p className="text-[9px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-1 mb-1">
                        <MapPin size={10} /> Origen del Viaje
                     </p>
                     <p className="text-xs font-bold uppercase text-slate-900 mt-0.5 truncate">{origin?.name || movement.originId}</p>
                     <p className="text-[9px] text-slate-600 truncate">{origin?.address || 'Planta Operativa'}</p>
                  </div>
                  <div className="p-3">
                     <p className="text-[9px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-1 mb-1">
                        <MapPin size={10} /> Destino Final
                     </p>
                     <p className="text-xs font-bold uppercase text-slate-900 mt-0.5 truncate">{destination?.name || movement.destinationId}</p>
                     <p className="text-[9px] text-slate-600 truncate">{destination?.address || 'Domicilio Destino'}</p>
                  </div>
               </div>

               {/* Transport */}
               <div className="border-2 border-slate-300 rounded-lg p-3 flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2">
                     <div>
                        <p className="text-[9px] font-black text-slate-900 uppercase tracking-widest mb-1 flex items-center gap-1">
                           <Truck size={10} /> Transportista
                        </p>
                        <p className="text-xs font-bold uppercase text-slate-900">{movement.transporter}</p>
                     </div>
                     <div className="text-right">
                        <p className="text-[9px] font-black text-slate-900 uppercase tracking-widest mb-1">Chofer</p>
                        <p className="text-xs font-bold uppercase text-slate-900">{movement.driverName || '---'}</p>
                        <p className="text-[9px] font-mono text-slate-600 font-bold">{driverDni}</p>
                     </div>
                  </div>
                  <div className="border-t border-dashed border-slate-300 pt-2 flex justify-between items-center">
                     <div className="text-center flex-1 border-r border-slate-200">
                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Patente Camión</p>
                        <p className="text-xs font-mono font-black mt-0.5 text-slate-900">{truckPlate || movement.truckPlate || '---'}</p>
                     </div>
                     <div className="text-center flex-1">
                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Acoplado</p>
                        <p className="text-xs font-mono font-black mt-0.5 text-slate-900">{trailerPlate || movement.trailerPlate || '---'}</p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Table */}
            <div className="mb-6">
               <div className="flex items-center gap-2 mb-2 border-b-2 border-slate-900 pb-1">
                  <Database size={14} className="text-slate-900" />
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Manifiesto de Carga</h3>
               </div>
               
               <table className="w-full text-xs border-collapse table-fixed">
                  <thead>
                     <tr className="bg-slate-200 text-slate-900 border-b-2 border-slate-900">
                        <th className="py-2 px-2 text-left font-black uppercase w-[5%]">#</th>
                        <th className="py-2 px-2 text-left font-black uppercase w-[25%]">VIN / Chasis</th>
                        <th className="py-2 px-2 text-left font-black uppercase w-[35%]">Detalle Unidad</th>
                        <th className="py-2 px-2 text-center font-black uppercase w-[10%]">Cond.</th>
                        <th className="py-2 px-2 text-left font-black uppercase w-[25%]">Observaciones</th>
                     </tr>
                  </thead>
                  <tbody className="border-b border-slate-300">
                     {vehicles.map((v, idx) => (
                        <tr key={v.vin}>
                           <td className="py-2 px-2 text-slate-600 font-bold align-top text-[10px]">{idx + 1}</td>
                           <td className="py-2 px-2 font-mono font-bold text-[11px] text-slate-900 align-top">
                              {v.vin}
                           </td>
                           <td className="py-2 px-2 align-top">
                              <p className="font-black uppercase text-[10px] leading-tight text-slate-900">{v.brand} {v.model}</p>
                              <p className="text-[9px] font-bold text-slate-500 uppercase mt-0.5">{v.color} - {v.year}</p>
                           </td>
                           <td className="py-2 px-2 text-center align-top">
                              <span className="text-[9px] font-bold border border-slate-400 px-1.5 py-0.5 rounded uppercase text-slate-900">
                                 {v.type === 'NEW' ? '0KM' : 'USD'}
                              </span>
                           </td>
                           <td className="py-2 px-2 align-top">
                              <p className="text-[10px] italic text-slate-900 font-medium leading-tight">
                                 {unitObservations?.[v.vin] || '-'}
                              </p>
                           </td>
                        </tr>
                     ))}
                     {/* Row fillers for A4 layout stability */}
                     {vehicles.length > 0 && vehicles.length < 5 && Array.from({ length: 5 - vehicles.length }).map((_, i) => (
                        <tr key={`fill-${i}`} style={{ height: '2rem' }}>
                           <td className="border-r border-transparent"></td>
                           <td className="border-r border-transparent"></td>
                           <td className="border-r border-transparent"></td>
                           <td className="border-r border-transparent"></td>
                           <td></td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>

            {/* Observations Box */}
            <div className="border-2 border-slate-300 rounded-lg p-3 mb-4 bg-slate-50">
               <p className="text-[9px] font-black text-slate-900 uppercase tracking-widest mb-1 flex items-center gap-1">
                  <FileText size={10} /> Observaciones Generales
               </p>
               <p className="text-[10px] font-medium text-slate-900 italic min-h-[2rem] leading-relaxed">
                  {movement.observations || 'Ninguna observación general registrada para este movimiento.'}
               </p>
            </div>

          </main>

          {/* FOOTER */}
          <footer className="mt-auto">
             {/* Signatures */}
             <div className="grid grid-cols-3 gap-8 mb-6">
                <div className="text-center pt-8 border-t-2 border-slate-900">
                   <p className="text-[9px] font-black uppercase tracking-widest text-slate-900">Emisor / Despacho</p>
                   <p className="text-[8px] text-slate-500 uppercase font-bold mt-0.5">{company.name}</p>
                </div>
                <div className="text-center pt-8 border-t-2 border-slate-900">
                   <p className="text-[9px] font-black uppercase tracking-widest text-slate-900">Transportista</p>
                   <p className="text-[8px] text-slate-500 uppercase font-bold mt-0.5">Conformidad Carga</p>
                </div>
                <div className="text-center pt-8 border-t-2 border-slate-900">
                   <p className="text-[9px] font-black uppercase tracking-widest text-slate-900">Receptor</p>
                   <p className="text-[8px] text-slate-500 uppercase font-bold mt-0.5">Firma y Sello</p>
                </div>
             </div>

             {/* Disclaimer & System ID */}
             <div className="bg-slate-100 border-t-2 border-slate-900 pt-3 pb-2 px-4 flex justify-between items-center">
                <div style={{ maxWidth: '70%' }}>
                   <p className="text-[7px] text-slate-500 font-bold uppercase tracking-wide leading-tight text-justify">
                      La mercadería viaja por cuenta y riesgo del remitente hasta su entrega. Este documento certifica únicamente el traslado físico.
                      Documento generado por MOVITRAK v2.0.
                   </p>
                </div>
                <div className="text-right flex flex-col items-end">
                   {/* QR Placeholder */}
                   <div className="w-12 h-12 border border-slate-900 mb-1 flex items-center justify-center p-0.5 bg-white">
                      <QrCode size={40} className="text-slate-900" />
                   </div>
                   <p className="text-[8px] font-black text-slate-900 uppercase">System ID</p>
                   <p className="text-[8px] font-mono font-bold text-slate-500">{movement.id}</p>
                </div>
             </div>
          </footer>

        </div>
      </div>
    </div>
  );
};
