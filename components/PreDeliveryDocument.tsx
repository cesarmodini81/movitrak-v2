import React from 'react';
import { Vehicle, Company } from '../types';
import { ShieldCheck, CheckSquare, FileText } from 'lucide-react';

interface Props {
  vehicles: Vehicle[];
  company: Company;
}

export const PreDeliveryDocument: React.FC<Props> = ({ vehicles, company }) => {
  return (
    <div className="w-full flex justify-center bg-white print:block">
      <style>{`
        @page {
          size: A4 landscape;
          margin: 10mm 15mm !important;
        }

        /* Screen Preview Styling */
        .pdf-preview-wrapper {
          display: flex;
          justify-content: center;
          width: 100%;
          background-color: transparent;
        }

        .pdf-page-canvas {
          width: 297mm;
          min-height: 210mm;
          background-color: white;
          padding: 10mm;
          box-sizing: border-box;
          position: relative;
          transform: scale(0.9);
          transform-origin: top center;
        }

        @media (max-width: 1280px) { .pdf-page-canvas { transform: scale(0.7); } }
        @media (max-width: 1024px) { .pdf-page-canvas { transform: scale(0.6); } }
        @media (max-width: 768px) { .pdf-page-canvas { transform: scale(0.4); } }

        /* Print Specifics - Critical Section */
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }
          .pdf-preview-wrapper {
            display: block !important;
            width: 100% !important;
            height: auto !important;
            padding: 0 !important;
            margin: 0 !important;
            transform: none !important;
          }
          .pdf-page-canvas {
            transform: none !important;
            width: 100% !important;
            min-height: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            margin: 0 !important;
            border: none !important;
            display: block !important;
          }
          .main-container {
            border-width: 2px !important;
            min-height: auto !important;
            padding: 10px !important;
          }
          table {
            width: 100% !important;
            font-size: 10pt !important;
            border-collapse: collapse !important;
          }
          th, td {
            padding: 6px !important;
          }
          thead {
            display: table-header-group !important;
          }
          tr {
            page-break-inside: avoid !important;
            page-break-after: auto !important;
          }
          .no-print {
            display: none !important;
          }
          .print-header {
            margin-bottom: 20px !important;
          }
          .signature-box {
            margin-top: 30px !important;
          }
        }
      `}</style>
      
      <div className="pdf-preview-wrapper print:block">
        <div className="pdf-page-canvas font-sans text-slate-900 print:p-0 print:m-0">
          {/* Main Border Container */}
          <div className="main-container border-[3px] border-slate-900 p-6 h-full flex flex-col min-h-[190mm] relative bg-white">
            
            {/* Header Section */}
            <div className="print-header flex justify-between items-center border-b-[3px] border-slate-900 pb-4 mb-6">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-slate-900 text-white rounded-lg">
                    <ShieldCheck size={20} strokeWidth={2.5} />
                 </div>
                 <h1 className="text-lg font-black uppercase tracking-tight leading-none text-slate-900">
                   PLANILLA TÉCNICA PDI · PROTOCOLO DE PRE-ENTREGA
                 </h1>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                 <span className="font-bold">{company.name}</span>
                 <span className="text-slate-300">|</span>
                 <span>FECHA: {new Date().toLocaleDateString()}</span>
              </div>
            </div>

            {/* Protocol Table */}
            <div className="flex-1">
              <table className="w-full border-collapse border-[2px] border-slate-900 text-sm">
                <thead className="bg-slate-900 text-white uppercase text-[9px] font-black tracking-[0.2em] text-left">
                  <tr>
                    <th className="p-3 border border-white/20 text-center w-12">POS</th>
                    <th className="p-3 border border-white/20 w-32">FECHA ENT.</th>
                    <th className="p-3 border border-white/20 w-48">MARCA / MODELO</th>
                    <th className="p-3 border border-white/20 w-56 text-center">CHASIS / VIN</th>
                    <th className="p-3 border border-white/20 w-40">DESTINO / CLIENTE</th>
                    <th className="p-3 border border-white/20">OBSERVACIONES TÉCNICAS</th>
                    <th className="p-3 border border-white/20 text-center w-20">V° B°</th>
                  </tr>
                </thead>
                <tbody className="divide-y-[2px] divide-slate-100">
                  {vehicles.length > 0 ? vehicles.map((v, idx) => (
                    <tr key={v.vin} className="bg-white">
                      <td className="p-3 border-x-[2px] border-slate-900 text-center font-black text-slate-400">{idx + 1}</td>
                      <td className="p-3 border-x-[2px] border-slate-100 font-mono font-black text-[10px]">{new Date(v.entryDate).toLocaleDateString()}</td>
                      <td className="p-3 border-x-[2px] border-slate-100 uppercase font-black tracking-tight text-xs">{v.brand} {v.model}</td>
                      <td className="p-3 border-x-[2px] border-slate-100 font-mono font-black tracking-[0.1em] text-center text-sm bg-slate-50">
                        {v.vin}
                      </td>
                      <td className="p-3 border-x-[2px] border-slate-100">
                        <div className="font-bold text-[10px] uppercase tracking-tighter truncate">
                           {v.locationId}
                        </div>
                      </td>
                      <td className="p-3 border-x-[2px] border-slate-100 relative min-h-[40px]">
                         <span className="text-[10px] font-bold text-slate-700 italic">{v.pdiComment || 'SIN NOVEDADES'}</span>
                      </td>
                      <td className="p-3 border-x-[2px] border-slate-900 text-center">
                         <div className={`w-8 h-8 border-[2px] rounded-lg mx-auto flex items-center justify-center transition-all ${v.preDeliveryConfirmed ? 'bg-slate-900 border-slate-900 text-white' : 'border-slate-200'}`}>
                            {v.preDeliveryConfirmed ? <CheckSquare size={16} /> : <span className="text-[8px] font-black text-slate-200">...</span>}
                         </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={7} className="p-24 text-center bg-slate-50/50">
                        <div className="flex flex-col items-center gap-4 opacity-30">
                           <FileText size={60} strokeWidth={1} />
                           <p className="italic font-black text-slate-400 text-2xl uppercase tracking-widest leading-none">
                             Sin unidades 0km pendientes
                           </p>
                        </div>
                      </td>
                    </tr>
                  )}
                  {/* Visual placeholders for empty table space */}
                  {vehicles.length > 0 && Array.from({ length: Math.max(0, 8 - vehicles.length) }).map((_, i) => (
                    <tr key={`empty-${i}`} className="h-12">
                      <td className="p-3 border-x-[2px] border-slate-900">&nbsp;</td>
                      <td className="p-3 border-x-[2px] border-slate-100">&nbsp;</td>
                      <td className="p-3 border-x-[2px] border-slate-100">&nbsp;</td>
                      <td className="p-3 border-x-[2px] border-slate-100">&nbsp;</td>
                      <td className="p-3 border-x-[2px] border-slate-100">&nbsp;</td>
                      <td className="p-3 border-x-[2px] border-slate-100 relative">
                         <div className="absolute inset-x-4 bottom-2 border-b border-dashed border-slate-100"></div>
                      </td>
                      <td className="p-3 border-x-[2px] border-slate-900 text-center">
                         <div className="w-8 h-8 border-[2px] border-slate-100 rounded-lg mx-auto"></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Signature Area */}
            <div className="signature-box mt-4 pt-4 border-t-[3px] border-slate-900 grid grid-cols-3 gap-12">
               <div className="text-center">
                  <div className="h-20 border-b-[2px] border-slate-900 mb-2 relative"></div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-900 leading-tight">Responsable Técnico PDI</p>
               </div>
               <div className="text-center">
                  <div className="h-20 border-b-[2px] border-slate-900 mb-2"></div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-900 leading-tight">Operaciones Logísticas</p>
               </div>
               <div className="text-center">
                  <div className="h-20 border-b-[2px] border-slate-900 mb-2 relative"></div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-900 leading-tight">Certificación Oficial</p>
               </div>
            </div>

            {/* Document Traceability */}
            <div className="mt-4 flex justify-between items-end border-t border-slate-100 pt-2">
               <div className="max-w-4xl">
                 <p className="text-[8px] text-slate-400 font-bold uppercase tracking-[0.2em] leading-relaxed italic">
                   Documento oficial de control generado por MOVITRAK. El firmante garantiza la verificación técnica exhaustiva de la unidad.
                 </p>
               </div>
               <div className="text-right">
                  <p className="text-[9px] font-mono font-black text-slate-900 uppercase bg-slate-100 px-2 py-1 rounded border border-slate-200">
                    ID VALIDACIÓN: {Date.now().toString().slice(-8)}
                  </p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
