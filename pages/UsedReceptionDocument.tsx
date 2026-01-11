import React from 'react';
import { UsedReception, Vehicle, Company, User } from '../types';
import { ShieldCheck, Truck, MapPin, User as UserIcon, Calendar, CheckSquare, Hash } from 'lucide-react';
import { OPERATION_TYPES } from '../constants';

interface Props {
  reception: UsedReception & { plate: string, condition: string, clientName: string, clientDni: string, clientPhone: string, clientEmail: string, operationType: string };
  vehicle: Vehicle;
  company: Company;
  user: User;
}

export const UsedReceptionDocument: React.FC<Props> = ({ reception, vehicle, company, user }) => {
  const opLabel = OPERATION_TYPES.find(o => o.id === reception.operationType)?.label || reception.operationType;

  return (
    <div className="w-full bg-white">
      <style>{`
        @media print {
          @page { size: A4; margin: 15mm; }
          body { -webkit-print-color-adjust: exact; }
          .no-print { display: none !important; }
        }
        .acta-page {
          width: 210mm;
          min-height: 297mm;
          padding: 10mm;
          font-family: 'Inter', sans-serif;
          color: #1e293b;
        }
      `}</style>

      <div className="acta-page border-[4px] border-slate-900 relative">
        
        {/* Header Correlativo */}
        <div className="flex justify-between items-start border-b-[4px] border-slate-900 pb-6 mb-8">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-900 text-white rounded-xl">
                 <ShieldCheck size={32} />
              </div>
              <div>
                 <h1 className="text-2xl font-black uppercase tracking-tighter">ACTA DE RECEPCIÓN VEHICULAR</h1>
                 <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{company.name} — USADOS SELECCIÓN</p>
              </div>
           </div>
           <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Acta Correlativa</p>
              <p className="text-2xl font-mono font-black text-slate-900">{reception.id}</p>
              <p className="text-[10px] font-bold text-slate-400 mt-2">{reception.date} — {new Date().toLocaleTimeString()}</p>
           </div>
        </div>

        {/* Sección 1: Datos del Operador y Ubicación */}
        <div className="grid grid-cols-2 gap-8 mb-8 bg-slate-50 p-6 border-b border-slate-200">
           <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                 <UserIcon size={12} /> Operador Responsable
              </p>
              <p className="text-sm font-black uppercase text-slate-900">{user.name}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase">{user.role}</p>
           </div>
           <div className="text-right">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2 justify-end">
                 <MapPin size={12} /> Lugar de Entrega
              </p>
              <p className="text-sm font-black uppercase text-slate-900">USADOS — SANTA FE</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Sector Recepción y Peritaje</p>
           </div>
        </div>

        <div className="space-y-10">
           
           {/* Datos Unidad */}
           <section>
              <div className="bg-slate-900 text-white px-4 py-1 flex justify-between items-center mb-4">
                 <h3 className="text-[10px] font-black uppercase tracking-widest">I. Especificaciones del Vehículo Recepcionado</h3>
                 <span className="text-[9px] font-bold text-slate-400 italic">Estado Sugerido: {reception.condition}</span>
              </div>
              <div className="grid grid-cols-4 gap-y-6 gap-x-4 px-2">
                 <div className="col-span-2">
                    <p className="text-[8px] font-black text-slate-400 uppercase mb-1">VIN / Número de Chasis</p>
                    <p className="text-base font-mono font-black text-slate-900 tracking-widest">{vehicle.vin}</p>
                 </div>
                 <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Patente / Dominio</p>
                    <p className="text-base font-mono font-black text-slate-900 tracking-wider">{reception.plate || 'SIN PATENTE'}</p>
                 </div>
                 <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Kilometraje</p>
                    <p className="text-base font-black text-slate-900">{reception.kmReception.toLocaleString()} KM</p>
                 </div>
                 
                 <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Marca</p>
                    <p className="text-xs font-black uppercase text-slate-800">{vehicle.brand}</p>
                 </div>
                 <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Modelo</p>
                    <p className="text-xs font-black uppercase text-slate-800">{vehicle.model}</p>
                 </div>
                 <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Año</p>
                    <p className="text-xs font-black uppercase text-slate-800">{vehicle.year}</p>
                 </div>
                 <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Color</p>
                    <p className="text-xs font-black uppercase text-slate-800">{vehicle.color}</p>
                 </div>
              </div>
           </section>

           {/* Datos Propietario */}
           <section>
              <div className="bg-slate-900 text-white px-4 py-1 flex justify-between items-center mb-4">
                 <h3 className="text-[10px] font-black uppercase tracking-widest">II. Información del Titular Registral</h3>
                 <span className="text-[9px] font-bold text-slate-400 italic">Operación: {opLabel}</span>
              </div>
              <div className="grid grid-cols-3 gap-y-6 gap-x-4 px-2">
                 <div className="col-span-2">
                    <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Apellido y Nombre / Razón Social</p>
                    <p className="text-sm font-black uppercase text-slate-900">{reception.clientName}</p>
                 </div>
                 <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase mb-1">DNI / CUIT / Pasaporte</p>
                    <p className="text-sm font-black text-slate-900">{reception.clientDni}</p>
                 </div>
                 <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Teléfono de Contacto</p>
                    <p className="text-xs font-bold text-slate-700">{reception.clientPhone || '---'}</p>
                 </div>
                 <div className="col-span-2">
                    <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Correo Electrónico</p>
                    <p className="text-xs font-bold text-slate-700">{reception.clientEmail || '---'}</p>
                 </div>
              </div>
           </section>

           {/* Observaciones Legales */}
           <section>
              <div className="bg-slate-100 border-l-[4px] border-slate-900 p-4">
                 <h3 className="text-[9px] font-black text-slate-900 uppercase tracking-widest mb-2">III. Observaciones Técnicas y de Recepción</h3>
                 <p className="text-xs text-slate-600 font-medium italic min-h-[80px] leading-relaxed">
                    {reception.observations || 'Sin observaciones declaradas en el momento de la toma del vehículo.'}
                 </p>
              </div>
           </section>

           {/* Cláusulas Legales Small */}
           <p className="text-[7px] text-slate-400 uppercase tracking-widest leading-relaxed">
              La presente acta certifica que el vehículo descripto precedentemente ha sido entregado a {company.name} bajo las condiciones detalladas. 
              El titular declara bajo juramento la veracidad de los datos y el kilometraje informado. La recepción definitiva queda sujeta a 
              verificación técnica exhaustiva en taller y aprobación administrativa de documentación.
           </p>

        </div>

        {/* Firmas Footer */}
        <div className="absolute bottom-10 left-10 right-10">
           <div className="grid grid-cols-2 gap-20">
              <div className="text-center">
                 <div className="border-t border-slate-300 pt-3">
                    <p className="text-[9px] font-black text-slate-900 uppercase tracking-widest">Firma del Titular / Cliente</p>
                    <p className="text-[8px] text-slate-400 uppercase mt-1">Aclaración y DNI</p>
                 </div>
              </div>
              <div className="text-center">
                 <div className="border-t border-slate-300 pt-3">
                    <p className="text-[9px] font-black text-slate-900 uppercase tracking-widest">Firma Operador {company.name}</p>
                    <p className="text-[8px] text-slate-400 uppercase mt-1">Responsable de Recepción</p>
                 </div>
              </div>
           </div>
           
           <div className="mt-12 pt-4 border-t border-slate-100 flex justify-between items-center opacity-40">
              <p className="text-[7px] font-black text-slate-400 uppercase tracking-[0.3em]">MOVITRAK LOGISTICS HUB v2.8.0 — TRACEID: {reception.id}</p>
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-slate-900"></div>
                 <span className="text-[8px] font-black">VALIDADO DIGITALMENTE</span>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};