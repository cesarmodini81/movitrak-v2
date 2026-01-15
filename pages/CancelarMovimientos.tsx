
import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { LOCATION_MAP } from '../constants';
import { Ban, CheckSquare, Square, AlertTriangle, X, Search } from 'lucide-react';

export const CancelarMovimientos: React.FC = () => {
  const { movements, availableVehicles, cancelMovements, currentCompany, user } = useApp();
  
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar movimientos pendientes y por empresa
  const pendingMovements = useMemo(() => {
    return movements.filter(m => {
      // Filtro status
      const isPending = m.status === 'PENDING';
      // Filtro empresa
      const belongsToCompany = currentCompany 
        ? (currentCompany.locations.some(l => l.id === m.originId || l.id === m.destinationId))
        : true; // SuperAdmin ve todo

      return isPending && belongsToCompany;
    });
  }, [movements, currentCompany]);

  // Filtrar por búsqueda
  const filteredMovements = useMemo(() => {
    if (!searchTerm) return pendingMovements;
    const lower = searchTerm.toLowerCase();
    return pendingMovements.filter(m => 
      m.id.toLowerCase().includes(lower) ||
      m.vehicleVins.some(v => v.toLowerCase().includes(lower)) ||
      LOCATION_MAP[m.destinationId]?.toLowerCase().includes(lower)
    );
  }, [pendingMovements, searchTerm]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredMovements.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredMovements.map(m => m.id));
    }
  };

  const handleOpenModal = () => {
    if (selectedIds.length === 0) return;
    setCancelReason('');
    setIsModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!cancelReason.trim()) return;
    
    // Attempt API Call
    try {
      await fetch('/api/movements', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ids: selectedIds, 
          reason: cancelReason,
          username: user?.username 
        })
      });
    } catch (e) {
      console.warn("API Cancel failed, local fallback");
    }

    // Context Update
    cancelMovements(selectedIds, cancelReason);
    
    // Toast Success
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-8 right-8 bg-emerald-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right duration-300 z-50';
    toast.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> <span class="font-bold">Movimientos anulados correctamente</span>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);

    setIsModalOpen(false);
    setSelectedIds([]);
  };

  const getVehicleDetails = (vins: string[]) => {
    const vehs = availableVehicles.filter(v => vins.includes(v.vin));
    if (vehs.length === 0) return { desc: 'Sin datos', color: '-' };
    
    const brands = [...new Set(vehs.map(v => `${v.brand} ${v.model}`))].join(', ');
    const colors = [...new Set(vehs.map(v => v.color))].join(', ');
    return { desc: brands, color: colors };
  };

  return (
    // PADDING TOP AUMENTADO (pt-20 md:pt-24)
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 pt-20 md:pt-24">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-red-600 text-white rounded-2xl shadow-xl shadow-red-200">
            <Ban size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase leading-none">Cancelar Movimientos</h2>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-2">Gestión de Anulaciones y Retornos</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
           <div className="relative">
              <input 
                type="text" 
                placeholder="Buscar Remito, VIN..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-red-500 transition-all shadow-sm w-64"
              />
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
           </div>
           
           <button 
             onClick={handleOpenModal}
             disabled={selectedIds.length === 0}
             className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
           >
             <Ban size={18} />
             Anular Seleccionados ({selectedIds.length})
           </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto max-h-[65vh]">
          <table className="w-full text-left">
            <thead className="bg-slate-900 text-white uppercase text-[10px] font-black tracking-[0.2em] sticky top-0 z-10">
              <tr>
                <th className="p-6 text-center w-16">
                   <button onClick={toggleSelectAll} className="hover:text-red-400 transition-colors">
                      {selectedIds.length > 0 && selectedIds.length === filteredMovements.length ? <CheckSquare size={18} /> : <Square size={18} />}
                   </button>
                </th>
                <th className="p-6"># ID Remito</th>
                <th className="p-6">VIN / Chasis</th>
                <th className="p-6">Unidad (Marca-Modelo)</th>
                <th className="p-6">Color</th>
                <th className="p-6">Destino</th>
                <th className="p-6 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMovements.length > 0 ? (
                filteredMovements.map(m => {
                  const details = getVehicleDetails(m.vehicleVins);
                  const isSelected = selectedIds.includes(m.id);
                  return (
                    <tr 
                      key={m.id} 
                      onClick={() => toggleSelect(m.id)}
                      className={`cursor-pointer transition-colors group ${isSelected ? 'bg-red-50' : 'hover:bg-slate-50'}`}
                    >
                      <td className="p-6 text-center">
                         <div className={`transition-colors ${isSelected ? 'text-red-600' : 'text-slate-300 group-hover:text-slate-400'}`}>
                            {isSelected ? <CheckSquare size={18} /> : <Square size={18} />}
                         </div>
                      </td>
                      <td className="p-6 font-mono font-black text-slate-900 text-sm">
                         {m.id}
                      </td>
                      <td className="p-6">
                         <div className="flex flex-col gap-1">
                            {m.vehicleVins.map(vin => (
                               <span key={vin} className="font-mono font-bold text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded w-fit">{vin}</span>
                            ))}
                         </div>
                      </td>
                      <td className="p-6 font-bold text-slate-800 text-xs uppercase">
                         {details.desc}
                      </td>
                      <td className="p-6 text-xs font-bold text-slate-500 uppercase">
                         {details.color}
                      </td>
                      <td className="p-6 text-xs font-black text-slate-700 uppercase">
                         {LOCATION_MAP[m.destinationId] || m.destinationId}
                      </td>
                      <td className="p-6 text-center">
                         <span className="inline-flex px-3 py-1 bg-slate-100 text-slate-500 rounded-full font-black text-[9px] uppercase tracking-widest border border-slate-200">
                            NO CONFIRMADO
                         </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="p-20 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-40">
                       <CheckSquare size={60} className="text-emerald-500" />
                       <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No hay movimientos pendientes de anulación</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Anulación */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
           <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-10 relative overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="absolute top-0 left-0 w-full h-2 bg-red-600"></div>
              
              <div className="flex items-center gap-4 mb-6 text-red-600">
                 <AlertTriangle size={32} strokeWidth={2} />
                 <h3 className="text-2xl font-black uppercase tracking-tight text-slate-900">Razón de Anulación</h3>
              </div>

              <p className="text-slate-500 text-sm font-medium mb-6 leading-relaxed">
                 Está por anular <b>{selectedIds.length} movimiento(s)</b>. Esta acción revertirá el estado de las unidades a "Disponibles" en origen. Es obligatorio documentar el motivo.
              </p>

              <div className="space-y-2 mb-8">
                 <label className="text-xs font-black uppercase text-slate-400 ml-1">Motivo / Justificación *</label>
                 <textarea 
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    rows={4}
                    placeholder="Ingrese motivo detallado de la anulación..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-bold text-slate-900 outline-none focus:border-red-500 focus:ring-4 focus:ring-red-50 resize-none transition-all"
                    autoFocus
                 />
              </div>

              <div className="flex gap-4">
                 <button 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
                 >
                    Cancelar
                 </button>
                 <button 
                    onClick={handleConfirmCancel}
                    disabled={!cancelReason.trim()}
                    className="flex-1 py-4 bg-red-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-red-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                    Confirmar Anulación
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
