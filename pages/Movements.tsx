
import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import { LOCATION_MAP } from '../constants';
import { ArrowRight, Truck, Plus, X, ClipboardList, MapPin, Info, Tag, Search, Database, CheckCircle, Printer, ArrowLeft } from 'lucide-react';
import { Movement, Vehicle } from '../types';
import { RemitoDocument } from '../components/RemitoDocument';
import { PrintPreviewModal } from '../components/PrintPreviewModal';

const STORAGE_KEYS = {
  ORIGIN: 'mov_origin',
  DEST: 'mov_dest',
  TRANS: 'mov_transporter',
  DRIVER: 'mov_driver',
  DNI: 'mov_dni',
  TRUCK: 'mov_truck',
  TRAILER: 'mov_trailer',
  VINS: 'mov_vins',
  OBS_UNIT: 'mov_obs_unit',
  OBS_GEN: 'mov_obs_gen',
  CUSTOM_TRANSPORTERS: 'mov_custom_transporters'
};

const DEFAULT_TRANSPORTERS = ['Logística Nation', 'TransCarga S.A.'];

export const Movements: React.FC = () => {
  const { availableVehicles, currentCompany, createMovement } = useApp();
  const { t } = useTranslation();

  const [origin, setOrigin] = useState(() => localStorage.getItem(STORAGE_KEYS.ORIGIN) || '');
  const [destination, setDestination] = useState(() => localStorage.getItem(STORAGE_KEYS.DEST) || '');
  const [transporter, setTransporter] = useState(() => localStorage.getItem(STORAGE_KEYS.TRANS) || '');
  const [driverName, setDriverName] = useState(() => localStorage.getItem(STORAGE_KEYS.DRIVER) || '');
  const [driverDni, setDriverDni] = useState(() => localStorage.getItem(STORAGE_KEYS.DNI) || '');
  const [truckPlate, setTruckPlate] = useState(() => localStorage.getItem(STORAGE_KEYS.TRUCK) || '');
  const [trailerPlate, setTrailerPlate] = useState(() => localStorage.getItem(STORAGE_KEYS.TRAILER) || '');
  
  const [availableTransporters, setAvailableTransporters] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CUSTOM_TRANSPORTERS);
    return saved ? JSON.parse(saved) : DEFAULT_TRANSPORTERS;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<Vehicle[]>([]);
  const [selectedVins, setSelectedVins] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.VINS);
    return saved ? JSON.parse(saved) : [];
  });
  
  const [unitObservations, setUnitObservations] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.OBS_UNIT);
    return saved ? JSON.parse(saved) : {};
  });
  const [generalObservations, setGeneralObservations] = useState(() => localStorage.getItem(STORAGE_KEYS.OBS_GEN) || '');

  const [showPdiWarning, setShowPdiWarning] = useState(false);
  const [successMovement, setSuccessMovement] = useState<Movement | null>(null);
  
  // Print Preview State
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const companyLocations = useMemo(() => currentCompany?.locations || [], [currentCompany]);

  useEffect(() => {
    if (companyLocations.length > 0) {
      const isOriginValid = companyLocations.some(l => l.id === origin);
      const isDestValid = companyLocations.some(l => l.id === destination);
      if (origin && !isOriginValid) setOrigin('');
      if (destination && !isDestValid) setDestination('');
    }
  }, [companyLocations, origin, destination]);

  useEffect(() => localStorage.setItem(STORAGE_KEYS.ORIGIN, origin), [origin]);
  useEffect(() => localStorage.setItem(STORAGE_KEYS.DEST, destination), [destination]);
  useEffect(() => localStorage.setItem(STORAGE_KEYS.TRANS, transporter), [transporter]);
  useEffect(() => localStorage.setItem(STORAGE_KEYS.DRIVER, driverName), [driverName]);
  useEffect(() => localStorage.setItem(STORAGE_KEYS.DNI, driverDni), [driverDni]);
  useEffect(() => localStorage.setItem(STORAGE_KEYS.TRUCK, truckPlate), [truckPlate]);
  useEffect(() => localStorage.setItem(STORAGE_KEYS.TRAILER, trailerPlate), [trailerPlate]);
  useEffect(() => localStorage.setItem(STORAGE_KEYS.VINS, JSON.stringify(selectedVins)), [selectedVins]);
  useEffect(() => localStorage.setItem(STORAGE_KEYS.OBS_UNIT, JSON.stringify(unitObservations)), [unitObservations]);
  useEffect(() => localStorage.setItem(STORAGE_KEYS.OBS_GEN, generalObservations), [generalObservations]);
  useEffect(() => localStorage.setItem(STORAGE_KEYS.CUSTOM_TRANSPORTERS, JSON.stringify(availableTransporters)), [availableTransporters]);

  useEffect(() => {
    if (searchTerm.length > 1) {
      const lowerTerm = searchTerm.toLowerCase();
      const filtered = availableVehicles.filter(v => {
        const isAvailable = v.status === 'AVAILABLE' && !v.isLocked;
        const matchesOrigin = !origin || v.locationId === origin;
        const isNotSelected = !selectedVins.includes(v.vin);
        
        const matchesVin = v.vin.toLowerCase().includes(lowerTerm);
        const matchesPlate = v.plate && v.plate.toLowerCase().replace(/\s/g, '').includes(lowerTerm.replace(/\s/g, ''));
        const matchesModel = v.model.toLowerCase().includes(lowerTerm);

        return isAvailable && matchesOrigin && isNotSelected && (matchesVin || matchesPlate || matchesModel);
      });
      setSuggestions(filtered.slice(0, 6));
    } else {
      setSuggestions([]);
    }
  }, [searchTerm, availableVehicles, origin, selectedVins]);

  const handleAddVehicle = (vehicle: Vehicle) => {
    if (!origin) setOrigin(vehicle.locationId);
    setSelectedVins([...selectedVins, vehicle.vin]);
    setSearchTerm('');
    setSuggestions([]);
  };

  const handleRemoveVehicle = (vin: string) => {
    setSelectedVins(selectedVins.filter(v => v !== vin));
    const newObs = { ...unitObservations };
    delete newObs[vin];
    setUnitObservations(newObs);
  };

  const handleEmitRemito = () => {
    const hasUncheckedNew = selectedVins.some(vin => {
      const v = availableVehicles.find(veh => veh.vin === vin);
      return v && v.type === 'NEW' && !v.preDeliveryConfirmed;
    });
    if (hasUncheckedNew && !showPdiWarning) { setShowPdiWarning(true); return; }

    const newMovement: Movement = {
      id: `REM-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString(),
      originId: origin,
      destinationId: destination,
      transporter,
      driverName,
      truckPlate,
      trailerPlate,
      vehicleVins: selectedVins,
      status: 'PENDING',
      createdBy: 'sys_oper',
      observations: generalObservations,
    };
    createMovement(newMovement);
    setSuccessMovement(newMovement);
    setShowPdiWarning(false);
    
    // Clear storage except custom transporters
    handleClearStorage();
  };

  const handleClearStorage = () => {
    setOrigin(''); setDestination(''); setTransporter(''); setDriverName(''); setDriverDni('');
    setTruckPlate(''); setTrailerPlate(''); setSelectedVins([]); setUnitObservations({});
    setGeneralObservations('');
    Object.values(STORAGE_KEYS).forEach(key => { if (key !== STORAGE_KEYS.CUSTOM_TRANSPORTERS) localStorage.removeItem(key); });
  };

  const handleReset = () => {
    setSuccessMovement(null);
    handleClearStorage();
  };

  // Prepare data for the Remito Document
  const remitoVehicles = successMovement ? availableVehicles.filter(v => successMovement.vehicleVins.includes(v.vin)) : [];
  const originLoc = successMovement && currentCompany ? currentCompany.locations.find(l => l.id === successMovement.originId) : undefined;
  const destLoc = successMovement && currentCompany ? currentCompany.locations.find(l => l.id === successMovement.destinationId) : undefined;

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      
      <div className="flex items-center gap-4">
        <div className="p-4 bg-slate-900 text-white rounded-2xl shadow-xl shadow-slate-200">
          <ClipboardList size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic">Emisión de Traslado Inter-Planta</h2>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em]">Protocolo de Despacho Logístico MOVITRAK</p>
        </div>
      </div>

      {!successMovement ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* ... Existing Input Form Logic (Unchanged) ... */}
          <div className="lg:col-span-8 space-y-10">
            <div className="enterprise-card p-10 bg-white rounded-[2.5rem] border-2 border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                 <div className="w-1.5 h-6 bg-slate-900 rounded-full"></div>
                 <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">I. Ruta de Tráfico</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                     <MapPin size={12} className="text-slate-400" /> Planta / Sucursal de Origen
                  </label>
                  <div className="relative">
                    <select 
                      value={origin}
                      onChange={(e) => { setOrigin(e.target.value); setSelectedVins([]); }}
                      className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-slate-900 outline-none text-sm font-black text-slate-800 transition-all cursor-pointer appearance-none"
                    >
                      <option value="">-- Seleccionar Planta --</option>
                      {companyLocations.map(l => <option key={l.id} value={l.id}>📍 {l.name}</option>)}
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                       <ArrowRight size={18} className="rotate-90" />
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                     <Truck size={12} className="text-slate-400" /> Sucursal Destino Final
                  </label>
                  <div className="relative">
                    <select 
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-slate-900 outline-none text-sm font-black text-slate-800 transition-all cursor-pointer appearance-none"
                    >
                      <option value="">-- Seleccionar Arribo --</option>
                      {companyLocations.filter(l => l.id !== origin).map(l => <option key={l.id} value={l.id}>🚩 {l.name}</option>)}
                    </select>
                     <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                       <ArrowRight size={18} className="rotate-90" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="enterprise-card p-10 bg-white rounded-[2.5rem] border-2 border-slate-100 shadow-sm relative">
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-slate-900 rounded-full"></div>
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">II. Manifiesto de Unidades</h3>
                 </div>
                 <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {selectedVins.length} Unidades en Carga
                 </div>
              </div>

              {!origin && (
                <div className="bg-blue-50 border border-blue-100 p-5 rounded-2xl mb-8 flex items-start gap-4 animate-pulse">
                   <div className="p-2 bg-blue-100 rounded-xl text-blue-600 mt-0.5"><Info size={20} /></div>
                   <p className="text-xs text-blue-700 font-bold uppercase tracking-wide leading-relaxed">Debe seleccionar una Planta de Origen para filtrar automáticamente el stock disponible físicamente en esa sucursal.</p>
                </div>
              )}

              <div className="relative group mb-10 z-30">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors">
                   <Search size={24} />
                </div>
                <input 
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Escanee VIN o ingrese Patente / Modelo..."
                  className="w-full pl-16 pr-4 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-slate-900 outline-none text-lg font-bold text-slate-800 transition-all placeholder:text-slate-300 shadow-inner"
                />
                
                {suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-3 bg-white border-2 border-slate-200 rounded-3xl shadow-2xl overflow-hidden z-40 animate-in slide-in-from-top-2 duration-300">
                    {suggestions.map(s => (
                      <button 
                        key={s.vin} 
                        onClick={() => handleAddVehicle(s)}
                        className="w-full text-left p-5 hover:bg-slate-50 border-b border-slate-50 last:border-0 flex justify-between items-center group transition-all"
                      >
                        <div className="flex items-center gap-5">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-[10px] shadow-sm ${s.type === 'USED' ? 'bg-amber-100 text-amber-700' : 'bg-slate-900 text-white'}`}>
                             {s.type === 'USED' ? 'USD' : '0KM'}
                          </div>
                          <div>
                            <p className="font-mono font-black text-slate-900 text-lg tracking-widest uppercase">
                               {s.plate || s.vin.slice(-8)}
                            </p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              {s.brand} {s.model} • {s.color} {s.plate ? `(Chasis: ${s.vin.slice(-6)})` : ''}
                            </p>
                          </div>
                        </div>
                        <div className="bg-emerald-50 text-emerald-600 p-2.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all">
                           <Plus size={20} strokeWidth={3} />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                {selectedVins.map(vin => {
                  const v = availableVehicles.find(av => av.vin === vin);
                  return (
                    <div key={vin} className="bg-white p-6 rounded-3xl border-2 border-slate-100 relative group animate-in zoom-in-95 duration-200 shadow-sm hover:border-slate-200 transition-all">
                      <button 
                        onClick={() => handleRemoveVehicle(vin)} 
                        className="absolute top-6 right-6 text-slate-300 hover:text-red-500 transition-colors p-1"
                      >
                         <X size={20} />
                      </button>
                      <div className="flex items-center gap-3 mb-4">
                         <div className={`w-2.5 h-2.5 rounded-full ${v?.type === 'USED' ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
                         <div className="flex items-center gap-2">
                            <Tag size={14} className="text-slate-400" />
                            <p className="font-mono font-black text-slate-900 text-sm tracking-[0.1em] uppercase">{v?.plate || vin}</p>
                         </div>
                      </div>
                      <div className="mb-4">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight">{v?.brand} {v?.model}</p>
                      </div>
                      <textarea 
                        placeholder="Reportar estado de carga o daños si existen..."
                        value={unitObservations[vin] || ''}
                        onChange={(e) => setUnitObservations({...unitObservations, [vin]: e.target.value})}
                        className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none text-xs font-bold text-slate-600 focus:bg-white focus:border-slate-300 transition-all resize-none h-20"
                      />
                    </div>
                  );
                })}
                {selectedVins.length === 0 && (
                  <div className="col-span-full py-20 text-center border-4 border-dashed border-slate-50 rounded-[3rem] text-slate-300">
                    <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                       <Database size={40} />
                    </div>
                    <p className="text-sm font-black uppercase tracking-[0.3em]">Lista de carga desierta</p>
                    <p className="text-[10px] font-bold uppercase mt-2">Inicie la carga escaneando el VIN o Patente</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl">
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-1.5 h-6 bg-brand-500 rounded-full"></div>
                  <h3 className="text-xs font-black uppercase tracking-widest">III. Logística</h3>
               </div>
               
               <div className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">Empresa de Transporte</label>
                     <div className="relative">
                       <select 
                         value={transporter}
                         onChange={(e) => setTransporter(e.target.value)}
                         className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-xl outline-none text-sm font-bold text-white focus:bg-white/20 transition-all appearance-none"
                       >
                         <option value="" className="text-slate-900">-- Seleccionar --</option>
                         {availableTransporters.map(t => <option key={t} value={t} className="text-slate-900">{t}</option>)}
                       </select>
                       <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50"><ArrowRight size={14} className="rotate-90" /></div>
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">Datos del Chofer</label>
                     <div className="grid grid-cols-3 gap-3">
                        <input type="text" placeholder="Nombre Completo" value={driverName} onChange={(e) => setDriverName(e.target.value)} className="col-span-2 px-4 py-3 bg-white/10 border border-white/10 rounded-xl outline-none text-sm font-bold text-white placeholder:text-slate-600 focus:bg-white/20 transition-all" />
                        <input type="text" placeholder="DNI" value={driverDni} onChange={(e) => setDriverDni(e.target.value)} className="px-4 py-3 bg-white/10 border border-white/10 rounded-xl outline-none text-sm font-bold text-white placeholder:text-slate-600 focus:bg-white/20 transition-all text-center" />
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">Unidad de Transporte</label>
                     <div className="grid grid-cols-2 gap-3">
                        <input type="text" placeholder="Patente Tractor" value={truckPlate} onChange={(e) => setTruckPlate(e.target.value.toUpperCase())} className="px-4 py-3 bg-white/10 border border-white/10 rounded-xl outline-none text-sm font-black text-white placeholder:text-slate-600 focus:bg-white/20 transition-all text-center uppercase" />
                        <input type="text" placeholder="Patente Acoplado" value={trailerPlate} onChange={(e) => setTrailerPlate(e.target.value.toUpperCase())} className="px-4 py-3 bg-white/10 border border-white/10 rounded-xl outline-none text-sm font-black text-white placeholder:text-slate-600 focus:bg-white/20 transition-all text-center uppercase" />
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-sm space-y-4">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Observaciones Generales Remito</label>
                  <textarea 
                    value={generalObservations} 
                    onChange={(e) => setGeneralObservations(e.target.value)}
                    placeholder="Instrucciones para transportista, alertas de seguridad, etc."
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none text-xs font-bold text-slate-600 focus:bg-white focus:border-slate-300 transition-all resize-none h-24"
                  />
               </div>

               {showPdiWarning && (
                 <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-start gap-3 animate-in shake">
                    <Info size={18} className="text-red-500 shrink-0 mt-0.5" />
                    <div className="flex-1">
                       <p className="text-xs font-black text-red-700 uppercase mb-1">¡Alerta de Calidad!</p>
                       <p className="text-[10px] font-medium text-red-600 leading-tight">Hay unidades 0KM seleccionadas que NO tienen la PDI (Pre-Entrega) validada. Esto viola el protocolo de calidad.</p>
                       <div className="mt-3 flex gap-2">
                          <button onClick={() => setShowPdiWarning(false)} className="flex-1 py-2 bg-white border border-red-200 rounded-lg text-[10px] font-bold uppercase text-red-500 hover:bg-red-50">Cancelar</button>
                          <button onClick={handleEmitRemito} className="flex-1 py-2 bg-red-600 text-white rounded-lg text-[10px] font-bold uppercase shadow-lg shadow-red-200 hover:bg-red-700">Autorizar Igual</button>
                       </div>
                    </div>
                 </div>
               )}

               <button 
                 onClick={handleEmitRemito}
                 disabled={selectedVins.length === 0 || !origin || !destination || !transporter}
                 className="w-full py-5 bg-brand-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-brand-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
               >
                 <ClipboardList size={18} />
                 Emitir Remito Oficial
               </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto text-center py-10 animate-in zoom-in-95 duration-500">
           <div className="bg-white rounded-[3rem] shadow-2xl p-12 border border-slate-100">
              <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                 <CheckCircle size={48} className="text-emerald-600" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-2">Operación Exitosa</h2>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-10">Remito Nº {successMovement.id} Generado</p>
              
              <div className="flex flex-col gap-4">
                 <button 
                   onClick={() => setIsPreviewOpen(true)}
                   className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-slate-800 active:scale-95 transition-all flex items-center justify-center gap-3"
                 >
                   <Printer size={18} />
                   Imprimir Remito Oficial
                 </button>
                 
                 <button 
                   onClick={handleReset}
                   className="w-full py-5 bg-white border-2 border-slate-100 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-50 hover:text-slate-600 transition-all flex items-center justify-center gap-3"
                 >
                   <ArrowLeft size={18} />
                   Volver a Operaciones
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Print Preview Modal - Replaces direct printing */}
      <PrintPreviewModal 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)}
        title={`Remito de Traslado #${successMovement?.id || ''}`}
      >
        {successMovement && currentCompany && (
          <RemitoDocument
            movement={successMovement}
            company={currentCompany}
            vehicles={remitoVehicles}
            origin={originLoc}
            destination={destLoc}
            driverDni={driverDni}
            truckPlate={truckPlate}
            trailerPlate={trailerPlate}
            unitObservations={unitObservations}
          />
        )}
      </PrintPreviewModal>
    </div>
  );
};
