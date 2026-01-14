
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
  
  // Calcular filas vacías para llenar la hoja A4 (aprox 20-22 filas total para layout estándar)
  const MIN_ROWS = 22;
  const emptyRows = Math.max(0, MIN_ROWS - vehicles.length);

  return (
    <div className="bg-white text-black font-sans leading-none w-full h-full">
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
          .no-print { display: none !important; }
          * { box-sizing: border-box; }
          
          /* Table Borders Reset */
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid black; padding: 4px 6px; }
          
          /* Force exact black borders */
          .border-black { border-color: #000000 !important; }
          .border-t-black { border-top-color: #000000 !important; }
          .border-b-black { border-bottom-color: #000000 !important; }
          .border-l-black { border-left-color: #000000 !important; }
          .border-r-black { border-right-color: #000000 !important; }
        }
      `}</style>

      <div className="remito-container relative">
        
        {/* === TOP SECTION === */}
        <div>
          {/* HEADER */}
          <header className="flex border-b-2 border-black pb-2 mb-2">
            {/* Left: Company */}
            <div className="w-[45%] pr-2 border-r border-black relative">
              <h1 className="text-2xl font-black uppercase tracking-tighter mb-1">{company.name} S.A.</h1>
              <p className="text-[9px] font-bold uppercase tracking-wider mb-2">Logística & Distribución Automotriz</p>
              
              <div className="text-[8px] font-medium uppercase space-y-0.5 leading-tight">
                <p><strong>Domicilio Legal:</strong> Ruta Nac. 11 KM 456</p>
                <p>Sauce Viejo - Santa Fe (CP 3017)</p>
                <p><strong>Tel:</strong> 0800-888-6284</p>
                <p><strong>IVA:</strong> RESPONSABLE INSCRIPTO</p>
              </div>
            </div>

            {/* Center: R Box */}
            <div className="w-[10%] flex flex-col items-center justify-start pt-1 relative">
               <div className="w-[50px] h-[50px] border-2 border-black flex flex-col items-center justify-center bg-white z-10">
                  <span className="text-4xl font-black leading-none mt-1">R</span>
                  <span className="text-[6px] font-bold">COD. 91</span>
               </div>
               <div className="absolute top-[25px] bottom-[-10px] w-[1px] bg-black -z-0"></div>
            </div>

            {/* Right: Document Data */}
            <div className="w-[45%] pl-4 flex flex-col justify-between">
               <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight text-right">REMITO</h2>
                  <p className="text-[8px] font-bold uppercase text-right mb-2">DOCUMENTO NO VÁLIDO COMO FACTURA</p>
               </div>
               
               <div className="space-y-1">
                  <div className="flex justify-between items-baseline">
                     <span className="text-[10px] font-bold uppercase">N° Comp:</span>
                     <span className="text-xl font-mono font-bold">{movement.id}</span>
                  </div>
                  <div className="flex justify-between items-baseline border-b border-dotted border-black pb-0.5">
                     <span className="text-[10px] font-bold uppercase">Fecha Emisión:</span>
                     <span className="text-sm font-mono font-bold">{new Date(movement.date).toLocaleDateString('es-AR')}</span>
                  </div>
                  <div className="flex justify-between items-baseline border-b border-dotted border-black pb-0.5">
                     <span className="text-[10px] font-bold uppercase">CUIT:</span>
                     <span className="text-xs font-mono font-bold">30-71458922-1</span>
                  </div>
                  <div className="flex justify-between items-baseline border-b border-dotted border-black pb-0.5">
                     <span className="text-[10px] font-bold uppercase">Ingresos Brutos:</span>
                     <span className="text-xs font-mono font-bold">CM-921-845120</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                     <span className="text-[10px] font-bold uppercase">Inicio Actividad:</span>
                     <span className="text-xs font-mono font-bold">01/03/2010</span>
                  </div>
               </div>
            </div>
          </header>

          {/* INFO BOXES GRID */}
          <div className="border border-black mb-2 flex">
            {/* Left: Ruta */}
            <div className="w-1/2 border-r border-black">
               <div className="bg-gray-200 border-b border-black px-2 py-1">
                  <p className="text-[9px] font-black uppercase tracking-widest">DATOS DEL TRASLADO</p>
               </div>
               <div className="p-2 space-y-3">
                  <div>
                     <p className="text-[7px] font-bold uppercase text-gray-500 mb-0.5">ORIGEN (REMITENTE)</p>
                     <p className="text-[11px] font-bold uppercase truncate">{origin?.name || LOCATION_MAP[movement.originId] || movement.originId}</p>
                     <p className="text-[8px] uppercase text-gray-600 truncate">{origin?.address || 'Domicilio Planta Origen'}</p>
                  </div>
                  <div>
                     <p className="text-[7px] font-bold uppercase text-gray-500 mb-0.5">DESTINO (DESTINATARIO)</p>
                     <p className="text-[11px] font-bold uppercase truncate">{destination?.name || LOCATION_MAP[movement.destinationId] || movement.destinationId}</p>
                     <p className="text-[8px] uppercase text-gray-600 truncate">{destination?.address || 'Domicilio Sucursal Destino'}</p>
                  </div>
               </div>
            </div>

            {/* Right: Transporte */}
            <div className="w-1/2">
               <div className="bg-gray-200 border-b border-black px-2 py-1">
                  <p className="text-[9px] font-black uppercase tracking-widest">EMPRESA TRANSPORTISTA</p>
               </div>
               <div className="p-2">
                  <div className="flex justify-between items-end mb-1">
                     <span className="text-[9px] font-bold uppercase w-20">Razón Social:</span>
                     <span className="text-[10px] font-bold uppercase flex-1 border-b border-black">{movement.transporter || 'PROPIO'}</span>
                  </div>
                  <div className="flex justify-between items-end mb-1">
                     <span className="text-[9px] font-bold uppercase w-20">Chofer:</span>
                     <span className="text-[10px] font-bold uppercase flex-1 border-b border-black truncate">{movement.driverName || '-'}</span>
                  </div>
                  <div className="flex justify-between items-end mb-2">
                     <span className="text-[9px] font-bold uppercase w-20">DNI:</span>
                     <span className="text-[10px] font-mono font-bold flex-1 border-b border-black">{driverDni || '-'}</span>
                  </div>
                  
                  <div className="flex gap-2 mt-2">
                     <div className="flex-1 border border-black p-1 text-center">
                        <p className="text-[6px] font-bold uppercase">DOMINIO TRACTOR</p>
                        <p className="text-[11px] font-mono font-bold">{truckPlate || '-'}</p>
                     </div>
                     <div className="flex-1 border border-black p-1 text-center">
                        <p className="text-[6px] font-bold uppercase">DOMINIO ACOPLADO</p>
                        <p className="text-[11px] font-mono font-bold">{trailerPlate || '-'}</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          {/* TABLE HEADER */}
          <table className="w-full text-[9pt]">
            <thead>
              <tr className="bg-gray-100">
                <th className="w-[5%] text-center font-black">#</th>
                <th className="w-[20%] text-left font-black">VIN / CHASIS</th>
                <th className="w-[35%] text-left font-black">DETALLE UNIDAD (MARCA - MODELO)</th>
                <th className="w-[15%] text-center font-black">COLOR</th>
                <th className="w-[25%] text-left font-black">OBSERVACIONES</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v, i) => (
                <tr key={v.vin}>
                  <td className="text-center font-bold">{i + 1}</td>
                  <td className="font-mono font-bold text-[10px] uppercase tracking-wider">{v.vin}</td>
                  <td className="font-bold text-[9px] uppercase">
                    {v.brand} {v.model} {v.type === 'NEW' ? '0KM' : 'USD'}
                  </td>
                  <td className="text-center text-[8px] uppercase font-bold">{v.color}</td>
                  <td className="text-[8px] uppercase italic leading-tight">
                    {unitObservations?.[v.vin] || '-'}
                  </td>
                </tr>
              ))}
              {/* Fill Empty Rows to keep layout consistent */}
              {Array.from({ length: emptyRows }).map((_, i) => (
                <tr key={`empty-${i}`}>
                  <td className="text-center py-3">&nbsp;</td>
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
        <div className="mt-2">
          {/* OBSERVACIONES BOX */}
          <div className="border border-black p-2 mb-4 min-h-[50px]">
            <p className="text-[8px] font-black uppercase underline mb-1">OBSERVACIONES GENERALES / REMITOS ASOCIADOS:</p>
            <p className="text-[9px] uppercase font-medium leading-tight">
              {movement.observations || 'EL TRANSPORTISTA DECLARA HABER RECIBIDO LAS UNIDADES DETALLADAS EN PERFECTAS CONDICIONES APARENTES, SALVO LO INDICADO EN OBSERVACIONES.'}
            </p>
          </div>

          {/* SIGNATURES */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="border border-black h-[80px] relative p-1">
               <p className="text-[7px] font-bold uppercase absolute top-1 left-1">EMISIÓN / AUTORIZACIÓN</p>
               <div className="absolute bottom-6 left-4 right-4 border-b border-black border-dotted"></div>
               <p className="text-[8px] font-bold text-center absolute bottom-1 w-full uppercase">Firma y Sello Nation S.A.</p>
            </div>
            <div className="border border-black h-[80px] relative p-1">
               <p className="text-[7px] font-bold uppercase absolute top-1 left-1">TRANSPORTISTA</p>
               <div className="absolute bottom-6 left-4 right-4 border-b border-black border-dotted"></div>
               <p className="text-[8px] font-bold text-center absolute bottom-1 w-full uppercase">Firma, Aclaración y DNI</p>
            </div>
            <div className="border border-black h-[80px] relative p-1">
               <p className="text-[7px] font-bold uppercase absolute top-1 left-1">RECEPCIÓN CONFORME</p>
               <div className="absolute bottom-6 left-4 right-4 border-b border-black border-dotted"></div>
               <p className="text-[8px] font-bold text-center absolute bottom-1 w-full uppercase">Firma y Sello Sucursal</p>
            </div>
          </div>

          {/* FOOTER */}
          <footer className="flex items-end justify-between border-t-2 border-black pt-2">
            <div className="flex items-center gap-2">
               <div className="border border-black p-0.5">
                  <img src={qrUrl} alt="QR" className="w-[50px] h-[50px]" />
               </div>
               <div>
                  <p className="text-[10px] font-black italic uppercase">NATION S.A. LOGISTICS</p>
                  <p className="text-[7px] font-bold text-gray-500 uppercase tracking-widest">Sistema de Gestión Integral v2.0</p>
                  <p className="text-[6px] text-gray-500 mt-1 max-w-[350px] leading-tight text-justify uppercase">
                    La tenencia de este documento acredita el tránsito lícito de la mercadería. Código Penal Art. 292/296.
                    Las unidades viajan por cuenta y riesgo de la empresa transportista designada.
                  </p>
               </div>
            </div>
            <div className="text-right">
               <p className="text-[10px] font-black uppercase">CAI N°: 224587789541</p>
               <p className="text-[10px] font-black uppercase">VTO CAI: 31/12/2030</p>
               <p className="text-[9px] font-bold text-gray-600 mt-1">ORIGINAL: BLANCO / DUPLICADO: CLIENTE</p>
            </div>
          </footer>
        </div>

      </div>
    </div>
  );
};
