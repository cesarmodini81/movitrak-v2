
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
    <div className="w-full h-full bg-slate-100 flex justify-center print:bg-white print:m-0 print:p-0">
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page {
            size: A4 portrait;
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
          body > *:not(#root) { display: none !important; }
          
          #print-content-root {
            width: 210mm !important;
            height: 297mm !important; /* Force A4 Portrait height */
            padding: 10mm 15mm !important;
            margin: 0 auto !important;
            box-shadow: none !important;
            border: none !important;
            overflow: hidden !important;
            page-break-after: always;
            position: absolute;
            top: 0;
            left: 0;
            display: flex !important;
            flex-direction: column;
            justify-content: space-between;
          }
          
          .no-print { display: none !important; }
          .break-inside-avoid {
            break-inside: avoid;
            page-break-inside: avoid;
          }
        }
      `}} />

      {/* Paper Representation (Screen & Print) */}
      <div 
        id="print-content-root" 
        className="bg-white w-[210mm] min-h-[297mm] p-[10mm] shadow-xl print:shadow-none relative flex flex-col justify-between font-sans text-slate-900 mx-auto my-8 print:my-0"
      >
        
        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden opacity-[0.04]">
          <div className="transform -rotate-45 text-[120px] font-black uppercase tracking-widest whitespace-nowrap text-slate-900 select-none">
             {company.name}
          </div>
        </div>

        <div className="relative z-10 flex flex-col h-full">
          
          {/* HEADER */}
          <header className="border-b-[3px] border-slate-900 pb-4 mb-6 shrink-0">
            <div className="flex justify-between items-start">
              
              {/* Left: Company */}
              <div className="w-1/3">
                <div className="flex items-center gap-3 mb-2">
                   <div className="w-12 h-12 bg-slate-900 text-white flex items-center justify-center rounded-lg print:bg-white print:border-[3px] print:border-black print:text-black">
                      <ShieldCheck size={28} strokeWidth={2.5} />
                   </div>
                   <div>
                     <h1 className="text-lg font-black uppercase leading-none tracking-tight">{company.name}</h1>
                     <p className="text-[7px] font-bold text-slate-500 uppercase tracking-[0.25em] mt-1 print:text-slate-800">Logística Oficial</p>
                   </div>
                </div>
                <div className="text-[8px] font-bold text-slate-500 uppercase leading-relaxed mt-2 pl-1 print:text-slate-800">
                   <p>Ruta Nacional 11 KM 456</p>
                   <p>Santa Fe, Argentina</p>
                   <p>IVA RESPONSABLE INSCRIPTO</p>
                </div>
              </div>

              {/* Center: R Box */}
              <div className="w-1/3 flex flex-col items-center justify-start pt-1">
                 <div className="w-14 h-14 border-[3px] border-slate-900 bg-slate-50 flex items-center justify-center mb-1 print:bg-transparent">
                    <span className="text-4xl font-black font-serif">R</span>
                 </div>
                 <p className="text-[7px] font-bold text-slate-900 uppercase tracking-widest text-center">CÓDIGO 91<br/>REMITO DE TRASLADO</p>
              </div>

              {/* Right: Document Data */}
              <div className="w-1/3 text-right">
                 <p className="text-3xl font-black text-slate-900 leading-none mb-1 tracking-tight">REMITO</p>
                 <p className="text-sm font-mono font-bold text-slate-500 mb-3 print:text-black">Nº {movement.id}</p>
                 <div className="inline-block text-right border-b-2 border-slate-900 pb-1">
                   <p className="text-[7px] font-black uppercase text-slate-400 tracking-widest mb-0.5 print:text-slate-600">Fecha de Emisión</p>
                   <p className="text-sm font-bold text-slate-900">
                     {new Date(movement.date).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                   </p>
                 </div>
              </div>
            </div>
          </header>

          {/* CONTENT BODY */}
          <main className="flex-1">
            
            {/* Route & Transport Grid */}
            <div className="grid grid-cols-2 gap-6 mb-8">
               
               {/* Origin / Destination */}
               <div className="border-[2px] border-slate-200 rounded-xl overflow-hidden print:border-slate-400">
                  <div className="p-3 border-b border-slate-200 bg-slate-50 print:bg-slate-100 print:border-slate-400">
                     <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1 mb-1 print:text-slate-800">
                        <MapPin size={10} /> Origen del Viaje
                     </p>
                     <p className="text-xs font-black uppercase text-slate-900 mt-0.5 truncate">{origin?.name}</p>
                     <p className="text-[8px] text-slate-500 truncate print:text-slate-700">{origin?.address}</p>
                  </div>
                  <div className="p-3">
                     <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1 mb-1 print:text-slate-800">
                        <MapPin size={10} /> Destino Final
                     </p>
                     <p className="text-xs font-black uppercase text-slate-900 mt-0.5 truncate">{destination?.name}</p>
                     <p className="text-[8px] text-slate-500 truncate print:text-slate-700">{destination?.address}</p>
                  </div>
               </div>

               {/* Transport Data */}
               <div className="border-[2px] border-slate-200 rounded-xl p-3 flex flex-col justify-between print:border-slate-400">
                  <div className="flex justify-between items-start mb-2">
                     <div>
                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1 print:text-slate-800 flex items-center gap-1">
                           <Truck size={10} /> Transportista
                        </p>
                        <p className="text-xs font-black uppercase text-slate-900">{movement.transporter}</p>
                     </div>
                     <div className="text-right">
                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1 print:text-slate-800">Chofer</p>
                        <p className="text-xs font-black uppercase text-slate-900">{movement.driverName || '---'}</p>
                        <p className="text-[9px] font-mono text-slate-500 font-bold print:text-slate-700">{driverDni}</p>
                     </div>
                  </div>
                  <div className="border-t border-dashed border-slate-300 pt-2 flex justify-between items-center print:border-slate-500">
                     <div className="text-center flex-1 border-r border-slate-200">
                        <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest print:text-slate-600">Patente Camión</p>
                        <p className="text-xs font-mono font-black mt-0.5">{truckPlate || '---'}</p>
                     </div>
                     <div className="text-center flex-1">
                        <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest print:text-slate-600">Acoplado</p>
                        <p className="text-xs font-mono font-black mt-0.5">{trailerPlate || '---'}</p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Units Table */}
            <div className="mb-8">
               <div className="flex items-center gap-2 mb-2 border-b-[2px] border-slate-900 pb-1">
                  <Database size={14} className="text-slate-900" />
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Manifiesto de Carga</h3>
               </div>
               
               <table className="w-full text-xs border-collapse">
                  <thead>
                     <tr className="bg-slate-900 text-white print:bg-slate-200 print:text-black print:border-b-2 print:border-black">
                        <th className="py-2 px-3 text-left font-black uppercase w-10 text-[9px]">#</th>
                        <th className="py-2 px-3 text-left font-black uppercase w-48 text-[9px]">VIN</th>
                        <th className="py-2 px-3 text-left font-black uppercase text-[9px]">Detalle Unidad</th>
                        <th className="py-2 px-3 text-center font-black uppercase w-20 text-[9px]">Cond.</th>
                        <th className="py-2 px-3 text-left font-black uppercase w-1/3 text-[9px]">Observaciones</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 border-b border-slate-200 print:border-slate-400 print:divide-slate-400">
                     {vehicles.map((v, idx) => (
                        <tr key={v.vin} className="break-inside-avoid">
                           <td className="py-3 px-3 text-slate-500 font-bold align-top text-[10px] print:text-slate-800">{idx + 1}</td>
                           <td className="py-3 px-3 font-mono font-bold text-[11px] text-slate-900 align-top">
                              {v.vin}
                           </td>
                           <td className="py-3 px-3 align-top">
                              <p className="font-black uppercase text-[10px] leading-tight text-slate-900">{v.brand} {v.model}</p>
                              <p className="text-[8px] font-bold text-slate-500 uppercase mt-0.5 print:text-slate-700">{v.color} - {v.year}</p>
                           </td>
                           <td className="py-3 px-3 text-center align-top">
                              <span className="text-[8px] font-bold border border-slate-300 px-1.5 py-0.5 rounded uppercase print:border-slate-600 print:text-slate-900">
                                 {v.type === 'NEW' ? '0KM' : 'USD'}
                              </span>
                           </td>
                           <td className="py-3 px-3 align-top">
                              <p className="text-[9px] italic text-slate-600 leading-tight print:text-slate-900 font-medium">
                                 {unitObservations?.[v.vin] || '-'}
                              </p>
                           </td>
                        </tr>
                     ))}
                     {/* Fillers for visual consistency */}
                     {vehicles.length > 0 && vehicles.length < 5 && Array.from({ length: 5 - vehicles.length }).map((_, i) => (
                        <tr key={`fill-${i}`} className="h-8">
                           <td colSpan={5}></td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>

            {/* General Observations */}
            <div className="border-[2px] border-slate-200 rounded-xl p-4 mb-6 break-inside-avoid print:border-slate-400 bg-slate-50 print:bg-transparent">
               <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1 print:text-slate-800">
                  <FileText size={10} /> Observaciones Generales del Despacho
               </p>
               <p className="text-[10px] font-medium text-slate-900 italic min-h-[3rem] leading-relaxed">
                  {movement.observations || 'Ninguna observación general registrada para este movimiento.'}
               </p>
            </div>

          </main>

          {/* FOOTER */}
          <footer className="break-inside-avoid mt-auto">
             {/* Signatures */}
             <div className="grid grid-cols-3 gap-8 mb-6">
                <div className="text-center pt-8 border-t-[2px] border-slate-300 print:border-slate-900">
                   <p className="text-[9px] font-black uppercase tracking-widest text-slate-900">Emisor / Despacho</p>
                   <p className="text-[7px] text-slate-500 uppercase font-bold mt-0.5 print:text-slate-700">{company.name}</p>
                </div>
                <div className="text-center pt-8 border-t-[2px] border-slate-300 print:border-slate-900">
                   <p className="text-[9px] font-black uppercase tracking-widest text-slate-900">Transportista</p>
                   <p className="text-[7px] text-slate-500 uppercase font-bold mt-0.5 print:text-slate-700">Conformidad Carga</p>
                </div>
                <div className="text-center pt-8 border-t-[2px] border-slate-300 print:border-slate-900">
                   <p className="text-[9px] font-black uppercase tracking-widest text-slate-900">Receptor</p>
                   <p className="text-[7px] text-slate-500 uppercase font-bold mt-0.5 print:text-slate-700">Firma y Sello</p>
                </div>
             </div>

             {/* Disclaimer & System ID */}
             <div className="bg-slate-50 border-t-2 border-slate-900 pt-3 pb-2 px-4 flex justify-between items-center print:bg-transparent print:border-t-2 print:border-black">
                <div className="max-w-[70%]">
                   <p className="text-[6px] text-slate-400 font-bold uppercase tracking-wide leading-tight text-justify print:text-slate-600">
                      La mercadería viaja por cuenta y riesgo del remitente hasta su entrega. Este documento certifica únicamente el traslado físico.
                      Documento generado por MOVITRAK.
                   </p>
                </div>
                <div className="text-right flex flex-col items-end">
                   {/* QR Placeholder (Self Contained SVG) */}
                   <div className="w-12 h-12 border border-slate-300 mb-1 flex items-center justify-center p-0.5 print:border-black">
                      <QrCode size={40} className="text-slate-900" />
                   </div>
                   <p className="text-[7px] font-black text-slate-900 uppercase">System ID</p>
                   <p className="text-[8px] font-mono font-bold text-slate-500 print:text-black">{movement.id}</p>
                </div>
             </div>
          </footer>

        </div>
      </div>
    </div>
  );
};
