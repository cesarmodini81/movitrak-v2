
import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import { LOCATION_MAP } from '../constants';
import { ClipboardList, ArrowRight, Truck, CheckCircle, MapPin, Box, Check } from 'lucide-react';

export const ConfirmMovements: React.FC = () => {
  const { movements, vehicles, updateVehicle, completeMovement, currentCompany } = useApp();
  const { t } = useTranslation();

  // Filter pending movements for current company
  const pendingMovements = useMemo(() => {
    return movements.filter(m => 
      m.status === 'PENDING' && 
      (currentCompany ? currentCompany.locations.some(l => l.id === m.destinationId) : true)
    );
  }, [movements, currentCompany]);

  const handleConfirmUnit = (movementId: string, vin: string) => {
    // 1. Get movement details
    const movement = movements.find(m => m.id === movementId);
    if (!movement) return;

    // 2. Update specific vehicle (Individual Confirmation)
    updateVehicle(vin, {
      status: 'AVAILABLE',
      locationId: movement.destinationId,
      isLocked: false,
      lockReason: undefined
    });

    // 3. Check if all units are now confirmed (locally derived check)
    // We get all vehicles for this movement
    const allVehiclesInMovement = vehicles.filter(v => movement.vehicleVins.includes(v.vin));
    
    // Check if everyone *else* (excluding the one we just updated implicitly via logic, though state update is async) 
    // is already available. Note: Since React state update might lag, we check the condition:
    // (v.status === 'AVAILABLE' OR v.vin === vin)
    const allConfirmed = allVehiclesInMovement.every(v => 
      (v.status === 'AVAILABLE' && v.locationId === movement.destinationId) || v.vin === vin
    );

    if (allConfirmed) {
      // If this was the last one (or all are done), mark movement as completed
      completeMovement(movementId);
      
      const toast = document.createElement('div');
      toast.className = 'fixed top-8 right-8 bg-emerald-900 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right duration-300 z-50';
      toast.innerHTML = `<span class="font-bold">Movimiento Completado - Todas las unidades recibidas</span>`;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3500);
    } else {
      // Single unit confirmation toast
      const toast = document.createElement('div');
      toast.className = 'fixed top-8 right-8 bg-emerald-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right duration-300 z-50';
      toast.innerHTML = `<span class="font-bold">Unidad ${vin} confirmada correctamente</span>`;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    }
  };

  return (
    // PADDING TOP AUMENTADO (pt-20 md:pt-24)
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 pt-20 md:pt-24">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="p-4 bg-emerald-600 text-white rounded-2xl shadow-xl shadow-emerald-200">
           <ClipboardList size={32} />
        </div>
        <div>
           <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase leading-none">Recepción de Unidades</h2>
           <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-2">Control de Arribos y Conformidad</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {pendingMovements.length > 0 ? (
          pendingMovements.map(mov => {
            // Get vehicles for this movement
            const movVehicles = vehicles.filter(v => mov.vehicleVins.includes(v.vin));
            
            // Calculate progress
            const confirmedCount = movVehicles.filter(v => v.status === 'AVAILABLE' && v.locationId === mov.destinationId).length;
            const totalCount = movVehicles.length;
            const progress = Math.round((confirmedCount / totalCount) * 100);

            return (
              <div key={mov.id} className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
                {/* Movement Header */}
                <div className="bg-slate-50 p-6 border-b border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                       <span className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg">
                          Remito #{mov.id}
                       </span>
                       <span className="text-slate-400 text-xs font-bold uppercase">
                          {new Date(mov.date).toLocaleDateString()}
                       </span>
                    </div>
                    <div className="flex items-center gap-3 text-lg font-black text-slate-800 uppercase">
                       <span className="text-slate-500">{LOCATION_MAP[mov.originId] || mov.originId}</span>
                       <ArrowRight size={20} className="text-emerald-500" />
                       <span className="text-emerald-700">{LOCATION_MAP[mov.destinationId] || mov.destinationId}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mt-2 uppercase tracking-wide">
                       <Truck size={14} />
                       {mov.transporter} {mov.driverName ? `• ${mov.driverName}` : ''}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 min-w-[150px]">
                     <div className="text-right">
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Progreso Recepción</p>
                        <p className="text-2xl font-black text-slate-900">{confirmedCount} / {totalCount}</p>
                     </div>
                     <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 transition-all duration-500" 
                          style={{ width: `${progress}%` }}
                        ></div>
                     </div>
                  </div>
                </div>

                {/* Vehicles Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-white text-slate-500 uppercase text-[10px] font-black tracking-[0.2em] border-b border-slate-100">
                      <tr>
                        <th className="p-6 w-16 text-center">#</th>
                        <th className="p-6">Identificación</th>
                        <th className="p-6">Detalle Unidad</th>
                        <th className="p-6">Color</th>
                        <th className="p-6 text-center">Estado Actual</th>
                        <th className="p-6 text-right">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {movVehicles.map((v, idx) => {
                        const isConfirmed = v.status === 'AVAILABLE' && v.locationId === mov.destinationId;
                        return (
                          <tr key={v.vin} className={`transition-colors ${isConfirmed ? 'bg-emerald-50/30' : 'hover:bg-slate-50'}`}>
                            <td className="p-6 text-center font-bold text-slate-400 text-xs">
                              {idx + 1}
                            </td>
                            <td className="p-6">
                              <span className="font-mono font-black text-slate-900 text-sm tracking-widest bg-slate-100 px-3 py-1 rounded-lg">
                                {v.vin}
                              </span>
                            </td>
                            <td className="p-6">
                              <div className="font-black text-slate-800 uppercase text-xs">{v.brand} {v.model}</div>
                              <div className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-wide">{v.year} • {v.type === 'NEW' ? '0KM' : 'USADO'}</div>
                            </td>
                            <td className="p-6 text-xs font-bold text-slate-600 uppercase">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full border border-slate-300 bg-slate-200"></div>
                                {v.color}
                              </div>
                            </td>
                            <td className="p-6 text-center">
                              {isConfirmed ? (
                                <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-200">
                                  <CheckCircle size={12} /> Confirmado
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-100 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-amber-200">
                                  <Box size={12} /> En Tránsito
                                </span>
                              )}
                            </td>
                            <td className="p-6 text-right">
                              {!isConfirmed && (
                                <button 
                                  onClick={() => handleConfirmUnit(mov.id, v.vin)}
                                  className="inline-flex items-center gap-2 bg-slate-900 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg hover:shadow-emerald-200 transition-all active:scale-95 group"
                                >
                                  <Check size={14} className="group-hover:scale-110 transition-transform" />
                                  Confirmar Unidad
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-[2.5rem] shadow-xl p-20 text-center border border-slate-100">
             <div className="inline-flex bg-slate-50 p-8 rounded-full mb-6 animate-pulse">
                <Truck className="text-slate-300 w-16 h-16" />
             </div>
             <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Sin Recepciones Pendientes</h3>
             <p className="text-sm font-bold text-slate-400 mt-2 uppercase tracking-widest">No hay movimientos en curso hacia su ubicación actual.</p>
          </div>
        )}
      </div>
    </div>
  );
};
