
import React from 'react';
import { Vehicle, Company } from '../types';

interface TravelSheetItem extends Vehicle {
  deliveryDate: string;
  deliveryLocationName: string;
}

interface Props {
  items: TravelSheetItem[];
  company: Company;
}

export const PlanillaViajesDocument: React.FC<Props> = ({ items, company }) => {
  return (
    <div className="w-full bg-white text-black font-sans overflow-visible">
      <style>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 10mm 15mm;
          }
          body {
            margin: 0;
            padding: 0;
            background: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print-container {
            width: 100%;
            position: static !important;
            display: block !important;
          }
          table {
            width: 100% !important;
            border-collapse: collapse !important;
            table-layout: fixed !important;
          }
          tr {
            page-break-inside: avoid !important;
          }
          th, td {
            word-break: break-word !important;
            border: 1px solid black !important;
          }
          .no-print {
            display: none !important;
          }
        }

        .table-header-black {
          background-color: #000000 !important;
          color: #ffffff !important;
        }

        .row-alternate {
          background-color: #f8fafc !important;
        }
      `}</style>

      <div className="print-container p-4">
        {/* Header Section */}
        <header className="flex justify-between items-end mb-6 border-b-4 border-black pb-4">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter leading-none">Planilla de Viajes</h1>
            <p className="text-sm font-bold text-gray-600 uppercase tracking-[0.25em] mt-1">Orden de Carga Logística</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-black uppercase italic leading-none">{company.name} S.A.</p>
            <p className="text-[10px] font-bold text-gray-500 uppercase mt-2">
              Emisión: <span className="font-mono text-black">{new Date().toLocaleDateString('es-AR')} {new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })} HS</span>
            </p>
          </div>
        </header>

        {/* Table Section */}
        <table className="w-full border-collapse border-2 border-black text-[10pt]">
          <thead>
            <tr className="table-header-black">
              <th className="p-2 text-center uppercase font-black" style={{ width: '5%' }}>#</th>
              <th className="p-2 text-left uppercase font-black" style={{ width: '20%' }}>VIN / Chasis</th>
              <th className="p-2 text-left uppercase font-black" style={{ width: '25%' }}>Unidad (Marca - Modelo)</th>
              <th className="p-2 text-center uppercase font-black" style={{ width: '15%' }}>Fecha Entrega</th>
              <th className="p-2 text-left uppercase font-black" style={{ width: '20%' }}>Ubicación Entrega</th>
              <th className="p-2 text-left uppercase font-black" style={{ width: '15%' }}>Obs. Técnicas</th>
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? items.map((v, idx) => (
              <tr key={v.vin} className={idx % 2 === 0 ? '' : 'row-alternate'}>
                <td className="p-2 text-center font-bold text-gray-500">{idx + 1}</td>
                <td className="p-2 font-mono font-bold tracking-wider">{v.vin}</td>
                <td className="p-2">
                  <div className="font-black uppercase">{v.brand} {v.model}</div>
                  <div className="text-[8pt] text-gray-600 uppercase italic">{v.color} — {v.year}</div>
                </td>
                <td className="p-2 text-center font-mono font-bold">
                  {new Date(v.deliveryDate).toLocaleDateString('es-AR')}
                </td>
                <td className="p-2 font-bold uppercase text-[9pt]">
                  {v.deliveryLocationName}
                </td>
                <td className="p-2 italic text-gray-700 text-[9pt] leading-tight">
                  {v.pdiComment || (v.type === 'USED' ? 'Unidad Usada - Peritaje OK' : 'Sin observaciones.')}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="p-10 text-center italic text-gray-400 uppercase font-bold">
                  No se registran unidades para la carga logística actual
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Footer Section */}
        <footer className="mt-8 flex justify-between items-center opacity-60">
          <div className="flex items-center gap-3">
            <div className="font-black text-sm italic uppercase tracking-tighter">NATION S.A. LOGISTICS</div>
            <div className="w-1 h-4 bg-black"></div>
            <div className="text-[8px] font-bold uppercase tracking-widest text-gray-500">Movitrak Enterprise v2.8.5</div>
          </div>
          <div className="text-[8px] font-black uppercase text-gray-400">
            Documento de control interno - Prohibida su alteración
          </div>
        </footer>
      </div>
    </div>
  );
};
