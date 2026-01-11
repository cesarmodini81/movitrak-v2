import React from 'react';
import { Movement, Vehicle, Company, Location } from '../types';
import { Truck, MapPin, ShieldCheck, User, Database, FileText } from 'lucide-react';

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
    <div className="w-full flex justify-center bg-slate-100/50 print:bg-white">
      <style>{`
        @page {
          size: A4;
          margin: 0;
        }

        /* Canvas dimensions for A4 Portrait */
        .pdf-page-canvas {
          width: 210mm;
          min-height: 297mm;
          background-color: white;
          padding: 10mm;
          box-sizing: border-box;
          position: relative;
        }

        /* Preview Scaling Wrapper */
        .pdf-preview-wrapper {
          display: flex;
          justify-content: center;
          transform: scale(0.85); /* Slightly smaller to fit UI comfortably */
          transform-origin: top center;
          transition: transform 0.3s ease;
          width: 100%;
          margin-bottom: -15%; /* Compensate for whitespace caused by scaling */
        }

        @media (max-width: 1200px) {
          .pdf-preview-wrapper { transform: scale(0.65); margin-bottom: -30%; }
        }
        @media (max-width: 800px) {
          .pdf-preview-wrapper { transform: scale(0.45); margin-bottom: -50%; }
        }

        @media print {
          @page { size: A4; margin: 0; }
          body { -webkit-print-color-adjust: exact; margin: 0; padding: 0; background: white !important; }
          
          /* Reset wrapper scaling for print */
          .pdf-preview-wrapper {
            transform: none !important;
            display: block !important;
            width: 100% !important;
            height: 100% !important;
            margin-bottom: 0 !important;
          }
          
          .pdf-page-canvas {
            margin: 0 !important;
            width: 210mm !important;
            min-height: 297mm !important;
            padding: 10mm !important;
            box-shadow: none !important;
            border: none !important;
            page-break-after: always;
          }
          
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="pdf-preview-wrapper">
        <div className="pdf-page-canvas font-sans text-slate-900 shadow-2xl print:shadow-none">
          
          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
            <h1 className="text-[100px] font-black text-slate-100 uppercase -rotate-45 tracking-widest opacity-60 select-none whitespace-nowrap">
              {company.name}
            </h1>
          </div>

          <div className="relative z-10 border-2 border-slate-900 h-full p-8 flex flex-col justify-between">
            
            {/* --- HEADER REDESIGNED: 3 Columns (Left Info, Center R, Right Doc Data) --- */}
            <div className="grid grid-cols-3 gap-4 border-b-2 border-slate-900 pb-6 mb-6">
              
              {/* Col 1: Company Info */}
              <div className="flex flex-col justify-center">
                 <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-slate-900 text-white rounded-lg print:bg-black">
                       <ShieldCheck size={28} strokeWidth={2.5} />
                    </div>
                    <div>
                      <h1 className="text-xl font-black uppercase tracking-tight leading-none">{company.name}</h1>
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">Logística Oficial</p>
                    </div>
                 </div>
                 <div className="space-y-0.5 text-[9px] font-bold text-slate-600 uppercase leading-tight">
                    <p>CUIT: 30-71458963-2</p>
                    <p>DOMICILIO: {origin?.address || 'SANTA FE, ARGENTINA'}</p>
                    <p>I.I.B.B.: 921-784512-4</p>
                 </div>
              </div>

              {/* Col 2: The "R" Box (Centered) */}
              <div className="flex flex-col items-center justify-start pt-2">
                 <div className="w-16 h-16 border-2 border-slate-900 bg-slate-50 flex items-center justify-center mb-2">
                    <span className="text-5xl font-black font-serif">R</span>
                 </div>
                 <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest text-center">CÓD. 91 | REMITO P/TRANSPORTE</p>
              </div>

              {/* Col 3: Document Data */}
              <div className="text-right flex flex-col justify-center">
                 <p className="text-3xl font-mono font-black text-slate-900 leading-none mb-1">REMITO</p>
                 <p className="text-lg font-mono font-bold text-slate-700 mb-4">№ {movement.id}</p>
                 
                 <div className="flex flex-col items-end">
                   <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Fecha de Emisión</p>
                   <p className="text-lg font-bold text-slate-900">
                     {new Date(movement.date).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                   </p>
                 </div>
              </div>
            </div>

            {/* --- BODY CONTENT --- */}
            <div className="flex-1 flex flex-col gap-6">
              
              {/* Route Info - Cleaner Layout */}
              <div className="flex border border-slate-300 rounded-xl overflow-hidden">
                 <div className="flex-1 p-4 border-r border-slate-200">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                      <MapPin size={10} /> Origen
                    </p>
                    <p className="text-sm font-black uppercase text-slate-900 truncate">{origin?.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{origin?.address}</p>
                 </div>
                 <div className="bg-slate-50 px-4 flex items-center justify-center">
                    <div className="text-slate-300">➜</div>
                 </div>
                 <div className="flex-1 p-4">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                      <MapPin size={10} /> Destino
                    </p>
                    <p className="text-sm font-black uppercase text-slate-900 truncate">{destination?.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{destination?.address}</p>
                 </div>
              </div>

              {/* Transport Info - Compact Grid */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl grid grid-cols-3 gap-6">
                 <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                      <Truck size={10} /> Transportista
                    </p>
                    <p className="text-xs font-black uppercase text-slate-900">{movement.transporter}</p>
                 </div>
                 <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                      <User size={10} /> Chofer / DNI
                    </p>
                    <p className="text-xs font-black uppercase text-slate-900">{movement.driverName || '---'}</p>
                    <p className="text-[9px] font-mono text-slate-500">{driverDni}</p>
                 </div>
                 <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                      <Database size={10} /> Unidades
                    </p>
                    <p className="text-xs font-black uppercase text-slate-900">
                       CAMIÓN: <span className="font-mono">{truckPlate || '---'}</span>
                    </p>
                    <p className="text-xs font-black uppercase text-slate-900">
                       ACOPLADO: <span className="font-mono">{trailerPlate || '---'}</span>
                    </p>
                 </div>
              </div>

              {/* Units Table - Standard Professional Table */}
              <div className="flex-1">
                <table className="w-full border-collapse border-t-2 border-slate-900 text-sm">
                  <thead>
                    <tr className="border-b border-slate-900">
                      <th className="py-2 text-left text-[9px] font-black uppercase tracking-wider w-10">#</th>
                      <th className="py-2 text-left text-[9px] font-black uppercase tracking-wider w-40">VIN / Chasis</th>
                      <th className="py-2 text-left text-[9px] font-black uppercase tracking-wider">Detalle Unidad</th>
                      <th className="py-2 text-center text-[9px] font-black uppercase tracking-wider w-16">Tipo</th>
                      <th className="py-2 text-left text-[9px] font-black uppercase tracking-wider w-1/3">Observaciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {vehicles.map((v, idx) => (
                      <tr key={v.vin}>
                        <td className="py-3 text-[10px] font-bold text-slate-400 align-top">{idx + 1}</td>
                        <td className="py-3 font-mono font-bold text-sm text-slate-900 align-top tracking-tight">
                          {v.vin}
                        </td>
                        <td className="py-3 align-top">
                          <p className="text-[10px] font-black uppercase leading-tight">{v.brand} {v.model}</p>
                          <p className="text-[9px] font-bold text-slate-500 uppercase mt-0.5">{v.color} - {v.year}</p>
                        </td>
                        <td className="py-3 text-center align-top">
                          <span className="text-[9px] font-bold border border-slate-300 px-1 rounded uppercase">
                            {v.type === 'NEW' ? '0KM' : 'USD'}
                          </span>
                        </td>
                        <td className="py-3 text-[10px] italic text-slate-500 align-top leading-tight">
                          {unitObservations?.[v.vin] || '---'}
                        </td>
                      </tr>
                    ))}
                    {/* Fill empty rows for visual structure */}
                    {Array.from({ length: Math.max(0, 8 - vehicles.length) }).map((_, i) => (
                      <tr key={`empty-${i}`} className="h-10">
                        <td colSpan={5}>&nbsp;</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* --- FOOTER --- */}
            <div className="mt-4 pt-4 border-t-2 border-slate-900">
              
              {/* General Observations */}
              <div className="mb-8 flex gap-4">
                 <div className="flex-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                       <FileText size={10} /> Observaciones Generales
                    </p>
                    <p className="text-xs font-medium text-slate-800 italic border-b border-dashed border-slate-300 pb-1">
                       {movement.observations || 'Sin observaciones declaradas.'}
                    </p>
                 </div>
              </div>

              {/* Signatures Grid */}
              <div className="grid grid-cols-3 gap-8 mb-4">
                 <div className="text-center pt-8 border-t border-slate-300 relative">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-900">Despacho</p>
                    <p className="text-[8px] text-slate-400 uppercase">{company.name}</p>
                 </div>
                 <div className="text-center pt-8 border-t border-slate-300 relative">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-900">Transportista</p>
                    <p className="text-[8px] text-slate-400 uppercase">Conformidad de Carga</p>
                 </div>
                 <div className="text-center pt-8 border-t border-slate-300 relative">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-900">Recepción</p>
                    <p className="text-[8px] text-slate-400 uppercase">Firma y Sello Destino</p>
                 </div>
              </div>

              {/* Legal / System Footer */}
              <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                 <p className="text-[8px] text-slate-400 uppercase tracking-widest max-w-lg">
                    Documento no válido como factura. La mercadería viaja por cuenta y orden del remitente.
                 </p>
                 <p className="text-[8px] font-mono font-bold text-slate-300">
                    MOVITRAK SYSTEM ID: {movement.id}
                 </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};