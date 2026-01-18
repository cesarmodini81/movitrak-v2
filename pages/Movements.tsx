
import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import { LOCATION_MAP } from '../constants';
import { 
  Truck, Plus, X, ClipboardList, MapPin, Info, Search, 
  CheckCircle, Printer, ArrowLeft, PlusCircle, Box, Loader2 
} from 'lucide-react';
import { Movement, Vehicle, CalendarEvent } from '../types';
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

const DEFAULT_TRANSPORTERS = ['Logística Nation', 'Logística Escobar', 'Logística Tercerizada'];

export const Movements: React.FC = () => {
  const { availableVehicles, currentCompany, createMovement, calendarEvents } = useApp();
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // New Transport Modal State
  const [isAddTransportOpen, setIsAddTransportOpen] = useState(false);
  const [newTransportName, setNewTransportName] = useState('');

  const companyLocations = useMemo(() => currentCompany?.locations || [], [currentCompany]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORIGIN, origin);
    localStorage.setItem(STORAGE_KEYS.DEST, destination);
    localStorage.setItem(STORAGE_KEYS.TRANS, transporter);
    localStorage.setItem(STORAGE_KEYS.DRIVER, driverName);
    localStorage.setItem(STORAGE_KEYS.DNI, driverDni);
    localStorage.setItem(STORAGE_KEYS.TRUCK, truckPlate);
    localStorage.setItem(STORAGE_KEYS.TRAILER, trailerPlate);
    localStorage.setItem(STORAGE_KEYS.VINS, JSON.stringify(selectedVins));
    localStorage.setItem(STORAGE_KEYS.OBS_UNIT, JSON.stringify(unitObservations));
    localStorage.setItem(STORAGE_KEYS.OBS_GEN, generalObservations);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_TRANSPORTERS, JSON.stringify(availableTransporters));
  }, [origin, destination, transporter, driverName, driverDni, truckPlate, trailerPlate, selectedVins, unitObservations, generalObservations, availableTransporters]);

  // FILTRADO OPTIMIZADO PARA BUSCADOR VIN/PATENTE
  useEffect(() => {
    if (searchTerm.trim().length > 1) {
      const lowerTerm = searchTerm.toLowerCase().replace(/\s/g, '');
      const filtered = availableVehicles.filter(v => {
        const isAvailable = v.status === 'AVAILABLE' && !v.isLocked;
        const isNotSelected = !selectedVins.includes(v.vin);
        
        const matchesVin = v.vin.toLowerCase().includes(lowerTerm);
        const matchesPlate = v.plate && v.plate.toLowerCase().replace(/\s/g, '').includes(lowerTerm);
        const matchesModel = v.model.toLowerCase().includes(lowerTerm);

        return isAvailable && isNotSelected && (matchesVin || matchesPlate || matchesModel);
      });
      setSuggestions(filtered.slice(0, 6));
    } else {
      setSuggestions([]);
    }
  }, [searchTerm, availableVehicles, selectedVins]);

  const handleAddVehicle = (vehicle: Vehicle) => {
    const event = calendarEvents.find(e => e.vehicleVin === vehicle.vin && e.status === 'PROGRAMADO');
    if (!origin) setOrigin(vehicle.locationId);
    if (!destination && event) setDestination(event.destinationId);
    setSelectedVins([...selectedVins, vehicle.vin]);
    setSearchTerm('');
    setSuggestions([]);
  };

  const handleRemoveVehicle = (vin: string) => {
    const newSelected = selectedVins.filter(v => v !== vin);
    setSelectedVins(newSelected);
    if (newSelected.length === 0) {
      setOrigin('');
      setDestination('');
    }
    const newObs = { ...unitObservations };
    delete newObs[vin];
    setUnitObservations(newObs);
  };

  const handleEmitRemito = async () => {
    const hasUncheckedNew = selectedVins.some(vin => {
      const v = availableVehicles.find(veh => veh.vin === vin);
      return v && v.type === 'NEW' && !v.preDeliveryConfirmed;
    });
    if (hasUncheckedNew && !showPdiWarning) { setShowPdiWarning(true); return; }

    setIsSubmitting(true);

    const newMovement: Movement = {
      id: `REM-${Date.now().toString().slice(-8)}`,
      date: new Date().toISOString(),
      originId: origin,
      destinationId: destination,
      transporter,
      driverName,
      truckPlate,
      trailerPlate,
      vehicleVins: selectedVins,
      status: 'PENDING',
      createdBy: currentCompany?.name || 'sys_oper',
      observations: generalObservations,
    };

    try {
      createMovement(newMovement);
      setSuccessMovement(newMovement);
      setShowPdiWarning(false);
      handleClearStorage();
      setIsPreviewOpen(true);
    } catch (err) {
      console.error("Error al emitir remito:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearStorage = () => {
    setOrigin(''); setDestination(''); setTransporter(''); setDriverName(''); setDriverDni('');
    setTruckPlate(''); setTrailerPlate(''); setSelectedVins([]); setUnitObservations({});
    setGeneralObservations('');
    Object.values(STORAGE_KEYS).forEach(key => { if (key !== STORAGE_KEYS.CUSTOM_TRANSPORTERS) localStorage.removeItem(key); });
  };

  const handleAddNewTransport = () => {
    if (!newTransportName.trim()) return;
    if (!availableTransporters.includes(newTransportName)) {
      setAvailableTransporters(prev => [...prev, newTransportName]);
    }
    setTransporter(newTransportName);
    setIsAddTransportOpen(false);
    setNewTransportName('');
  };

  const remitoVehicles = useMemo(() => 
    successMovement ? availableVehicles.filter(v => successMovement.vehicleVins.includes(v.vin)) : [],
    [successMovement, availableVehicles]
  );
  
  const originLoc = useMemo(() => 
    successMovement && currentCompany ? currentCompany.locations.find(l => l.id === successMovement.originId) : undefined,
    [successMovement, currentCompany]
  );
  
  const destLoc = useMemo(() => 
    successMovement && currentCompany ? currentCompany.locations.find(l => l.id === successMovement.destinationId) : undefined,
    [successMovement, currentCompany]
  );

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-500 pb-24 pt-20 md:pt-24 max-w-[1400px] mx-auto px-4">
      
      {/* HEADER PRINCIPAL */}
      <div className="flex items-center gap-5 no-print mb-6">
        <div className="p-4 bg-slate-900 text-white rounded-xl shadow-xl">
          <ClipboardList size={36} />
        </div>
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold text-slate-800 tracking-tight uppercase leading-none">EMISIÓN DE TRASLADO</h2>
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest mt-1">PROTOCOLO DE DESPACHO LOGÍSTICO</p>
        </div>
      </div>

      {!successMovement ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 no-print">
          
          {/* COLUMNA IZQUIERDA: I y II */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* SECCIÓN I: RUTA DE TRÁFICO */}
            <div className="bg-white p-6 lg:p-8 rounded-xl border border-gray-300 shadow-lg relative">
              <div className="flex items-center gap-4 mb-10 border-b border-gray-100 pb-4">
                 <MapPin size={32} className="text-slate-900" strokeWidth={2.5} />
                 <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">I. Ruta de Tráfico</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-widest ml-1">PLANTA / SUCURSAL DE ORIGEN</label>
                  <select 
                    value={origin}
                    onChange={(e) => { setOrigin(e.target.value); setSelectedVins([]); }}
                    className="w-full px-4 py-3 border-gray-400 border rounded-lg focus:border-blue-600 outline-none text-slate-900 font-semibold shadow-sm transition-all bg-white"
                  >
                    <option value="">-- Seleccionar Planta --</option>
                    {companyLocations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-widest ml-1">SUCURSAL DESTINO FINAL</label>
                  <select 
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full px-4 py-3 border-gray-400 border rounded-lg focus:border-blue-600 outline-none text-slate-900 font-semibold shadow-sm transition-all bg-white"
                  >
                    <option value="">-- Seleccionar Arribo --</option>
                    {companyLocations.filter(l => l.id !== origin).map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* SECCIÓN II: MANIFIESTO DE UNIDADES */}
            <div className="bg-white p-6 lg:p-8 rounded-xl border border-gray-300 shadow-lg relative">
              <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
                 <div className="flex items-center gap-4">
                    <Box size={32} className="text-slate-900" strokeWidth={2.5} />
                    <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">II. Manifiesto de Unidades</h3>
                 </div>
                 <div className="bg-slate-100 border border-slate-200 text-slate-900 px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-widest shadow-sm">
                    {selectedVins.length} Unidades
                 </div>
              </div>

              <div className="relative mb-8 group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                   <Search size={24} />
                </div>
                <input 
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Escanee VIN o ingrese Patente..."
                  className="w-full pl-14 pr-6 py-4 border border-gray-400 rounded-lg focus:border-blue-600 outline-none text-lg font-semibold text-slate-900 transition-all shadow-sm bg-white"
                />
                
                {suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-xl shadow-2xl overflow-hidden z-40">
                    {suggestions.map(s => (
                      <button key={s.vin} onClick={() => handleAddVehicle(s)} className="w-full text-left p-4 hover:bg-blue-50 border-b border-gray-100 last:border-0 flex justify-between items-center group transition-colors">
                        <div className="flex-1">
                          <p className="font-mono font-bold text-slate-900 text-base tracking-wider">{s.plate || s.vin}</p>
                          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">{s.brand} {s.model} • {s.color}</p>
                        </div>
                        <Plus size={20} className="text-blue-600 group-hover:scale-110 transition-transform" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {selectedVins.length > 0 ? (
                <div className="space-y-4">
                  {selectedVins.map((vin, idx) => {
                    const v = availableVehicles.find(av => av.vin === vin);
                    return (
                      <div key={vin} className="bg-slate-50 p-6 rounded-xl border border-gray-200 relative group animate-in zoom-in-95 hover:border-gray-400 transition-all">
                        <button onClick={() => handleRemoveVehicle(vin)} className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition-colors">
                          <X size={24} />
                        </button>
                        <div className="flex items-center gap-5 mb-4">
                           <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-gray-200 text-slate-900 font-bold shadow-sm text-lg">
                              {idx + 1}
                           </div>
                           <div>
                              <p className="font-mono font-bold text-slate-900 text-lg tracking-widest leading-none">{v?.plate || vin}</p>
                              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mt-1">{v?.brand} {v?.model} — {v?.color}</p>
                           </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase text-gray-500 ml-1">OBSERVACIONES ESPECÍFICAS DE LA UNIDAD</label>
                          <textarea 
                            placeholder="Reportar estado estético, llaves faltantes, etc..."
                            value={unitObservations[vin] || ''}
                            onChange={(e) => setUnitObservations({...unitObservations, [vin]: e.target.value})}
                            className="w-full p-4 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-slate-800 focus:border-blue-600 outline-none transition-all resize-none h-20 shadow-inner"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-xl bg-slate-50">
                   <p className="text-base font-bold text-gray-300 uppercase tracking-[0.2em]">LISTA VACÍA</p>
                </div>
              )}
            </div>
          </div>

          {/* COLUMNA DERECHA: III y Observaciones */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* SECCIÓN III: LOGÍSTICA */}
            <div className="bg-white p-6 lg:p-8 rounded-xl border border-gray-300 shadow-lg relative">
               <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-4">
                  <Truck size={32} className="text-slate-900" strokeWidth={2.5} />
                  <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">III. Logística</h3>
               </div>
               
               <div className="space-y-6">
                  <div className="space-y-2">
                     <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-bold text-gray-600 uppercase tracking-widest ml-1">EMPRESA DE TRANSPORTE</label>
                        <button 
                           onClick={() => setIsAddTransportOpen(true)}
                           className="text-blue-600 hover:text-blue-800 p-1 bg-blue-50 rounded-full transition-all hover:scale-110"
                        >
                           <PlusCircle size={22} />
                        </button>
                     </div>
                     <select 
                       value={transporter} 
                       onChange={(e) => setTransporter(e.target.value)} 
                       className="w-full px-4 py-3 border border-gray-400 rounded-lg text-slate-900 font-semibold outline-none focus:border-blue-600 shadow-sm bg-white"
                     >
                        <option value="">-- Seleccionar --</option>
                        {availableTransporters.map(t => <option key={t} value={t}>{t}</option>)}
                     </select>
                  </div>
                  
                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">DATOS DEL CHOFER</label>
                    <input type="text" placeholder="Nombre Completo" value={driverName} onChange={(e) => setDriverName(e.target.value)} className="w-full px-4 py-3 border border-gray-400 rounded-lg text-slate-900 font-semibold outline-none focus:border-blue-600 shadow-sm bg-white" />
                    <input type="text" placeholder="DNI" value={driverDni} onChange={(e) => setDriverDni(e.target.value)} className="w-full px-4 py-3 border border-gray-400 rounded-lg text-slate-900 font-semibold outline-none focus:border-blue-600 shadow-sm bg-white" />
                  </div>

                  <div className="space-y-2 pt-4">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">PATENTES</label>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-1">
                          <input type="text" placeholder="TRACTOR" value={truckPlate} onChange={(e) => setTruckPlate(e.target.value.toUpperCase())} className="w-full px-3 py-3 border border-gray-400 rounded-lg uppercase text-center font-bold shadow-sm focus:border-blue-600 outline-none bg-white placeholder:text-gray-300" />
                       </div>
                       <div className="space-y-1">
                          <input type="text" placeholder="ACOPLADO" value={trailerPlate} onChange={(e) => setTrailerPlate(e.target.value.toUpperCase())} className="w-full px-3 py-3 border border-gray-400 rounded-lg uppercase text-center font-bold shadow-sm focus:border-blue-600 outline-none bg-white placeholder:text-gray-300" />
                       </div>
                    </div>
                  </div>
               </div>
            </div>

            {/* SECCIÓN OBSERVACIONES GENERALES Y BOTÓN EMITIR */}
            <div className="bg-white p-6 lg:p-8 rounded-xl border border-gray-300 shadow-lg space-y-6">
               <div className="space-y-2">
                 <label className="text-xs font-bold text-gray-600 uppercase block tracking-widest ml-1">OBSERVACIONES GENERALES</label>
                 <textarea 
                   value={generalObservations} 
                   onChange={(e) => setGeneralObservations(e.target.value)} 
                   placeholder="Instrucciones adicionales para el remito..." 
                   className="w-full p-4 border border-gray-400 rounded-lg text-sm font-semibold focus:border-blue-600 outline-none resize-none h-40 shadow-inner bg-white" 
                 />
               </div>

               {showPdiWarning && (
                 <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-600 flex gap-3 animate-in slide-in-from-left">
                    <Info size={24} className="text-red-600 shrink-0 mt-0.5" />
                    <div>
                       <p className="text-sm font-bold text-red-700 uppercase">¡PDI Pendiente!</p>
                       <p className="text-[10px] font-semibold text-red-600 mb-2 leading-tight">Existen unidades en el manifiesto sin validación técnica certificada.</p>
                       <button onClick={handleEmitRemito} className="px-3 py-1.5 bg-red-600 text-white rounded-lg font-bold text-[10px] uppercase tracking-widest w-full hover:bg-red-700 transition-colors shadow-md">EMITIR BAJO RESPONSABILIDAD</button>
                    </div>
                 </div>
               )}

               <button 
                 onClick={handleEmitRemito}
                 disabled={selectedVins.length === 0 || !origin || !destination || !transporter || isSubmitting}
                 className="w-full py-5 bg-slate-900 text-white rounded-xl font-bold text-sm uppercase tracking-[0.15em] shadow-2xl hover:bg-slate-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex justify-center items-center gap-3 transform active:scale-[0.98]"
               >
                 {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : null}
                 {isSubmitting ? 'PROCESANDO...' : 'EMITIR REMITO OFICIAL'}
               </button>
            </div>
          </div>
        </div>
      ) : (
        /* VISTA DE ÉXITO POST-EMISIÓN */
        <div className="max-w-3xl mx-auto text-center py-12 animate-in zoom-in-95 no-print">
           <div className="bg-white rounded-[2rem] shadow-2xl p-12 border border-gray-200">
              <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                 <CheckCircle size={56} className="text-emerald-600" />
              </div>
              <h2 className="text-4xl font-bold text-slate-900 uppercase tracking-tight mb-2">REMITO Nº {successMovement.id}</h2>
              <p className="text-base font-bold text-gray-400 uppercase tracking-widest mb-10 italic">Operación registrada con éxito por {successMovement.createdBy}</p>
              
              <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
                  <button 
                      className="w-full bg-blue-900 hover:bg-blue-950 text-white font-bold py-5 rounded-xl shadow-xl text-lg uppercase tracking-widest flex items-center justify-center gap-4 transition-all hover:scale-[1.02] active:scale-[0.98]"
                      onClick={() => setIsPreviewOpen(true)}
                  >
                      <Printer size={28} />
                      IMPRIMIR REMITO
                  </button>

                 <button onClick={() => setSuccessMovement(null)} className="w-full py-4 bg-slate-50 border border-gray-300 text-slate-600 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white hover:border-slate-900 hover:text-slate-900 transition-all flex items-center justify-center gap-2">
                   <ArrowLeft size={18} /> Volver a Nueva Operación
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* MODAL ALTA DE TRANSPORTE RÁPIDO */}
      {isAddTransportOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 border border-gray-200 animate-in zoom-in-95">
              <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                 <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight flex items-center gap-3">
                    <PlusCircle size={28} className="text-blue-600" />
                    Alta de Transporte
                 </h3>
                 <button onClick={() => setIsAddTransportOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                    <X size={28} />
                 </button>
              </div>
              <div className="space-y-5">
                 <div>
                    <label className="text-[11px] font-bold uppercase text-gray-500 ml-1 tracking-widest">RAZÓN SOCIAL / NOMBRE</label>
                    <input type="text" value={newTransportName} onChange={e => setNewTransportName(e.target.value)} className="w-full p-4 border border-gray-300 rounded-lg font-bold outline-none focus:border-blue-600 focus:bg-slate-50 transition-all text-lg" placeholder="Nombre de la empresa" />
                 </div>
                 <div className="flex gap-4 pt-4">
                    <button onClick={() => setIsAddTransportOpen(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-gray-200 transition-colors">CANCELAR</button>
                    <button onClick={handleAddNewTransport} className="flex-1 py-4 bg-blue-600 text-white rounded-lg font-bold text-xs uppercase tracking-widest shadow-lg hover:bg-blue-700 transition-colors">GUARDAR ALTA</button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* MODAL DE VISTA PREVIA E IMPRESIÓN OFICIAL */}
      {successMovement && (
        <PrintPreviewModal 
          isOpen={isPreviewOpen} 
          onClose={() => setIsPreviewOpen(false)}
          title={`Remito Oficial Nº ${successMovement.id}`}
        >
          <RemitoDocument 
            movement={successMovement}
            company={currentCompany!}
            vehicles={remitoVehicles}
            origin={originLoc}
            destination={destLoc}
            driverDni={driverDni}
            truckPlate={truckPlate}
            trailerPlate={trailerPlate}
            unitObservations={unitObservations}
          />
        </PrintPreviewModal>
      )}
    </div>
  );
};
