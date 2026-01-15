
import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import { LOCATION_MAP } from '../constants';
import { Truck, Plus, X, ClipboardList, MapPin, Info, Search, CheckCircle, Printer, ArrowLeft, PlusCircle, Box, Loader2 } from 'lucide-react';
import { Movement, Vehicle } from '../types';
import { RemitoDocument } from '../components/RemitoDocument';

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Transport Modal State
  const [isAddTransportOpen, setIsAddTransportOpen] = useState(false);
  const [newTransport, setNewTransport] = useState({
    name: '',
    driver: '',
    dni: '',
    truck: '',
    trailer: ''
  });

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

    // Attempt DB Sync
    try {
      const res = await fetch('/api/movements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMovement)
      });
      if (!res.ok) throw new Error('API_ERROR');
    } catch (e) {
      console.warn('API Offline, saving locally via AppContext');
    }

    createMovement(newMovement);
    setSuccessMovement(newMovement);
    setShowPdiWarning(false);
    handleClearStorage();
    setIsSubmitting(false);
  };

  const handleClearStorage = () => {
    setOrigin(''); setDestination(''); setTransporter(''); setDriverName(''); setDriverDni('');
    setTruckPlate(''); setTrailerPlate(''); setSelectedVins([]); setUnitObservations({});
    setGeneralObservations('');
    Object.values(STORAGE_KEYS).forEach(key => { if (key !== STORAGE_KEYS.CUSTOM_TRANSPORTERS) localStorage.removeItem(key); });
  };

  const handleReset = () => {
    setSuccessMovement(null);
  };

  const handleAddNewTransport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTransport.name.trim()) return;

    if (!availableTransporters.includes(newTransport.name)) {
      setAvailableTransporters(prev => [...prev, newTransport.name]);
    }
    setTransporter(newTransport.name);
    setDriverName(newTransport.driver);
    setDriverDni(newTransport.dni);
    setTruckPlate(newTransport.truck.toUpperCase());
    setTrailerPlate(newTransport.trailer.toUpperCase());
    
    setIsAddTransportOpen(false);
    setNewTransport({ name: '', driver: '', dni: '', truck: '', trailer: '' });
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
    // PADDING TOP AUMENTADO (pt-20 md:pt-24) para evitar solapamiento con Topbar
    <div className="space-y-8 lg:space-y-10 animate-in slide-in-from-bottom-4 duration-500 pb-24 pt-20 md:pt-24">
      
      {/* Page Title */}
      <div className="flex items-center gap-5 no-print">
        <div className="p-4 bg-slate-800 text-white rounded-xl shadow-lg">
          <ClipboardList size={28} />
        </div>
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold text-slate-800 tracking-tight uppercase">Emisión de Traslado</h2>
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest mt-1">Protocolo de Despacho Logístico</p>
        </div>
      </div>

      {!successMovement ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 no-print">
          
          {/* COLUMNA IZQUIERDA (8) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* I. RUTA DE TRÁFICO */}
            <div className="bg-white p-6 lg:p-8 rounded-xl border border-gray-600 shadow-lg">
              <div className="flex items-center gap-3 mb-6 border-b border-gray-200 pb-3">
                 <div className="p-1.5 bg-slate-800 text-white rounded">
                    <MapPin size={18} />
                 </div>
                 <h3 className="text-xl font-bold text-slate-800">I. Ruta de Tráfico</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-600 uppercase ml-1">
                     Planta / Sucursal de Origen
                  </label>
                  <select 
                    value={origin}
                    onChange={(e) => { setOrigin(e.target.value); setSelectedVins([]); }}
                    className="w-full px-4 py-3 bg-white border border-gray-400 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none text-slate-900 font-semibold transition-all cursor-pointer shadow-sm"
                  >
                    <option value="">-- Seleccionar Planta --</option>
                    {companyLocations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-600 uppercase ml-1">
                     Sucursal Destino Final
                  </label>
                  <select 
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-400 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none text-slate-900 font-semibold transition-all cursor-pointer shadow-sm"
                  >
                    <option value="">-- Seleccionar Arribo --</option>
                    {companyLocations.filter(l => l.id !== origin).map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* II. MANIFIESTO DE UNIDADES */}
            <div className="bg-white p-6 lg:p-8 rounded-xl border border-gray-600 shadow-lg">
              <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-3">
                 <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-slate-800 text-white rounded">
                       <Box size={18} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">II. Manifiesto de Unidades</h3>
                 </div>
                 <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full border border-gray-300">
                    {selectedVins.length} Unidades
                 </span>
              </div>

              <div className="relative mb-8">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                   <Search size={20} />
                </div>
                <input 
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Escanee VIN o ingrese Patente..."
                  className="w-full pl-12 pr-4 py-4 bg-white border border-gray-400 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none text-lg font-bold text-slate-900 transition-all shadow-sm"
                />
                
                {suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-2xl overflow-hidden z-40">
                    {suggestions.map(s => (
                      <button key={s.vin} onClick={() => handleAddVehicle(s)} className="w-full text-left p-4 hover:bg-blue-50 border-b border-gray-100 last:border-0 flex justify-between items-center group transition-colors">
                        <div>
                          <p className="font-mono font-bold text-slate-900 text-base">{s.plate || s.vin.slice(-8)}</p>
                          <p className="text-xs font-semibold text-gray-500 uppercase">{s.brand} {s.model} • {s.color}</p>
                        </div>
                        <Plus size={18} className="text-blue-600 opacity-0 group-hover:opacity-100 transition-all" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {selectedVins.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedVins.map(vin => {
                    const v = availableVehicles.find(av => av.vin === vin);
                    return (
                      <div key={vin} className="bg-gray-50 p-5 rounded-lg border border-gray-300 relative group animate-in zoom-in-95 shadow-sm hover:shadow-md transition-shadow">
                        <button onClick={() => handleRemoveVehicle(vin)} className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-white"><X size={18} /></button>
                        <p className="font-mono font-bold text-slate-900 text-sm mb-1">{v?.plate || vin}</p>
                        <p className="text-xs font-bold text-gray-600 uppercase mb-3">{v?.brand} {v?.model}</p>
                        <textarea 
                          placeholder="Observaciones de la unidad..."
                          value={unitObservations[vin] || ''}
                          onChange={(e) => setUnitObservations({...unitObservations, [vin]: e.target.value})}
                          className="w-full p-3 bg-white border border-gray-300 rounded-md text-xs font-medium text-slate-700 focus:border-blue-500 outline-none transition-all resize-none h-16"
                        />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-10 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                   <p className="text-sm font-bold text-gray-400 uppercase">Lista vacía</p>
                </div>
              )}
            </div>
          </div>

          {/* COLUMNA DERECHA (4) */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* III. LOGÍSTICA */}
            <div className="bg-white p-6 lg:p-8 rounded-xl border border-gray-600 shadow-lg">
               <div className="flex items-center gap-3 mb-6 border-b border-gray-200 pb-3">
                  <div className="p-1.5 bg-slate-800 text-white rounded">
                     <Truck size={18} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">III. Logística</h3>
               </div>
               
               <div className="space-y-5">
                  <div className="space-y-1.5">
                     <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-bold uppercase text-gray-600">Empresa de Transporte</label>
                        <button 
                           onClick={() => setIsAddTransportOpen(true)}
                           className="text-blue-600 hover:text-blue-800 transition-colors"
                           title="Agregar nuevo transporte"
                        >
                           <PlusCircle size={16} />
                        </button>
                     </div>
                     <select 
                       value={transporter} 
                       onChange={(e) => setTransporter(e.target.value)} 
                       className="w-full px-4 py-3 bg-white border border-gray-400 rounded-lg text-slate-900 font-semibold outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 shadow-sm"
                     >
                        <option value="">-- Seleccionar --</option>
                        {availableTransporters.map(t => <option key={t} value={t}>{t}</option>)}
                     </select>
                  </div>
                  
                  <div className="space-y-1.5">
                     <label className="text-xs font-bold uppercase text-gray-600">Datos del Chofer</label>
                     <input 
                       type="text" 
                       placeholder="Nombre Completo" 
                       value={driverName} 
                       onChange={(e) => setDriverName(e.target.value)} 
                       className="w-full px-4 py-3 bg-white border border-gray-400 rounded-lg text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 mb-2 shadow-sm text-sm font-medium" 
                     />
                     <input 
                       type="text" 
                       placeholder="DNI" 
                       value={driverDni} 
                       onChange={(e) => setDriverDni(e.target.value)} 
                       className="w-full px-4 py-3 bg-white border border-gray-400 rounded-lg text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 shadow-sm text-sm font-medium" 
                     />
                  </div>
                  
                  <div className="space-y-1.5">
                     <label className="text-xs font-bold uppercase text-gray-600">Patentes</label>
                     <div className="grid grid-cols-2 gap-3">
                        <input 
                          type="text" 
                          placeholder="Tractor" 
                          value={truckPlate} 
                          onChange={(e) => setTruckPlate(e.target.value.toUpperCase())} 
                          className="px-4 py-3 bg-white border border-gray-400 rounded-lg text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 uppercase text-center font-bold shadow-sm" 
                        />
                        <input 
                          type="text" 
                          placeholder="Acoplado" 
                          value={trailerPlate} 
                          onChange={(e) => setTrailerPlate(e.target.value.toUpperCase())} 
                          className="px-4 py-3 bg-white border border-gray-400 rounded-lg text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 uppercase text-center font-bold shadow-sm" 
                        />
                     </div>
                  </div>
               </div>
            </div>

            {/* OBSERVACIONES Y ACCIONES */}
            <div className="bg-white p-6 lg:p-8 rounded-xl border border-gray-600 shadow-lg">
               <div className="mb-6">
                 <label className="text-xs font-bold text-gray-600 uppercase mb-2 block">Observaciones Generales</label>
                 <textarea 
                   value={generalObservations} 
                   onChange={(e) => setGeneralObservations(e.target.value)} 
                   placeholder="Instrucciones adicionales para el remito..." 
                   className="w-full p-4 bg-white border border-gray-400 rounded-lg text-sm font-medium text-slate-800 focus:border-blue-600 outline-none transition-all resize-none h-32 shadow-sm" 
                 />
               </div>

               {showPdiWarning && (
                 <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500 mb-6 animate-in shake flex gap-3">
                    <Info size={20} className="text-red-600 shrink-0" />
                    <div>
                       <p className="text-sm font-bold text-red-700 uppercase mb-1">¡PDI Pendiente Detectado!</p>
                       <p className="text-xs text-red-600 mb-3">Hay unidades nuevas sin validación técnica confirmada.</p>
                       <button onClick={handleEmitRemito} className="px-4 py-2 bg-red-600 text-white rounded font-bold text-xs uppercase shadow-md hover:bg-red-700 w-full">Emitir Igual (Bajo Responsabilidad)</button>
                    </div>
                 </div>
               )}

               <button 
                 onClick={handleEmitRemito}
                 disabled={selectedVins.length === 0 || !origin || !destination || !transporter || isSubmitting}
                 className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-sm uppercase tracking-widest shadow-xl hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex justify-center items-center gap-2"
               >
                 {isSubmitting && <Loader2 size={18} className="animate-spin" />}
                 {isSubmitting ? 'Procesando...' : 'Emitir Remito Oficial'}
               </button>
            </div>
          </div>
        </div>
      ) : (
        /* SUCCESS SCREEN */
        <div className="max-w-3xl mx-auto text-center py-10 animate-in zoom-in-95 no-print">
           <div className="bg-white rounded-3xl shadow-2xl p-12 border border-gray-300">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                 <CheckCircle size={54} className="text-green-600" />
              </div>
              <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight mb-2">Remito Nº {successMovement.id}</h2>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-12">Emitido correctamente por {successMovement.createdBy}</p>
              
              <div className="flex flex-col gap-4 px-12">
                <button 
                  onClick={() => window.print()}
                  className="bg-blue-900 hover:bg-blue-800 text-white font-bold py-5 px-8 rounded-xl shadow-xl text-lg uppercase tracking-wide flex items-center justify-center gap-3 transition-all active:scale-95"
                >
                  <Printer size={24} /> IMPRIMIR DOCUMENTO
                </button>

                 <button onClick={handleReset} className="w-full py-5 bg-white border-2 border-gray-200 text-gray-500 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-gray-50 hover:text-gray-700 transition-all flex items-center justify-center gap-3">
                   <ArrowLeft size={18} /> Volver a Operaciones
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Add New Transport Modal */}
      {isAddTransportOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 border border-gray-300 animate-in zoom-in-95 duration-300">
              <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                       <Plus size={20} strokeWidth={3} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 uppercase">Alta de Transporte</h3>
                 </div>
                 <button onClick={() => setIsAddTransportOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                    <X size={24} />
                 </button>
              </div>

              <form onSubmit={handleAddNewTransport} className="space-y-5">
                 <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Empresa Carrier *</label>
                    <input 
                       required
                       type="text" 
                       value={newTransport.name}
                       onChange={e => setNewTransport({...newTransport, name: e.target.value})}
                       className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:border-blue-500 outline-none font-semibold text-slate-800"
                       placeholder="Ej: Logística Central"
                    />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Nombre Chofer</label>
                    <input 
                       type="text" 
                       value={newTransport.driver}
                       onChange={e => setNewTransport({...newTransport, driver: e.target.value})}
                       className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:border-blue-500 outline-none font-semibold text-slate-800"
                       placeholder="Nombre y Apellido"
                    />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">DNI</label>
                    <input 
                       type="text" 
                       value={newTransport.dni}
                       onChange={e => setNewTransport({...newTransport, dni: e.target.value})}
                       className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:border-blue-500 outline-none font-semibold text-slate-800"
                       placeholder="Documento"
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                       <label className="text-xs font-bold text-gray-500 uppercase ml-1">Patente Tractor</label>
                       <input 
                          type="text" 
                          value={newTransport.truck}
                          onChange={e => setNewTransport({...newTransport, truck: e.target.value.toUpperCase()})}
                          className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:border-blue-500 outline-none font-semibold text-slate-800 uppercase text-center"
                          placeholder="AAA 000"
                       />
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-xs font-bold text-gray-500 uppercase ml-1">Patente Acoplado</label>
                       <input 
                          type="text" 
                          value={newTransport.trailer}
                          onChange={e => setNewTransport({...newTransport, trailer: e.target.value.toUpperCase()})}
                          className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:border-blue-500 outline-none font-semibold text-slate-800 uppercase text-center"
                          placeholder="BBB 111"
                       />
                    </div>
                 </div>

                 <div className="flex gap-4 pt-4">
                    <button 
                       type="button"
                       onClick={() => setIsAddTransportOpen(false)}
                       className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-lg font-bold text-xs uppercase hover:bg-gray-200 transition-all"
                    >
                       Cancelar
                    </button>
                    <button 
                       type="submit"
                       className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-bold text-xs uppercase shadow-lg hover:bg-blue-700 transition-all active:scale-95"
                    >
                       Guardar
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* Hidden Remito Container for Native Print */}
      {successMovement && (
        <div className="hidden print:block">
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
        </div>
      )}
    </div>
  );
};
