
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Vehicle, Movement, Company } from '../types';
import { LOCATION_MAP } from '../constants';
// Add AlertCircle to the imports
import { X, Search, MapPin, Truck, Car, Database, Info, Layers, Building2, Calendar, FileText, User, ArrowRight, ShieldAlert, ShieldCheck, Hash, Tag, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { RemitoDocument } from './RemitoDocument';
import { PrintPreviewModal } from './PrintPreviewModal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const VehicleQueryModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { availableVehicles, movements, companies } = useApp();
  const { t } = useTranslation();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [suggestions, setSuggestions] = useState<Vehicle[]>([]);
  const [activeTab, setActiveTab] = useState<'LOGISTICS' | 'UNIT'>('LOGISTICS');
  const [isFocused, setIsFocused] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchTerm.length > 1) {
      const lowerTerm = searchTerm.toLowerCase();
      const filtered = availableVehicles.filter(v => 
        v.vin.toLowerCase().includes(lowerTerm) || 
        (v.plate && v.plate.toLowerCase().replace(/\s/g, '').includes(lowerTerm.replace(/\s/g, ''))) ||
        v.model.toLowerCase().includes(lowerTerm)
      );
      setSuggestions(filtered.slice(0, 8));
    } else {
      setSuggestions([]);
    }
  }, [searchTerm, availableVehicles]);

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const vehicleHistory = useMemo(() => {
    if (!selectedVehicle) return [];
    return movements
      .filter(m => m.vehicleVins.includes(selectedVehicle.vin))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [selectedVehicle, movements]);

  const handleSelect = (v: Vehicle) => {
    setSelectedVehicle(v);
    setSearchTerm(v.plate || v.vin);
    setSuggestions([]);
    setIsFocused(false);
  };

  const handleClose = () => {
    setSearchTerm('');
    setSelectedVehicle(null);
    setSuggestions([]);
    setActiveTab('LOGISTICS');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-7xl rounded-3xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-300">
        
        {/* Header Modificado */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-slate-900 text-white rounded-xl shadow-lg shadow-slate-200"><Search size={24} /></div>
             <div>
               <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Consulta Trazabilidad Centralizada</h2>
               <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">Gestión de Stock 0KM / USADOS Selección</p>
             </div>
          </div>
          <button onClick={handleClose} className="w-10 h-10 flex items-center justify-center hover:bg-red-50 hover:text-red-500 rounded-full transition-all text-slate-400"><X size={24} /></button>
        </div>

        <div className="flex-1 overflow-y-auto bg-slate-50/30">
          <div className="p-8">
            {/* Buscador Predictivo Premium */}
            <div className="max-w-3xl mx-auto mb-10 relative" ref={suggestionsRef}>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Identificación de Unidad (VIN, Patente o Modelo)</label>
              <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Database size={20} />
                </div>
                <input 
                  type="text"
                  value={searchTerm}
                  onFocus={() => setIsFocused(true)}
                  onChange={(e) => { setSearchTerm(e.target.value); if(selectedVehicle) setSelectedVehicle(null); }}
                  className="w-full pl-14 pr-4 py-5 bg-white border-2 border-slate-200 rounded-2xl text-xl font-bold text-slate-800 focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all uppercase placeholder:text-slate-300 shadow-sm"
                  placeholder="Ej: ABC 123 o 8AJH..."
                  autoFocus
                />
                
                {/* Fallback visual cuando no hay resultados */}
                {isFocused && searchTerm.length > 2 && suggestions.length === 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-slate-200 rounded-2xl shadow-2xl p-6 text-center z-50">
                    <AlertCircle size={32} className="mx-auto text-slate-300 mb-2" />
                    <p className="text-sm font-bold text-slate-500 uppercase">No se encontraron unidades coincidentes</p>
                  </div>
                )}

                {/* Lista de Sugerencias Enterprise */}
                {isFocused && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
                    <div className="max-h-80 overflow-y-auto">
                      {suggestions.map(s => (
                        <button 
                          key={s.vin} 
                          onClick={() => handleSelect(s)}
                          className="w-full text-left px-6 py-4 hover:bg-slate-50 border-b border-slate-50 last:border-0 flex justify-between items-center group transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`p-2.5 rounded-xl font-black text-[10px] shadow-sm flex items-center justify-center min-w-[48px] ${s.type === 'USED' ? 'bg-amber-100 text-amber-700' : 'bg-brand-50 text-brand-700'}`}>
                               {s.type === 'USED' ? 'USD' : '0KM'}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-black text-slate-900 text-lg tracking-wider">{s.plate || s.vin.slice(-8)}</span>
                                {s.plate && <span className="text-[10px] font-bold text-slate-400 font-mono">({s.vin.slice(-6)})</span>}
                              </div>
                              <span className="text-xs font-bold text-slate-400 uppercase tracking-tight">{s.brand} {s.model} • {s.color}</span>
                            </div>
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white p-2 rounded-lg">
                             <ArrowRight size={16} />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {selectedVehicle ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                {/* Tabs de Navegación */}
                <div className="flex border-b-2 border-slate-100 bg-white px-8 rounded-t-3xl shadow-sm">
                  <button onClick={() => setActiveTab('LOGISTICS')} className={`px-8 py-5 text-xs font-black uppercase tracking-[0.2em] border-b-4 transition-all flex items-center gap-2 ${activeTab === 'LOGISTICS' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}><Truck size={18} /> Resumen Logístico</button>
                  <button onClick={() => setActiveTab('UNIT')} className={`px-8 py-5 text-xs font-black uppercase tracking-[0.2em] border-b-4 transition-all flex items-center gap-2 ${activeTab === 'UNIT' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}><Info size={18} /> Ficha Técnica</button>
                </div>

                {/* Dashboard de Estado de Unidad */}
                <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-200 border-t-0 -mt-px">
                   {activeTab === 'LOGISTICS' ? (
                     <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                        <div className="space-y-2">
                           <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Disponibilidad</p>
                           <p className={`text-2xl font-black uppercase tracking-tighter ${selectedVehicle.status === 'AVAILABLE' ? 'text-emerald-600' : 'text-amber-600'}`}>
                             {selectedVehicle.status.replace('_', ' ')}
                           </p>
                        </div>
                        <div className="space-y-2">
                           <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Ubicación Actual</p>
                           <div className="flex items-center gap-2 text-slate-900 font-black uppercase text-xl tracking-tight">
                              <MapPin size={20} className="text-slate-400" />
                              {LOCATION_MAP[selectedVehicle.locationId] || selectedVehicle.locationId}
                           </div>
                        </div>
                        <div className="space-y-2">
                           <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Dominio / VIN</p>
                           <div className="flex items-center gap-2">
                             <Tag size={18} className="text-slate-400" />
                             <p className="text-2xl font-mono font-black text-slate-900 tracking-wider">
                                {selectedVehicle.plate || selectedVehicle.vin.slice(-8)}
                             </p>
                           </div>
                        </div>
                        <div className="space-y-2">
                           <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Certificación PDI</p>
                           <div className={`flex items-center gap-2 text-sm font-black uppercase tracking-wide px-3 py-1.5 rounded-xl w-fit ${selectedVehicle.preDeliveryConfirmed ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                              {selectedVehicle.preDeliveryConfirmed ? <ShieldCheck size={16} /> : <ShieldAlert size={16} />}
                              {selectedVehicle.preDeliveryConfirmed ? 'VALIDADO OK' : 'PENDIENTE'}
                           </div>
                        </div>
                     </div>
                   ) : (
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-8">
                        <div className="space-y-1">
                           <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">Marca / Modelo</p>
                           <p className="font-black text-slate-900 uppercase text-xl tracking-tight">{selectedVehicle.brand} {selectedVehicle.model}</p>
                        </div>
                        <div className="space-y-1">
                           <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">Año Fab.</p>
                           <p className="font-black text-slate-900 text-xl">{selectedVehicle.year}</p>
                        </div>
                        <div className="space-y-1">
                           <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">Kilometraje</p>
                           <p className="font-black text-slate-900 text-xl">{selectedVehicle.km ? `${selectedVehicle.km.toLocaleString()} KM` : '0KM - UNIDAD NUEVA'}</p>
                        </div>
                        <div className="space-y-1">
                           <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">Color Oficial</p>
                           <div className="flex items-center gap-2">
                             <div className="w-4 h-4 rounded-full border border-slate-200" style={{ backgroundColor: '#e2e8f0' }}></div>
                             <p className="font-black text-slate-700 uppercase text-lg">{selectedVehicle.color}</p>
                           </div>
                        </div>
                        <div className="col-span-full pt-6 border-t border-slate-100 flex items-center justify-between">
                           <div>
                              <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">Identificador de Chasis (VIN) Completo</p>
                              <p className="font-mono font-black text-slate-500 text-sm tracking-[0.2em] bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">{selectedVehicle.vin}</p>
                           </div>
                           <div className="text-right">
                              <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">Fecha de Ingreso a Flota</p>
                              <p className="font-black text-slate-800 text-sm">{new Date(selectedVehicle.entryDate).toLocaleDateString()}</p>
                           </div>
                        </div>
                     </div>
                   )}
                </div>

                {/* Cronología Logística */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                   <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                         <Layers size={20} className="text-slate-900" />
                         <h3 className="font-black text-slate-900 text-sm uppercase tracking-tight">Historial de Operaciones Logísticas</h3>
                      </div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Últimos traslados registrados</span>
                   </div>
                   <div className="overflow-x-auto">
                     <table className="w-full text-left text-xs">
                       <thead className="bg-slate-50 text-slate-500 font-black uppercase text-[9px] tracking-widest border-b border-slate-100">
                         <tr>
                           <th className="px-8 py-4">Fecha Op.</th>
                           <th className="px-8 py-4">ID Remito</th>
                           <th className="px-8 py-4">Planta Origen</th>
                           <th className="px-8 py-4">Planta Destino</th>
                           <th className="px-8 py-4 text-center">Estado</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-50">
                         {vehicleHistory.length > 0 ? vehicleHistory.map((m) => (
                           <tr key={m.id} className="hover:bg-slate-50 transition-colors group">
                             <td className="px-8 py-5 font-mono font-bold text-slate-500">{new Date(m.date).toLocaleDateString()}</td>
                             <td className="px-8 py-5 font-mono font-black text-slate-900 group-hover:text-brand-600 transition-colors">{m.id}</td>
                             <td className="px-8 py-5 uppercase font-bold text-slate-600">{LOCATION_MAP[m.originId] || m.originId}</td>
                             <td className="px-8 py-5 uppercase font-black text-slate-900">{LOCATION_MAP[m.destinationId] || m.destinationId}</td>
                             <td className="px-8 py-5 text-center">
                               <span className={`px-3 py-1 rounded-full font-black text-[9px] uppercase border ${m.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                                 {m.status}
                               </span>
                             </td>
                           </tr>
                         )) : (
                           <tr>
                             <td colSpan={5} className="p-20 text-center text-slate-400 italic bg-white">
                               <div className="flex flex-col items-center gap-4 opacity-40">
                                  <Truck size={48} strokeWidth={1} />
                                  <p className="text-sm font-bold uppercase tracking-widest">Sin registros de transferencias inter-planta</p>
                               </div>
                             </td>
                           </tr>
                         )}
                       </tbody>
                     </table>
                   </div>
                </div>
              </div>
            ) : (
              <div className="py-24 text-center">
                <div className="bg-slate-100/50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                   <Database size={48} className="text-slate-300" />
                </div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Centro de Trazabilidad MOVITRAK</h3>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-2 max-w-sm mx-auto">Ingrese VIN o Patente para visualizar el historial completo, estado de PDI y ubicación física de la unidad.</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-white flex justify-end shrink-0">
           <button 
             onClick={handleClose}
             className="px-10 py-3.5 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95"
           >
             Cerrar Consulta
           </button>
        </div>
      </div>
    </div>
  );
};
