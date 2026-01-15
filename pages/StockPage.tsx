
import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Package, MapPin, Search, CheckCircle, 
  AlertCircle, Car, Calendar, Tag, Filter
} from 'lucide-react';
import { LOCATION_MAP } from '../constants';

export const StockPage: React.FC = () => {
  const { availableVehicles, currentCompany, calendarEvents, companies } = useApp();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [activeTab, setActiveTab] = useState<'NEW' | 'USED'>('NEW');

  // Resolve location name helper
  const getLocationName = (id: string) => {
    if (LOCATION_MAP[id]) return LOCATION_MAP[id];
    for (const c of companies) {
      const loc = c.locations.find(l => l.id === id);
      if (loc) return loc.name;
    }
    return id;
  };

  // Filter Logic
  const filteredVehicles = useMemo(() => {
    return availableVehicles.filter(v => {
      // 1. Tab Filter
      if (activeTab === 'NEW' && v.type !== 'NEW') return false;
      if (activeTab === 'USED' && v.type !== 'USED') return false;

      // 2. Location Filter
      if (selectedLocation !== 'all' && v.locationId !== selectedLocation) return false;

      // 3. Search Filter
      if (searchTerm) {
        const lower = searchTerm.toLowerCase();
        return (
          v.vin.toLowerCase().includes(lower) ||
          v.brand.toLowerCase().includes(lower) ||
          v.model.toLowerCase().includes(lower) ||
          (v.plate && v.plate.toLowerCase().includes(lower))
        );
      }

      return true;
    });
  }, [availableVehicles, activeTab, selectedLocation, searchTerm]);

  // Determine "Lugar de Entrega" based on programming
  const getDeliveryPlace = (vin: string) => {
    const event = calendarEvents.find(e => e.vehicleVin === vin && e.status === 'PROGRAMADO');
    if (event) {
      return getLocationName(event.destinationId);
    }
    return '-';
  };

  return (
    // PADDING TOP AUMENTADO (pt-20 md:pt-24)
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 pt-20 md:pt-24">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-brand-600 text-white rounded-2xl shadow-xl shadow-brand-200">
            <Package size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase leading-none">Stock Unidades</h2>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-2">Inventario Físico & Logístico</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
           <div className="flex items-center gap-2 px-4 border-r border-slate-100">
              <Filter size={16} className="text-slate-400" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest hidden md:block">Filtrar Ubicación:</span>
           </div>
           <select 
             value={selectedLocation}
             onChange={(e) => setSelectedLocation(e.target.value)}
             className="bg-transparent text-sm font-bold text-slate-800 outline-none cursor-pointer pr-8 py-2"
           >
             <option value="all">Todas las Ubicaciones</option>
             {currentCompany?.locations.map(l => (
               <option key={l.id} value={l.id}>{l.name}</option>
             ))}
           </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button 
          onClick={() => setActiveTab('NEW')}
          className={`px-8 py-4 text-sm font-black uppercase tracking-widest border-b-4 transition-all flex items-center gap-2 ${activeTab === 'NEW' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
        >
          <Car size={18} /> Unidades 0KM
        </button>
        <button 
          onClick={() => setActiveTab('USED')}
          className={`px-8 py-4 text-sm font-black uppercase tracking-widest border-b-4 transition-all flex items-center gap-2 ${activeTab === 'USED' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
        >
          <Tag size={18} /> Usados Selección
        </button>
      </div>

      {/* Controls */}
      <div className="relative">
         <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <Search size={20} />
         </div>
         <input 
           type="text" 
           placeholder="Buscar por VIN, Patente, Marca o Modelo..." 
           value={searchTerm}
           onChange={(e) => setSearchTerm(e.target.value)}
           className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-xl shadow-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-50 transition-all font-bold text-slate-700"
         />
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto max-h-[65vh]">
          <table className="w-full text-left">
            <thead className="bg-slate-900 text-white uppercase text-[10px] font-black tracking-[0.2em] sticky top-0 z-10">
              <tr>
                <th className="p-6">Identificación</th>
                <th className="p-6">Unidad</th>
                <th className="p-6">Ubicación Actual</th>
                <th className="p-6">Programación Entrega</th>
                <th className="p-6 text-center">Estado PDI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVehicles.length > 0 ? (
                filteredVehicles.map(v => (
                  <tr key={v.vin} className="hover:bg-slate-50 transition-colors group">
                    <td className="p-6">
                       <div className="flex flex-col gap-1">
                          <span className="font-mono font-black text-slate-900 text-sm tracking-widest">{v.vin}</span>
                          {v.plate ? (
                            <span className="text-[10px] font-black text-slate-500 bg-slate-100 px-2 py-0.5 rounded w-fit border border-slate-200">{v.plate}</span>
                          ) : (
                            <span className="text-[10px] font-bold text-slate-300 italic">Sin Patente</span>
                          )}
                       </div>
                    </td>
                    <td className="p-6">
                       <div className="font-black text-slate-800 text-sm uppercase">{v.brand} {v.model}</div>
                       <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wide">{v.color} • {v.year}</div>
                    </td>
                    <td className="p-6">
                       <div className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase">
                          <MapPin size={14} className="text-brand-500" />
                          {getLocationName(v.locationId)}
                       </div>
                    </td>
                    <td className="p-6">
                       <div className="text-xs font-black text-slate-700 uppercase flex items-center gap-2">
                          {getDeliveryPlace(v.vin) !== '-' ? (
                             <>
                               <Calendar size={14} className="text-brand-600" />
                               {getDeliveryPlace(v.vin)}
                             </>
                          ) : (
                             <span className="text-slate-300 font-bold">-</span>
                          )}
                       </div>
                    </td>
                    <td className="p-6 text-center">
                       {v.type === 'NEW' ? (
                          v.preDeliveryConfirmed ? (
                             <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-black text-[9px] uppercase tracking-widest border border-emerald-200">
                                <CheckCircle size={12} /> Certificado
                             </div>
                          ) : (
                             <div className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 px-3 py-1 rounded-full font-black text-[9px] uppercase tracking-widest border border-red-100">
                                <AlertCircle size={12} /> Pendiente
                             </div>
                          )
                       ) : (
                          <div className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-500 px-3 py-1 rounded-full font-black text-[9px] uppercase tracking-widest">
                             Usado OK
                          </div>
                       )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-20 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-40">
                       <Package size={60} className="text-slate-300" />
                       <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No se encontraron unidades en stock</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-between items-center px-8">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Registros: {filteredVehicles.length}</p>
           <div className="text-[10px] font-bold text-slate-400 italic">Actualizado en tiempo real</div>
        </div>
      </div>
    </div>
  );
};
