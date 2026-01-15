
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import { CalendarPlus, Save, Truck, Check, Search, AlertCircle, Car, Plus, Database, Info } from 'lucide-react';
import { Vehicle, CalendarEvent } from '../types';
import { BRANDS, MODELS, COLORS } from '../constants';

type ProgrammingTab = 'SCHEDULE' | 'REGISTER';

export const ProgrammingPage: React.FC = () => {
  const { vehicles, scheduleEvent, currentCompany, addVehicle, addToPdiQueue } = useApp();
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState<ProgrammingTab>('SCHEDULE');
  
  // Schedule Form State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVin, setSelectedVin] = useState<string>('');
  const [destinationId, setDestinationId] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('09:00');
  const [suggestions, setSuggestions] = useState<Vehicle[]>([]);
  
  // New Unit Form State
  const [newUnit, setNewUnit] = useState<Partial<Vehicle>>({
    vin: '',
    brand: BRANDS[0],
    model: MODELS[BRANDS[0]][0],
    year: 2024,
    color: COLORS[0],
    type: 'NEW',
    locationId: '',
    entryDate: new Date().toISOString().split('T')[0],
    status: 'AVAILABLE',
    preDeliveryConfirmed: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (searchTerm.length > 2) {
      const filtered = vehicles.filter(v => 
        v.vin.toLowerCase().includes(searchTerm.toLowerCase()) && 
        v.status === 'AVAILABLE' && 
        !v.isLocked
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  }, [searchTerm, vehicles]);

  const handleSelectVehicle = (v: Vehicle) => {
    setSelectedVin(v.vin);
    setSearchTerm(v.vin);
    setSuggestions([]);
  };

  const showToast = (title: string, message: string) => {
    const toast = document.createElement('div');
    toast.className = 'fixed top-8 right-8 bg-slate-900 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right duration-300 z-[100] border border-white/20';
    toast.innerHTML = `
      <div class="bg-indigo-500 p-2 rounded-full"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
      <div>
        <p class="font-bold text-sm uppercase tracking-tight">${title}</p>
        <p class="text-slate-400 text-xs">${message}</p>
      </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVin || !destinationId || !scheduleDate) return;
    setIsSubmitting(true);

    const newEvent: CalendarEvent = {
      id: `EVT-${Date.now()}`,
      vehicleVin: selectedVin,
      date: scheduleDate,
      time: scheduleTime,
      destinationId: destinationId,
      status: 'PROGRAMADO',
      createdBy: 'sys_prog'
    };

    setTimeout(() => {
      scheduleEvent(newEvent);
      showToast('Agenda Confirmada', `Unidad ${selectedVin} programada para el ${scheduleDate}`);
      setSearchTerm('');
      setSelectedVin('');
      setIsSubmitting(false);
    }, 500);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUnit.vin || !newUnit.locationId) return;
    setIsSubmitting(true);

    const finalUnit = {
      ...newUnit,
      vin: newUnit.vin!.toUpperCase(),
      preDeliveryConfirmed: false,
      status: 'AVAILABLE' as const,
      isLocked: false,
    } as Vehicle;

    setTimeout(() => {
      // 1. Add vehicle to global list
      addVehicle(finalUnit);
      
      // 2. Automatically add to PDI Queue
      addToPdiQueue(finalUnit.vin);
      
      // 3. Create entry calendar event
      scheduleEvent({
        id: `ENT-${Date.now()}`,
        vehicleVin: finalUnit.vin,
        date: finalUnit.entryDate,
        time: '08:00',
        destinationId: finalUnit.locationId,
        status: 'PROGRAMADO',
        createdBy: 'sys_prog'
      });

      showToast('Ingreso Registrado', `VIN ${finalUnit.vin} registrado y enviado a PDI`);
      setNewUnit({
        vin: '', brand: BRANDS[0], model: MODELS[BRANDS[0]][0],
        year: 2024, color: COLORS[0], type: 'NEW', locationId: '',
        entryDate: new Date().toISOString().split('T')[0],
        status: 'AVAILABLE', preDeliveryConfirmed: false
      });
      setIsSubmitting(false);
    }, 600);
  };

  return (
    // PADDING TOP AUMENTADO (pt-20 md:pt-24)
    <div className="max-w-5xl mx-auto space-y-6 lg:space-y-8 pb-20 pt-20 md:pt-24 animate-in fade-in duration-500">
      
      {/* Header Selectivo */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 lg:p-4 bg-indigo-600 text-white rounded-[2rem] shadow-xl shadow-indigo-100">
            <CalendarPlus size={28} className="lg:w-8 lg:h-8" />
          </div>
          <div>
            <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Gestión Logística 0KM</h2>
            <p className="text-slate-500 text-xs lg:text-sm font-bold uppercase tracking-widest mt-2">Módulo de Programación y Previsión</p>
          </div>
        </div>

        <div className="bg-slate-100 p-1.5 rounded-2xl flex gap-1 shadow-inner border border-slate-200">
           <button 
             onClick={() => setActiveTab('SCHEDULE')}
             className={`px-4 py-2 lg:px-6 lg:py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'SCHEDULE' ? 'bg-white text-indigo-700 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
           >
             Agendar Entrega
           </button>
           <button 
             onClick={() => setActiveTab('REGISTER')}
             className={`px-4 py-2 lg:px-6 lg:py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'REGISTER' ? 'bg-white text-indigo-700 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
           >
             Ingreso Unidades
           </button>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] lg:rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
        
        {activeTab === 'SCHEDULE' ? (
          <form onSubmit={handleScheduleSubmit} className="relative">
            <div className="p-6 lg:p-10 space-y-6 lg:space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                <div className="col-span-full">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Buscador de Stock para Agendar</label>
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors">
                      <Search size={22} />
                    </div>
                    <input 
                      type="text" 
                      value={searchTerm}
                      onChange={(e) => { setSearchTerm(e.target.value); setSelectedVin(''); }}
                      className="w-full pl-14 pr-4 py-4 lg:py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-500 outline-none text-lg lg:text-xl font-mono font-bold text-slate-800 tracking-wider transition-all"
                      placeholder="Ingrese VIN de unidad existente..."
                    />
                    {suggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-3 bg-white border-2 border-slate-100 rounded-2xl shadow-2xl z-20 overflow-hidden">
                        {suggestions.map(s => (
                          <button 
                            key={s.vin}
                            type="button"
                            onClick={() => handleSelectVehicle(s)}
                            className="w-full text-left p-5 hover:bg-indigo-50 border-b border-slate-50 last:border-0 flex justify-between items-center group"
                          >
                            <div>
                              <p className="font-mono font-black text-slate-900 text-lg">{s.vin}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.brand} {s.model}</p>
                            </div>
                            <Check className="text-indigo-200 group-hover:text-indigo-600" size={20} />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Destino Planificado</label>
                  <select 
                    value={destinationId} 
                    onChange={(e) => setDestinationId(e.target.value)}
                    className="w-full px-4 py-3 lg:px-5 lg:py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-500 outline-none font-bold text-slate-800 cursor-pointer text-sm lg:text-base"
                    required
                  >
                    <option value="">Seleccionar Sucursal</option>
                    {currentCompany?.locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Fecha</label>
                    <input 
                      type="date" 
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      className="w-full px-4 py-3 lg:px-5 lg:py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-500 outline-none font-bold text-slate-800 text-sm lg:text-base"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Hora</label>
                    <input 
                      type="time" 
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      className="w-full px-4 py-3 lg:px-5 lg:py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-500 outline-none font-bold text-slate-800 text-sm lg:text-base"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-6 lg:px-10 lg:py-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-start gap-3 opacity-60">
                 <Info className="shrink-0 text-slate-400 mt-0.5" size={16} />
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">La programación no bloquea stock. Es previsión operativa.</p>
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting || !selectedVin || !destinationId || !scheduleDate}
                className="flex items-center gap-3 bg-indigo-600 text-white px-8 py-4 lg:px-10 lg:py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-30"
              >
                <CalendarPlus size={18} strokeWidth={2.5} />
                Agendar Entrega
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit}>
            <div className="p-6 lg:p-10 space-y-6 lg:space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                  <div className="col-span-full flex items-center gap-3 bg-blue-50 p-4 rounded-2xl border border-blue-100">
                     <Database className="text-blue-500" size={20} />
                     <p className="text-[10px] font-black text-blue-800 uppercase tracking-widest">Aviso: Las unidades registradas se marcarán como "Pendientes de PDI" automáticamente.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Identificación VIN *</label>
                    <input 
                      type="text"
                      maxLength={17}
                      value={newUnit.vin}
                      onChange={(e) => setNewUnit({...newUnit, vin: e.target.value.toUpperCase()})}
                      className="w-full px-4 py-3 lg:px-5 lg:py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-500 outline-none font-mono font-black text-slate-800 tracking-widest uppercase text-sm lg:text-base"
                      placeholder="EJ: 8AJH452..."
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Marca</label>
                    <select 
                      value={newUnit.brand}
                      onChange={(e) => setNewUnit({...newUnit, brand: e.target.value, model: MODELS[e.target.value][0]})}
                      className="w-full px-4 py-3 lg:px-5 lg:py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-500 outline-none font-bold text-slate-800 text-sm lg:text-base"
                    >
                      {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Modelo</label>
                    <select 
                      value={newUnit.model}
                      onChange={(e) => setNewUnit({...newUnit, model: e.target.value})}
                      className="w-full px-4 py-3 lg:px-5 lg:py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-500 outline-none font-bold text-slate-800 text-sm lg:text-base"
                    >
                      {MODELS[newUnit.brand!].map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Año</label>
                    <input 
                      type="number"
                      value={newUnit.year}
                      onChange={(e) => setNewUnit({...newUnit, year: parseInt(e.target.value)})}
                      className="w-full px-4 py-3 lg:px-5 lg:py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-500 outline-none font-bold text-slate-800 text-sm lg:text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Color Oficial</label>
                    <select 
                      value={newUnit.color}
                      onChange={(e) => setNewUnit({...newUnit, color: e.target.value})}
                      className="w-full px-4 py-3 lg:px-5 lg:py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-500 outline-none font-bold text-slate-800 text-sm lg:text-base"
                    >
                      {COLORS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Fecha de Arribo</label>
                    <input 
                      type="date"
                      value={newUnit.entryDate}
                      onChange={(e) => setNewUnit({...newUnit, entryDate: e.target.value})}
                      className="w-full px-4 py-3 lg:px-5 lg:py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-500 outline-none font-bold text-slate-800 text-sm lg:text-base"
                    />
                  </div>

                  <div className="col-span-full space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Ubicación de Recepción *</label>
                    <select 
                      value={newUnit.locationId}
                      onChange={(e) => setNewUnit({...newUnit, locationId: e.target.value})}
                      className="w-full px-4 py-3 lg:px-5 lg:py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-500 outline-none font-bold text-slate-800 text-sm lg:text-base"
                      required
                    >
                      <option value="">Seleccionar Playa de Recepción...</option>
                      {currentCompany?.locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                    </select>
                  </div>
               </div>
            </div>

            <div className="px-6 py-6 lg:px-10 lg:py-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-start gap-3 opacity-60">
                 <AlertCircle className="shrink-0 text-slate-400 mt-0.5" size={16} />
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide max-w-sm">Esta unidad aparecerá en la Planilla PDI operativa de inmediato.</p>
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting || !newUnit.vin || !newUnit.locationId}
                className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 lg:px-10 lg:py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-30"
              >
                <Plus size={18} strokeWidth={2.5} />
                Registrar Unidad 0KM
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
