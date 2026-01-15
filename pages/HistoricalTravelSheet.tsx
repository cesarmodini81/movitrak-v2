
import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import { LOCATION_MAP } from '../constants';
import { 
  History, RotateCcw, Search, ArrowUpDown, ArrowUp, ArrowDown, MapPin, 
  Calendar, CheckSquare, Square, Info, AlertCircle 
} from 'lucide-react';
import { Vehicle } from '../types';

type SortDirection = 'asc' | 'desc';
interface SortConfig {
  key: keyof Vehicle | 'deliveryDate' | 'deliveryLocationName';
  direction: SortDirection;
}

export const HistoricalTravelSheet: React.FC = () => {
  const { vehicles, historicalTravelSheetList, restoreFromHistorical, calendarEvents, companies } = useApp();
  const { t } = useTranslation();
  
  const [selectedVins, setSelectedVins] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'deliveryDate', direction: 'desc' });

  const getLocationName = (id: string) => {
    if (LOCATION_MAP[id]) return LOCATION_MAP[id];
    for (const c of companies) {
      const loc = c.locations.find(l => l.id === id);
      if (loc) return loc.name;
    }
    return id;
  };

  const mergedData = useMemo(() => {
    return vehicles
      .filter(v => historicalTravelSheetList.includes(v.vin))
      .map(v => {
        const event = calendarEvents.find(e => e.vehicleVin === v.vin);
        
        let deliveryDate = event?.date;
        let deliveryLocationName = event ? getLocationName(event.destinationId) : '';

        if (!deliveryDate) {
           const vinSum = v.vin.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
           const mockDate = new Date();
           mockDate.setDate(mockDate.getDate() - (vinSum % 20) - 1); // Archivo histórico (pasado)
           deliveryDate = mockDate.toISOString().split('T')[0];
           deliveryLocationName = 'Predio Sauce Viejo';
        }

        return {
          ...v,
          deliveryDate,
          deliveryLocationName
        };
      });
  }, [vehicles, historicalTravelSheetList, calendarEvents, companies]);

  const filteredData = useMemo(() => {
    if (!searchTerm) return mergedData;
    const lowerTerm = searchTerm.toLowerCase();
    return mergedData.filter(item => 
      item.vin.toLowerCase().includes(lowerTerm) ||
      item.brand.toLowerCase().includes(lowerTerm) ||
      item.model.toLowerCase().includes(lowerTerm) ||
      item.deliveryLocationName.toLowerCase().includes(lowerTerm)
    );
  }, [mergedData, searchTerm]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key] || '';
      const bValue = b[sortConfig.key] || '';
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  const handleSort = (key: keyof Vehicle | 'deliveryDate' | 'deliveryLocationName') => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const toggleSelect = (vin: string) => {
    if (selectedVins.includes(vin)) {
      setSelectedVins(prev => prev.filter(v => v !== vin));
    } else {
      setSelectedVins(prev => [...prev, vin]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedVins.length === sortedData.length) {
      setSelectedVins([]);
    } else {
      setSelectedVins(sortedData.map(v => v.vin));
    }
  };

  const handleBulkRestore = () => {
    restoreFromHistorical(selectedVins);
    setSelectedVins([]);
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-8 right-8 bg-emerald-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right duration-300 z-50';
    toast.innerHTML = `<div class="bg-white text-emerald-600 p-1.5 rounded-full"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg></div><div><p class="font-bold text-xs uppercase tracking-widest">Unidades restauradas a Viajes</p></div>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const SortIcon = ({ column }: { column: string }) => {
    if (sortConfig.key !== column) return <ArrowUpDown size={14} className="opacity-30" />;
    return sortConfig.direction === 'asc' 
      ? <ArrowUp size={14} className="text-brand-400" /> 
      : <ArrowDown size={14} className="text-brand-400" />;
  };

  return (
    // PADDING TOP AUMENTADO (pt-20 md:pt-24)
    <div className="space-y-6 animate-in fade-in duration-500 min-h-screen pt-20 md:pt-24">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="p-3 bg-slate-900 text-white rounded-xl shadow-lg shrink-0">
            <History size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Histórica Planilla de Viajes</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Archivo Logístico de Unidades Despachadas</p>
          </div>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Search size={16} />
            </div>
            <input 
              type="text" 
              placeholder="Buscar VIN, Modelo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-slate-900 outline-none text-xs font-bold transition-all"
            />
          </div>
          <button 
            onClick={handleBulkRestore}
            disabled={selectedVins.length === 0}
            className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl hover:bg-emerald-700 transition-all shadow-md active:scale-95 font-bold text-[10px] uppercase tracking-widest whitespace-nowrap disabled:opacity-30 disabled:pointer-events-none"
          >
            <RotateCcw size={16} />
            Restaurar Seleccionadas ({selectedVins.length})
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[1.5rem] shadow-lg border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto max-h-[75vh] overflow-y-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-900 text-white uppercase text-[10px] font-black tracking-[0.2em] sticky top-0 z-20">
              <tr>
                <th className="p-4 w-16 text-center">
                  <button onClick={toggleSelectAll} className="hover:text-emerald-400 transition-colors">
                     {selectedVins.length > 0 && selectedVins.length === sortedData.length ? <CheckSquare size={18} /> : <Square size={18} />}
                  </button>
                </th>
                <th className="p-6 cursor-pointer hover:bg-slate-800 transition-colors group" onClick={() => handleSort('vin')}>
                  <div className="flex items-center gap-2">Identificación VIN <SortIcon column="vin" /></div>
                </th>
                <th className="p-6 cursor-pointer hover:bg-slate-800 transition-colors group" onClick={() => handleSort('model')}>
                  <div className="flex items-center gap-2">Unidad / Modelo <SortIcon column="model" /></div>
                </th>
                <th className="p-6 cursor-pointer hover:bg-slate-800 transition-colors group" onClick={() => handleSort('deliveryDate')}>
                  <div className="flex items-center gap-2">Fecha Despacho <SortIcon column="deliveryDate" /></div>
                </th>
                <th className="p-6 cursor-pointer hover:bg-slate-800 transition-colors group" onClick={() => handleSort('deliveryLocationName')}>
                  <div className="flex items-center gap-2">Punto de Entrega <SortIcon column="deliveryLocationName" /></div>
                </th>
                <th className="p-6">Estado Final PDI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedData.length > 0 ? (
                sortedData.map(v => {
                  const isSelected = selectedVins.includes(v.vin);
                  return (
                    <tr 
                      key={v.vin} 
                      className={`transition-colors group ${isSelected ? 'bg-emerald-50' : 'hover:bg-slate-50'}`}
                      onClick={() => toggleSelect(v.vin)}
                    >
                      <td className="p-4 text-center cursor-pointer">
                        <div className={`transition-colors ${isSelected ? 'text-emerald-600' : 'text-slate-300 group-hover:text-slate-400'}`}>
                          {isSelected ? <CheckSquare size={18} /> : <Square size={18} />}
                        </div>
                      </td>
                      <td className="p-6">
                        <span className="font-mono font-black text-slate-800 text-sm tracking-wider bg-slate-100 px-2 py-1 rounded border border-slate-200">
                          {v.vin}
                        </span>
                      </td>
                      <td className="p-6 align-top">
                        <div className="font-bold text-slate-900 uppercase text-xs">{v.brand} {v.model}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase mt-1">{v.color} — {v.year}</div>
                      </td>
                      <td className="p-6 align-top">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase">
                          <Calendar size={14} className="text-slate-400" />
                          {new Date(v.deliveryDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-6 align-top">
                        <div className="flex items-center gap-2 text-xs font-black uppercase text-slate-700">
                           <MapPin size={14} className="text-slate-400" />
                           {v.deliveryLocationName}
                        </div>
                      </td>
                      <td className="p-6 align-top">
                        <div className="text-xs font-medium text-slate-500 italic border-l-2 border-slate-200 pl-3">
                          {v.pdiComment || 'Sin novedades registradas.'}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="p-24 text-center">
                    <div className="flex flex-col items-center gap-6 opacity-40">
                      <div className="bg-slate-50 p-8 rounded-full border-2 border-dashed border-slate-200">
                         <Info size={60} strokeWidth={1} className="text-slate-300" />
                      </div>
                      <div>
                        <p className="text-xl font-black uppercase text-slate-900 tracking-tight">Archivo Vacío</p>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2">No hay registros históricos disponibles para mostrar.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
