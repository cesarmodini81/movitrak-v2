
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

export const RemitoDocument: React.FC<Props> = ({ movement, company, vehicles, origin, destination, driverDni, truckPlate, trailerPlate, unitObservations }) => {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&bgcolor=ffffff&data=${movement.id}`;

  return (
    <div className="bg-white text-slate-900 font-sans p-0 m-0 border-0">
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
          .remito-wrapper {
            width: 210mm;
            min-height: 297mm;
            padding: 12mm 18mm;
            margin: 0 auto;
            box-sizing: border-box;
            position: relative;
            background: white !important;
          }
          .no-print { display: none !important; }
          * { break-inside: avoid; }
        }

        .watermark {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-35deg);
          font-size: 80px;
          font-weight: 900;
          color: rgba(226, 232, 240, 0.35);
          text-transform: uppercase;
          pointer-events: none;
          z-index: 0;
          white-space: nowrap;
          letter-spacing: 0.1em;
        }

        .table-remito th {
          background-color: #0f172a !important;
          color: white !important;
        }
      `}</style>

      <div className="remito-wrapper relative z-10 flex flex-col h-full bg-white">
        {/* Marca de Agua */}
        <div className="watermark">{company.name.toUpperCase()}</div>

        {/* Encabezado Corporativo NATION S.A. */}
        <header className="flex justify-between items-start border-b-[3px] border-slate-950 pb-6 mb-8 relative z-10">
          <div className="w-1/2">
            <h1 className="text-3xl font-black uppercase tracking-tighter italic leading-none text-slate-950">
              {company.name} S.A.
            </h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.25em] mt-2">Logística & Despacho Automotriz</p>
            <div className="mt-4 space-y-0.5">
              <p className="text-[9px] font-bold uppercase text-slate-700">CUIT: 30-71458922-1</p>
              <p className="text-[9px] font-bold uppercase text-slate-700">Planta Central: Ruta 11 KM 456 - Santa Fe</p>
            </div>
          </div>
          
          <div className="w-1/4 flex flex-col items-center">
            <div className="border-[3px] border-slate-950 w-14 h-14 flex items-center justify-center font-black text-4xl leading-none">R</div>
            <p className="text-[8px] font-black uppercase mt-1">Cód. 91 - Remito</p>
          </div>

          <div className="w-1/2 text-right">
            <h2 className="text-2xl font-black uppercase tracking-tight text-slate-950">Remito de Traslado</h2>
            <p className="font-mono font-black text-2xl leading-none mt-2 text-slate-900">Nº {movement.id}</p>
            <p className="text-[10px] font-black text-slate-400 mt-2 uppercase tracking-widest">Fecha: {new Date(movement.date).toLocaleDateString('es-AR')}</p>
          </div>
        </header>

        {/* Ruta Origen/Destino */}
        <div className="grid grid-cols-2 gap-6 mb-8 relative z-10">
          <div className="bg-slate-50 p-5 border-l-4 border-slate-900 rounded-r-xl">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 text-center">Punto de Despacho (Origen)</p>
            <p className="font-black text-slate-900 uppercase italic text-sm text-center">{origin?.name || LOCATION_MAP[movement.originId] || movement.originId}</p>
            <p className="text-[9px] font-bold text-slate-500 mt-1 uppercase text-center">{origin?.address || 'Base Operativa Principal'}</p>
          </div>
          <div className="bg-slate-50 p-5 border-l-4 border-emerald-600 rounded-r-xl">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 text-center">Punto de Recepción (Destino)</p>
            <p className="font-black text-slate-900 uppercase italic text-sm text-center">{destination?.name || LOCATION_MAP[movement.destinationId] || movement.destinationId}</p>
            <p className="text-[9px] font-bold text-slate-500 mt-1 uppercase text-center">{destination?.address || 'Sucursal Destino'}</p>
          </div>
        </div>

        {/* Transporte / Carrier */}
        <div className="bg-slate-950 text-white p-5 rounded-2xl grid grid-cols-3 gap-6 mb-8 shadow-md relative z-10">
          <div className="space-y-1">
            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Transportista</p>
            <p className="text-xs font-black uppercase text-white">{movement.transporter || 'UNIDAD PROPIA'}</p>
          </div>
          <div className="space-y-1 border-x border-white/10 px-4">
            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Chofer Responsable</p>
            <p className="text-xs font-black uppercase text-white">{movement.driverName || 'PERSONAL NATION'}</p>
            <p className="text-[9px] font-bold text-slate-400">DNI: {driverDni || '---'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Dominios (Camión/Acopl.)</p>
            <p className="text-xs font-black uppercase font-mono tracking-widest text-emerald-400">
               {truckPlate || '---'} / {trailerPlate || '---'}
            </p>
          </div>
        </div>

        {/* Tabla VIN/Modelo/Color */}
        <div className="flex-1 mb-8 relative z-10">
          <table className="w-full text-left border-collapse table-remito">
            <thead>
              <tr className="border-b-[3px] border-slate-950">
                <th className="p-3 text-[9px] font-black uppercase tracking-[0.1em] w-12 text-center">#</th>
                <th className="p-3 text-[9px] font-black uppercase tracking-[0.1em] w-48">VIN / Chasis</th>
                <th className="p-3 text-[9px] font-black uppercase tracking-[0.1em]">Unidad / Modelo / Color</th>
                <th className="p-3 text-[9px] font-black uppercase tracking-[0.1em] w-1/4">Obs. Técnicas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {vehicles.map((v, i) => (
                <tr key={v.vin} className="text-[10px]">
                  <td className="p-3 font-bold text-slate-400 text-center">{i + 1}</td>
                  <td className="p-3 font-mono font-black tracking-widest text-slate-900 bg-slate-50/50 uppercase">{v.vin}</td>
                  <td className="p-3">
                    <p className="font-black uppercase text-slate-950 leading-tight">{v.brand} {v.model}</p>
                    <p className="text-[8px] font-bold text-slate-500 uppercase mt-0.5 tracking-tighter">Color: {v.color} - {v.type === 'NEW' ? '0KM' : 'USADO'}</p>
                  </td>
                  <td className="p-3 italic text-slate-600 font-medium leading-tight">
                    {unitObservations?.[v.vin] || 'Inspección visual conforme.'}
                  </td>
                </tr>
              ))}
              {vehicles.length < 6 && Array.from({length: 6 - vehicles.length}).map((_, i) => (
                <tr key={`fill-${i}`} className="h-10 border-b border-slate-50">
                    <td className="p-3"></td>
                    <td className="p-3"></td>
                    <td className="p-3"></td>
                    <td className="p-3"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Observaciones Generales */}
        {movement.observations && (
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 mb-8 relative z-10">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Observaciones de Carga</p>
            <p className="text-[10px] font-bold text-slate-700 italic leading-relaxed">{movement.observations}</p>
          </div>
        )}

        {/* Firmas Responsables */}
        <footer className="grid grid-cols-3 gap-12 mt-auto pt-8 relative z-10">
          <div className="text-center">
            <div className="border-t-2 border-slate-900 pt-3">
              <p className="text-[8px] font-black uppercase tracking-[0.1em] text-slate-950 leading-none">Firma Autorizada Nation</p>
              <p className="text-[7px] text-slate-400 font-bold uppercase mt-1.5 tracking-widest italic">Responsable Despacho</p>
            </div>
          </div>
          <div className="text-center">
            <div className="border-t-2 border-slate-900 pt-3">
              <p className="text-[8px] font-black uppercase tracking-[0.1em] text-slate-950 leading-none">Firma Transportista</p>
              <p className="text-[7px] text-slate-400 font-bold uppercase mt-1.5 tracking-widest italic">Aceptación de Carga</p>
            </div>
          </div>
          <div className="text-center">
            <div className="border-t-2 border-slate-900 pt-3">
              <p className="text-[8px] font-black uppercase tracking-[0.1em] text-slate-950 leading-none">Firma Recepción Sucursal</p>
              <p className="text-[7px] text-slate-400 font-bold uppercase mt-1.5 tracking-widest italic">Responsable de Arribo</p>
            </div>
          </div>
        </footer>

        {/* Legal y QR */}
        <div className="mt-12 pt-6 border-t border-slate-100 flex justify-between items-end relative z-10">
          <div className="max-w-[75%]">
            <p className="text-[7px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 italic">Certificación de Trazabilidad Logística MOVITRAK v2.0</p>
            <p className="text-[6px] text-slate-400 leading-tight text-justify uppercase font-medium">
              Nota Legal: El presente documento constituye un manifiesto de traslado físico para fines logísticos internos. No acredita propiedad dominial ni transfiere riesgos de la unidad fuera de los establecidos por los seguros de carga vigentes. El transportista declara haber recibido las unidades en las condiciones técnicas descritas.
            </p>
            <p className="text-[7px] font-black text-slate-900 mt-2 tracking-widest uppercase">ID Validación: {movement.id.replace('REM-','')}_{Date.now().toString().slice(-4)}</p>
          </div>
          <div className="bg-white p-1 border border-slate-100 shadow-sm">
            <img src={qrUrl} alt="QR Validación" className="w-20 h-20" />
          </div>
        </div>
      </div>
    </div>
  );
};
