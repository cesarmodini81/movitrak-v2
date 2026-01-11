import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import { LOCATION_MAP } from '../constants';
import { ArrowRight, Truck, AlertTriangle, Plus, X, FileText, CheckCircle, Printer, ArrowLeft, Search, User, ShieldCheck, Database, Trash2, ClipboardList, Save, MapPin } from 'lucide-react';
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
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  const [isTransportModalOpen, setIsTransportModalOpen] = useState(false);
  const [newTransportData, setNewTransportData] = useState({ name: '', driver: '', dni: '', truck: '', trailer: '' });

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
    if (searchTerm.length > 2) {
      const lowerTerm = searchTerm.toLowerCase();
      
      const filtered = availableVehicles.filter(v => {
        const isAvailable = v.status === 'AVAILABLE' && !v.isLocked;
        const matchesTerm = v.vin.toLowerCase().includes(lowerTerm) || v.model.toLowerCase().includes(lowerTerm);
        const matchesOrigin = !origin || v.locationId === origin;
        const isNotSelected = !selectedVins.includes(v.vin);
        return isAvailable && matchesTerm && matchesOrigin && isNotSelected;
      });
      
      setSuggestions(filtered.slice(0, 5));
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

  const handleClearForm = () => {
    setOrigin('');
    setDestination('');
    setTransporter('');
    setDriverName('');
    setDriverDni('');
    setTruckPlate('');
    setTrailerPlate('');
    setSelectedVins([]);
    setUnitObservations({});
    setGeneralObservations('');
    setSuccessMovement(null);

    Object.values(STORAGE_KEYS).forEach(key => {
      if (key !== STORAGE_KEYS.CUSTOM_TRANSPORTERS) {
        localStorage.removeItem(key);
      }
    });
  };

  const handleSaveNewTransport = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTransportData.name) {
      const updatedList = [...availableTransporters, newTransportData.name];
      setAvailableTransporters(updatedList);
      setTransporter(newTransportData.name);
      if (newTransportData.driver) setDriverName(newTransportData.driver);
      if (newTransportData.dni) setDriverDni(newTransportData.dni);
      if (newTransportData.truck) setTruckPlate(newTransportData.truck);
      if (newTransportData.trailer) setTrailerPlate(newTransportData.trailer);
      setIsTransportModalOpen(false);
      setNewTransportData({ name: '', driver: '', dni: '', truck: '', trailer: '' });
    }
  };

  const handleEmitRemito = () => {
    const invalidVehicles = selectedVins.filter(vin => {
      const v = availableVehicles.find(av => av.vin === vin);
      return v && v.locationId !== origin;
    });

    if (invalidVehicles.length > 0) {
      alert(`Error: Hay unidades que no se encuentran en el Origen seleccionado (${LOCATION_MAP[origin] || origin}). Verifique la lista de carga.`);
      return;
    }

    const hasUncheckedNew = selectedVins.some(vin => {
      const v = availableVehicles.find(veh => veh.vin === vin);
      return v && v.type === 'NEW' && !v.preDeliveryConfirmed;
    });

    if (hasUncheckedNew && !showPdiWarning) {
      setShowPdiWarning(true);
      return;
    }

    const newMovement: Movement = {
      id: `REM-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString(),
      originId: origin,
      destinationId: destination,
      transporter,
      driverName,
      vehicleVins: selectedVins,
      status: 'PENDING',
      createdBy: 'sys_oper',
      observations: generalObservations,
    };

    createMovement(newMovement);
    setSuccessMovement(newMovement);
    setShowPdiWarning(false);
  };

  if (successMovement && currentCompany) {
    const remitoDoc = (
      <RemitoDocument 
        movement={successMovement} company={currentCompany} 
        vehicles={availableVehicles.filter(v => successMovement.vehicleVins.includes(v.vin))}
        origin={currentCompany.locations.find(l => l.id === successMovement.originId)}
        destination={currentCompany.locations.find(l => l.id === successMovement.destinationId)}
        driverDni={driverDni} truckPlate={truckPlate} trailerPlate={trailerPlate}
        unitObservations={unitObservations}
       />
    );

    return (
      <div className="max-w-xl mx-auto py-12 text-center animate-in fade-in duration-500">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-emerald-200">
          <CheckCircle size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight italic">Remito Emitido Oficialmente</h2>
        <p className="text-slate-500 text-sm font-medium uppercase tracking-widest mt-2">Unidades Bloqueadas "En Tránsito"</p>
        
        <div className="flex gap-4 mt-10">
          <button 
            onClick={() => setIsPreviewOpen(true)}
            className="flex-1 bg-slate-900 text-white py-3 rounded-lg font-bold text-xs uppercase tracking-widest shadow-md hover:bg-slate-800 transition-all active:scale-95"
          >
            Imprimir Remito
          </button>
          <button 
            onClick={handleClearForm}
            className="flex-1 bg-white border border-slate-200 text-slate-500 py-3 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all"
          >
            Nueva Emisión (Limpiar)
          </button>
        </div>

        <PrintPreviewModal 
          isOpen={isPreviewOpen} 
          onClose={() => setIsPreviewOpen(false)} 
          title={`Remito Oficial #${successMovement.id}`}
        >
          {remitoDoc}
        </PrintPreviewModal>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-slate-900 text-white rounded-xl">
          <ClipboardList size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Emisión de Traslado</h2>
          <p className="text-slate-500 text-xs font-medium uppercase tracking-widest">Despacho Oficial (Bloqueo de Stock)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="enterprise-card p-8">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-50 pb-2">I. Ruta Operativa</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Origen</label>
                <select 
                  value={origin}
                  onChange={(e) => { setOrigin(e.target.value); setSelectedVins([]); }}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-slate-400 outline-none text-sm font-bold text-slate-800 transition-all appearance-none cursor-pointer"
                >
                  <option value="">-- Seleccionar Planta --</option>
                  {currentCompany?.locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Destino</label>
                <select 
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-slate-400 outline-none text-sm font-bold text-slate-800 transition-all appearance-none cursor-pointer"
                >
                  <option value="">-- Seleccionar Destino --</option>
                  {currentCompany?.locations.filter(l => l.id !== origin).map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="enterprise-card p-8">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-50 pb-2">II. Unidades para Carga</h3>
            
            {!origin && (
              <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg mb-4 flex items-center gap-2">
                 <div className="p-1 bg-blue-100 rounded-full text-blue-600">
                    <MapPin size={12} />
                 </div>
                 <p className="text-[10px] font-bold text-blue-800 uppercase tracking-wide">
                   Tip: Si busca un VIN sin seleccionar origen, el sistema buscará en toda la empresa.
                 </p>
              </div>
            )}

            <div className="relative group mb-8">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
                <Search size={20} />
              </div>
              <input 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Escriba VIN o Modelo..."
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-slate-400 outline-none text-lg font-bold text-slate-800 transition-all placeholder:text-slate-300"
              />
              {suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden max-h-64 overflow-y-auto">
                  {suggestions.map(s => (
                    <button 
                      key={s.vin} 
                      onClick={() => handleAddVehicle(s)}
                      className="w-full text-left p-4 hover:bg-slate-50 border-b border-slate-50 last:border-0 flex justify-between items-center group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 font-bold text-xs uppercase">
                           {s.brand.slice(0,3)}
                        </div>
                        <div>
                          <p className="font-mono font-bold text-slate-900">{s.vin}</p>
                          <p className="text-[10px] font-medium text-slate-400 uppercase">
                            {s.model} • {s.color} 
                            {!origin && <span className="text-brand-600 ml-2 font-bold">({LOCATION_MAP[s.locationId] || s.locationId})</span>}
                          </p>
                        </div>
                      </div>
                      <Plus className="text-slate-200 group-hover:text-brand-600 transition-colors" size={20} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedVins.map(vin => (
                <div key={vin} className="bg-slate-50 p-4 rounded-xl border border-slate-200 relative group animate-in zoom-in-95 duration-200">
                  <button 
                    onClick={() => handleRemoveVehicle(vin)}
                    className="absolute top-3 right-3 text-slate-300 hover:text-red-500"
                  >
                    <Trash2 size={14} />
                  </button>
                  <p className="font-mono font-bold text-slate-900 text-sm tracking-widest">{vin}</p>
                  <textarea 
                    placeholder="Observaciones del remito..."
                    value={unitObservations[vin] || ''}
                    onChange={(e) => setUnitObservations({...unitObservations, [vin]: e.target.value})}
                    className="w-full mt-3 p-3 bg-white border border-slate-200 rounded-lg focus:border-slate-400 outline-none text-[11px] font-medium text-slate-600 resize-none h-16"
                  />
                </div>
              ))}
              {selectedVins.length === 0 && (
                <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-100 rounded-xl text-slate-300">
                  <p className="text-xs font-bold uppercase tracking-widest">Lista de carga vacía</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="enterprise-card p-6 bg-slate-900 text-white space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-5">
              <Truck size={120} />
            </div>
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] border-b border-white/5 pb-2 relative z-10">III. Transporte</h3>
            <div className="space-y-4 relative z-10">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Selecciona Transporte</label>
                <div className="flex gap-2">
                  <select 
                    value={transporter}
                    onChange={(e) => setTransporter(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:bg-white/10 outline-none text-xs font-bold text-white appearance-none cursor-pointer"
                  >
                    <option value="" className="text-slate-900">-- Seleccionar --</option>
                    {availableTransporters.map((t, idx) => (
                      <option key={idx} value={t} className="text-slate-900">{t}</option>
                    ))}
                  </select>
                  <button 
                    onClick={() => setIsTransportModalOpen(true)}
                    className="px-3 bg-brand-600 hover:bg-brand-500 text-white rounded-lg flex items-center justify-center transition-colors"
                    title="Agregar Transporte"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Chofer</label>
                  <input 
                    type="text"
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    placeholder="Nombre Completo"
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:bg-white/10 outline-none text-xs font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">DNI</label>
                  <input 
                    type="text"
                    value={driverDni}
                    onChange={(e) => setDriverDni(e.target.value)}
                    placeholder="Documento"
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:bg-white/10 outline-none text-xs font-bold"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Patente</label>
                  <input 
                    type="text"
                    value={truckPlate}
                    onChange={(e) => setTruckPlate(e.target.value.toUpperCase())}
                    placeholder="AAA-000"
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:bg-white/10 outline-none text-xs font-mono font-bold text-center tracking-widest"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Acoplado</label>
                  <input 
                    type="text"
                    value={trailerPlate}
                    onChange={(e) => setTrailerPlate(e.target.value.toUpperCase())}
                    placeholder="AAA-000"
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:bg-white/10 outline-none text-xs font-mono font-bold text-center tracking-widest"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="enterprise-card p-6">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">Observaciones Generales</h3>
            <textarea 
              value={generalObservations}
              onChange={(e) => setGeneralObservations(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:border-slate-400 outline-none resize-none h-24"
              placeholder="Notas para el remito..."
            />
          </div>

          {showPdiWarning && (
            <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex flex-col gap-2 animate-in fade-in slide-in-from-top-2">
               <div className="flex items-center gap-2 text-red-700">
                  <AlertTriangle size={16} />
                  <p className="text-[10px] font-bold uppercase tracking-widest">Alerta de Seguridad PDI</p>
               </div>
               <p className="text-xs text-red-600">Hay unidades 0km sin certificación técnica. ¿Confirma el despacho bajo responsabilidad operativa?</p>
               <div className="flex gap-2 mt-2">
                 <button onClick={handleEmitRemito} className="flex-1 bg-red-600 text-white text-[10px] font-bold uppercase py-2 rounded-lg hover:bg-red-700">Confirmar</button>
                 <button onClick={() => setShowPdiWarning(false)} className="flex-1 bg-white text-red-600 border border-red-200 text-[10px] font-bold uppercase py-2 rounded-lg">Cancelar</button>
               </div>
            </div>
          )}

          <button 
            onClick={handleEmitRemito}
            disabled={!origin || !destination || !transporter || selectedVins.length === 0}
            className="w-full bg-slate-900 text-white py-5 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-20 flex items-center justify-center gap-2"
          >
             {(!origin || !destination || !transporter || selectedVins.length === 0) ? (
                <Save size={16} className="opacity-50" />
             ) : (
                <FileText size={16} />
             )}
             {(!origin || !destination || !transporter || selectedVins.length === 0) ? 'Borrador Guardado' : 'Emitir Remito Oficial'}
          </button>
        </div>
      </div>

      {isTransportModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
           <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 border border-slate-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-900 text-lg uppercase tracking-tight">Nuevo Transportista</h3>
                <button onClick={() => setIsTransportModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSaveNewTransport} className="space-y-4">
                 <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Razón Social / Nombre *</label>
                    <input 
                      type="text" 
                      required 
                      value={newTransportData.name}
                      onChange={(e) => setNewTransportData({...newTransportData, name: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-500 outline-none text-sm font-bold"
                      placeholder="Ej: Logística Express"
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Chofer Default</label>
                      <input 
                        type="text" 
                        value={newTransportData.driver}
                        onChange={(e) => setNewTransportData({...newTransportData, driver: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-500 outline-none text-sm font-bold"
                        placeholder="Opcional"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">DNI Default</label>
                      <input 
                        type="text" 
                        value={newTransportData.dni}
                        onChange={(e) => setNewTransportData({...newTransportData, dni: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-500 outline-none text-sm font-bold"
                        placeholder="Opcional"
                      />
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Patente Default</label>
                      <input 
                        type="text" 
                        value={newTransportData.truck}
                        onChange={(e) => setNewTransportData({...newTransportData, truck: e.target.value.toUpperCase()})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-500 outline-none text-sm font-mono font-bold"
                        placeholder="AAA-000"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Acoplado Default</label>
                      <input 
                        type="text" 
                        value={newTransportData.trailer}
                        onChange={(e) => setNewTransportData({...newTransportData, trailer: e.target.value.toUpperCase()})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-500 outline-none text-sm font-mono font-bold"
                        placeholder="AAA-000"
                      />
                    </div>
                 </div>
                 <button type="submit" className="w-full bg-brand-600 text-white py-4 rounded-xl font-bold uppercase text-xs tracking-widest mt-4 hover:bg-brand-700 transition-all">
                    Guardar Transportista
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};