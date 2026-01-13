
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRightLeft, Printer, Truck, User, ArrowRight, FileText, CheckCircle } from 'lucide-react';
import { PartTransfer } from '../../types';
import { PrintPreviewModal } from '../../components/PrintPreviewModal';
import { TransferenciaRepuestosDocument } from '../../components/TransferenciaRepuestosDocument';

export const PartsTransfer: React.FC = () => {
  const { parts, currentCompany, createPartTransfer, user } = useApp();
  const companyParts = parts.filter(p => p.companyId === currentCompany?.id);
  const locations = currentCompany?.locations || [];

  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [transporter, setTransporter] = useState('');
  const [driver, setDriver] = useState('');
  const [plate, setPlate] = useState('');
  
  const [selectedItems, setSelectedItems] = useState<{code: string, qty: number}[]>([]);
  const [itemCode, setItemCode] = useState('');
  const [itemQty, setItemQty] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [lastTransfer, setLastTransfer] = useState<PartTransfer | null>(null);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const part = companyParts.find(p => p.code === itemCode);
    if (part) {
       setSelectedItems([...selectedItems, { code: itemCode, qty: itemQty }]);
       setItemCode('');
       setItemQty(1);
    }
  };

  const handleSubmit = () => {
     if (!origin || !destination || selectedItems.length === 0) return;
     const transfer: PartTransfer = {
        id: `TR-${Date.now().toString().slice(-6)}`,
        date: new Date().toISOString(),
        originId: origin,
        destinationId: destination,
        transporter,
        driverName: driver,
        truckPlate: plate,
        items: selectedItems.map(i => ({
           partCode: i.code,
           quantity: i.qty,
           name: companyParts.find(p => p.code === i.code)?.name || ''
        })),
        status: 'COMPLETED',
        createdBy: user?.username || 'sys',
        companyId: currentCompany!.id
     };
     createPartTransfer(transfer);
     setLastTransfer(transfer);
     setIsSubmitted(true);
     setIsPreviewOpen(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center gap-4">
        <div className="p-4 bg-slate-900 text-white rounded-2xl shadow-xl">
           <ArrowRightLeft size={32} />
        </div>
        <div>
           <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase leading-none">Transferencia de Repuestos</h2>
           <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-2">Emisión de Remito Inter-Planta</p>
        </div>
      </div>

      {!isSubmitted ? (
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-10 space-y-8">
           <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Origen</label>
                 <select value={origin} onChange={(e) => setOrigin(e.target.value)} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold">
                    <option value="">Seleccionar...</option>
                    {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                 </select>
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Destino</label>
                 <select value={destination} onChange={(e) => setDestination(e.target.value)} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold">
                    <option value="">Seleccionar...</option>
                    {locations.filter(l => l.id !== origin).map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                 </select>
              </div>
           </div>

           <div className="grid grid-cols-3 gap-4">
              <input type="text" placeholder="Transportista" value={transporter} onChange={e => setTransporter(e.target.value)} className="p-4 bg-slate-50 rounded-xl font-bold border-2 border-slate-100" />
              <input type="text" placeholder="Chofer" value={driver} onChange={e => setDriver(e.target.value)} className="p-4 bg-slate-50 rounded-xl font-bold border-2 border-slate-100" />
              <input type="text" placeholder="Patente" value={plate} onChange={e => setPlate(e.target.value)} className="p-4 bg-slate-50 rounded-xl font-bold border-2 border-slate-100 uppercase" />
           </div>

           <div className="border-t-2 border-dashed border-slate-100 pt-8">
              <form onSubmit={handleAddItem} className="flex gap-4 mb-6">
                 <input list="parts-list" placeholder="Código Repuesto" value={itemCode} onChange={e => setItemCode(e.target.value)} className="flex-1 p-4 bg-slate-50 rounded-xl font-bold border-2 border-slate-100" />
                 <datalist id="parts-list">
                    {companyParts.map(p => <option key={p.id} value={p.code}>{p.name}</option>)}
                 </datalist>
                 <input type="number" min="1" value={itemQty} onChange={e => setItemQty(parseInt(e.target.value))} className="w-24 p-4 bg-slate-50 rounded-xl font-bold border-2 border-slate-100" />
                 <button type="submit" className="bg-slate-900 text-white px-6 rounded-xl font-bold uppercase text-xs">Agregar</button>
              </form>

              {selectedItems.length > 0 && (
                 <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                    {selectedItems.map((i, idx) => (
                       <div key={idx} className="flex justify-between items-center text-sm font-bold text-slate-700">
                          <span>{i.code} - {companyParts.find(p => p.code === i.code)?.name}</span>
                          <span>x{i.qty}</span>
                       </div>
                    ))}
                 </div>
              )}
           </div>

           <button onClick={handleSubmit} disabled={selectedItems.length === 0} className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-indigo-700 transition-all">
              Confirmar Transferencia
           </button>
        </div>
      ) : (
         <div className="text-center bg-white p-12 rounded-[2.5rem] shadow-xl">
            <CheckCircle size={60} className="text-emerald-500 mx-auto mb-4" />
            <h3 className="text-2xl font-black uppercase text-slate-900">Transferencia Exitosa</h3>
            <button onClick={() => setIsPreviewOpen(true)} className="mt-8 bg-slate-900 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 mx-auto">
               <Printer size={16} /> Imprimir Remito
            </button>
         </div>
      )}

      <PrintPreviewModal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} title="Remito de Repuestos">
         {lastTransfer && currentCompany && (
            <TransferenciaRepuestosDocument 
                transfer={lastTransfer} 
                company={currentCompany} 
                locations={locations}
            />
         )}
      </PrintPreviewModal>
    </div>
  );
};
