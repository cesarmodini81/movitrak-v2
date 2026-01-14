
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

  return (
    <div className="bg-white text-black font-sans p-0 m-0 leading-tight">
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 5mm 10mm;
          }
          body {
            margin: 0;
            padding: 0;
            background: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            width: 100%;
            height: 100%;
          }
          .remito-container {
            width: 100%;
            height: 100%;
            position: relative;
            display: flex;
            flex-direction: column;
          }
          .no-print { display: none !important; }
          * { box-sizing: border-box; }
        }

        .header-grid {
          display: grid;
          grid-template-columns: 1fr 80px 1fr;
          border-bottom: 2px solid black;
          padding-bottom: 10px;
          margin-bottom: 10px;
        }

        .box-r {
          border: 2px solid black;
          width: 60px;
          height: 60px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          background: white;
          margin: 0 auto;
        }

        .data-box {
          border: 1px solid black;
          margin-bottom: 10px;
        }

        .data-row {
          border-bottom: 1px solid black;
          display: flex;
        }
        .data-row:last-child { border-bottom: none; }

        .data-col {
          padding: 4px 8px;
          border-right: 1px solid black;
        }
        .data-col:last-child { border-right: none; }

        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 10pt;
        }
        
        th {
          background-color: #f0f0f0;
          border: 1px solid black;
          padding: 4px;
          font-weight: 800;
          text-transform: uppercase;
        }

        td {
          border: 1px solid black;
          padding: 4px;
        }

        .watermark {
          position: absolute;
          top: 40%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-45deg);
          font-size: 100px;
          font-weight: 900;
          color: rgba(0, 0, 0, 0.03);
          text-transform: uppercase;
          pointer-events: none;
          z-index: 0;
          white-space: nowrap;
        }
      `}</style>

      <div className="remito-container relative z-10">
        <div className="watermark">{company.name}</div>

        {/* HEADER */}
        <header className="header-grid relative">
          {/* Left: Company Info */}
          <div className="pt-2">
            <h1 className="text-2xl font-black uppercase tracking-tighter">{company.name} S.A.</h1>
            <p className="text-[9px] font-bold uppercase mt-1">Logística & Distribución Automotriz</p>
            <div className="mt-2 text-[8px] font-medium uppercase leading-snug">
              <p>Domicilio: Ruta 11 KM 456 - Sauce Viejo</p>
              <p>Santa Fe - Argentina</p>
              <p>IVA RESPONSABLE INSCRIPTO</p>
            </div>
          </div>

          {/* Center: R Box */}
          <div className="relative pt-2">
            <div className="box-r">
              <span className="text-4xl leading-none mt-1">R</span>
              <span className="text-[7px] font-bold">COD. 91</span>
            </div>
            <div className="absolute top-[30px] left-1/2 w-[2px] h-[70px] bg-black -translate-x-1/2 -z-10 hidden"></div>
          </div>

          {/* Right: Document Info */}
          <div className="text-right pt-2">
            <h2 className="text-xl font-black uppercase tracking-tight">REMITO</h2>
            <p className="text-[9px] font-bold uppercase mb-2">DOCUMENTO NO VÁLIDO COMO FACTURA</p>
            
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase">N° Comp:</span>
                <span className="text-xl font-mono font-bold">{movement.id}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase">Fecha:</span>
                <span className="text-sm font-mono font-bold">{new Date(movement.date).toLocaleDateString('es-AR')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase">Hora:</span>
                <span className="text-sm font-mono font-bold">{new Date(movement.date).toLocaleTimeString('es-AR', {hour: '2-digit', minute:'2-digit'})} Hs</span>
              </div>
            </div>
            <div className="mt-2 text-[8px] font-medium uppercase">
              <p>CUIT: 30-71458922-1</p>
              <p>Ing. Brutos: 30-71458922-1</p>
            </div>
          </div>
        </header>

        {/* INFO BOXES GRID */}
        <div className="grid grid-cols-2 gap-0 border border-black mb-4">
          
          {/* Left Box: RUTA */}
          <div className="border-r border-black p-0">
            <div className="bg-gray-100 border-b border-black px-2 py-1">
              <p className="text-[9px] font-black uppercase">ORIGEN Y DESTINO</p>
            </div>
            <div className="p-2 space-y-3">
              <div>
                <p className="text-[7px] font-bold uppercase text-gray-500">PUNTO DE EMISIÓN (ORIGEN)</p>
                <p className="text-xs font-bold uppercase">{origin?.name || LOCATION_MAP[movement.originId] || movement.originId}</p>
                <p className="text-[8px] uppercase">{origin?.address || 'Base Operativa'}</p>
              </div>
              <div>
                <p className="text-[7px] font-bold uppercase text-gray-500">PUNTO DE ENTREGA (DESTINO)</p>
                <p className="text-xs font-bold uppercase">{destination?.name || LOCATION_MAP[movement.destinationId] || movement.destinationId}</p>
                <p className="text-[8px] uppercase">{destination?.address || 'Sucursal Destino'}</p>
              </div>
            </div>
          </div>

          {/* Right Box: TRANSPORTE */}
          <div className="p-0">
            <div className="bg-gray-100 border-b border-black px-2 py-1">
              <p className="text-[9px] font-black uppercase">EMPRESA TRANSPORTISTA</p>
            </div>
            <div className="p-2">
              <div className="flex justify-between items-baseline border-b border-dotted border-black mb-1 pb-1">
                <span className="text-[9px] font-bold uppercase">Razón Social:</span>
                <span className="text-[10px] font-bold uppercase">{movement.transporter || 'PROPIO'}</span>
              </div>
              <div className="flex justify-between items-baseline border-b border-dotted border-black mb-1 pb-1">
                <span className="text-[9px] font-bold uppercase">Conductor:</span>
                <span className="text-[10px] font-bold uppercase">{movement.driverName || '-'}</span>
              </div>
              <div className="flex justify-between items-baseline border-b border-dotted border-black mb-2 pb-1">
                <span className="text-[9px] font-bold uppercase">DNI:</span>
                <span className="text-[10px] font-mono font-bold">{driverDni || '-'}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="border border-black p-1 text-center">
                  <p className="text-[7px] font-bold uppercase">Dominio Tractor</p>
                  <p className="text-xs font-mono font-bold">{truckPlate || '-'}</p>
                </div>
                <div className="border border-black p-1 text-center">
                  <p className="text-[7px] font-bold uppercase">Dominio Acoplado</p>
                  <p className="text-xs font-mono font-bold">{trailerPlate || '-'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="flex-grow mb-4">
          <table className="w-full">
            <thead>
              <tr>
                <th className="w-[5%] text-center">#</th>
                <th className="w-[20%] text-left">VIN / CHASIS</th>
                <th className="w-[30%] text-left">UNIDAD (MARCA - MODELO)</th>
                <th className="w-[15%] text-center">COLOR</th>
                <th className="w-[30%] text-left">OBSERVACIONES / SALVADES</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v, i) => (
                <tr key={v.vin}>
                  <td className="text-center font-bold">{i + 1}</td>
                  <td className="font-mono font-bold text-[11px] uppercase tracking-wide">{v.vin}</td>
                  <td className="font-bold text-[10px] uppercase">
                    {v.brand} {v.model} {v.type === 'NEW' ? '0KM' : 'USD'}
                  </td>
                  <td className="text-center text-[9px] uppercase font-bold">{v.color}</td>
                  <td className="text-[9px] uppercase italic">
                    {unitObservations?.[v.vin] || 'SIN NOVEDADES VISIBLES'}
                  </td>
                </tr>
              ))}
              {/* Fill empty rows to maintain layout structure */}
              {vehicles.length < 12 && Array.from({length: 12 - vehicles.length}).map((_, i) => (
                <tr key={`empty-${i}`} style={{ height: '24px' }}>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* OBSERVACIONES GENERALES */}
        <div className="border border-black p-2 mb-4 h-[60px]">
          <p className="text-[8px] font-black uppercase underline mb-1">OBSERVACIONES GENERALES:</p>
          <p className="text-[9px] uppercase font-medium">
            {movement.observations || 'EL TRANSPORTISTA DECLARA HABER RECIBIDO LAS UNIDADES EN CONFORMIDAD Y EN EL ESTADO DETALLADO.'}
          </p>
        </div>

        {/* FOOTER & FIRMAS */}
        <footer className="mt-auto">
          <div className="grid grid-cols-3 gap-8 mb-6">
            <div className="text-center pt-8 border-t border-black border-dotted relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[1px] w-2/3 border-t border-black"></div>
              <p className="text-[9px] font-black uppercase">AUTORIZÓ DESPACHO</p>
              <p className="text-[8px] uppercase font-bold text-gray-500">NATION S.A.</p>
            </div>
            <div className="text-center pt-8 border-t border-black border-dotted relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[1px] w-2/3 border-t border-black"></div>
              <p className="text-[9px] font-black uppercase">FIRMA TRANSPORTISTA</p>
              <p className="text-[8px] uppercase font-bold text-gray-500">ACLARACIÓN / DNI</p>
            </div>
            <div className="text-center pt-8 border-t border-black border-dotted relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[1px] w-2/3 border-t border-black"></div>
              <p className="text-[9px] font-black uppercase">RECIBIÓ CONFORME</p>
              <p className="text-[8px] uppercase font-bold text-gray-500">SUCURSAL DESTINO</p>
            </div>
          </div>

          <div className="border-t-2 border-black pt-2 flex items-end justify-between">
            <div className="flex items-center gap-2">
               <div className="border border-black p-1">
                  <img src={qrUrl} alt="QR" className="w-[50px] h-[50px]" />
               </div>
               <div>
                  <p className="text-[10px] font-black italic uppercase">NATION S.A. LOGISTICS</p>
                  <p className="text-[7px] font-bold text-gray-500 uppercase">SISTEMA INTEGRAL MOVITRAK v2.0</p>
                  <p className="text-[6px] text-gray-400 mt-1 max-w-[300px] leading-tight text-justify uppercase">
                    El presente documento certifica el traslado físico de unidades. No constituye título de propiedad.
                    La tenencia de este documento implica responsabilidad sobre la carga transportada.
                  </p>
               </div>
            </div>
            <div className="text-right">
               <p className="text-[9px] font-black uppercase">CAI: 224587789541</p>
               <p className="text-[9px] font-black uppercase">VTO: 31/12/2030</p>
               <p className="text-[8px] font-mono mt-1 text-gray-500">TOKEN: {movement.id.split('-')[1]}-{Date.now().toString().slice(-4)}</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
