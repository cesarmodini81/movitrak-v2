import React from 'react';
import { Vehicle, Company } from '../types';
import { ShieldCheck, CheckSquare, FileText } from 'lucide-react';

interface Props {
  vehicles: Vehicle[];
  company: Company;
}

export const PreDeliveryDocument: React.FC<Props> = ({ vehicles, company }) => {
  return (
    <div className="w-full flex justify-center">
      <style>{`
        @page {
          size: A4 landscape;
          margin: 0;
        }

        /* Canvas dimensions for A4 Landscape */
        .pdf-page-canvas {
          width: 297mm;
          min-height: 210mm;
          background-color: white;
          padding: 10mm;
          box-sizing: border-box;
          position: relative;
        }

        /* Preview Scaling Wrapper */
        .pdf-preview-wrapper {
          display: flex;
          justify-content: center;
          transform: scale(0.9);
          transform-origin: top center;
          transition: transform 0.3s ease;
          width: 100%;
        }

        @media (max-width: 1200px) {
          .pdf-preview-wrapper { transform: scale(0.7); }
        }
        @media (max-width: 800px) {
          .pdf-preview-wrapper { transform: scale(0.5); }
        }

        @media print {
          @page { size: A4 landscape; margin: 0; }
          body { -webkit-print-color-adjust: exact; margin: 0; padding: 0; background: white !important; }
          
          /* Reset wrapper scaling for print */
          .pdf-preview-wrapper {
            transform: none !important;
            display: block !important;
            width: 100% !important;
            height: 100% !important;
          }
          
          .pdf-page-canvas {
            margin: 0 !important;
            width: 297mm !important;
            min-height: 210mm !important;
            padding: 10mm !important;
            box-shadow: none !important;
            border: none !important;
            page-break-after: always;
          }

          /* Hide UI elements */
          .no-print { display: none !important; }
        }
      `}</style>
      
      <div className="pdf-preview-wrapper">
        <div className="pdf-page-canvas font-sans text-slate-900">
          {/* Outer Container with High-Contrast Border */}
          <div className="border-[3px] border-slate-900 p-6 h-full flex flex-col min-h-[190mm] relative">
            
            {/* Header Branding Section - REDESIGNED: Single Line, Compact */}
            <div className="flex justify-between items-center border-b-[3px] border-slate-900 pb-4 mb-6">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-slate-900 text-white rounded-lg print:bg-black">
                    <ShieldCheck size={20} strokeWidth={2.5} />
                 </div>
                 <h1 className="text-lg font-black uppercase tracking-tight leading-none text-slate-900">
                   PLANILLA TÉCNICA PDI · PROTOCOLO DE PRE-ENTREGA
                 </h1>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                 <span>{company.name}</span>
                 <span className="text-slate-300">|</span>
                 <span>{new Date().toLocaleDateString()}</span>
              </div>
            </div>

            {/* Data Structured Grid */}
            <div className="flex-1">
              <table className="w-full border-collapse border-[2px] border-slate-900 text-sm">
                <thead>
                  <tr className="bg-slate-900 text-white uppercase text-[9px] font-black tracking-[0.2em] text-left print:bg-black print:text-white">
                    <th className="p-3 border border-white/20 text-center w-12">POS</th>
                    <th className="p-3 border border-white/20 w-32">Fecha Ent.</th>
                    <th className="p-3 border border-white/20 w-48">Marca / Modelo</th>
                    <th className="p-3 border border-white/20 w-56 text-center">Chasis / VIN</th>
                    <th className="p-3 border border-white/20 w-40">Destino / Cliente</th>
                    <th className="p-3 border border-white/20">Observaciones Técnicas</th>
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
                         <span className="text-[10px] font-bold text-slate-700 italic">{v.pdiComment}</span>
                      </td>
                      <td className="p-3 border-x-[2px] border-slate-900 text-center">
                         <div className={`w-8 h-8 border-[2px] rounded-lg mx-auto flex items-center justify-center transition-all ${v.preDeliveryConfirmed ? 'bg-slate-900 border-slate-900 text-white print:bg-black print:border-black' : 'border-slate-200'}`}>
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
                  {/* Maintain layout consistency */}
                  {vehicles.length > 0 && Array.from({ length: Math.max(0, 10 - vehicles.length) }).map((_, i) => (
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

            {/* Auditor & Signature Footer Section */}
            <div className="mt-4 pt-4 border-t-[3px] border-slate-900 grid grid-cols-3 gap-12">
               <div className="text-center">
                  <div className="h-16 border-b-[2px] border-slate-900 mb-2 relative"></div>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-900 leading-tight">Responsable Técnico PDI</p>
               </div>
               <div className="text-center">
                  <div className="h-16 border-b-[2px] border-slate-900 mb-2"></div>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-900 leading-tight">Operaciones Logísticas</p>
               </div>
               <div className="text-center">
                  <div className="h-16 border-b-[2px] border-slate-900 mb-2 relative"></div>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-900 leading-tight">Certificación Oficial</p>
               </div>
            </div>

            {/* Legal Traceability Statement */}
            <div className="mt-4 flex justify-between items-end border-t border-slate-100 pt-2">
               <div className="max-w-4xl">
                 <p className="text-[8px] text-slate-400 font-bold uppercase tracking-[0.2em] leading-relaxed italic">
                   Documento oficial de control. El firmante garantiza la verificación de los puntos de seguridad. USO EXCLUSIVO INTERNO.
                 </p>
               </div>
               <div className="text-right flex flex-col items-end">
                  <p className="text-[9px] font-mono font-black text-slate-900 uppercase bg-slate-100 px-2 py-1 rounded border border-slate-200">
                    ID: {Date.now().toString().slice(-8)}
                  </p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};