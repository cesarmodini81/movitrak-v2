
import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
/* Added Package to imports */
import { Search, MapPin, AlertCircle, ShoppingCart, ArrowRight, Package } from 'lucide-react';
import { Part } from '../../types';

export const PartsSearch: React.FC = () => {
  const { parts, currentCompany } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<Part[]>([]);
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);

  // Filtrar repuestos por la empresa actual
  const companyParts = parts.filter(p => p.companyId === currentCompany?.id);

  useEffect(() => {
    if (searchTerm.length > 1) {
      const lower = searchTerm.toLowerCase();
      const filtered = companyParts.filter(p => 
        p.code.toLowerCase().includes(lower) || 
        p.name.toLowerCase().includes(lower) ||
        p.modelCompatibility.some(m => m.toLowerCase().includes(lower))
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  }, [searchTerm, companyParts]);

  const handleSelect = (part: Part) => {
    setSelectedPart(part);
    setSearchTerm(part.code);
    setSuggestions([]);
  };

  const totalStock: number = selectedPart 
    ? (Object.values(selectedPart.stock) as number[]).reduce((a: number, b: number) => a + b, 0)
    : 0;

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-500 pt-24 pb-12">
      <div className="flex items-center gap-4 mb-6 lg:mb-8">
        <div className="p-3 lg:p-4 bg-emerald-500 text-white rounded-2xl shadow-lg shadow-emerald-200">
          <Search size={28} className="lg:w-8 lg:h-8" />
        </div>
        <div>
          <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight uppercase leading-none">Buscador Inteligente de Piezas</h2>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-2">Catálogo de Repuestos {currentCompany?.name}</p>
        </div>
      </div>

      {/* BARRA DE BÚSQUEDA PREDICTIVA */}
      <div className="relative max-w-2xl">
        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400">
           <Search size={24} />
        </div>
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); if(!e.target.value) setSelectedPart(null); }}
          placeholder="Código, Nombre o Modelo (Hilux, Ranger...)"
          className="w-full pl-16 pr-4 py-4 lg:py-6 bg-white border-2 border-slate-100 rounded-2xl focus:border-emerald-500 outline-none text-lg lg:text-xl font-bold text-slate-800 shadow-lg shadow-slate-100 transition-all uppercase placeholder:normal-case"
          autoFocus
        />
        {suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl overflow-hidden z-50 border border-slate-100">
            {suggestions.map(s => (
              <button 
                key={s.id}
                onClick={() => handleSelect(s)}
                className="w-full text-left p-5 hover:bg-slate-50 border-b border-slate-50 flex items-center justify-between group transition-colors"
              >
                <div>
                  <p className="font-mono font-black text-slate-900 text-sm">{s.code}</p>
                  <p className="text-xs font-bold text-slate-500 uppercase">{s.name}</p>
                </div>
                <div className="flex items-center gap-2">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.brand}</span>
                   <ArrowRight size={16} className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-all" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* DETALLES DE LA PIEZA SELECCIONADA */}
      {selectedPart ? (
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden flex flex-col md:row mt-8 animate-in zoom-in-95 duration-300">
           <div className="grid grid-cols-1 md:grid-cols-12">
             <div className="md:col-span-4 bg-slate-50 relative min-h-[300px]">
                <img src={selectedPart.photoUrl} alt={selectedPart.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent p-8 flex flex-col justify-end">
                   <p className="text-emerald-400 text-xs font-black uppercase tracking-widest mb-1">Zona de Instalación</p>
                   <p className="text-white text-2xl font-black uppercase">{selectedPart.locationInCar}</p>
                </div>
             </div>
             
             <div className="md:col-span-8 p-8 lg:p-12 space-y-8">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                   <div>
                      <div className="flex gap-2 mb-3">
                         <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase border border-emerald-200">Genuino</span>
                         <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase border border-slate-200">{selectedPart.code}</span>
                      </div>
                      <h1 className="text-3xl lg:text-5xl font-black text-slate-900 uppercase leading-tight">{selectedPart.name}</h1>
                      <p className="text-slate-400 font-bold uppercase text-xs tracking-[0.2em] mt-3">Compatibilidad: {selectedPart.modelCompatibility.join(' • ')}</p>
                   </div>
                   <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-right min-w-[200px]">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Precio Unitario</p>
                      <p className="text-4xl font-black text-slate-900">${selectedPart.price.toLocaleString()}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">IVA No Incluido</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
                   <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 shadow-inner">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                         <MapPin size={14} className="text-emerald-500" /> Stock Global Empresa
                      </p>
                      <p className="text-5xl font-black text-slate-900">{totalStock}</p>
                   </div>
                   <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 shadow-inner">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                         <ShoppingCart size={14} className="text-emerald-500" /> Disponibilidad
                      </p>
                      <div className="flex items-center gap-3">
                         <div className={`w-4 h-4 rounded-full ${totalStock > 0 ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`}></div>
                         <p className={`text-xl font-black uppercase ${totalStock > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                            {totalStock > 0 ? 'Entrega Inmediata' : 'Sin Disponibilidad'}
                         </p>
                      </div>
                   </div>
                </div>

                <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-8 opacity-10"><Package size={80} /></div>
                   <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6 text-slate-500 border-b border-white/10 pb-4">Detalle de Existencias por Sucursal</h3>
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {Object.entries(selectedPart.stock).map(([locId, qty]) => {
                         const locName = currentCompany?.locations.find(l => l.id === locId)?.name || locId;
                         if (qty === 0) return null;
                         return (
                            <div key={locId} className="flex flex-col bg-white/5 p-4 rounded-2xl border border-white/10 group hover:bg-white/10 transition-all">
                               <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 truncate">{locName}</span>
                               <span className="text-2xl font-black text-white">{qty} <small className="text-[10px] font-bold text-slate-400 uppercase ml-1">UNID</small></span>
                            </div>
                         );
                      })}
                   </div>
                </div>
             </div>
           </div>
        </div>
      ) : (
        <div className="p-12 lg:p-32 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100 mt-8 animate-pulse">
           <div className="flex flex-col items-center gap-8 opacity-30">
              <div className="bg-slate-50 p-8 rounded-full border-4 border-slate-100">
                 <Search size={80} className="text-slate-300" strokeWidth={1} />
              </div>
              <div className="max-w-md">
                 <p className="text-2xl font-black uppercase text-slate-900 tracking-tighter">Esperando Criterio de Búsqueda</p>
                 <p className="text-sm font-bold uppercase text-slate-400 tracking-widest mt-3 leading-relaxed">
                   Ingrese el código de la pieza o el nombre del componente para visualizar stock dinámico y precios oficiales.
                 </p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
