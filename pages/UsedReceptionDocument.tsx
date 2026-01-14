
import React from 'react';
import { UsedReception, Vehicle, Company, User } from '../types';
import { ShieldCheck, MapPin, User as UserIcon } from 'lucide-react';
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
        @page {
          size: A4 portrait;
          margin: 10mm;
        }
        @media print {
          /* Document internal layout fixes */
          .document-container {
             width: 100% !important;
             border-width: 2px !important;
          }
        }
      `}</style>

      <div className="document-container font-sans text-slate-900 w-[190mm] mx-auto border-[3px] border-slate-900 p-6 min-h-[277mm] relative flex flex-col justify-between bg-white">
        
        {/* Header Correlativo */}
        <div className="flex justify-between items-start border-b-[3px] border-slate-900 pb-4 mb-6">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-900 text-white rounded-xl">
                 <ShieldCheck size={32} />
              </div>
              <div>
                 <h1 className="text-xl font-black uppercase tracking-tighter text-slate-900">ACTA DE RECEPCIÓN VEHICULAR</h1>
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{company.name} — USADOS</p>
              </div>
           </div>
           <div className="text-right">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Acta Correlativa</p>
              <p className="text-xl font-mono font-black text-slate-900">{reception.id}</p>
              <p className="text-[9px] font-bold text-slate-400 mt-1">{reception.date}</p>
           </div>
        </div>

        <div className="flex-1">
            {/* Sección 1: Datos del Operador y Ubicación */}
            <div className="grid grid-cols-2 gap-8 mb-6 bg-slate-50 p-4 border border-slate-200">
               <div>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                     <UserIcon size={10} /> Operador Responsable
                  </p>
                  <p className="text-xs font-black uppercase text-slate-900">{user.name}</p>
                  <p className="text-[8px] text-slate-500 font-bold uppercase">{user.role}</p>
               </div>
               <div className="text-right">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2 justify-end">
                     <MapPin size={10} /> Lugar de Entrega
                  </p>
                  <p className="text-xs font-black uppercase text-slate-900">USADOS — SANTA FE</p>
               </div>
            </div>

            <div className="space-y-8">
               
               {/* Datos Unidad */}
               <section>
                  <div className="bg-slate-900 text-white px-3 py-1 flex justify-between items-center mb-3">
                     <h3 className="text-[9px] font-black uppercase tracking-widest">I. Especificaciones del Vehículo</h3>
                     <span className="text-[8px] font-bold text-slate-300 italic">Estado: {reception.condition}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-y-4 gap-x-4 px-1">
                     <div className="col-span-2">
                        <p className="text-[7px] font-black text-slate-400 uppercase mb-0.5">VIN / Chasis</p>
                        <p className="text-sm font-mono font-black text-slate-900 tracking-widest">{vehicle.vin}</p>
                     </div>
                     <div>
                        <p className="text-[7px] font-black text-slate-400 uppercase mb-0.5">Dominio</p>
                        <p className="text-sm font-mono font-black text-slate-900 tracking-wider">{reception.plate || 'SIN PATENTE'}</p>
                     </div>
                     <div>
                        <p className="text-[7px] font-black text-slate-400 uppercase mb-0.5">Kilometraje</p>
                        <p className="text-sm font-black text-slate-900">{reception.kmReception.toLocaleString()} KM</p>
                     </div>
                     
                     <div>
                        <p className="text-[7px] font-black text-slate-400 uppercase mb-0.5">Marca</p>
                        <p className="text-xs font-bold uppercase text-slate-800">{vehicle.brand}</p>
                     </div>
                     <div>
                        <p className="text-[7px] font-black text-slate-400 uppercase mb-0.5">Modelo</p>
                        <p className="text-xs font-bold uppercase text-slate-800">{vehicle.model}</p>
                     </div>
                     <div>
                        <p className="text-[7px] font-black text-slate-400 uppercase mb-0.5">Año</p>
                        <p className="text-xs font-bold uppercase text-slate-800">{vehicle.year}</p>
                     </div>
                     <div>
                        <p className="text-[7px] font-black text-slate-400 uppercase mb-0.5">Color</p>
                        <p className="text-xs font-bold uppercase text-slate-800">{vehicle.color}</p>
                     </div>
                  </div>
               </section>

               {/* Datos Propietario */}
               <section>
                  <div className="bg-slate-900 text-white px-3 py-1 flex justify-between items-center mb-3">
                     <h3 className="text-[9px] font-black uppercase tracking-widest">II. Titular Registral</h3>
                     <span className="text-[8px] font-bold text-slate-300 italic">Op: {opLabel}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-y-4 gap-x-4 px-1">
                     <div className="col-span-2">
                        <p className="text-[7px] font-black text-slate-400 uppercase mb-0.5">Apellido y Nombre</p>
                        <p className="text-xs font-black uppercase text-slate-900">{reception.clientName}</p>
                     </div>
                     <div>
                        <p className="text-[7px] font-black text-slate-400 uppercase mb-0.5">DNI / CUIT</p>
                        <p className="text-xs font-black text-slate-900">{reception.clientDni}</p>
                     </div>
                     <div>
                        <p className="text-[7px] font-black text-slate-400 uppercase mb-0.5">Teléfono</p>
                        <p className="text-xs font-bold text-slate-700">{reception.clientPhone || '-'}</p>
                     </div>
                     <div className="col-span-2">
                        <p className="text-[7px] font-black text-slate-400 uppercase mb-0.5">Email</p>
                        <p className="text-xs font-bold text-slate-700">{reception.clientEmail || '-'}</p>
                     </div>
                  </div>
               </section>

               {/* Observaciones Legales */}
               <section>
                  <div className="bg-slate-100 border-l-[4px] border-slate-900 p-3">
                     <h3 className="text-[8px] font-black text-slate-900 uppercase tracking-widest mb-1">III. Observaciones</h3>
                     <p className="text-[10px] text-slate-600 font-medium italic min-h-[60px] leading-relaxed">
                        {reception.observations || 'Sin observaciones declaradas.'}
                     </p>
                  </div>
               </section>

               <p className="text-[7px] text-slate-400 uppercase tracking-widest leading-relaxed text-justify">
                  La presente acta certifica que el vehículo descripto ha sido entregado a {company.name}. 
                  El titular declara bajo juramento la veracidad de los datos. La recepción definitiva queda sujeta a 
                  verificación técnica y aprobación de documentación.
               </p>
            </div>
        </div>

        {/* Firmas Footer */}
        <div className="mt-8 pt-4 border-t border-slate-200">
           <div className="grid grid-cols-2 gap-20">
              <div className="text-center">
                 <div className="border-t border-slate-400 pt-2">
                    <p className="text-[8px] font-black text-slate-900 uppercase tracking-widest">Firma del Titular / Cliente</p>
                    <p className="text-[7px] text-slate-400 uppercase mt-0.5">Aclaración y DNI</p>
                 </div>
              </div>
              <div className="text-center">
                 <div className="border-t border-slate-400 pt-2">
                    <p className="text-[8px] font-black text-slate-900 uppercase tracking-widest">Firma Operador {company.name}</p>
                    <p className="text-[7px] text-slate-400 uppercase mt-0.5">Responsable de Recepción</p>
                 </div>
              </div>
           </div>
           
           <div className="mt-4 pt-2 border-t border-slate-100 flex justify-between items-center opacity-50">
              <p className="text-[6px] font-black text-slate-400 uppercase tracking-[0.3em]">MOVITRAK ID: {reception.id}</p>
              <span className="text-[6px] font-black">VALIDADO DIGITALMENTE</span>
           </div>
        </div>

      </div>
    </div>
  );
};
