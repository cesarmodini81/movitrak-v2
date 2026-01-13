
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
          /* Hide everything in the body by default */
          body * {
            visibility: hidden;
          }
          
          /* Unhide the print container and its children */
          #print-preview-container, #print-preview-container * {
            visibility: visible;
          }

          /* Position the print container at the top-left of the page */
          #print-preview-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 0;
            background: white;
          }

          /* Ensure body background is white */
          body {
            background: white !important;
            overflow: visible !important;
          }

          /* Hide the toolbar specifically (redundant but safe) */
          .no-print-toolbar {
            display: none !important;
          }
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
        <div id="print-preview-container" className="relative print:w-full">
          {/* Paper Shadow Effect (Screen Only) */}
          <div className="bg-white shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] print:shadow-none w-auto inline-block mx-auto transition-transform">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
