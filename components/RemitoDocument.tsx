
import React from 'react';
import { Movement, Vehicle, Company, Location } from '../types';
import { LOCATION_MAP } from '../constants';
import { MapPin, Truck, FileText, ShieldCheck } from 'lucide-react';

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

// Componente simple sin forwardRef para impresión nativa
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
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&bgcolor=ffffff&data=${movement.id}`;
  
  return (
    <div className="p-8 bg-white font-sans text-slate-900 selection:bg-none print:p-0">
      <style>{`
        @media print {
          @page { size: A4 portrait; margin: 0; }
          body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; margin: 0; padding: 0; background: white !important; }
          .page-container { width: 210mm; height: 297mm; padding: 10mm 12mm; margin: 0 auto; display: flex; flex-direction: column; position: relative; }
          .footer-mt-auto { margin-top: auto; }
        }
      `}</style>

      <div className="page-container bg-white relative">
        
        {/* WATERMARK */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] z-0">
           <h1 className="text-[120px] font-black uppercase -rotate-45 tracking-widest text-slate-900 select-none">MOVITRAK</h1>
        </div>

        <div className="relative z-10 flex flex-col h-full">
          {/* HEADER */}
          <header className="flex justify-between items-start border-b-[3px] border-slate-900 pb-5 mb-6">
            <div className="w-[45%]">
              <h1 className="text-3xl font-black tracking-tighter text-slate-900 uppercase leading-none">{company.name} </h1>
              <div className="flex items-center gap-2 mt-2">
                 <span className="px-2 py-0.5 bg-slate-900 text-white text-[8px] font-bold uppercase tracking-widest rounded-sm">Logística</span>
                 <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Distribución Oficial</span>
              </div>
              <div className="mt-3 text-[8px] text-slate-600 space-y-0.5 font-medium leading-tight">
                <p>Ruta Nac. 11 KM 456 - Sauce Viejo (SF)</p>
                <p>IVA RESPONSABLE INSCRIPTO • CUIT 30-71458922-1</p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center pt-1">
               <div className="w-14 h-14 border-[3px] border-slate-900 rounded-xl flex flex-col items-center justify-center bg-slate-50 shadow-sm">
                  <span className="text-3xl font-black leading-none text-slate-900">R</span>
                  <span className="text-[6px] font-bold uppercase mt-0.5">COD. 91</span>
               </div>
            </div>

            <div className="w-[45%] text-right">
               <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">REMITO DE TRASLADO</h2>
               <p className="text-[8px] font-bold text-slate-400 uppercase mb-3">Documento de Tránsito (No válido como factura)</p>
               
               <div className="flex justify-end gap-4">
                  <div className="text-right">
                     <p className="text-[8px] font-bold text-slate-400 uppercase">N° Comprobante</p>
                     <p className="text-xl font-mono font-black text-slate-900 leading-none">{movement.id}</p>
                  </div>
                  <div className="text-right pl-4 border-l border-slate-200">
                     <p className="text-[8px] font-bold text-slate-400 uppercase">Emisión</p>
                     <p className="text-sm font-bold text-slate-900 leading-none mt-1">{new Date(movement.date).toLocaleDateString('es-AR')}</p>
                  </div>
               </div>
            </div>
          </header>

          {/* INFO GRID */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* RUTA */}
            <div className="bg-blue-50/60 rounded-xl p-4 border border-blue-100/50">
               <h3 className="text-[9px] font-black text-blue-700 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <MapPin size={12} strokeWidth={3} /> Ruta de Tráfico
               </h3>
               <div className="space-y-3 relative">
                  {/* Connector Line */}
                  <div className="absolute left-[3px] top-2 bottom-2 w-[2px] bg-blue-200/50 rounded-full"></div>
                  
                  <div className="relative pl-4">
                     <div className="absolute left-0 top-1.5 w-1.5 h-1.5 bg-blue-400 rounded-full ring-2 ring-white"></div>
                     <p className="text-[7px] font-bold text-slate-400 uppercase tracking-wider">Origen</p>
                     <p className="text-xs font-black text-slate-900 uppercase truncate">
                        {origin?.name || LOCATION_MAP[movement.originId] || movement.originId}
                     </p>
                  </div>
                  <div className="relative pl-4">
                     <div className="absolute left-0 top-1.5 w-1.5 h-1.5 bg-blue-600 rounded-full ring-2 ring-white"></div>
                     <p className="text-[7px] font-bold text-slate-400 uppercase tracking-wider">Destino Final</p>
                     <p className="text-xs font-black text-slate-900 uppercase truncate">
                        {destination?.name || LOCATION_MAP[movement.destinationId] || movement.destinationId}
                     </p>
                  </div>
               </div>
            </div>

            {/* LOGISTICA */}
            <div className="bg-emerald-50/60 rounded-xl p-4 border border-emerald-100/50">
               <h3 className="text-[9px] font-black text-emerald-700 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Truck size={12} strokeWidth={3} /> Logística & Transporte
               </h3>
               <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                  <div className="col-span-2 pb-2 border-b border-emerald-200/30">
                     <p className="text-[7px] font-bold text-slate-400 uppercase">Empresa Transportista</p>
                     <p className="text-xs font-black text-slate-900 uppercase truncate">{movement.transporter || 'LOGÍSTICA PROPIA'}</p>
                  </div>
                  <div>
                     <p className="text-[7px] font-bold text-slate-400 uppercase">Conductor / DNI</p>
                     <p className="text-[10px] font-bold text-slate-900 uppercase truncate">
                        {movement.driverName || '-'} <span className="text-slate-400 font-medium">({driverDni || '-'})</span>
                     </p>
                  </div>
                  <div className="flex gap-2">
                     <div>
                        <p className="text-[7px] font-bold text-slate-400 uppercase">Tractor</p>
                        <span className="text-[10px] font-mono font-black text-slate-900 bg-white px-1.5 rounded border border-emerald-100">{truckPlate || '-'}</span>
                     </div>
                     <div>
                        <p className="text-[7px] font-bold text-slate-400 uppercase">Acoplado</p>
                        <span className="text-[10px] font-mono font-black text-slate-900 bg-white px-1.5 rounded border border-emerald-100">{trailerPlate || '-'}</span>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          {/* TABLE */}
          <div className="mb-4 flex-1">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b-2 border-slate-900">
                  <th className="py-2 px-2 w-[5%] text-center text-[9px] font-black text-slate-900 uppercase tracking-wider">#</th>
                  <th className="py-2 px-2 w-[20%] text-[9px] font-black text-slate-900 uppercase tracking-wider">VIN / Identificación</th>
                  <th className="py-2 px-2 w-[25%] text-[9px] font-black text-slate-900 uppercase tracking-wider">Unidad (Marca - Modelo)</th>
                  <th className="py-2 px-2 w-[15%] text-[9px] font-black text-slate-900 uppercase tracking-wider">Color</th>
                  <th className="py-2 px-2 w-[35%] text-[9px] font-black text-slate-900 uppercase tracking-wider">Observaciones Específicas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {vehicles.map((v, i) => (
                  <tr key={v.vin}>
                    <td className="py-2 px-2 text-center text-[10px] font-bold text-slate-400">{i + 1}</td>
                    <td className="py-2 px-2">
                       <span className="font-mono text-[11px] font-black text-slate-900 tracking-wider bg-slate-50 px-1.5 py-0.5 rounded">{v.vin}</span>
                    </td>
                    <td className="py-2 px-2">
                      <div className="text-[10px] font-black text-slate-800 uppercase leading-tight">{v.brand} {v.model}</div>
                      <div className="text-[8px] font-bold text-slate-500 uppercase mt-0.5">{v.type === 'NEW' ? '0KM' : 'USADO'} — {v.year}</div>
                    </td>
                    <td className="py-2 px-2 text-[9px] font-bold text-slate-600 uppercase">{v.color}</td>
                    <td className="py-2 px-2 text-[9px] font-medium text-slate-500 italic leading-tight uppercase">
                      {unitObservations?.[v.vin] || '-'}
                    </td>
                  </tr>
                ))}
                {/* Filas vacías de relleno */}
                {vehicles.length < 5 && Array.from({ length: 5 - vehicles.length }).map((_, i) => (
                   <tr key={`fill-${i}`} className="h-10">
                      <td colSpan={5} className="border-b border-dashed border-slate-50"></td>
                   </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* FOOTER AREA */}
          <div className="footer-mt-auto">
             
             {/* General Observations */}
             <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-8 min-h-[80px]">
               <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                  <FileText size={10} /> Observaciones Generales del Despacho
               </p>
               <p className="text-[10px] text-slate-800 font-medium leading-relaxed uppercase">
                 {movement.observations || 'Sin observaciones adicionales declaradas al momento de la emisión.'}
               </p>
             </div>

             {/* Signatures */}
             <div className="grid grid-cols-3 gap-8 mb-8 items-end">
               <div className="text-center">
                  <div className="border-b border-slate-300 mb-2 h-8"></div>
                  <p className="text-[9px] font-black text-slate-900 uppercase tracking-widest">Gestión Logística</p>
                  <p className="text-[7px] font-bold text-slate-400 uppercase">Firma Autorizada</p>
               </div>
               <div className="text-center">
                  <div className="border-b border-slate-300 mb-2 h-8"></div>
                  <p className="text-[9px] font-black text-slate-900 uppercase tracking-widest">Transportista</p>
                  <p className="text-[7px] font-bold text-slate-400 uppercase">Conformidad de Carga</p>
               </div>
               <div className="text-center">
                  <div className="border-b border-slate-300 mb-2 h-8"></div>
                  <p className="text-[9px] font-black text-slate-900 uppercase tracking-widest">Recepción Destino</p>
                  <p className="text-[7px] font-bold text-slate-400 uppercase">Control de Arribo</p>
               </div>
             </div>

             {/* Legal & Security Footer */}
             <div className="flex items-end justify-between border-t-4 border-slate-900 pt-4">
                <div className="flex items-center gap-4">
                   <div className="bg-white p-1 border border-slate-200 rounded-lg shadow-sm">
                      <img src={qrUrl} alt="QR" className="w-[60px] h-[60px]" />
                   </div>
                   <div>
                      <div className="flex items-center gap-2 mb-1">
                         <ShieldCheck size={14} className="text-slate-900" />
                         <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">VALIDACIÓN DE SEGURIDAD</p>
                      </div>
                      <p className="text-[7px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                        Hash: {movement.id.slice(0,4)}-{Date.now().toString().slice(-6)} • Secure Protocol
                      </p>
                      <p className="text-[6px] text-slate-400 max-w-[300px] leading-tight uppercase text-justify">
                        La tenencia de este documento implica responsabilidad legal sobre la carga descrita. 
                        Documento generado electrónicamente por sistema MOVITRAK. Cualquier enmienda invalida su autenticidad.
                      </p>
                   </div>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black text-slate-900 uppercase">MOVITRAK ENTERPRISE v2.8</p>
                   <p className="text-[8px] font-bold text-slate-400 uppercase">CAI: 224587789541 • Vto: 31/12/2030</p>
                   <div className="mt-1 px-2 py-0.5 bg-slate-900 text-white text-[7px] font-black uppercase rounded inline-block tracking-widest">
                      Original: Cliente / Copia: Archivo
                   </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};
