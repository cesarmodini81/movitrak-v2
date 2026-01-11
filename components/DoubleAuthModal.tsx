import React, { useState, useEffect } from 'react';
import { ShieldCheck, X, AlertCircle, ArrowRight, LockKeyhole } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onVerify: (code: string) => void;
  onCancel: () => void;
  error?: string;
}

export const DoubleAuthModal: React.FC<Props> = ({ isOpen, onVerify, onCancel, error }) => {
  const [code, setCode] = useState('');

  // Reset code when modal opens
  useEffect(() => {
    if (isOpen) setCode('');
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length === 6) {
      onVerify(code);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and max 6 chars
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(val);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200 transform transition-all animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="bg-slate-900 p-8 text-center relative overflow-hidden">
          {/* Decorative background circle */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
          
          <button 
            onClick={onCancel}
            className="absolute right-6 top-6 text-slate-400 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-2 rounded-full backdrop-blur-sm"
          >
            <X size={20} />
          </button>
          
          <div className="inline-flex p-4 bg-white/10 rounded-2xl mb-4 text-white shadow-inner backdrop-blur-sm ring-1 ring-white/20">
            <ShieldCheck size={40} strokeWidth={1.5} />
          </div>
          
          <h3 className="text-2xl font-black text-white tracking-tight">Verificación de Identidad</h3>
          <p className="text-slate-400 text-xs mt-2 uppercase tracking-[0.2em] font-bold">Nivel Super Admin</p>
        </div>

        {/* Body */}
        <div className="p-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="text-center">
              <p className="text-sm font-medium text-slate-500 mb-6 leading-relaxed px-4">
                Se requiere autenticación de doble factor (2FA). Ingrese el código generado en su dispositivo.
              </p>
              
              <div className="relative group">
                <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 pointer-events-none opacity-10">
                   <LockKeyhole size={80} />
                </div>
                <input 
                  type="text" 
                  value={code}
                  onChange={handleInputChange}
                  className="w-full text-center text-5xl tracking-[0.3em] font-mono font-bold py-6 border-b-4 border-slate-200 focus:border-slate-900 outline-none transition-all placeholder:text-slate-200 text-slate-900 bg-transparent"
                  placeholder="000000"
                  autoFocus
                  inputMode="numeric"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex items-start gap-3 text-red-700 animate-in shake duration-300">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-black uppercase tracking-wide mb-0.5">Error de Validación</p>
                  <p className="text-sm font-medium leading-tight">{error}</p>
                </div>
              </div>
            )}

            <div className="space-y-3 pt-2">
              <button 
                type="submit" 
                disabled={code.length !== 6}
                className="w-full bg-slate-900 text-white font-black py-4 rounded-xl shadow-xl shadow-slate-200 hover:bg-slate-800 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none uppercase tracking-widest text-xs"
              >
                Verificar Acceso
                <ArrowRight size={16} strokeWidth={3} />
              </button>
              
              <button 
                type="button"
                onClick={onCancel}
                className="w-full py-3 text-slate-400 font-bold hover:text-slate-600 transition-colors text-xs uppercase tracking-widest"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
          <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold flex items-center justify-center gap-2">
            <LockKeyhole size={10} />
            Protección de Datos End-to-End
          </p>
        </div>
      </div>
    </div>
  );
};