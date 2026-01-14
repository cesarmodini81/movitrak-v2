
import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import { LOCATION_MAP } from '../constants';
import { ArrowRight, Truck, Plus, X, ClipboardList, MapPin, Info, Tag, Search, Database, CheckCircle, Printer, ArrowLeft, Download, FileText as FileIcon } from 'lucide-react';
import { Movement, Vehicle } from '../types';
import { RemitoDocument } from '../components/RemitoDocument';
import { PDFDownloadLink } from '@react-pdf/renderer';

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
  
  const [availableTransporters] = useState<string[]>(() => {
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
  };

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
                  <select 
                    value={origin}
                    onChange={(e) => { setOrigin(e.target.value); setSelectedVins([]); }}
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-slate-900 outline-none text-sm font-black text-slate-800 transition-all cursor-pointer appearance-none"
                  >
                    <option value="">-- Seleccionar Planta --</option>
                    {companyLocations.map(l => <option key={l.id} value={l.id}>📍 {l.name}</option>)}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                     <Truck size={12} className="text-slate-400" /> Sucursal Destino Final
                  </label>
                  <select 
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-slate-900 outline-none text-sm font-black text-slate-800 transition-all cursor-pointer appearance-none"
                  >
                    <option value="">-- Seleccionar Arribo --</option>
                    {companyLocations.filter(l => l.id !== origin).map(l => <option key={l.id} value={l.id}>🚩 {l.name}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="enterprise-card p-10 bg-white rounded-[2.5rem] border-2 border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-slate-900 rounded-full"></div>
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">II. Manifiesto de Unidades</h3>
                 </div>
              </div>

              <div className="relative mb-10">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300">
                   <Search size={24} />
                </div>
                <input 
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Escanee VIN o ingrese Patente..."
                  className="w-full pl-16 pr-4 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-slate-900 outline-none text-lg font-bold text-slate-800 transition-all"
                />
                
                {suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-3 bg-white border-2 border-slate-200 rounded-3xl shadow-2xl overflow-hidden z-40">
                    {suggestions.map(s => (
                      <button key={s.vin} onClick={() => handleAddVehicle(s)} className="w-full text-left p-5 hover:bg-slate-50 border-b last:border-0 flex justify-between items-center group">
                        <div>
                          <p className="font-mono font-black text-slate-900 text-lg uppercase">{s.plate || s.vin.slice(-8)}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.brand} {s.model} • {s.color}</p>
                        </div>
                        <Plus size={20} className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-all" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectedVins.map(vin => {
                  const v = availableVehicles.find(av => av.vin === vin);
                  return (
                    <div key={vin} className="bg-white p-6 rounded-3xl border-2 border-slate-100 relative group animate-in zoom-in-95">
                      <button onClick={() => handleRemoveVehicle(vin)} className="absolute top-6 right-6 text-slate-300 hover:text-red-500"><X size={20} /></button>
                      <p className="font-mono font-black text-slate-900 text-sm tracking-[0.1em] uppercase mb-1">{v?.plate || vin}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-4">{v?.brand} {v?.model}</p>
                      <textarea 
                        placeholder="Observaciones de la unidad..."
                        value={unitObservations[vin] || ''}
                        onChange={(e) => setUnitObservations({...unitObservations, [vin]: e.target.value})}
                        className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-xs font-bold text-slate-600 focus:bg-white focus:border-slate-300 transition-all resize-none h-20"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl">
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
                  <h3 className="text-xs font-black uppercase tracking-widest">III. Logística</h3>
               </div>
               
               <div className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Empresa de Transporte</label>
                     <select value={transporter} onChange={(e) => setTransporter(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white font-bold outline-none">
                        <option value="" className="text-slate-900">-- Seleccionar --</option>
                        {availableTransporters.map(t => <option key={t} value={t} className="text-slate-900">{t}</option>)}
                     </select>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Datos del Chofer</label>
                     <input type="text" placeholder="Nombre Chofer" value={driverName} onChange={(e) => setDriverName(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white outline-none mb-2" />
                     <input type="text" placeholder="DNI Chofer" value={driverDni} onChange={(e) => setDriverDni(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white outline-none" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Patentes Camión / Acoplado</label>
                     <div className="grid grid-cols-2 gap-2">
                        <input type="text" placeholder="Tractor" value={truckPlate} onChange={(e) => setTruckPlate(e.target.value.toUpperCase())} className="px-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white outline-none uppercase text-center" />
                        <input type="text" placeholder="Acoplado" value={trailerPlate} onChange={(e) => setTrailerPlate(e.target.value.toUpperCase())} className="px-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white outline-none uppercase text-center" />
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-sm">
               <textarea value={generalObservations} onChange={(e) => setGeneralObservations(e.target.value)} placeholder="Observaciones Generales..." className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-xs font-bold text-slate-600 focus:bg-white focus:border-slate-300 transition-all resize-none h-24 mb-6" />

               {showPdiWarning && (
                 <div className="bg-red-50 p-4 rounded-xl border border-red-100 mb-6 animate-in shake">
                    <p className="text-[10px] font-black text-red-700 uppercase mb-2 flex items-center gap-2"><Info size={14} /> ¡PDI Pendiente Detectado!</p>
                    <button onClick={handleEmitRemito} className="w-full py-2 bg-red-600 text-white rounded-lg text-[10px] font-black uppercase shadow-lg shadow-red-200">Emitir Igual (Bajo Responsabilidad)</button>
                 </div>
               )}

               <button 
                 onClick={handleEmitRemito}
                 disabled={selectedVins.length === 0 || !origin || !destination || !transporter}
                 className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50"
               >
                 Emitir Remito Oficial
               </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto text-center py-20 animate-in zoom-in-95">
           <div className="bg-white rounded-[3rem] shadow-2xl p-16 border border-slate-100">
              <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8">
                 <CheckCircle size={54} className="text-emerald-600" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-2">Remito Nº {successMovement.id}</h2>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-12">Emitido correctamente por {successMovement.createdBy}</p>
              
              <div className="flex flex-col gap-4">
                 <PDFDownloadLink
                   document={
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
                   }
                   fileName={`Remito_${successMovement.id}.pdf`}
                   className="w-full"
                 >
                    {({ loading }) => (
                      <button 
                        className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-slate-800 active:scale-95 flex items-center justify-center gap-3 transition-all"
                        disabled={loading}
                      >
                        {loading ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        ) : (
                          <><Download size={20} /> Descargar Remito Oficial</>
                        )}
                      </button>
                    )}
                 </PDFDownloadLink>

                 <button onClick={handleReset} className="w-full py-5 bg-white border-2 border-slate-100 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-50 transition-all flex items-center justify-center gap-3">
                   <ArrowLeft size={18} /> Volver a Operaciones
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
