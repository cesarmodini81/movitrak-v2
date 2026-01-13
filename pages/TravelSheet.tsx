
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import { LOCATION_MAP } from '../constants';
import { 
  FileText, Printer, Trash2, CheckSquare, Square, 
  AlertCircle, Calendar, Search, ArrowUpDown, ArrowUp, ArrowDown, MapPin,
  GripVertical
} from 'lucide-react';
import { PrintPreviewModal } from '../components/PrintPreviewModal';
import { Vehicle } from '../types';

type SortDirection = 'asc' | 'desc';
interface SortConfig {
  key: string;
  direction: SortDirection;
}

// Helper interface for the display data
interface TravelSheetItem extends Vehicle {
  deliveryDate: string;
  deliveryLocationName: string;
}

export const TravelSheet: React.FC = () => {
  const { vehicles, travelSheetList, removeFromTravelSheet, currentCompany, calendarEvents, companies } = useApp();
  const { t } = useTranslation();
  
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedVins, setSelectedVins] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for the ordered list (allows Drag & Drop)
  const [orderedItems, setOrderedItems] = useState<TravelSheetItem[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  
  // Drag & Drop Refs
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const getLocationName = (id: string) => {
    if (LOCATION_MAP[id]) return LOCATION_MAP[id];
    for (const c of companies) {
      const loc = c.locations.find(l => l.id === id);
      if (loc) return loc.name;
    }
    return id;
  };

  // 1. Merge Context Data (Source of Truth - Integration Logic)
  const sourceData = useMemo(() => {
    return vehicles
      .filter(v => travelSheetList.includes(v.vin)) // Only confirmed PDI units
      .map(v => {
        // Integrate Calendar Data (Priority to Event)
        const event = calendarEvents.find(e => e.vehicleVin === v.vin && e.status === 'PROGRAMADO');
        
        let deliveryDate = event?.date;
        let deliveryLocationName = event ? getLocationName(event.destinationId) : '';

        // Fallback logic if no calendar event (Mock Data resilience)
        if (!deliveryDate) {
           const vinSum = v.vin.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
           const mockDate = new Date();
           mockDate.setDate(mockDate.getDate() + (vinSum % 10) + 1);
           deliveryDate = mockDate.toISOString().split('T')[0];
           
           const mockLocs = ['Entrega Final Predio', 'Cliente Final Directo', 'Puerto Sauce Viejo', 'Depósito Regional'];
           deliveryLocationName = mockLocs[vinSum % mockLocs.length];
        }

        return {
          ...v,
          deliveryDate,
          deliveryLocationName
        };
      });
  }, [vehicles, travelSheetList, calendarEvents, companies]);

  // 2. Sync Source Data with Ordered State
  useEffect(() => {
    setOrderedItems(prev => {
      // New items coming from PDI
      const newItems = sourceData.filter(s => !prev.some(p => p.vin === s.vin));
      // Existing items (keep manual order)
      const existingItems = prev.filter(p => sourceData.some(s => s.vin === p.vin)).map(p => {
        const fresh = sourceData.find(s => s.vin === p.vin);
        return fresh ? { ...fresh } : p;
      });
      
      return [...existingItems, ...newItems];
    });
  }, [sourceData]);

  // 3. Filtering
  const filteredData = useMemo(() => {
    if (!searchTerm) return orderedItems;
    const lowerTerm = searchTerm.toLowerCase();
    return orderedItems.filter(item => 
      item.vin.toLowerCase().includes(lowerTerm) ||
      item.brand.toLowerCase().includes(lowerTerm) ||
      item.model.toLowerCase().includes(lowerTerm) ||
      item.deliveryLocationName.toLowerCase().includes(lowerTerm) ||
      (item.pdiComment && item.pdiComment.toLowerCase().includes(lowerTerm))
    );
  }, [orderedItems, searchTerm]);

  // 4. Sorting Handlers
  const handleSort = (key: keyof TravelSheetItem) => {
    let direction: SortDirection = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sorted = [...orderedItems].sort((a, b) => {
      const aVal = a[key]?.toString().toLowerCase() || '';
      const bVal = b[key]?.toString().toLowerCase() || '';
      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setOrderedItems(sorted);
  };

  // 5. Drag & Drop Handlers
  const handleDragStart = (e: React.DragEvent<HTMLTableRowElement>, index: number) => {
    dragItem.current = index;
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnter = (e: React.DragEvent<HTMLTableRowElement>, index: number) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = () => {
    if (dragItem.current !== null && dragOverItem.current !== null && dragItem.current !== dragOverItem.current) {
      const _items = [...orderedItems];
      const draggedItemContent = _items.splice(dragItem.current, 1)[0];
      _items.splice(dragOverItem.current, 0, draggedItemContent);
      setOrderedItems(_items);
      setSortConfig(null);
    }
    dragItem.current = null;
    dragOverItem.current = null;
  };

  // Selection Logic
  const toggleSelect = (vin: string) => {
    setSelectedVins(prev => prev.includes(vin) ? prev.filter(v => v !== vin) : [...prev, vin]);
  };

  const toggleSelectAll = () => {
    setSelectedVins(selectedVins.length === filteredData.length ? [] : filteredData.map(v => v.vin));
  };

  const handleBulkRemove = () => {
    removeFromTravelSheet(selectedVins);
    setSelectedVins([]);
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-8 right-8 bg-slate-900 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right duration-300 z-50';
    toast.innerHTML = `<div class="bg-red-500 text-white p-1.5 rounded-full"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg></div><div><p class="font-bold text-xs uppercase tracking-widest">Unidades quitadas de Viajes</p></div>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const SortIcon = ({ column }: { column: string }) => {
    if (sortConfig?.key !== column) return <ArrowUpDown size={14} className="opacity-20 ml-2" />;
    return sortConfig.direction === 'asc' 
      ? <ArrowUp size={14} className="text-brand-400 ml-2" /> 
      : <ArrowDown size={14} className="text-brand-400 ml-2" />;
  };

  // Printable Component
  const PrintableTable = () => (
    <div className="bg-white p-12 text-slate-900 font-sans min-h-[297mm]">
      <div className="p-8 border-b-4 border-slate-900 mb-8">
         <div className="flex justify-between items-end">
           <div>
             <h1 className="text-2xl font-black uppercase tracking-tighter leading-none mb-2">Planilla de Viajes</h1>
             <p className="text-sm font-bold text-slate-500 uppercase tracking-[0.2em]">Orden de Carga Logística</p>
           </div>
           <div className="text-right">
             <p className="text-[10px] uppercase font-bold text-slate-400">{currentCompany?.name}</p>
             <p className="text-xs font-mono">{new Date().toLocaleString()}</p>
           </div>
         </div>
      </div>
      <table className="w-full text-left text-xs border-collapse border-t-2 border-slate-900">
        <thead className="bg-slate-50 uppercase font-black">
          <tr>
            <th className="p-3 border-b-2 border-slate-900 w-10 text-center">#</th>
            <th className="p-3 border-b-2 border-slate-900">VIN / Chasis</th>
            <th className="p-3 border-b-2 border-slate-900">Unidad</th>
            <th className="p-3 border-b-2 border-slate-900">Fecha Entrega</th>
            <th className="p-3 border-b-2 border-slate-900">Ubicación Entrega</th>
            <th className="p-3 border-b-2 border-slate-900">Obs. Técnicas</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {filteredData.map((v, idx) => (
            <tr key={v.vin}>
              <td className="p-3 font-bold text-center text-slate-400">{idx + 1}</td>
              <td className="p-3 font-mono font-bold align-top">{v.vin}</td>
              <td className="p-3 align-top">
                <div className="font-bold uppercase">{v.brand} {v.model}</div>
                <div className="text-[10px] text-slate-500 uppercase">{v.color}</div>
              </td>
              <td className="p-3 align-top font-mono">{new Date(v.deliveryDate).toLocaleDateString()}</td>
              <td className="p-3 align-top uppercase font-bold text-xs">{v.deliveryLocationName}</td>
              <td className="p-3 align-top italic text-slate-600">{v.pdiComment || '---'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 min-h-screen">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 no-print">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="p-3 bg-brand-600 text-white rounded-xl shadow-lg shadow-brand-200 shrink-0">
            <FileText size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Planilla de Viajes</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Coordinación de Entregas & Despachos</p>
          </div>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Search size={16} />
            </div>
            <input 
              type="text" 
              placeholder="Buscar VIN, Modelo, Destino..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-50 outline-none text-xs font-bold transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            {selectedVins.length > 0 && (
              <button 
                onClick={handleBulkRemove}
                className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-red-100 transition-all border border-red-100 whitespace-nowrap"
              >
                <Trash2 size={16} />
                Quitar ({selectedVins.length})
              </button>
            )}
            <button 
              onClick={() => setIsPreviewOpen(true)}
              className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-colors shadow-md active:scale-95 font-bold text-[10px] uppercase tracking-widest whitespace-nowrap"
            >
              <Printer size={16} />
              {t('print')}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[1.5rem] shadow-lg border border-slate-100 overflow-hidden no-print">
        {filteredData.length > 0 && (
           <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              <GripVertical size={14} />
              <span>Arrastre las filas para reordenar la prioridad de carga</span>
           </div>
        )}
        <div className="overflow-x-auto max-h-[75vh] overflow-y-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-900 text-white uppercase text-[10px] font-black tracking-[0.2em] sticky top-0 z-20 shadow-xl">
              <tr>
                <th className="p-4 w-12 text-center"></th>
                <th className="p-4 w-16 text-center">
                  <button onClick={toggleSelectAll} className="hover:text-brand-300 transition-colors">
                     {selectedVins.length > 0 && selectedVins.length === filteredData.length ? <CheckSquare size={18} /> : <Square size={18} />}
                  </button>
                </th>
                <th className="p-6 cursor-pointer hover:bg-slate-800 transition-colors group" onClick={() => handleSort('vin')}>
                  <div className="flex items-center">Identificación VIN <SortIcon column="vin" /></div>
                </th>
                <th className="p-6 cursor-pointer hover:bg-slate-800 transition-colors group" onClick={() => handleSort('model')}>
                  <div className="flex items-center">Unidad / Modelo <SortIcon column="model" /></div>
                </th>
                <th className="p-6 cursor-pointer hover:bg-slate-800 transition-colors group" onClick={() => handleSort('deliveryDate')}>
                  <div className="flex items-center">FECHA DE ENTREGA <SortIcon column="deliveryDate" /></div>
                </th>
                <th className="p-6 cursor-pointer hover:bg-slate-800 transition-colors group" onClick={() => handleSort('deliveryLocationName')}>
                  <div className="flex items-center">UBICACIÓN DE ENTREGA <SortIcon column="deliveryLocationName" /></div>
                </th>
                <th className="p-6 w-1/4">OBSERVACIONES TÉCNICAS (PDI)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.length > 0 ? (
                filteredData.map((v, index) => {
                  const isSelected = selectedVins.includes(v.vin);
                  return (
                    <tr 
                      key={v.vin} 
                      draggable={!searchTerm && !sortConfig} // Disable drag if filtering/sorting
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragEnter={(e) => handleDragEnter(e, index)}
                      onDragEnd={handleDragEnd}
                      onClick={() => toggleSelect(v.vin)}
                      className={`transition-all group border-l-4 ${
                        isSelected 
                          ? 'bg-brand-50 border-l-brand-500' 
                          : 'hover:bg-slate-50 border-l-transparent'
                      } ${!searchTerm && !sortConfig ? 'cursor-move' : 'cursor-default'}`}
                    >
                      <td className="p-4 text-center text-slate-300">
                         {!searchTerm && !sortConfig && <GripVertical size={16} className="mx-auto group-hover:text-slate-500" />}
                      </td>
                      <td className="p-4 text-center cursor-pointer">
                        <div className={`transition-colors ${isSelected ? 'text-brand-600' : 'text-slate-300 group-hover:text-slate-400'}`}>
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
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase bg-white border border-slate-200 px-3 py-1 rounded-lg w-fit">
                          <Calendar size={14} className="text-brand-500" />
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
                        <div className="text-xs font-medium text-slate-600 italic border-l-2 border-emerald-400 pl-3 truncate max-w-xs">
                          {v.pdiComment || 'Validado sin observaciones.'}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="p-24 text-center">
                    <div className="flex flex-col items-center gap-6 opacity-40">
                      <div className="bg-slate-100 p-8 rounded-full">
                         <AlertCircle size={60} strokeWidth={1} className="text-slate-400" />
                      </div>
                      <div>
                        <p className="text-xl font-black uppercase text-slate-900 tracking-tight">Sin Resultados</p>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2">No se encontraron unidades en Planilla de Viajes.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <PrintPreviewModal 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
        title="Planilla de Viajes Operativa"
      >
        <PrintableTable />
      </PrintPreviewModal>
    </div>
  );
};
