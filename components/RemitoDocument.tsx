
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
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&bgcolor=ffffff&data=${movement.id}`;

  return (
    <div className="bg-white text-black font-sans p-0 m-0">
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 0;
          }
          body {
            margin: 0;
            padding: 0;
            background: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .remito-traditional-wrapper {
            width: 210mm;
            min-height: 297mm;
            padding: 15mm 15mm;
            margin: 0 auto;
            box-sizing: border-box;
            position: relative;
            background: white !important;
            font-family: 'Inter', sans-serif;
          }
          .no-print { display: none !important; }
          * { break-inside: avoid; }
        }

        .watermark-trad {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-35deg);
          font-size: 70px;
          font-weight: 900;
          color: rgba(0, 0, 0, 0.04);
          text-transform: uppercase;
          pointer-events: none;
          z-index: 0;
          white-space: nowrap;
          letter-spacing: 0.2em;
        }

        .border-traditional {
          border: 1px solid black;
        }

        .table-trad {
          border-collapse: collapse;
          width: 100%;
        }
        
        .table-trad th, .table-trad td {
          border: 1px solid black;
          padding: 6px;
        }

        .type-r-box {
          border: 2px solid black;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          font-weight: 900;
          background: white;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          top: 15mm;
          z-index: 20;
        }
      `}</style>

      <div className="remito-traditional-wrapper relative z-10 flex flex-col h-full bg-white">
        {/* Marca de Agua (Small Caps Request) */}
        <div className="watermark-trad">{company.name.toUpperCase()}</div>

        {/* Caja de Identificación Tipo R (Fiscal/Logística Tradicional) */}
        <div className="type-r-box">R</div>

        {/* Encabezado Formal */}
        <header className="flex justify-between items-start border-b-2 border-black pb-4 mb-6 relative z-10">
          <div className="w-2/5">
            <h1 className="text-2xl font-black uppercase leading-tight">{company.name} S.A.</h1>
            <p className="text-[10px] font-bold uppercase tracking-wider mt-1">Logística & Despacho Automotriz</p>
            <div className="mt-4 space-y-0.5 text-[9px] font-medium uppercase">
              <p>CUIT: 30-71458922-1</p>
              <p>Ing. Brutos: 30-71458922-1</p>
              <p>Inicio Actividades: 01/01/1998</p>
              <p>Domicilio: Ruta 11 KM 456 - Sauce Viejo (S.F.)</p>
            </div>
          </div>

          <div className="w-2/5 text-right">
            <h2 className="text-xl font-black uppercase tracking-tight">Remito de Traslado</h2>
            <p className="text-lg font-mono font-bold mt-1 text-black">Nº {movement.id}</p>
            <div className="mt-4 space-y-0.5 text-[10px] font-bold uppercase">
              <p>Fecha de Emisión: <span className="font-mono">{new Date(movement.date).toLocaleDateString('es-AR')}</span></p>
              <p>Hora de Despacho: <span className="font-mono">{new Date(movement.date).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })} HS</span></p>
            </div>
          </div>
        </header>

        {/* Cajas de Datos Logísticos (Ruta y Transporte) */}
        <div className="grid grid-cols-2 gap-0 mb-6 relative z-10 border-traditional">
          {/* Columna Izquierda: RUTA */}
          <div className="p-4 border-r border-black">
            <p className="text-[10px] font-black uppercase mb-4 border-b border-black inline-block">Ruta de Tráfico Operativo</p>
            <div className="space-y-4">
              <div>
                <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Planta de Origen / Despachante</p>
                <p className="font-black text-xs uppercase italic">{origin?.name || LOCATION_MAP[movement.originId] || movement.originId}</p>
                <p className="text-[8px] uppercase mt-0.5">{origin?.address || 'Base Sauce Viejo'}</p>
              </div>
              <div>
                <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Punto de Arribo / Destino</p>
                <p className="font-black text-xs uppercase italic">{destination?.name || LOCATION_MAP[movement.destinationId] || movement.destinationId}</p>
                <p className="text-[8px] uppercase mt-0.5">{destination?.address || 'Sucursal de Recepción'}</p>
              </div>
            </div>
          </div>

          {/* Columna Derecha: TRANSPORTE */}
          <div className="p-4">
            <p className="text-[10px] font-black uppercase mb-4 border-b border-black inline-block">Datos de la Empresa Transportista</p>
            <div className="space-y-2 text-[10px]">
              <p className="flex justify-between border-b border-dotted border-black pb-1">
                <span className="font-bold uppercase">Empresa:</span>
                <span className="font-mono font-bold">{movement.transporter || 'UNIDAD PROPIA'}</span>
              </p>
              <p className="flex justify-between border-b border-dotted border-black pb-1">
                <span className="font-bold uppercase">Chofer:</span>
                <span className="font-mono">{movement.driverName || 'PERSONAL NATION'}</span>
              </p>
              <p className="flex justify-between border-b border-dotted border-black pb-1">
                <span className="font-bold uppercase">DNI N°:</span>
                <span className="font-mono">{driverDni || '---'}</span>
              </p>
              <div className="grid grid-cols-2 gap-4 mt-2">
                 <div className="text-center border border-black p-1">
                    <p className="text-[7px] font-bold uppercase mb-0.5">Patente Tractor</p>
                    <p className="font-mono font-bold text-xs">{truckPlate || '---'}</p>
                 </div>
                 <div className="text-center border border-black p-1">
                    <p className="text-[7px] font-bold uppercase mb-0.5">Patente Acoplado</p>
                    <p className="font-mono font-bold text-xs">{trailerPlate || '---'}</p>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabla de Manifiesto de Carga (Traditional Table) */}
        <div className="flex-1 mb-6 relative z-10">
          <table className="table-trad">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-[9px] font-black uppercase text-center w-8">#</th>
                <th className="text-[9px] font-black uppercase w-40">VIN / Chasis (Identif. de Unidad)</th>
                <th className="text-[9px] font-black uppercase">Unidad (Marca - Modelo - Versión)</th>
                <th className="text-[9px] font-black uppercase w-20 text-center">Color</th>
                <th className="text-[9px] font-black uppercase w-1/4">Obs. de Carga / Salvades</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v, i) => (
                <tr key={v.vin} className="text-[10px]">
                  <td className="text-center font-bold">{i + 1}</td>
                  <td className="font-mono font-black tracking-widest text-[11px] uppercase bg-gray-50/30">
                    {v.vin}
                  </td>
                  <td className="uppercase font-bold">
                    {v.brand} {v.model} {v.type === 'NEW' ? '0KM' : 'USD'}
                  </td>
                  <td className="text-center uppercase text-[9px]">{v.color}</td>
                  <td className="text-[9px] italic font-medium">
                    {unitObservations?.[v.vin] || 'Sin novedades técnicas.'}
                  </td>
                </tr>
              ))}
              {/* Filas vacías para completar el layout de tabla tradicional (mínimo 10 filas) */}
              {vehicles.length < 10 && Array.from({length: 10 - vehicles.length}).map((_, i) => (
                <tr key={`fill-${i}`} className="h-8">
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

        {/* Bloque de Observaciones Generales */}
        <div className="border-traditional p-4 mb-8 relative z-10 min-h-[80px]">
          <p className="text-[9px] font-black uppercase mb-1 underline">Observaciones Generales de la Operación:</p>
          <p className="text-[10px] font-medium leading-relaxed italic">
            {movement.observations || 'Unidades verificadas en planta según protocolo de auditoría visual. Transportista retira en conformidad.'}
          </p>
        </div>

        {/* Firmas Responsables (Three Columns) */}
        <footer className="grid grid-cols-3 gap-8 mt-auto pt-10 relative z-10">
          <div className="text-center">
            <div className="border-t border-black pt-2 px-2">
              <p className="text-[9px] font-black uppercase">Firma Autorizada Despacho</p>
              <p className="text-[7px] font-bold uppercase mt-1">Gestor Logístico {company.name}</p>
            </div>
          </div>
          <div className="text-center">
            <div className="border-t border-black pt-2 px-2">
              <p className="text-[9px] font-black uppercase">Firma Transportista</p>
              <p className="text-[7px] font-bold uppercase mt-1">Conformidad Retiro de Carga</p>
            </div>
          </div>
          <div className="text-center">
            <div className="border-t border-black pt-2 px-2">
              <p className="text-[9px] font-black uppercase">Recepción de Sucursal</p>
              <p className="text-[7px] font-bold uppercase mt-1">Responsable de Arribo</p>
            </div>
          </div>
        </footer>

        {/* Pie de Página con QR y Legal */}
        <div className="mt-12 pt-4 border-t border-black flex justify-between items-end relative z-10">
          <div className="max-w-[70%]">
             <div className="flex items-center gap-3 mb-2">
               <div className="font-black text-[12px] italic uppercase tracking-tighter">NATION S.A. LOGISTICS</div>
               <div className="text-[7px] font-black text-gray-400 uppercase tracking-widest">Movitrak Enterprise v2.0</div>
             </div>
             <p className="text-[6px] text-gray-500 leading-tight text-justify uppercase font-bold">
               Aviso Legal: El presente remito constituye un manifiesto de traslado físico interno. El transportista declara conocer y aceptar el estado técnico de las unidades detalladas. Documento emitido bajo protocolo de auditoría centralizada. El extravío del presente debe ser reportado a Gerencia Logística de inmediato.
             </p>
             <p className="text-[8px] font-black mt-2 tracking-widest uppercase">Validación de Sistema ID: {movement.id.replace('REM-','')}_{Date.now().toString().slice(-4)}</p>
          </div>
          
          <div className="flex flex-col items-center gap-1">
             <div className="border border-black p-1 bg-white">
                <img src={qrUrl} alt="QR Secure Track" className="w-16 h-16" />
             </div>
             <p className="text-[7px] font-black uppercase">Token Auditoría</p>
          </div>
        </div>
      </div>
    </div>
  );
};
