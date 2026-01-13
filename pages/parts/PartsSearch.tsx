
import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, MapPin, AlertCircle, ShoppingCart, ArrowRight } from 'lucide-react';
import { Part } from '../../types';

export const PartsSearch: React.FC = () => {
  const { parts, currentCompany } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<Part[]>([]);
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);

  // Filter parts by current company
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

  const totalStock = selectedPart 
    ? Object.values(selectedPart.stock).reduce((a, b) => a + b, 0)
    : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-4 bg-emerald-500 text-white rounded-2xl shadow-lg shadow-emerald-200">
          <Search size={32} />
        </div>
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase leading-none">Buscador Inteligente</h2>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-2">Catálogo de Repuestos {currentCompany?.name}</p>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="relative max-w-2xl">
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); if(!e.target.value) setSelectedPart(null); }}
          placeholder="Ingrese Código, Nombre o Modelo compatible..."
          className="w-full pl-6 pr-4 py-5 bg-white border-2 border-slate-100 rounded-2xl focus:border-emerald-500 outline-none text-xl font-bold text-slate-800 shadow-sm transition-all"
          autoFocus
        />
        {suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl overflow-hidden z-50 border border-slate-100">
            {suggestions.map(s => (
              <button 
                key={s.id}
                onClick={() => handleSelect(s)}
                className="w-full text-left p-4 hover:bg-slate-50 border-b border-slate-50 flex items-center justify-between group"
              >
                <div>
                  <p className="font-mono font-black text-slate-900 text-sm">{s.code}</p>
                  <p className="text-xs font-bold text-slate-500 uppercase">{s.name}</p>
                </div>
                <ArrowRight size={16} className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-all" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* RESULT CARD */}
      {selectedPart ? (
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden flex flex-col md:flex-row">
           <div className="w-full md:w-1/3 bg-slate-50 relative min-h-[300px]">
              <img src={selectedPart.photoUrl} alt={selectedPart.name} className="w-full h-full object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
                 <p className="text-white text-xs font-bold uppercase tracking-widest mb-1">Ubicación en Vehículo</p>
                 <p className="text-white text-xl font-black uppercase">{selectedPart.locationInCar}</p>
              </div>
           </div>
           
           <div className="flex-1 p-10 space-y-8">
              <div className="flex justify-between items-start">
                 <div>
                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg text-xs font-black tracking-widest uppercase">Repuesto Original</span>
                    <h1 className="text-4xl font-black text-slate-900 uppercase mt-2 mb-1">{selectedPart.name}</h1>
                    <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Compatibilidad: {selectedPart.modelCompatibility.join(', ')}</p>
                 </div>
                 <div className="text-right">
                    <p className="text-3xl font-black text-slate-900">${selectedPart.price.toLocaleString()}</p>
                    <p className="text-xs font-bold text-slate-400 uppercase">Precio Lista</p>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                 <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                       <MapPin size={12} /> Stock Total Global
                    </p>
                    <p className="text-4xl font-black text-slate-900">{totalStock}</p>
                 </div>
                 <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                       <ShoppingCart size={12} /> Estado
                    </p>
                    <p className={`text-xl font-black uppercase ${totalStock > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                       {totalStock > 0 ? 'Disponible' : 'Sin Stock'}
                    </p>
                 </div>
              </div>

              <div className="bg-slate-900 text-white p-6 rounded-2xl">
                 <p className="text-xs font-black uppercase tracking-widest mb-4 border-b border-white/20 pb-2">Distribución por Sucursal</p>
                 <div className="grid grid-cols-2 gap-4">
                    {Object.entries(selectedPart.stock).map(([locId, qty]) => {
                       const locName = currentCompany?.locations.find(l => l.id === locId)?.name || locId;
                       if (qty === 0) return null;
                       return (
                          <div key={locId} className="flex justify-between items-center">
                             <span className="text-xs font-bold text-slate-300 uppercase truncate pr-2">{locName}</span>
                             <span className="text-sm font-black text-white">{qty} Unid.</span>
                          </div>
                       );
                    })}
                 </div>
              </div>
           </div>
        </div>
      ) : (
        <div className="p-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
           <div className="flex flex-col items-center gap-4 opacity-40">
              <Search size={60} className="text-slate-300" />
              <p className="text-xl font-black uppercase text-slate-900">Inicie una búsqueda</p>
              <p className="text-sm font-bold uppercase text-slate-400 tracking-widest">Ingrese el código de la pieza para ver detalles</p>
           </div>
        </div>
      )}
    </div>
  );
};
