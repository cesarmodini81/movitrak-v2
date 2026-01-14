
import React from 'react';
import { Movement, Vehicle, Company, Location } from '../types';
import { LOCATION_MAP } from '../constants';
import { MapPin, Truck, Calendar, Hash, User, FileText } from 'lucide-react';

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
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&bgcolor=ffffff&data=${movement.id}`;
  
  return (
    <div className="w-full h-full bg-white text-slate-900 font-sans selection:bg-none">
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 5mm 8mm;
          }
          html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            background: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .remito-container {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          /* Clean Table Styles */
          table { width: 100%; border-collapse: collapse; }
          th { font-weight: 800; text-transform: uppercase; color: #475569; border-bottom: 2px solid #e2e8f0; }
          td { border-bottom: 1px solid #f1f5f9; padding: 4px 6px; font-size: 9pt; vertical-align: top; }
          tr:last-child td { border-bottom: none; }
          
          /* Utility overrides for print */
          .text-blue-600 { color: #2563eb !important; }
          .border-blue-600 { border-color: #2563eb !important; }
          .bg-blue-50 { background-color: #eff6ff !important; }
          
          .text-emerald-600 { color: #059669 !important; }
          .border-emerald-600 { border-color: #059669 !important; }
          .bg-emerald-50 { background-color: #ecfdf5 !important; }
          
          .bg-slate-900 { background-color: #0f172a !important; color: white !important; }
          .bg-slate-100 { background-color: #f1f5f9 !important; }
        }
      `}</style>

      <div className="remito-container">
        
        {/* === TOP SECTION === */}
        <div>
          {/* HEADER */}
          <header className="flex justify-between items-start border-b border-slate-200 pb-4 mb-4">
            {/* Company Info */}
            <div className="w-[45%]">
              <h1 className="text-3xl font-black tracking-tighter text-slate-900 uppercase leading-none">{company.name} S.A.</h1>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Logística & Distribución Automotriz</p>
              <div className="mt-3 text-[8px] text-slate-600 space-y-0.5 leading-tight font-medium">
                <p>Ruta Nac. 11 KM 456 - Sauce Viejo (SF)</p>
                <p>IVA RESPONSABLE INSCRIPTO</p>
                <p>C.U.I.T: 30-71458922-1</p>
              </div>
            </div>

            {/* R Box */}
            <div className="flex flex-col items-center justify-center">
               <div className="w-14 h-14 border-2 border-slate-900 rounded-lg flex flex-col items-center justify-center bg-slate-50">
                  <span className="text-4xl font-black leading-none mt-1">R</span>
                  <span className="text-[6px] font-bold">COD. 91</span>
               </div>
            </div>

            {/* Document Details */}
            <div className="w-[45%] text-right">
               <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">REMITO</h2>
               <p className="text-[8px] font-bold text-slate-400 uppercase mb-2">Documento no válido como factura</p>
               
               <div className="inline-block text-right bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <div className="flex justify-end items-baseline gap-2 mb-1">
                     <span className="text-[9px] font-bold text-slate-500 uppercase">N° Comprobante</span>
                     <span className="text-lg font-mono font-black text-slate-900">{movement.id}</span>
                  </div>
                  <div className="flex justify-end items-center gap-2">
                     <span className="text-[9px] font-bold text-slate-500 uppercase">Fecha Emisión</span>
                     <span className="text-sm font-bold text-slate-900">{new Date(movement.date).toLocaleDateString('es-AR')}</span>
                  </div>
               </div>
            </div>
          </header>

          {/* LOGISTICS GRID */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* RUTA (Blue Accent) */}
            <div className="border-l-4 border-blue-600 bg-blue-50/50 p-3 rounded-r-xl">
               <h3 className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <MapPin size={12} strokeWidth={2.5} /> Ruta de Tráfico
               </h3>
               <div className="space-y-3">
                  <div>
                     <p className="text-[8px] font-bold text-slate-400 uppercase">Origen</p>
                     <p className="text-xs font-bold text-slate-900 uppercase truncate leading-tight">
                        {origin?.name || LOCATION_MAP[movement.originId] || movement.originId}
                     </p>
                     <p className="text-[8px] text-slate-500 truncate">{origin?.address || 'Planta Logística'}</p>
                  </div>
                  <div className="border-t border-blue-200/50 pt-2">
                     <p className="text-[8px] font-bold text-slate-400 uppercase">Destino</p>
                     <p className="text-xs font-bold text-slate-900 uppercase truncate leading-tight">
                        {destination?.name || LOCATION_MAP[movement.destinationId] || movement.destinationId}
                     </p>
                     <p className="text-[8px] text-slate-500 truncate">{destination?.address || 'Sucursal Destino'}</p>
                  </div>
               </div>
            </div>

            {/* TRANSPORTE (Green Accent) */}
            <div className="border-l-4 border-emerald-600 bg-emerald-50/50 p-3 rounded-r-xl">
               <h3 className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Truck size={12} strokeWidth={2.5} /> Logística & Transporte
               </h3>
               <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                     <p className="text-[8px] font-bold text-slate-400 uppercase">Empresa Carrier</p>
                     <p className="text-xs font-bold text-slate-900 uppercase truncate">{movement.transporter || 'Logística Propia'}</p>
                  </div>
                  <div>
                     <p className="text-[8px] font-bold text-slate-400 uppercase">Conductor</p>
                     <p className="text-[10px] font-bold text-slate-900 uppercase truncate">{movement.driverName || '-'}</p>
                  </div>
                  <div>
                     <p className="text-[8px] font-bold text-slate-400 uppercase">DNI</p>
                     <p className="text-[10px] font-mono font-bold text-slate-900">{driverDni || '-'}</p>
                  </div>
                  <div>
                     <p className="text-[8px] font-bold text-slate-400 uppercase">Patente Tractor</p>
                     <p className="text-[10px] font-mono font-bold text-slate-900 bg-white border border-emerald-100 rounded px-1 w-fit">
                        {truckPlate || '-'}
                     </p>
                  </div>
                  <div>
                     <p className="text-[8px] font-bold text-slate-400 uppercase">Patente Acoplado</p>
                     <p className="text-[10px] font-mono font-bold text-slate-900 bg-white border border-emerald-100 rounded px-1 w-fit">
                        {trailerPlate || '-'}
                     </p>
                  </div>
               </div>
            </div>
          </div>

          {/* TABLE */}
          <div className="mb-4">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50">
                  <th className="py-2 px-2 w-[5%] text-center">#</th>
                  <th className="py-2 px-2 w-[20%]">Identificación (VIN)</th>
                  <th className="py-2 px-2 w-[30%]">Unidad (Marca - Modelo)</th>
                  <th className="py-2 px-2 w-[15%]">Color</th>
                  <th className="py-2 px-2 w-[30%]">Observaciones Técnicas</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((v, i) => (
                  <tr key={v.vin}>
                    <td className="text-center font-bold text-slate-400">{i + 1}</td>
                    <td className="font-mono font-bold text-slate-900">{v.vin}</td>
                    <td>
                      <div className="font-bold text-slate-800 uppercase text-[10px] leading-tight">
                        {v.brand} {v.model}
                      </div>
                      <div className="text-[8px] font-bold text-slate-500 uppercase">{v.type === 'NEW' ? '0KM' : 'USADO'} — {v.year}</div>
                    </td>
                    <td className="font-bold text-slate-600 text-[10px] uppercase">{v.color}</td>
                    <td className="text-[9px] font-medium text-slate-500 italic leading-tight">
                      {unitObservations?.[v.vin] || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* === BOTTOM SECTION === */}
        <div>
          {/* OBSERVACIONES BOX */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-6 min-h-[60px]">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2">
               <FileText size={10} /> Observaciones Generales
            </p>
            <p className="text-[10px] text-slate-700 font-medium leading-snug">
              {movement.observations || 'Sin observaciones adicionales declaradas en la emisión.'}
            </p>
          </div>

          {/* SIGNATURES */}
          <div className="grid grid-cols-3 gap-8 mb-6 h-[80px] items-end">
            <div className="border-t border-slate-300 pt-2 text-center">
               <p className="text-[9px] font-black text-slate-900 uppercase">Gestión Logística</p>
               <p className="text-[8px] text-slate-500 uppercase">Firma y Aclaración</p>
            </div>
            <div className="border-t border-slate-300 pt-2 text-center">
               <p className="text-[9px] font-black text-slate-900 uppercase">Transportista</p>
               <p className="text-[8px] text-slate-500 uppercase">Conformidad de Carga</p>
            </div>
            <div className="border-t border-slate-300 pt-2 text-center">
               <p className="text-[9px] font-black text-slate-900 uppercase">Recepción Sucursal</p>
               <p className="text-[8px] text-slate-500 uppercase">Control de Arribo</p>
            </div>
          </div>

          {/* FOOTER */}
          <footer className="flex items-end justify-between border-t-2 border-slate-900 pt-3">
            <div className="flex items-center gap-3">
               <div className="bg-white p-1 border border-slate-200 rounded">
                  <img src={qrUrl} alt="QR" className="w-[50px] h-[50px]" />
               </div>
               <div>
                  <p className="text-[10px] font-black text-slate-900 uppercase tracking-wide">NATION S.A. LOGISTICS SYSTEM</p>
                  <p className="text-[7px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                    Control de Seguridad & Trazabilidad
                  </p>
                  <p className="text-[6px] text-slate-400 mt-1 max-w-[350px] leading-tight uppercase">
                    La tenencia de este documento implica responsabilidad sobre la carga descrita. 
                    Código Penal Art. 292/296. Documento generado electrónicamente.
                  </p>
               </div>
            </div>
            <div className="text-right">
               <p className="text-[9px] font-black text-slate-900 uppercase">CAI N°: 224587789541</p>
               <p className="text-[9px] font-bold text-slate-500 uppercase">Vencimiento: 31/12/2030</p>
               <div className="mt-1 px-2 py-0.5 bg-slate-900 text-white text-[7px] font-black uppercase rounded inline-block tracking-widest">
                  Original: Cliente
               </div>
            </div>
          </footer>
        </div>

      </div>
    </div>
  );
};
