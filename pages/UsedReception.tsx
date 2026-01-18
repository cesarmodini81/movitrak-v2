
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
  const { saveUsedReception, currentCompany, user, addVehicle, addAuditLog } = useApp();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [formState, setFormState] = useState<'IDLE' | 'INGRESADO' | 'CONFIRMADO'>('IDLE');

  const initialReception: any = {
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
    vin: '', brand: 'Toyota', model: 'Corolla', year: 2020, color: 'Blanco', type: 'USED'
  });

  const handleSave = (status: 'INGRESADO' | 'CONFIRMADO') => {
    if (!vehicleData.vin || !reception.clientName) {
      alert("Faltan datos obligatorios (VIN y Cliente)");
      return;
    }

    const finalReception: UsedReception = {
      ...reception,
      vehicleVin: vehicleData.vin,
      companyId: currentCompany?.id || 'unknown',
      status: status
    } as any;

    saveUsedReception(finalReception);
    
    if (status === 'CONFIRMADO') {
       addVehicle({
         ...vehicleData,
         locationId: currentCompany?.locations.find(l => l.id.includes('used'))?.id || currentCompany?.locations[0].id || 'loc_used_default',
         entryDate: new Date().toISOString(),
         status: 'AVAILABLE',
         isLocked: false,
         preDeliveryConfirmed: true
       } as Vehicle);
       setFormState('CONFIRMADO');
       addAuditLog('USED_CONFIRMED', `Vehículo ${vehicleData.vin} (${reception.plate}) confirmado.`);
    } else {
       setFormState('INGRESADO');
       addAuditLog('USED_INGRESADO', `Borrador Acta ${reception.id} guardado.`);
    }
  };

  return (
    // PADDING TOP AUMENTADO (pt-20 md:pt-24)
    <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8 pb-20 pt-20 md:pt-24 animate-in fade-in duration-500">
      <div className="bg-white border-t-8 border-slate-900 p-6 lg:p-8 rounded-b-3xl shadow-xl space-y-6 lg:space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-100 pb-6">
           <div className="flex items-center gap-5">
              <div className="p-3 lg:p-4 bg-slate-900 text-white rounded-2xl shadow-lg"><ClipboardList size={28} className="lg:w-8 lg:h-8" /></div>
              <div>
                <h1 className="text-xl lg:text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">Acta de Recepción Usado</h1>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{currentCompany?.name} • Peritaje Técnico</p>
              </div>
           </div>
           <div className="bg-slate-50 p-3 lg:p-4 rounded-2xl border border-slate-200 flex flex-col items-end min-w-[180px]">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2"><Hash size={12} /> ID Registro</span>
              <p className="text-xl lg:text-2xl font-mono font-black text-slate-900">{reception.id}</p>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
          <div className="lg:col-span-8 space-y-6 lg:space-y-10">
            <section className="space-y-4 lg:space-y-6">
               <div className="flex items-center gap-3 border-l-4 border-slate-900 pl-4 py-1">
                  <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">I. Datos Técnicos de la Unidad</h3>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Chasis / VIN (17 caracteres)</label>
                     <input type="text" value={vehicleData.vin} onChange={(e) => setVehicleData({...vehicleData, vin: e.target.value.toUpperCase()})} className="w-full p-3 lg:p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-slate-900 outline-none font-mono font-bold tracking-widest uppercase text-sm lg:text-base" placeholder="8AJ..." disabled={formState !== 'IDLE'} />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Patente / Dominio</label>
                     <input type="text" value={reception.plate} onChange={(e) => setReception({...reception, plate: e.target.value.toUpperCase()})} className="w-full p-3 lg:p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-slate-900 outline-none font-mono font-black text-center tracking-widest text-sm lg:text-base" placeholder="AAA 000" disabled={formState !== 'IDLE'} />
                  </div>
                  <div className="grid grid-cols-2 gap-4 col-span-full">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Marca</label>
                      <input 
                        type="text" 
                        value={vehicleData.brand} 
                        onChange={(e) => setVehicleData({...vehicleData, brand: e.target.value.toUpperCase()})} 
                        className="w-full p-3 lg:p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-slate-900 outline-none font-bold text-sm lg:text-base transition-all uppercase placeholder:normal-case" 
                        placeholder="Ingresar marca"
                        disabled={formState !== 'IDLE'} 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Modelo</label>
                      <input 
                        type="text" 
                        value={vehicleData.model} 
                        onChange={(e) => setVehicleData({...vehicleData, model: e.target.value.toUpperCase()})} 
                        className="w-full p-3 lg:p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-slate-900 outline-none font-bold text-sm lg:text-base transition-all uppercase placeholder:normal-case" 
                        placeholder="Ingresar modelo"
                        disabled={formState !== 'IDLE'} 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 col-span-full">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest ml-1">Año</label>
                      <input type="number" value={vehicleData.year} onChange={(e) => setVehicleData({...vehicleData, year: parseInt(e.target.value)})} className="w-full p-3 lg:p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-sm lg:text-base focus:bg-white focus:border-slate-900 outline-none transition-all" placeholder="Año" disabled={formState !== 'IDLE'} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest ml-1">Color</label>
                      <input 
                        type="text" 
                        value={vehicleData.color} 
                        onChange={(e) => setVehicleData({...vehicleData, color: e.target.value.toUpperCase()})} 
                        className="w-full p-3 lg:p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-slate-900 outline-none font-bold text-sm lg:text-base transition-all uppercase placeholder:normal-case" 
                        placeholder="Ingresar color"
                        disabled={formState !== 'IDLE'} 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest ml-1">KM</label>
                      <input type="number" value={reception.kmReception} onChange={(e) => setReception({...reception, kmReception: parseInt(e.target.value)})} className="w-full p-3 lg:p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-sm lg:text-base focus:bg-white focus:border-slate-900 outline-none transition-all" placeholder="Kilometraje" disabled={formState !== 'IDLE'} />
                    </div>
                  </div>
               </div>
            </section>

            <section className="space-y-4 lg:space-y-6">
               <div className="flex items-center gap-3 border-l-4 border-slate-900 pl-4 py-1">
                  <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">II. Titular Registral</h3>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                  <input type="text" value={reception.clientName} onChange={(e) => setReception({...reception, clientName: e.target.value})} className="p-3 lg:p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold col-span-full text-sm lg:text-base focus:bg-white focus:border-slate-900 outline-none transition-all" placeholder="Nombre y Apellido Titular *" disabled={formState !== 'IDLE'} />
                  <input type="text" value={reception.clientDni} onChange={(e) => setReception({...reception, clientDni: e.target.value})} className="p-3 lg:p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-sm lg:text-base focus:bg-white focus:border-slate-900 outline-none transition-all" placeholder="DNI / CUIT" disabled={formState !== 'IDLE'} />
                  <input type="text" value={reception.clientPhone} onChange={(e) => setReception({...reception, clientPhone: e.target.value})} className="p-3 lg:p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-sm lg:text-base focus:bg-white focus:border-slate-900 outline-none transition-all" placeholder="Teléfono" disabled={formState !== 'IDLE'} />
               </div>
            </section>

            <section className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">III. Estado de Recepción y Novedades</label>
              <textarea value={reception.observations} onChange={(e) => setReception({...reception, observations: e.target.value})} className="w-full h-24 lg:h-32 p-4 lg:p-6 bg-slate-50 border-2 border-slate-100 rounded-3xl font-medium outline-none focus:bg-white focus:border-slate-900 transition-all resize-none text-sm lg:text-base" placeholder="Reporte de peritaje inicial..." disabled={formState !== 'IDLE'} />
            </section>
          </div>

          <div className="lg:col-span-4 space-y-6 lg:space-y-8">
            <div className="bg-slate-900 text-white p-6 lg:p-8 rounded-[2rem] lg:rounded-[2.5rem] shadow-2xl space-y-6">
               <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-white/10 pb-4">Operatoria Comercial</h3>
               <div className="space-y-4">
                  <div className="space-y-1">
                     <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Tipo de Ingreso</p>
                     <select value={reception.operationType} onChange={(e) => setReception({...reception, operationType: e.target.value})} className="w-full bg-white/5 border border-white/20 rounded-xl p-3 text-xs font-bold outline-none" disabled={formState !== 'IDLE'}>
                       {OPERATION_TYPES.map(opt => <option key={opt.id} value={opt.id} className="text-slate-900">{opt.label}</option>)}
                     </select>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Estado Sugerido</p>
                     <select value={reception.condition} onChange={(e) => setReception({...reception, condition: e.target.value})} className="w-full bg-white/5 border border-white/20 rounded-xl p-3 text-xs font-bold outline-none" disabled={formState !== 'IDLE'}>
                       {VEHICLE_CONDITIONS.map(c => <option key={c} value={c} className="text-slate-900">{c}</option>)}
                     </select>
                  </div>
               </div>
            </div>

            <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-6 lg:p-8 space-y-4 shadow-sm">
               {formState === 'IDLE' ? (
                 <>
                   <button onClick={() => handleSave('INGRESADO')} className="w-full bg-slate-100 text-slate-600 py-3 lg:py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-200 transition-all"><Save size={18} /> Guardar Acta</button>
                   <button onClick={() => handleSave('CONFIRMADO')} className="w-full bg-slate-900 text-white py-4 lg:py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"><CheckCircle2 size={20} /> Confirmar Alta</button>
                 </>
               ) : (
                 <div className="space-y-4">
                    <div className={`p-6 rounded-2xl flex flex-col items-center gap-3 text-center ${formState === 'CONFIRMADO' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                       {formState === 'CONFIRMADO' ? <CheckCircle2 size={40} /> : <Clock size={40} />}
                       <p className="text-sm font-black uppercase tracking-tight leading-none">{formState === 'CONFIRMADO' ? 'Alta de Stock OK' : 'Acta Archivada'}</p>
                    </div>
                    <button onClick={() => setIsPreviewOpen(true)} className="w-full border-2 border-slate-900 text-slate-900 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-50 transition-all"><Printer size={18} /> Imprimir Acta</button>
                    <button onClick={() => { setFormState('IDLE'); setReception(initialReception); }} className="w-full text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:text-slate-900 flex items-center justify-center gap-2 pt-4"><Ban size={12} /> Nueva Recepción</button>
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>
      <PrintPreviewModal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} title={`Acta Recepción - ${reception.id}`}><UsedReceptionDocument reception={{...reception, status: formState} as any} vehicle={{...vehicleData} as any} company={currentCompany!} user={user!} /></PrintPreviewModal>
    </div>
  );
};
