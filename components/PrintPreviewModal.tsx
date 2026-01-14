
import React from 'react';
import { X, Printer, Eye } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const PrintPreviewModal: React.FC<Props> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-slate-900/95 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Global Print Isolation Styles */}
      <style>{`
        @media print {
          /* Hide all elements by default */
          body * {
            visibility: hidden !important;
          }
          
          /* Unhide the preview container and every child within it */
          #print-preview-container, #print-preview-container * {
            visibility: visible !important;
          }

          /* Force the container to the top-left of the physical page */
          #print-preview-container {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }

          /* Ensure body doesn't add margins or backgrounds */
          body {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          /* Explicitly hide the toolbar/UI of the modal */
          .no-print-toolbar {
            display: none !important;
          }
          
          /* Optimization for page breaks in tables */
          table { page-break-inside: auto; }
          tr { page-break-inside: avoid; page-break-after: auto; }
        }
      `}</style>

      {/* Toolbar - Screen Only */}
      <div className="flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-white/10 shrink-0 no-print-toolbar">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-lg text-white">
            <Eye size={20} />
          </div>
          <div>
            <h3 className="text-white font-bold text-sm tracking-wide uppercase">Vista Previa de Impresión</h3>
            <p className="text-slate-400 text-xs font-medium">{title}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-slate-300 font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-all"
          >
            Cerrar Visor
          </button>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-8 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-brand-900/50 transition-all active:scale-95"
          >
            <Printer size={18} />
            Imprimir Ahora
          </button>
        </div>
      </div>

      {/* Document Canvas - Screen: Scrollable | Print: Full Page */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-8 flex justify-center bg-slate-800/50 print:bg-white print:overflow-visible print:p-0">
        <div id="print-preview-container" className="relative print:w-full bg-white shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] print:shadow-none transition-transform">
          {children}
        </div>
      </div>
    </div>
  );
};
