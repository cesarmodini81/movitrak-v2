
import React from 'react';
import { Movement, Vehicle, Company, Location } from '../types';
import { LOCATION_MAP } from '../constants';

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
  
  // Adjusted for A4 fit - typically 20 rows fit comfortably with headers/footers in 1 page
  const MIN_ROWS = 20; 
  const emptyRows = Math.max(0, MIN_ROWS - vehicles.length);

  return (
    <div className="bg-white text-black font-sans w-full h-full">
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 5mm;
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
            height: 100%; /* Important for flex justify-between */
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          .content-wrapper {
            flex-grow: 1;
          }
          /* Table Borders */
          table { border-collapse: collapse; width: 100%; table-layout: fixed; }
          th, td { border: 1px solid #000; padding: 2px 4px; font-size: 8pt; }
          
          /* Utility overrides for strict black printing */
          .border-black { border-color: #000000 !important; }
          .text-black { color: #000000 !important; }
          .bg-gray-200 { background-color: #e5e7eb !important; }
        }
      `}</style>

      <div className="remito-container p-2">
        
        {/* === CONTENT WRAPPER (Header + Data + Table) === */}
        <div className="content-wrapper">
          
          {/* HEADER */}
          <header className="flex border-b-2 border-black pb-1 mb-2 h-[110px]">
            {/* Left: Company */}
            <div className="w-[45%] pr-2 border-r border-black relative flex flex-col justify-center">
              <h1 className="text-2xl font-black uppercase tracking-tighter mb-0 leading-none">{company.name} S.A.</h1>
              <p className="text-[8px] font-bold uppercase tracking-wider mb-2">Logística & Distribución Automotriz</p>
              
              <div className="text-[7px] font-medium uppercase space-y-0.5 leading-tight">
                <p><strong>Domicilio Legal:</strong> Ruta Nac. 11 KM 456 - Sauce Viejo (SF)</p>
                <p><strong>Tel:</strong> 0800-888-6284 | <strong>IVA:</strong> RESPONSABLE INSCRIPTO</p>
                <p><strong>C.U.I.T:</strong> 30-71458922-1</p>
              </div>
            </div>

            {/* Center: R Box */}
            <div className="w-[10%] flex flex-col items-center justify-start pt-1 relative">
               <div className="w-[40px] h-[40px] border-2 border-black flex flex-col items-center justify-center bg-white z-10">
                  <span className="text-3xl font-black leading-none mt-0.5">R</span>
                  <span className="text-[5px] font-bold">COD. 91</span>
               </div>
               <div className="absolute top-[20px] bottom-[-5px] w-[1px] bg-black -z-0"></div>
            </div>

            {/* Right: Document Data */}
            <div className="w-[45%] pl-4 flex flex-col justify-between py-1">
               <div>
                  <h2 className="text-xl font-black uppercase tracking-tight text-right leading-none">REMITO</h2>
                  <p className="text-[7px] font-bold uppercase text-right mb-1">DOCUMENTO NO VÁLIDO COMO FACTURA</p>
               </div>
               
               <div className="space-y-0.5">
                  <div className="flex justify-between items-baseline">
                     <span className="text-[9px] font-bold uppercase">N° Comp:</span>
                     <span className="text-lg font-mono font-bold">{movement.id}</span>
                  </div>
                  <div className="flex justify-between items-baseline border-b border-dotted border-black">
                     <span className="text-[9px] font-bold uppercase">Fecha Emisión:</span>
                     <span className="text-xs font-mono font-bold">{new Date(movement.date).toLocaleDateString('es-AR')}</span>
                  </div>
                  <div className="flex justify-between items-baseline border-b border-dotted border-black">
                     <span className="text-[9px] font-bold uppercase">Ingresos Brutos:</span>
                     <span className="text-[9px] font-mono font-bold">CM-921-845120</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                     <span className="text-[9px] font-bold uppercase">Inicio Actividad:</span>
                     <span className="text-[9px] font-mono font-bold">01/03/2010</span>
                  </div>
               </div>
            </div>
          </header>

          {/* INFO BOXES GRID */}
          <div className="border border-black mb-2 flex h-[85px]">
            {/* Left: Ruta */}
            <div className="w-1/2 border-r border-black flex flex-col">
               <div className="bg-gray-200 border-b border-black px-2 py-0.5">
                  <p className="text-[8px] font-black uppercase tracking-widest">DATOS DEL TRASLADO</p>
               </div>
               <div className="p-1.5 space-y-1 flex-1">
                  <div>
                     <p className="text-[6px] font-bold uppercase text-gray-500 mb-0">ORIGEN</p>
                     <p className="text-[9px] font-bold uppercase truncate leading-none">{origin?.name || LOCATION_MAP[movement.originId] || movement.originId}</p>
                     <p className="text-[7px] uppercase text-gray-600 truncate">{origin?.address || 'Planta Logística'}</p>
                  </div>
                  <div className="border-t border-dotted border-gray-400 mt-1 pt-1">
                     <p className="text-[6px] font-bold uppercase text-gray-500 mb-0">DESTINO</p>
                     <p className="text-[9px] font-bold uppercase truncate leading-none">{destination?.name || LOCATION_MAP[movement.destinationId] || movement.destinationId}</p>
                     <p className="text-[7px] uppercase text-gray-600 truncate">{destination?.address || 'Sucursal Destino'}</p>
                  </div>
               </div>
            </div>

            {/* Right: Transporte */}
            <div className="w-1/2 flex flex-col">
               <div className="bg-gray-200 border-b border-black px-2 py-0.5">
                  <p className="text-[8px] font-black uppercase tracking-widest">TRANSPORTE</p>
               </div>
               <div className="p-1.5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-end mb-0.5">
                       <span className="text-[8px] font-bold uppercase w-16">Empresa:</span>
                       <span className="text-[9px] font-bold uppercase flex-1 border-b border-black leading-none">{movement.transporter || 'PROPIO'}</span>
                    </div>
                    <div className="flex justify-between items-end mb-0.5">
                       <span className="text-[8px] font-bold uppercase w-16">Chofer:</span>
                       <span className="text-[9px] font-bold uppercase flex-1 border-b border-black truncate leading-none">{movement.driverName || '-'}</span>
                    </div>
                    <div className="flex justify-between items-end">
                       <span className="text-[8px] font-bold uppercase w-16">DNI:</span>
                       <span className="text-[9px] font-mono font-bold flex-1 border-b border-black leading-none">{driverDni || '-'}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-1 mt-1">
                     <div className="flex-1 border border-black p-0.5 text-center">
                        <p className="text-[5px] font-bold uppercase">DOM. TRACTOR</p>
                        <p className="text-[9px] font-mono font-bold">{truckPlate || '-'}</p>
                     </div>
                     <div className="flex-1 border border-black p-0.5 text-center">
                        <p className="text-[5px] font-bold uppercase">DOM. ACOPLADO</p>
                        <p className="text-[9px] font-mono font-bold">{trailerPlate || '-'}</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          {/* TABLE */}
          <table className="w-full text-[8pt] mb-2">
            <thead>
              <tr className="bg-gray-200">
                <th className="w-[5%] text-center font-black py-1">#</th>
                <th className="w-[20%] text-left font-black py-1">VIN / CHASIS</th>
                <th className="w-[35%] text-left font-black py-1">UNIDAD (MARCA - MODELO)</th>
                <th className="w-[15%] text-center font-black py-1">COLOR</th>
                <th className="w-[25%] text-left font-black py-1">OBSERVACIONES</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v, i) => (
                <tr key={v.vin} className="h-[22px]">
                  <td className="text-center font-bold">{i + 1}</td>
                  <td className="font-mono font-bold text-[9px] uppercase tracking-wider">{v.vin}</td>
                  <td className="font-bold text-[8px] uppercase">
                    {v.brand} {v.model} {v.type === 'NEW' ? '0KM' : 'USD'}
                  </td>
                  <td className="text-center text-[7px] uppercase font-bold">{v.color}</td>
                  <td className="text-[7px] uppercase italic leading-tight truncate">
                    {unitObservations?.[v.vin] || '-'}
                  </td>
                </tr>
              ))}
              {/* Fill Empty Rows */}
              {Array.from({ length: emptyRows }).map((_, i) => (
                <tr key={`empty-${i}`} className="h-[22px]">
                  <td className="text-center">&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* === BOTTOM SECTION === */}
        <div className="mt-1">
          {/* OBSERVACIONES BOX */}
          <div className="border border-black p-1.5 mb-2 h-[45px]">
            <p className="text-[7px] font-black uppercase underline mb-0.5">OBSERVACIONES GENERALES:</p>
            <p className="text-[8px] uppercase font-medium leading-tight">
              {movement.observations || 'EL TRANSPORTISTA DECLARA HABER RECIBIDO LAS UNIDADES EN CONFORMIDAD.'}
            </p>
          </div>

          {/* SIGNATURES */}
          <div className="grid grid-cols-3 gap-2 mb-2 h-[70px]">
            <div className="border border-black relative p-1">
               <p className="text-[6px] font-bold uppercase absolute top-1 left-1">EMISIÓN</p>
               <div className="absolute bottom-5 left-2 right-2 border-b border-black border-dotted"></div>
               <p className="text-[6px] font-bold text-center absolute bottom-1 w-full uppercase">Firma Nation S.A.</p>
            </div>
            <div className="border border-black relative p-1">
               <p className="text-[6px] font-bold uppercase absolute top-1 left-1">TRANSPORTISTA</p>
               <div className="absolute bottom-5 left-2 right-2 border-b border-black border-dotted"></div>
               <p className="text-[6px] font-bold text-center absolute bottom-1 w-full uppercase">Firma / DNI</p>
            </div>
            <div className="border border-black relative p-1">
               <p className="text-[6px] font-bold uppercase absolute top-1 left-1">RECEPCIÓN</p>
               <div className="absolute bottom-5 left-2 right-2 border-b border-black border-dotted"></div>
               <p className="text-[6px] font-bold text-center absolute bottom-1 w-full uppercase">Firma / Sello</p>
            </div>
          </div>

          {/* FOOTER */}
          <footer className="flex items-end justify-between border-t-2 border-black pt-1">
            <div className="flex items-center gap-2">
               <div className="border border-black p-0.5">
                  <img src={qrUrl} alt="QR" className="w-[45px] h-[45px]" />
               </div>
               <div>
                  <p className="text-[9px] font-black italic uppercase">NATION S.A. LOGISTICS</p>
                  <p className="text-[6px] font-bold text-gray-500 uppercase tracking-widest">Sistema MOVITRAK v2.0</p>
                  <p className="text-[5px] text-gray-500 mt-0.5 max-w-[300px] leading-tight text-justify uppercase">
                    Documento de control interno. Código Penal Art. 292/296.
                    Las unidades viajan por cuenta y riesgo del transportista.
                  </p>
               </div>
            </div>
            <div className="text-right">
               <p className="text-[9px] font-black uppercase">CAI N°: 224587789541</p>
               <p className="text-[9px] font-black uppercase">VTO: 31/12/2030</p>
               <p className="text-[7px] font-bold text-gray-600 mt-0.5">ORIGINAL: BLANCO</p>
            </div>
          </footer>
        </div>

      </div>
    </div>
  );
};
