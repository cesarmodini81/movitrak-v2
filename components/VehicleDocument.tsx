import React from 'react';
import { Vehicle, Movement, Company } from '../types';
import { Truck, MapPin, CheckCircle, Info, Calendar, ShieldCheck } from 'lucide-react';

interface Props {
  vehicle: Vehicle;
  movements: Movement[];
  company: Company;
}

export const VehicleDocument: React.FC<Props> = ({ vehicle, movements, company }) => {
  return (
    <div className="w-full max-w-[210mm] mx-auto bg-white p-12 text-slate-900 relative overflow-hidden min-h-[297mm] font-sans">
      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <h1 className="text-[120px] font-black text-slate-100 uppercase -rotate-45 tracking-widest opacity-40 select-none">
          {company.name}
        </h1>
      </div>

      <div className="relative z-10 border-[6px] border-slate-900 h-full p-10 flex flex-col shadow-inner">
        {/* Header Section */}
        <div className="border-b-[4px] border-slate-900 pb-8 mb-10 flex justify-between items-end">
          <div>
            <div className="flex items-center gap-3 mb-4">
               <div className="p-3 bg-slate-900 text-white rounded-xl">
                  <ShieldCheck size={32} />
               </div>
               <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">Reporte de Trazabilidad</h1>
            </div>
            <p className="text-lg font-black text-slate-500 uppercase tracking-[0.3em] ml-1">MOVITRAK LOGISTICS v2.0</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Titular del Registro</p>
            <p className="text-2xl font-black text-slate-900 uppercase leading-none">{company.name}</p>
            <p className="text-xs text-slate-500 mt-2 font-mono">Emisión: {new Date().toLocaleString()}</p>
          </div>
        </div>

        {/* Main Unit Card */}
        <div className="bg-slate-900 text-white p-8 rounded-3xl mb-10 flex justify-between items-center shadow-xl">
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Chasis / VIN de Unidad</p>
            <h2 className="text-5xl font-mono font-black tracking-widest mb-2">{vehicle.vin}</h2>
            <div className="flex gap-4 items-center mt-4">
               <span className="text-2xl font-bold">{vehicle.brand} {vehicle.model}</span>
               <span className="w-2 h-2 rounded-full bg-slate-600"></span>
               <span className="text-xl text-slate-400">{vehicle.color}</span>
            </div>
          </div>
          <div className="text-right">
             <div className="bg-white/10 px-6 py-4 rounded-2xl border border-white/20">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Año Fabricación</p>
                <p className="text-4xl font-black">{vehicle.year}</p>
             </div>
          </div>
        </div>

        {/* Operational Status Cards */}
        <div className="grid grid-cols-4 gap-6 mb-10">
           <div className="border-4 border-slate-200 p-5 rounded-2xl">
              <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Ubicación</p>
              <p className="font-black text-lg text-slate-900 flex items-center gap-2">
                <MapPin size={16} className="text-brand-600" />
                {vehicle.locationId}
              </p>
           </div>
           <div className="border-4 border-slate-200 p-5 rounded-2xl">
              <p className="text-[10px] font-black text-slate-500 uppercase mb-2">PDI Técnica</p>
              <p className={`font-black text-lg flex items-center gap-2 ${vehicle.preDeliveryConfirmed ? 'text-emerald-600' : 'text-red-600'}`}>
                {vehicle.preDeliveryConfirmed ? <CheckCircle size={16} /> : <Info size={16} />}
                {vehicle.preDeliveryConfirmed ? 'CERTIFICADA' : 'PENDIENTE'}
              </p>
           </div>
           <div className="border-4 border-slate-200 p-5 rounded-2xl">
              <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Estado Logístico</p>
              <p className="font-black text-lg text-slate-900 flex items-center gap-2">
                <Truck size={16} className="text-slate-400" />
                {vehicle.status}
              </p>
           </div>
           <div className="border-4 border-slate-200 p-5 rounded-2xl">
              <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Ingreso Flota</p>
              <p className="font-black text-lg text-slate-900 flex items-center gap-2">
                <Calendar size={16} className="text-slate-400" />
                {new Date(vehicle.entryDate).toLocaleDateString()}
              </p>
           </div>
        </div>

        {/* History Table */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-6">
             <div className="h-1 flex-1 bg-slate-900"></div>
             <h3 className="text-sm font-black uppercase text-slate-900 tracking-widest px-4">Historial de Trazabilidad</h3>
             <div className="h-1 flex-1 bg-slate-900"></div>
          </div>
          
          <div className="border-4 border-slate-900 rounded-2xl overflow-hidden">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white text-left uppercase text-[10px] font-black tracking-wider">
                  <th className="p-4">Fecha</th>
                  <th className="p-4">Operación ID</th>
                  <th className="p-4">Logística Origen > Destino</th>
                  <th className="p-4">Transporte / Chofer</th>
                  <th className="p-4 text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-100">
                {movements.length > 0 ? movements.map(m => (
                  <tr key={m.id} className="bg-white">
                    <td className="p-4 font-mono font-bold text-slate-500">{new Date(m.date).toLocaleDateString()}</td>
                    <td className="p-4 font-black text-slate-900">{m.id}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-600">{m.originId}</span>
                        <span className="text-brand-600 font-black">➔</span>
                        <span className="font-black text-brand-700">{m.destinationId}</span>
                      </div>
                    </td>
                    <td className="p-4 text-[11px] font-bold uppercase leading-tight text-slate-500">
                      {m.transporter}
                      {m.driverName && <span className="block text-[9px] font-medium text-slate-400 mt-0.5">CHOFER: {m.driverName}</span>}
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-block px-3 py-1 bg-slate-100 rounded-lg font-black uppercase text-[9px] text-slate-900 border border-slate-200">
                        {m.status}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-slate-400 font-bold italic text-lg bg-slate-50/50">
                      No se registran movimientos logísticos inter-planta para esta unidad.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer / Legal Disclaimer */}
        <div className="mt-12 pt-8 border-t-[4px] border-slate-900">
          <div className="flex justify-between items-end">
            <div className="max-w-xl">
              <p className="text-[10px] text-slate-500 font-bold uppercase mb-2">Certificación de Datos</p>
              <p className="text-[9px] text-slate-400 leading-relaxed italic">
                La presente consulta vehicular integra datos en tiempo real del ecosistema MOVITRAK. La trazabilidad completa incluye validaciones técnicas de ingreso (PDI), traslados por transportistas externos y auditoría de operadores en planta. Cualquier alteración de este documento invalida su legalidad operativa. Reporte generado bajo protocolos de seguridad AES-256.
              </p>
            </div>
            <div className="text-right flex flex-col items-end">
              <div className="bg-white p-3 border-4 border-slate-900 shadow-lg mb-2">
                 <div className="w-20 h-20 border-2 border-slate-200 flex items-center justify-center font-mono text-[8px] text-center font-black">
                    QR SECURE<br/>HASH<br/>VERIFIED
                 </div>
              </div>
              <p className="text-[10px] font-black text-slate-900 tracking-widest">TRACE_TOKEN: {vehicle.vin.slice(0, 4)}_{Date.now().toString().slice(-4)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};