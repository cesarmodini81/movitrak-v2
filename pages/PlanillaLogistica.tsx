
import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, Plus, Printer, Trash2, Save, FileText, CheckSquare, Square, 
  MapPin, Calendar, MessageSquare, AlertCircle, CheckCircle2, ShieldCheck, Truck
} from 'lucide-react';
import { Vehicle } from '../types';
import { LOCATION_MAP } from '../constants';
import { PrintPreviewModal } from '../components/PrintPreviewModal';

// Documento de Impresión Interno
const PlanillaLogisticaDocument: React.FC<{ items: Vehicle[], companyName: string }> = ({ items, companyName }) => (
  <div className="w-full bg-white font-sans text-slate-900">
    <style>{`@page { size: A4 landscape; margin: 10mm; }`}</style>
    <div className="border-b-[4px] border-slate-900 pb-4 mb-6 flex justify-between items-end">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tighter leading-none">{companyName}</h1>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Gerencia de Logística y Calidad</p>
      </div>
      <div className="text-right">
        <h2 className="text-xl font-black uppercase tracking-tight">Planilla Logística Unificada</h2>
        <p className="text-[10px] font-bold text-slate-400 uppercase">Control de PDI y Despacho</p>
        <p className="text-[9px] font-bold text-slate-900 uppercase mt-2">Emisión: <span className="font-mono">{new Date().toLocaleDateString('es-AR')}</span></p>
      </div>
    </div>
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="border-b-2 border-slate-900">
          <th className="py-2 px-2 text-[9px] font-black uppercase w-[5%]">#</th>
          <th className="py-2 px-2 text-[9px] font-black uppercase w-[15%]">Fecha Entrega</th>
          <th className="py-2 px-2 text-[9px] font-black uppercase w-[15%]">VIN</th>
          <th className="py-2 px-2 text-[9px] font-black uppercase w-[20%]">Unidad</th>
          <th className="py-2 px-2 text-[9px] font-black uppercase w-[20%]">Destino</th>
          <th className="py-2 px-2 text-[9px] font-black uppercase w-[20%]">Observaciones</th>
          <th className="py-2 px-2 text-[9px] font-black uppercase w-[5%] text-center">PDI</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {items.map((v, i) => (
          <tr key={v.vin}>
            <td className="py-2 px-2 text-[10px] font-bold text-slate-400">{i + 1}</td>
            <td className="py-2 px-2 text-[10px] font-bold">{v.preDeliveryDate ? new Date(v.preDeliveryDate).toLocaleDateString() : '-'}</td>
            <td className="py-2 px-2 font-mono text-[11px] font-black">{v.vin}</td>
            <td className="py-2 px-2 text-[10px] font-bold uppercase">{v.brand} {v.model} <span className="text-[9px] text-slate-500 block">{v.color}</span></td>
            <td className="py-2 px-2 text-[10px] uppercase">{LOCATION_MAP[v.locationId] || v.locationId}</td>
            <td className="py-2 px-2 text-[9px] italic">{v.pdiComment || '-'}</td>
            <td className="py-2 px-2 text-center">{v.preDeliveryConfirmed ? <CheckCircle2 size={14} className="mx-auto" /> : <Square size={14} className="mx-auto text-slate-300" />}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <div className="mt-auto pt-10 border-t border-slate-300 flex justify-between">
       <div className="text-center w-32"><div className="border-b border-slate-400 mb-2"></div><p className="text-[8px] font-bold uppercase">Resp. PDI</p></div>
       <div className="text-center w-32"><div className="border-b border-slate-400 mb-2"></div><p className="text-[8px] font-bold uppercase">Logística</p></div>
       <div className="text-center w-32"><div className="border-b border-slate-400 mb-2"></div><p className="text-[8px] font-bold uppercase">Gerencia</p></div>
       <div className="text-right"><div className="w-16 h-16 border border-slate-200 flex items-center justify-center ml-auto"><ShieldCheck size={24} className="text-slate-300"/></div><p className="text-[7px] font-mono mt-1">MOVITRAK SECURE</p></div>
    </div>
  </div>
);

export const PlanillaLogistica: React.FC = () => {
  const { vehicles, pdiQueue, travelSheetList, addToPdiQueue, removeFromTravelSheet, confirmPDI, updateVehicle, addAuditLog, currentCompany, calendarEvents } = useApp();
  
  // State Local
  const [selectedVins, setSelectedVins] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<Vehicle[]>([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Unificar listas (PDI + Viajes) = Logística Activa
  const activeItems = useMemo(() => {
    return vehicles.filter(v => pdiQueue.includes(v.vin) || travelSheetList.includes(v.vin));
  }, [vehicles, pdiQueue, travelSheetList]);

  // Buscador Predictivo
  useEffect(() => {
    if (searchTerm.length > 2) {
      const lower = searchTerm.toLowerCase();
      const filtered = vehicles.filter(v => 
        !activeItems.some(active => active.vin === v.vin) && // Excluir ya listados
        (v.vin.toLowerCase().includes(lower) || 
         v.model.toLowerCase().includes(lower) || 
         (v.plate && v.plate.toLowerCase().includes(lower)))
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  }, [searchTerm, vehicles, activeItems]);

  const handleAddUnit = (vin: string) => {
    addToPdiQueue(vin); // Push a la planilla
    setSearchTerm('');
    setSuggestions([]);
    addAuditLog('LOGISTICS_ADD', `Unidad ${vin} agregada manualmente a Planilla Logística`);
  };

  const handleToggleSelect = (vin: string) => {
    setSelectedVins(prev => prev.includes(vin) ? prev.filter(v => v !== vin) : [...prev, vin]);
  };

  const handleDeleteSelected = () => {
    // Mover a histórica (simulado con removeFromTravelSheet que archiva)
    removeFromTravelSheet(selectedVins);
    // Limpiar también de PDI Queue si estuviera
    // Nota: removeFromTravelSheet maneja la lógica de "Histórica" en el context actual
    addAuditLog('LOGISTICS_REMOVE', `Unidades eliminadas de planilla activa: ${selectedVins.join(', ')}`);
    setSelectedVins([]);
  };

  const handleUpdateField = (vin: string, field: keyof Vehicle | 'date', value: any) => {
    if (field === 'date') {
       // Mock date saving to preDeliveryDate for display purposes or specific event logic
       // En un escenario real actualizaría el evento del calendario asociado
       updateVehicle(vin, { preDeliveryDate: value });
    } else {
       updateVehicle(vin, { [field]: value });
    }
    // Debounce audit log in real app, immediate here
  };

  const handleTogglePDI = (vin: string, currentStatus: boolean) => {
    if (!currentStatus) {
      confirmPDI(vin, 'PDI OK desde Planilla Unificada');
    } else {
      updateVehicle(vin, { preDeliveryConfirmed: false });
    }
  };

  // Helper para fecha (si no tiene, busca en calendario o usa hoy mock)
  const getDisplayDate = (v: Vehicle) => {
    if (v.preDeliveryDate) return v.preDeliveryDate.split('T')[0];
    const event = calendarEvents.find(e => e.vehicleVin === v.vin);
    return event ? event.date : new Date().toISOString().split('T')[0];
  };

  return (
    <div className="space-y-6 pt-20 md:pt-24 pb-20 animate-in fade-in duration-500">
      
      {/* Header & Controls */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="flex items-center gap-4">
           <div className="p-3 bg-slate-900 text-white rounded-xl shadow-lg">
              <FileText size={24} />
           </div>
           <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">Planilla Logística</h1>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Gestión Unificada PDI & Entregas</p>
           </div>
        </div>

        <div className="flex flex-1 w-full lg:w-auto items-center gap-4">
           {/* Buscador Predictivo */}
           <div className="relative flex-1 lg:max-w-md ml-auto">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Search size={16} /></div>
              <input 
                type="text" 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Buscar para agregar (VIN, Modelo)..."
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:bg-white focus:border-slate-900 outline-none transition-all uppercase placeholder:normal-case"
              />
              {suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden">
                   {suggestions.map(s => (
                     <button key={s.vin} onClick={() => handleAddUnit(s.vin)} className="w-full text-left px-4 py-3 hover:bg-slate-50 border-b border-slate-100 last:border-0 flex justify-between items-center group">
                        <div>
                           <span className="font-mono font-black text-xs text-slate-900">{s.vin}</span>
                           <span className="text-[10px] font-bold text-slate-500 uppercase ml-2">{s.brand} {s.model}</span>
                        </div>
                        <Plus size={14} className="text-slate-400 group-hover:text-emerald-600" />
                     </button>
                   ))}
                </div>
              )}
           </div>

           {selectedVins.length > 0 && (
             <button onClick={handleDeleteSelected} className="bg-red-50 text-red-600 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-red-100 transition-all flex items-center gap-2">
                <Trash2 size={16} /> Eliminar ({selectedVins.length})
             </button>
           )}

           <button onClick={() => setIsPreviewOpen(true)} className="bg-slate-900 text-white px-5 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg active:scale-95 flex items-center gap-2">
              <Printer size={16} /> Imprimir
           </button>
        </div>
      </div>

      {/* Tabla Editable */}
      <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
         <div className="overflow-x-auto min-h-[500px]">
            <table className="w-full text-left border-collapse">
               <thead className="bg-slate-900 text-white uppercase text-[10px] font-black tracking-[0.2em] sticky top-0 z-20">
                  <tr>
                     <th className="p-4 w-12 text-center"><Square size={16} className="mx-auto opacity-50" /></th>
                     <th className="p-4 w-40">Fecha Entrega</th>
                     <th className="p-4 w-48">Identificación</th>
                     <th className="p-4 w-64">Unidad / Modelo</th>
                     <th className="p-4 w-64">Ubicación Entrega</th>
                     <th className="p-4 min-w-[300px]">Observaciones / Comentarios</th>
                     <th className="p-4 text-center w-24">PDI</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {activeItems.length > 0 ? activeItems.map(v => (
                     <tr key={v.vin} className={`hover:bg-slate-50 transition-colors group ${selectedVins.includes(v.vin) ? 'bg-slate-50' : ''}`}>
                        <td className="p-4 text-center">
                           <button onClick={() => handleToggleSelect(v.vin)} className="text-slate-300 hover:text-slate-900 transition-colors">
                              {selectedVins.includes(v.vin) ? <CheckSquare size={18} /> : <Square size={18} />}
                           </button>
                        </td>
                        <td className="p-4">
                           <input 
                              type="date" 
                              defaultValue={getDisplayDate(v)} 
                              onBlur={(e) => handleUpdateField(v.vin, 'date', e.target.value)}
                              className="w-full bg-transparent font-bold text-xs text-slate-700 uppercase focus:bg-white focus:ring-2 focus:ring-slate-200 rounded p-1 outline-none"
                           />
                        </td>
                        <td className="p-4">
                           <span className="font-mono font-black text-xs text-slate-900 bg-slate-100 px-2 py-1 rounded">{v.vin}</span>
                        </td>
                        <td className="p-4">
                           <div className="font-black text-xs text-slate-800 uppercase">{v.brand} {v.model}</div>
                           <div className="text-[10px] font-bold text-slate-400 uppercase">{v.color}</div>
                        </td>
                        <td className="p-4">
                           <select 
                              value={v.locationId} 
                              onChange={(e) => handleUpdateField(v.vin, 'locationId', e.target.value)}
                              className="w-full bg-transparent font-bold text-xs text-slate-600 uppercase focus:bg-white focus:ring-2 focus:ring-slate-200 rounded p-1 outline-none cursor-pointer"
                           >
                              {currentCompany?.locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                           </select>
                        </td>
                        <td className="p-4">
                           <textarea 
                              defaultValue={v.pdiComment || ''}
                              onBlur={(e) => handleUpdateField(v.vin, 'pdiComment', e.target.value)}
                              placeholder="Sin observaciones..."
                              className="w-full bg-transparent text-xs font-medium text-slate-600 resize-none focus:bg-white focus:ring-2 focus:ring-slate-200 rounded p-2 outline-none h-10 overflow-hidden focus:h-20 transition-all placeholder:italic"
                           />
                        </td>
                        {/* CELDA PDI CORREGIDA: Borde negro, verde solido OK, alerta roja pendiente */}
                        <td className="p-4 text-center align-middle">
                           <button 
                              onClick={() => handleTogglePDI(v.vin, v.preDeliveryConfirmed)} 
                              className={`
                                 w-10 h-10 flex items-center justify-center rounded-lg border-2 border-slate-900 transition-all active:scale-95 shadow-sm mx-auto
                                 ${v.preDeliveryConfirmed 
                                    ? 'bg-emerald-500 text-white' 
                                    : 'bg-white text-red-600 hover:bg-red-50'
                                 }
                              `}
                              title={v.preDeliveryConfirmed ? "PDI Certificado OK" : "PDI Pendiente"}
                           >
                              {v.preDeliveryConfirmed ? (
                                 <CheckCircle2 size={20} strokeWidth={3} />
                              ) : (
                                 <span className="text-xl font-black leading-none">!</span>
                              )}
                           </button>
                        </td>
                     </tr>
                  )) : (
                     <tr>
                        <td colSpan={7} className="p-32 text-center text-slate-300">
                           <Truck size={60} className="mx-auto mb-4 opacity-20" />
                           <p className="text-sm font-black uppercase tracking-widest opacity-50">Planilla Vacía</p>
                        </td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>

      <PrintPreviewModal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} title="Planilla Logística">
         <PlanillaLogisticaDocument items={activeItems} companyName={currentCompany?.name || 'MOVITRAK'} />
      </PrintPreviewModal>
    </div>
  );
};
