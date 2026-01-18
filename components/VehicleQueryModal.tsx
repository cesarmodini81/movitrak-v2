
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Vehicle, Movement } from '../types';
import { LOCATION_MAP } from '../constants';
import { 
  X, Search, MapPin, Truck, Database, 
  ArrowRight, ShieldCheck, ShieldAlert, 
  Printer, Calendar, FileText, Activity, Loader2, Info
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { RemitoDocument } from './RemitoDocument';
import { PrintPreviewModal } from './PrintPreviewModal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const VehicleQueryModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { availableVehicles, movements, currentCompany } = useApp();
  const { t } = useTranslation();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [suggestions, setSuggestions] = useState<Vehicle[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state for DB
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Estados para impresión
  const [previewMovement, setPreviewMovement] = useState<Movement | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Debounced Search Effect with DB Integration
  useEffect(() => {
    const fetchVehicles = async () => {
      if (searchTerm.length <= 1) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        // Attempt Real DB Fetch
        const response = await fetch(`/api/vehicles?search=${encodeURIComponent(searchTerm)}&companyId=${currentCompany?.id}`);
        if (!response.ok) throw new Error('API_OFFLINE');
        const data = await response.json();
        setSuggestions(data.slice(0, 8));
      } catch (error) {
        // Fallback to Mocks (AppContext)
        const lowerTerm = searchTerm.toLowerCase();
        const filtered = availableVehicles.filter(v => 
          v.vin.toLowerCase().includes(lowerTerm) || 
          (v.plate && v.plate.toLowerCase().replace(/\s/g, '').includes(lowerTerm.replace(/\s/g, ''))) ||
          v.model.toLowerCase().includes(lowerTerm)
        );
        setSuggestions(filtered.slice(0, 8));
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchVehicles, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, availableVehicles, currentCompany]);

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
    // Here we would ideally fetch history from API too, but strictly using mocks for history in this example 
    // unless we create a specific endpoint for history. Falling back to context movements for consistency.
    return movements
      .filter(m => m.vehicleVins.includes(selectedVehicle.vin))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [selectedVehicle, movements]);

  // Helper para generar observación mock por unidad (Satisfaciendo requerimiento "Si no existe, agregar campo mock")
  // Esto asegura que cada unidad tenga una observación "particular" visualmente distinta en el historial
  const getUnitSpecificObservation = (movement: Movement, vin: string) => {
    // 1. Intentar obtener dato real si existiera en estructura extendida (simulado con any)
    const realObs = (movement as any).unitObservations?.[vin];
    if (realObs) return realObs;

    // 2. Generar Mock Determinista basado en VIN + ID Movimiento para consistencia visual
    const hash = (movement.id + vin).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const mocks = [
      "Unidad verificada sin novedades.",
      "Sin observaciones particulares.",
      "Revisar alfombras delanteras.",
      "Detalle mínimo en paragolpes tras.",
      "OK - Recepción conforme.",
      "Sin novedades.",
      "Kit de seguridad incompleto.",
      "Unidad sucia exterior."
    ];
    
    // Si es un movimiento completado, tendemos a poner OK.
    if (movement.status === 'COMPLETED' && hash % 2 === 0) return "Recepción OK - Sin novedades";
    
    return mocks[hash % mocks.length];
  };

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
    onClose();
  };

  const handlePrintRemito = (movement: Movement) => {
    setPreviewMovement(movement);
    setIsPreviewOpen(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-7xl rounded-[2.5rem] shadow-2xl flex flex-col h-[90vh] overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-slate-900 text-white rounded-2xl shadow-lg shadow-slate-200">
                <Search size={24} />
             </div>
             <div>
               <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase leading-none">Consulta Trazabilidad</h2>
               <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Historial Unificado & Estado de Unidad</p>
             </div>
          </div>
          <button onClick={handleClose} className="w-10 h-10 flex items-center justify-center hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all text-slate-400">
             <X size={24} strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col relative">
          {/* Barra de Búsqueda Flotante */}
          <div className="absolute top-0 left-0 right-0 z-20 px-8 py-4 bg-gradient-to-b from-white via-white to-transparent" ref={suggestionsRef}>
             <div className="relative max-w-3xl mx-auto shadow-xl rounded-2xl">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                  {isLoading ? <Loader2 size={20} className="animate-spin text-brand-600" /> : <Database size={20} />}
                </div>
                <input 
                  type="text"
                  value={searchTerm}
                  onFocus={() => setIsFocused(true)}
                  onChange={(e) => { setSearchTerm(e.target.value); if(selectedVehicle) setSelectedVehicle(null); }}
                  className="w-full pl-14 pr-4 py-4 bg-white border-2 border-slate-200 rounded-2xl text-lg font-bold text-slate-800 focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all uppercase placeholder:text-slate-300"
                  placeholder="Buscar por VIN, Patente o Modelo..."
                  autoFocus
                />
                
                {/* Lista de Sugerencias */}
                {isFocused && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-top-2 duration-200">
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
                          <ArrowRight size={16} className="text-slate-300 group-hover:text-slate-900 transition-colors" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
             </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8 pt-24 space-y-8 bg-slate-50/30">
            {selectedVehicle ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8 pb-10">
                
                {/* 1. SECCIÓN SUPERIOR: FICHA TÉCNICA */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
                      <Truck size={200} />
                   </div>
                   
                   <div className="flex items-center gap-3 mb-6">
                      <div className="w-1.5 h-6 bg-slate-900 rounded-full"></div>
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Información de la Unidad</h3>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                      {/* Columna 1: Identificación */}
                      <div className="space-y-4">
                         <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Identificación VIN</p>
                            <p className="font-mono font-black text-slate-900 text-xl tracking-widest bg-slate-50 px-3 py-1 rounded-lg border border-slate-100 w-fit">{selectedVehicle.vin}</p>
                         </div>
                         <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Dominio / Patente</p>
                            <p className="font-black text-slate-800 text-lg uppercase">{selectedVehicle.plate || 'NO PATENTADO'}</p>
                         </div>
                      </div>

                      {/* Columna 2: Detalles Unidad */}
                      <div className="space-y-4">
                         <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Marca & Modelo</p>
                            <p className="font-black text-slate-900 text-lg uppercase leading-tight">{selectedVehicle.brand} {selectedVehicle.model}</p>
                         </div>
                         <div className="flex gap-6">
                            <div>
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Año</p>
                               <p className="font-bold text-slate-700">{selectedVehicle.year}</p>
                            </div>
                            <div>
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Color</p>
                               <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 rounded-full border border-slate-300 bg-slate-200"></div>
                                  <p className="font-bold text-slate-700 uppercase text-sm">{selectedVehicle.color}</p>
                               </div>
                            </div>
                         </div>
                      </div>

                      {/* Columna 3: Estado & Ubicación */}
                      <div className="space-y-4">
                         <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Ubicación Actual</p>
                            <div className="flex items-center gap-2 text-brand-600 font-black uppercase text-sm">
                               <MapPin size={16} />
                               {LOCATION_MAP[selectedVehicle.locationId] || selectedVehicle.locationId}
                            </div>
                         </div>
                         <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status Logístico</p>
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                               selectedVehicle.status === 'AVAILABLE' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                               selectedVehicle.status === 'IN_TRANSIT' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                               'bg-slate-100 text-slate-600 border-slate-200'
                            }`}>
                               <Activity size={12} />
                               {selectedVehicle.status.replace('_', ' ')}
                            </span>
                         </div>
                      </div>

                      {/* Columna 4: PDI & Kilometraje */}
                      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col justify-between">
                         <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Estado PDI</p>
                            <div className={`flex items-center gap-2 font-black text-sm uppercase ${selectedVehicle.preDeliveryConfirmed ? 'text-emerald-600' : 'text-red-500'}`}>
                               {selectedVehicle.preDeliveryConfirmed ? <ShieldCheck size={20} /> : <ShieldAlert size={20} />}
                               {selectedVehicle.preDeliveryConfirmed ? 'CERTIFICADO OK' : 'PENDIENTE'}
                            </div>
                         </div>
                         <div className="mt-4 pt-4 border-t border-slate-200">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Odómetro</p>
                            <p className="font-mono font-black text-slate-900 text-lg">{selectedVehicle.km ? `${selectedVehicle.km.toLocaleString()} KM` : '0 KM'}</p>
                         </div>
                      </div>
                   </div>
                </div>

                {/* 2. SECCIÓN INFERIOR: HISTORIAL LOGÍSTICO */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                   <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                         <FileText size={20} className="text-slate-900" />
                         <h3 className="font-black text-slate-900 text-sm uppercase tracking-tight">Historial Logístico & Remitos</h3>
                      </div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{vehicleHistory.length} Movimientos Registrados</span>
                   </div>
                   
                   <div className="overflow-x-auto max-h-[400px]">
                     <table className="w-full text-left">
                       <thead className="bg-slate-900 text-white uppercase text-[10px] font-black tracking-[0.2em] sticky top-0 z-10">
                         <tr>
                           <th className="px-6 py-4">ID Operación</th>
                           <th className="px-6 py-4">Fecha</th>
                           <th className="px-6 py-4">Origen</th>
                           <th className="px-6 py-4">Destino</th>
                           <th className="px-6 py-4 w-1/4">Observaciones Unidad</th>
                           <th className="px-6 py-4 text-center">Estado PDI</th>
                           <th className="px-6 py-4 text-center">Acciones</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100">
                         {vehicleHistory.length > 0 ? vehicleHistory.map((m) => {
                           const isCompleted = m.status === 'COMPLETED';
                           const unitObs = getUnitSpecificObservation(m, selectedVehicle.vin);
                           
                           return (
                             <tr key={m.id} className="hover:bg-slate-50 transition-colors group">
                               <td className="px-6 py-4 font-mono font-black text-slate-900 text-xs">
                                 {m.id}
                               </td>
                               <td className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                                 <div className="flex items-center gap-2">
                                    <Calendar size={14} className="text-slate-400" />
                                    {new Date(m.date).toLocaleDateString()}
                                 </div>
                               </td>
                               <td className="px-6 py-4 text-xs font-bold text-slate-600 uppercase">
                                 {LOCATION_MAP[m.originId] || m.originId}
                               </td>
                               <td className="px-6 py-4 text-xs font-black text-slate-800 uppercase">
                                 {LOCATION_MAP[m.destinationId] || m.destinationId}
                               </td>
                               <td className="px-6 py-4 text-xs font-medium text-slate-600 max-w-xs truncate cursor-help relative group/tooltip">
                                 {/* OBSERVACIÓN ESPECÍFICA DE UNIDAD */}
                                 <div className="flex items-center gap-1.5">
                                    <Info size={12} className="text-slate-300 shrink-0" />
                                    <span className="truncate">{unitObs}</span>
                                 </div>
                                 <div className="absolute bottom-full left-0 mb-2 w-max max-w-xs bg-slate-800 text-white text-[10px] p-2 rounded shadow-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-20">
                                    {unitObs}
                                 </div>
                               </td>
                               <td className="px-6 py-4 text-center">
                                 {isCompleted ? (
                                   <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest border border-emerald-100">
                                      <ShieldCheck size={10} /> OK
                                   </span>
                                 ) : (
                                   <span className="inline-flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest border border-amber-100">
                                      <Activity size={10} /> En Curso
                                   </span>
                                 )}
                               </td>
                               <td className="px-6 py-4 text-center">
                                 <button 
                                   onClick={() => handlePrintRemito(m)}
                                   className="inline-flex items-center gap-2 bg-blue-900 hover:bg-blue-950 text-white px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest shadow-md hover:shadow-lg transition-all active:scale-95"
                                 >
                                   <Printer size={14} /> Imprimir Remito
                                 </button>
                               </td>
                             </tr>
                           );
                         }) : (
                           <tr>
                             <td colSpan={7} className="p-16 text-center">
                               <div className="flex flex-col items-center gap-4 opacity-40">
                                  <Truck size={48} className="text-slate-300" strokeWidth={1} />
                                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Sin historial de movimientos logísticos</p>
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
              <div className="h-full flex flex-col items-center justify-center text-center pb-20">
                <div className="bg-slate-100 w-32 h-32 rounded-full flex items-center justify-center mb-6 shadow-inner animate-pulse">
                   <Search size={64} className="text-slate-300" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Centro de Trazabilidad</h3>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-2 max-w-sm mx-auto leading-relaxed">
                  Ingrese VIN o Patente en la barra superior para visualizar la ficha técnica completa y el historial de remitos.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Impresión */}
      <PrintPreviewModal 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)}
        title={`Remito Oficial #${previewMovement?.id || ''}`}
      >
        {previewMovement && currentCompany && (
          <RemitoDocument 
            movement={previewMovement}
            company={currentCompany}
            vehicles={availableVehicles.filter(v => previewMovement.vehicleVins.includes(v.vin))}
            origin={currentCompany.locations.find(l => l.id === previewMovement.originId)}
            destination={currentCompany.locations.find(l => l.id === previewMovement.destinationId)}
            driverDni={previewMovement.driverName ? '---' : undefined} // Mock si falta dato
            truckPlate={previewMovement.truckPlate}
            trailerPlate={previewMovement.trailerPlate}
          />
        )}
      </PrintPreviewModal>
    </div>
  );
};
