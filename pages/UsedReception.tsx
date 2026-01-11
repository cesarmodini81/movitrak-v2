import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { UsedReception, Vehicle } from '../types';
import { 
  FileText, Save, Truck, Search, 
  CheckCircle, AlertCircle, Info, User, 
  ShieldCheck, Database, Calendar, Gauge,
  Printer, Trash2, CheckCircle2, Building2,
  Clock, Hash, MapPin, ClipboardList, Ban
} from 'lucide-react';
import { USED_STATES, OPERATION_TYPES, VEHICLE_CONDITIONS, BRANDS, MODELS, COLORS } from '../constants';
import { UsedReceptionDocument } from './UsedReceptionDocument';
import { PrintPreviewModal } from '../components/PrintPreviewModal';

export const UsedReceptionPage: React.FC = () => {
  const { availableVehicles, saveUsedReception, currentCompany, user, addVehicle, updateVehicle, addAuditLog } = useApp();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [formState, setFormState] = useState<'IDLE' | 'INGRESADO' | 'CONFIRMADO'>('IDLE');

  // Form Initial State
  const initialReception: Partial<UsedReception & { plate: string, condition: string, clientName: string, clientDni: string, clientPhone: string, clientEmail: string, operationType: string }> = {
    id: `US-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
    date: new Date().toISOString().split('T')[0],
    kmReception: 0,
    fuelLevel: 50,
    inventory: { exterior: {}, interior: {}, accessories: {} },
    observations: '',
    plate: '',
    condition: VEHICLE_CONDITIONS[0],
    clientName: '',
    clientDni: '',
    clientPhone: '',
    clientEmail: '',
    operationType: OPERATION_TYPES[0].id
  };

  const [reception, setReception] = useState(initialReception);
  const [vehicleData, setVehicleData] = useState<Partial<Vehicle>>({
    vin: '', brand: BRANDS[0], model: MODELS[BRANDS[0]][0], year: 2020, color: COLORS[0], type: 'USED'
  });

  const handleSave = (status: 'INGRESADO' | 'CONFIRMADO') => {
    if (!vehicleData.vin || !reception.clientName) {
      alert("Faltan datos obligatorios (VIN y Nombre del Cliente)");
      return;
    }

    const finalReception: UsedReception = {
      ...reception,
      vehicleVin: vehicleData.vin,
      companyId: currentCompany?.id || 'unknown',
      status: status
    } as any;

    // Save to global context
    saveUsedReception(finalReception);
    
    // Add vehicle to stock if confirmed
    if (status === 'CONFIRMADO') {
       addVehicle({
         ...vehicleData,
         locationId: currentCompany?.locations[0].id || 'loc_used_default',
         entryDate: new Date().toISOString(),
         status: 'AVAILABLE',
         isLocked: false,
         preDeliveryConfirmed: true
       } as Vehicle);
       setFormState('CONFIRMADO');
       addAuditLog('USED_CONFIRMED', `Vehículo ${vehicleData.vin} confirmado y dado de alta en stock.`);
    } else {
       setFormState('INGRESADO');
       addAuditLog('USED_INGRESADO', `Acta ${reception.id} guardada como borrador.`);
    }

    showToast(status === 'CONFIRMADO' ? 'Recepción Confirmada y Alta de Stock' : 'Acta Guardada como Borrador');
  };

  const handleAnular = () => {
    if (window.confirm("¿Está seguro de anular esta recepción? El registro quedará bloqueado.")) {
      setFormState('IDLE');
      setReception(initialInitialReception());
      setVehicleData({ vin: '', brand: BRANDS[0], model: MODELS[BRANDS[0]][0], year: 2020, color: COLORS[0], type: 'USED' });
      addAuditLog('USED_ANULADO', `Acta ${reception.id} anulada por el operador.`);
      showToast('Recepción Anulada', 'warning');
    }
  };

  const showToast = (msg: string, type: 'success' | 'warning' = 'success') => {
    const toast = document.createElement('div');
    toast.className = `fixed bottom-8 right-8 ${type === 'success' ? 'bg-emerald-600' : 'bg-amber-600'} text-white px-6 py-4 rounded-xl shadow-2xl z-50 animate-in slide-in-from-right duration-300`;
    toast.innerHTML = `<p class="font-black uppercase tracking-widest text-xs">${msg}</p>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const initialInitialReception = () => initialReception;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
      
      {/* Header Formato Enterprise */}
      <div className="bg-white border-t-8 border-slate-900 p-8 rounded-b-3xl shadow-xl space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-100 pb-6">
           <div className="flex items-center gap-5">
              <div className="p-4 bg-slate-900 text-white rounded-2xl shadow-lg">
                 <ClipboardList size={32} />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">ACTA DE RECEPCIÓN DE VEHÍCULO USADO</h1>
                <div className="flex items-center gap-4 mt-1">
                   <p className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                     <Building2 size={12} /> {currentCompany?.name}
                   </p>
                   <p className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                     <User size={12} /> Operador: {user?.name}
                   </p>
                </div>
              </div>
           </div>
           
           <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col items-end min-w-[200px]">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                 <Hash size={14} />
                 <span className="text-[10px] font-black uppercase tracking-widest">Número de Acta</span>
              </div>
              <p className="text-2xl font-mono font-black text-slate-900 leading-none">{reception.id}</p>
              <div className="flex items-center gap-2 mt-3 text-slate-400">
                 <Clock size={14} />
                 <span className="text-[10px] font-bold">{new Date().toLocaleTimeString()} — {reception.date}</span>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Columna Izquierda: Datos del Vehículo y Propietario */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Sección I: Identificación de la Unidad */}
            <section className="space-y-6">
               <div className="flex items-center gap-3 border-l-4 border-slate-900 pl-4 py-1">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">I. Datos Técnicos del Vehículo</h3>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="col-span-2 space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Número de Chasis (VIN) *</label>
                     <input 
                       type="text"
                       value={vehicleData.vin}
                       onChange={(e) => setVehicleData({...vehicleData, vin: e.target.value.toUpperCase()})}
                       className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-slate-900 outline-none font-mono font-bold text-slate-800 tracking-widest"
                       placeholder="EJ: 8AJH452..."
                       disabled={formState !== 'IDLE'}
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Patente / Dominio</label>
                     <input 
                       type="text"
                       value={reception.plate}
                       onChange={(e) => setReception({...reception, plate: e.target.value.toUpperCase()})}
                       className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-slate-900 outline-none font-mono font-bold text-slate-800 text-center tracking-widest"
                       placeholder="AAA 000"
                       disabled={formState !== 'IDLE'}
                     />
                  </div>
                  
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Marca</label>
                     <select 
                       value={vehicleData.brand}
                       onChange={(e) => setVehicleData({...vehicleData, brand: e.target.value, model: MODELS[e.target.value]?.[0] || ''})}
                       className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-slate-900 outline-none font-bold text-slate-800"
                       disabled={formState !== 'IDLE'}
                     >
                       {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                     </select>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Modelo</label>
                     <select 
                       value={vehicleData.model}
                       onChange={(e) => setVehicleData({...vehicleData, model: e.target.value})}
                       className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-slate-900 outline-none font-bold text-slate-800"
                       disabled={formState !== 'IDLE'}
                     >
                       {MODELS[vehicleData.brand || 'Toyota']?.map(m => <option key={m} value={m}>{m}</option>)}
                     </select>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Año</label>
                     <input 
                       type="number"
                       value={vehicleData.year}
                       onChange={(e) => setVehicleData({...vehicleData, year: parseInt(e.target.value)})}
                       className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-slate-900 outline-none font-bold text-slate-800"
                       disabled={formState !== 'IDLE'}
                     />
                  </div>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Color</label>
                     <select 
                       value={vehicleData.color}
                       onChange={(e) => setVehicleData({...vehicleData, color: e.target.value})}
                       className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-slate-900 outline-none font-bold text-slate-800 text-xs"
                       disabled={formState !== 'IDLE'}
                     >
                       {COLORS.map(c => <option key={c} value={c}>{c}</option>)}
                     </select>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kilometraje Declarado</label>
                     <input 
                       type="number"
                       value={reception.kmReception}
                       onChange={(e) => setReception({...reception, kmReception: parseInt(e.target.value)})}
                       className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-slate-900 outline-none font-bold text-slate-800"
                       disabled={formState !== 'IDLE'}
                     />
                  </div>
                  <div className="col-span-2 space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Estado General Sugerido</label>
                     <select 
                       value={reception.condition}
                       onChange={(e) => setReception({...reception, condition: e.target.value})}
                       className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-slate-900 outline-none font-bold text-slate-800 text-sm"
                       disabled={formState !== 'IDLE'}
                     >
                       {VEHICLE_CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                     </select>
                  </div>
               </div>
            </section>

            {/* Sección II: Datos del Propietario */}
            <section className="space-y-6">
               <div className="flex items-center gap-3 border-l-4 border-slate-900 pl-4 py-1">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">II. Identificación del Propietario / Cliente</h3>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  <div className="md:col-span-8 space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre Completo / Razón Social *</label>
                     <input 
                       type="text"
                       value={reception.clientName}
                       onChange={(e) => setReception({...reception, clientName: e.target.value})}
                       className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-slate-900 outline-none font-bold text-slate-800"
                       placeholder="Titular registral..."
                       disabled={formState !== 'IDLE'}
                     />
                  </div>
                  <div className="md:col-span-4 space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">DNI / CUIT</label>
                     <input 
                       type="text"
                       value={reception.clientDni}
                       onChange={(e) => setReception({...reception, clientDni: e.target.value})}
                       className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-slate-900 outline-none font-bold text-slate-800"
                       disabled={formState !== 'IDLE'}
                     />
                  </div>
                  <div className="md:col-span-4 space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Teléfono</label>
                     <input 
                       type="text"
                       value={reception.clientPhone}
                       onChange={(e) => setReception({...reception, clientPhone: e.target.value})}
                       className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-slate-900 outline-none font-bold text-slate-800"
                       disabled={formState !== 'IDLE'}
                     />
                  </div>
                  <div className="md:col-span-8 space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                     <input 
                       type="email"
                       value={reception.clientEmail}
                       onChange={(e) => setReception({...reception, clientEmail: e.target.value})}
                       className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-slate-900 outline-none font-bold text-slate-800"
                       disabled={formState !== 'IDLE'}
                     />
                  </div>
               </div>
            </section>

            <section className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">III. Observaciones Iniciales y Detalles de Faltantes</label>
              <textarea 
                value={reception.observations}
                onChange={(e) => setReception({...reception, observations: e.target.value})}
                className="w-full h-32 p-6 bg-slate-50 border-2 border-slate-100 rounded-3xl font-medium text-slate-700 outline-none focus:bg-white focus:border-slate-900 transition-all resize-none"
                placeholder="Describa el estado de recepción, manuales, llaves, auxilio..."
                disabled={formState !== 'IDLE'}
              />
            </section>
          </div>

          {/* Columna Derecha: Configuración Operativa y Resumen */}
          <div className="lg:col-span-4 space-y-8">
            
            <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-10 opacity-5">
                  <Database size={120} />
               </div>
               
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 border-b border-white/10 pb-4">Configuración Logística</h3>
               
               <div className="space-y-6">
                  <div className="space-y-1">
                     <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Ubicación Asignada</p>
                     <div className="flex items-center gap-3 text-white">
                        <MapPin size={16} className="text-slate-500" />
                        <span className="font-black uppercase text-sm">USADOS — Santa Fe</span>
                     </div>
                  </div>
                  
                  <div className="space-y-1">
                     <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Tipo de Operatoria</p>
                     <select 
                       value={reception.operationType}
                       onChange={(e) => setReception({...reception, operationType: e.target.value})}
                       className="w-full bg-white/5 border border-white/20 rounded-xl p-3 text-xs font-bold outline-none focus:bg-white/10"
                       disabled={formState !== 'IDLE'}
                     >
                       {OPERATION_TYPES.map(opt => <option key={opt.id} value={opt.id} className="text-slate-900">{opt.label}</option>)}
                     </select>
                  </div>

                  <div className="space-y-3 pt-4">
                     <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                        <span className="text-slate-500">Estado de Control:</span>
                        <span className="text-amber-500">BLOQUEADO</span>
                     </div>
                     <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Motivo Bloqueo Automático</p>
                        <p className="text-[10px] font-black text-white italic tracking-wide">"Pendiente de validación administrativa y alta técnica"</p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Acciones del Acta */}
            <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-8 shadow-sm space-y-4">
               {formState === 'IDLE' ? (
                 <>
                   <button 
                     onClick={() => handleSave('INGRESADO')}
                     className="w-full bg-slate-100 text-slate-600 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                   >
                     <Save size={18} />
                     Guardar Borrador
                   </button>
                   <button 
                     onClick={() => handleSave('CONFIRMADO')}
                     className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-slate-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                   >
                     <CheckCircle2 size={20} />
                     Confirmar Recepción
                   </button>
                 </>
               ) : (
                 <div className="space-y-4">
                    <div className={`p-6 rounded-2xl flex flex-col items-center gap-3 text-center ${formState === 'CONFIRMADO' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                       {formState === 'CONFIRMADO' ? <CheckCircle2 size={40} /> : <Clock size={40} />}
                       <div>
                          <p className="text-sm font-black uppercase tracking-tight">{formState === 'CONFIRMADO' ? 'RECEPCIÓN CONFIRMADA' : 'ACTA INGRESADA'}</p>
                          <p className="text-[10px] font-bold mt-1 opacity-70">El stock ha sido {formState === 'CONFIRMADO' ? 'actualizado y desbloqueado' : 'reservado pero permanece bloqueado'}.</p>
                       </div>
                    </div>
                    
                    <button 
                      onClick={() => setIsPreviewOpen(true)}
                      className="w-full bg-white border-2 border-slate-900 text-slate-900 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-50 transition-all"
                    >
                      <Printer size={18} />
                      Imprimir Acta Oficial
                    </button>

                    {formState === 'INGRESADO' && (
                       <button 
                         onClick={() => setFormState('IDLE')}
                         className="w-full text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-slate-900 transition-colors"
                       >
                         Editar Registro
                       </button>
                    )}

                    <button 
                      onClick={handleAnular}
                      className="w-full flex items-center justify-center gap-2 text-red-400 font-black text-[10px] uppercase tracking-widest hover:text-red-600 pt-4"
                    >
                      <Ban size={14} />
                      Anular Recepción
                    </button>
                 </div>
               )}
            </div>

          </div>
        </div>
      </div>

      <PrintPreviewModal 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
        title={`Acta de Recepción Usado - ${reception.id}`}
      >
        <UsedReceptionDocument 
          reception={{...reception, status: formState} as any}
          vehicle={{...vehicleData} as any}
          company={currentCompany!}
          user={user!}
        />
      </PrintPreviewModal>
    </div>
  );
};