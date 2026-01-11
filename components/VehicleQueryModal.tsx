import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Vehicle, Movement, Company } from '../types';
import { LOCATION_MAP } from '../constants';
import { X, Search, MapPin, Truck, Car, Database, Info, Layers, Building2, Calendar, FileText, User, ArrowRight, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { RemitoDocument } from './RemitoDocument';
import { PrintPreviewModal } from './PrintPreviewModal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const VehicleQueryModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { vehicles, movements, companies, currentCompany } = useApp();
  const { t } = useTranslation();
  
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [suggestions, setSuggestions] = useState<Vehicle[]>([]);
  const [activeTab, setActiveTab] = useState<'LOGISTICS' | 'UNIT'>('LOGISTICS');
  
  // Preview States
  const [previewRemito, setPreviewRemito] = useState<Movement | null>(null);

  useEffect(() => {
    if (searchTerm.length > 2) {
      setSuggestions(vehicles.filter(v => v.vin.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 5));
    } else {
      setSuggestions([]);
    }
  }, [searchTerm, vehicles]);

  const vehicleHistory = useMemo(() => {
    if (!selectedVehicle) return [];
    return movements
      .filter(m => m.vehicleVins.includes(selectedVehicle.vin))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [selectedVehicle, movements]);

  const getFullLocationInfo = (locationId: string) => {
    for (const comp of companies) {
      const loc = comp.locations.find(l => l.id === locationId);
      if (loc) return { location: loc, company: comp };
    }
    return null;
  };

  if (!isOpen) return null;

  const handleSelect = (v: Vehicle) => {
    setSelectedVehicle(v);
    setSearchTerm(v.vin);
    setSuggestions([]);
  };

  const handleClose = () => {
    setSearchTerm('');
    setSelectedVehicle(null);
    setSuggestions([]);
    setActiveTab('LOGISTICS');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-7xl rounded-3xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden no-print border border-slate-200 animate-in zoom-in-95 duration-300">
        
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-slate-900 text-white rounded-xl shadow-lg">
                <Search size={24} />
             </div>
             <div>
               <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Consulta Trazabilidad</h2>
               <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Estado Central de Flota MOVITRAK</p>
             </div>
          </div>
          <button 
            onClick={handleClose} 
            className="w-10 h-10 flex items-center justify-center hover:bg-slate-200 rounded-full transition-all text-slate-400 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-slate-50/30">
          <div className="p-8">
            <div className="max-w-3xl mx-auto mb-8">
              <div className="relative group z-30">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Buscador por VIN / Chasis</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                     <Database size={18} />
                  </div>
                  <input 
                    type="text"
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setSelectedVehicle(null); }}
                    className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-xl text-lg font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-50 transition-all uppercase shadow-sm"
                    placeholder="Ingrese el VIN de la unidad..."
                    autoFocus
                  />
                  {suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden">
                      {suggestions.map(s => (
                        <button 
                          key={s.vin} 
                          onClick={() => handleSelect(s)}
                          className="w-full text-left px-6 py-4 hover:bg-slate-50 border-b border-slate-50 last:border-0 flex justify-between items-center group transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-slate-100 rounded-lg text-slate-500 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                               <Car size={20} />
                            </div>
                            <div>
                              <span className="font-mono font-black text-slate-900 text-base">{s.vin}</span>
                              <span className="text-xs font-bold text-slate-400 uppercase ml-2 block">{s.brand} {s.model}</span>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-100 px-2 py-1 rounded">{s.status}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {selectedVehicle ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                
                <div className="flex border-b border-slate-200 bg-white px-6 rounded-t-2xl shadow-sm">
                  <button 
                    onClick={() => setActiveTab('LOGISTICS')}
                    className={`px-6 py-4 text-xs font-black uppercase tracking-widest border-b-4 transition-all flex items-center gap-2 ${activeTab === 'LOGISTICS' ? 'border-brand-600 text-brand-700' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                  >
                    <Truck size={16} /> Logística Actual
                  </button>
                  <button 
                    onClick={() => setActiveTab('UNIT')}
                    className={`px-6 py-4 text-xs font-black uppercase tracking-widest border-b-4 transition-all flex items-center gap-2 ${activeTab === 'UNIT' ? 'border-brand-600 text-brand-700' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                  >
                    <Info size={16} /> Especificaciones
                  </button>
                </div>

                <div className="bg-white p-8 rounded-b-2xl rounded-tr-2xl shadow-sm border border-slate-200 border-t-0 -mt-px">
                   {activeTab === 'LOGISTICS' ? (
                     <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="space-y-1">
                           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Disponibilidad</p>
                           <p className={`text-xl font-black uppercase ${selectedVehicle.status === 'AVAILABLE' ? 'text-emerald-600' : 'text-amber-600'}`}>
                              {selectedVehicle.status === 'AVAILABLE' ? 'LIBRE' : selectedVehicle.status.replace('_', ' ')}
                           </p>
                        </div>
                        
                        <div className="space-y-1">
                           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Ubicación Física Actual</p>
                           <div className="flex items-center gap-3">
                              <div className="p-2 bg-slate-900 text-white rounded-lg">
                                 <MapPin size={18} />
                              </div>
                              <div>
                                 <p className="text-lg font-black text-slate-900 uppercase leading-none">
                                   {LOCATION_MAP[selectedVehicle.locationId] || selectedVehicle.locationId}
                                 </p>
                                 <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">
                                   {getFullLocationInfo(selectedVehicle.locationId)?.company.name || 'Empresa Desconocida'}
                                 </p>
                              </div>
                           </div>
                        </div>

                        <div className="space-y-1">
                           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">VIN Registrado</p>
                           <p className="text-xl font-mono font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 w-fit">{selectedVehicle.vin}</p>
                        </div>
                        
                        <div className="space-y-1">
                           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Bloqueo Operativo</p>
                           <div className={`flex items-center gap-2 text-sm font-bold uppercase ${selectedVehicle.isLocked ? 'text-red-600' : 'text-slate-400'}`}>
                              {selectedVehicle.isLocked ? <ShieldAlert size={14} /> : <ShieldCheck size={14} />}
                              {selectedVehicle.isLocked ? `BLOQUEADO (${selectedVehicle.lockReason})` : 'SIN RESTRICCIONES'}
                           </div>
                        </div>
                     </div>
                   ) : (
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6">
                        <div className="space-y-1">
                           <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Marca</p>
                           <p className="font-bold text-slate-900 uppercase">{selectedVehicle.brand}</p>
                        </div>
                        <div className="space-y-1">
                           <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Año Modelo</p>
                           <p className="font-bold text-slate-900 uppercase">{selectedVehicle.year}</p>
                        </div>
                        <div className="space-y-1">
                           <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Color Oficial</p>
                           <p className="font-bold text-slate-900 uppercase">{selectedVehicle.color}</p>
                        </div>
                        <div className="space-y-1">
                           <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Tipo de Unidad</p>
                           <p className={`font-black text-xs uppercase ${selectedVehicle.type === 'NEW' ? 'text-brand-600' : 'text-amber-700'}`}>
                             {selectedVehicle.type === 'NEW' ? '0KM (NUEVO)' : 'USADO SELECCION'}
                           </p>
                        </div>
                        
                        <div className="col-span-full h-px bg-slate-100 my-2"></div>

                        <div className="space-y-1">
                           <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Certificación PDI</p>
                           <div className={`inline-flex items-center gap-2 font-black text-[10px] uppercase px-2 py-1 rounded-full ${selectedVehicle.preDeliveryConfirmed ? 'bg-emerald-100 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                              {selectedVehicle.preDeliveryConfirmed ? <ShieldCheck size={12} /> : <ShieldAlert size={12} />}
                              {selectedVehicle.preDeliveryConfirmed ? 'VALIDADA' : 'PENDIENTE'}
                           </div>
                        </div>
                        <div className="space-y-1">
                           <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Fecha Ingreso</p>
                           <p className="font-medium text-slate-700">{new Date(selectedVehicle.entryDate).toLocaleDateString()}</p>
                        </div>
                     </div>
                   )}
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                   <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                      <h3 className="font-bold text-slate-900 text-sm uppercase tracking-tight flex items-center gap-2">
                        <Layers size={16} /> Cronología de Movimientos
                      </h3>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trazabilidad Total</span>
                   </div>
                   
                   <div className="overflow-x-auto">
                     <table className="w-full text-left text-xs">
                       <thead>
                         <tr className="bg-white text-slate-400 font-bold uppercase text-[9px] tracking-widest border-b border-slate-100">
                           <th className="px-6 py-3">Fecha</th>
                           <th className="px-6 py-3">ID Remito</th>
                           <th className="px-6 py-3">Empresa / Origen</th>
                           <th className="px-6 py-3">Ubicación Destino</th>
                           <th className="px-6 py-3 text-center">Estado</th>
                           <th className="px-6 py-3">Transporte</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-50">
                         {vehicleHistory.length > 0 ? (
                           vehicleHistory.map((m) => {
                             const destInfo = getFullLocationInfo(m.destinationId);
                             const originInfo = getFullLocationInfo(m.originId);
                             
                             return (
                               <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                                 <td className="px-6 py-4 font-mono font-bold text-slate-500">
                                   {new Date(m.date).toLocaleDateString()}
                                 </td>
                                 <td className="px-6 py-4">
                                   <button 
                                     onClick={() => setPreviewRemito(m)}
                                     className="flex items-center gap-2 text-brand-600 hover:text-brand-800 font-mono font-black"
                                   >
                                     <FileText size={12} />
                                     {m.id}
                                   </button>
                                 </td>
                                 <td className="px-6 py-4">
                                   <p className="font-black text-slate-700 uppercase">{LOCATION_MAP[m.originId] || m.originId}</p>
                                   <p className="text-[9px] font-bold text-slate-400 uppercase">{originInfo?.company.name}</p>
                                 </td>
                                 <td className="px-6 py-4">
                                   <p className="font-black text-brand-700 uppercase">{LOCATION_MAP[m.destinationId] || m.destinationId}</p>
                                   <p className="text-[9px] font-bold text-slate-400 uppercase">{destInfo?.company.name}</p>
                                 </td>
                                 <td className="px-6 py-4 text-center">
                                   <span className={`px-2 py-0.5 rounded-full font-black text-[9px] uppercase border ${m.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                                     {m.status}
                                   </span>
                                 </td>
                                 <td className="px-6 py-4">
                                   <div className="flex items-center gap-2 text-slate-600 font-bold uppercase">
                                      <Truck size={12} />
                                      {m.transporter}
                                   </div>
                                 </td>
                               </tr>
                             );
                           })
                         ) : (
                           <tr>
                             <td colSpan={6} className="p-12 text-center text-slate-400 italic">
                               No se registran transferencias inter-planta para esta unidad.
                             </td>
                           </tr>
                         )}
                       </tbody>
                     </table>
                   </div>
                </div>

              </div>
            ) : (
              <div className="py-24 text-center flex flex-col items-center gap-6 opacity-60">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
                  <Database size={40} />
                </div>
                <div>
                   <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Consultar Stock Centralizado</h3>
                   <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Ingrese un VIN para obtener el historial completo y ubicación física real.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {previewRemito && selectedVehicle && (
        <PrintPreviewModal 
          isOpen={!!previewRemito} 
          onClose={() => setPreviewRemito(null)} 
          title={`Remito Oficial #${previewRemito.id}`}
        >
          <RemitoDocument 
            movement={previewRemito} 
            company={companies.find(c => c.locations.some(l => l.id === previewRemito.originId)) || companies[0]}
            vehicles={[selectedVehicle]}
            origin={getFullLocationInfo(previewRemito.originId)?.location}
            destination={getFullLocationInfo(previewRemito.destinationId)?.location}
            driverDni="Consultar Base Choferes"
          />
        </PrintPreviewModal>
      )}
    </div>
  );
};