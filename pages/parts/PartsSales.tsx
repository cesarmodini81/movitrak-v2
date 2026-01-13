
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShoppingCart, Printer, User, Plus, Trash2, CheckCircle2, FileText, Ban } from 'lucide-react';
import { PartSale } from '../../types';
import { PrintPreviewModal } from '../../components/PrintPreviewModal';
import { FacturaVentasDocument } from '../../components/FacturaVentasDocument';

export const PartsSales: React.FC = () => {
  const { parts, currentCompany, createPartSale, user } = useApp();
  const companyParts = parts.filter(p => p.companyId === currentCompany?.id);
  
  const [client, setClient] = useState({ name: '', dni: '', email: '', phone: '' });
  const [items, setItems] = useState<{code: string, qty: number, price: number, name: string}[]>([]);
  const [currentCode, setCurrentCode] = useState('');
  const [currentQty, setCurrentQty] = useState(1);
  const [isDone, setIsDone] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [lastSale, setLastSale] = useState<PartSale | null>(null);

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    const part = companyParts.find(p => p.code === currentCode);
    if (part) {
       // Check if already exists to update qty or add new
       const existingIdx = items.findIndex(i => i.code === part.code);
       if (existingIdx >= 0) {
         const newItems = [...items];
         newItems[existingIdx].qty += currentQty;
         setItems(newItems);
       } else {
         setItems([...items, { code: part.code, qty: currentQty, price: part.price, name: part.name }]);
       }
       setCurrentCode('');
       setCurrentQty(1);
    }
  };

  const removeItem = (idx: number) => {
     setItems(items.filter((_, i) => i !== idx));
  };

  const total = items.reduce((acc, curr) => acc + (curr.price * curr.qty), 0);

  const handleSale = () => {
     if (!client.name || items.length === 0) return;
     const sale: PartSale = {
        id: `FC-${Date.now().toString().slice(-6)}`,
        date: new Date().toISOString(),
        clientName: client.name,
        clientDni: client.dni,
        clientEmail: client.email,
        clientPhone: client.phone,
        items: items.map(item => ({
           partCode: item.code,
           quantity: item.qty,
           price: item.price,
           name: item.name
        })),
        total: total,
        soldBy: user?.username || 'sys',
        companyId: currentCompany!.id
     };
     createPartSale(sale);
     setLastSale(sale);
     setIsDone(true);
     setIsPreviewOpen(true);
  };

  const resetForm = () => {
    setClient({ name: '', dni: '', email: '', phone: '' });
    setItems([]);
    setIsDone(false);
    setLastSale(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center gap-4">
        <div className="p-4 bg-emerald-600 text-white rounded-2xl shadow-xl shadow-emerald-200">
           <ShoppingCart size={32} />
        </div>
        <div>
           <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase leading-none">Mostrador de Ventas</h2>
           <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-2">Facturación y Despacho</p>
        </div>
      </div>

      {!isDone ? (
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
               {/* Client Data */}
               <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                  <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2 text-slate-400">
                    <User size={14} /> Datos del Cliente
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="col-span-1 md:col-span-2">
                        <input type="text" placeholder="Nombre y Apellido *" value={client.name} onChange={e => setClient({...client, name: e.target.value})} className="w-full p-4 bg-slate-50 rounded-xl font-bold border-2 border-slate-100 outline-none focus:border-emerald-500 focus:bg-white transition-colors" />
                     </div>
                     <input type="text" placeholder="DNI / CUIT" value={client.dni} onChange={e => setClient({...client, dni: e.target.value})} className="p-4 bg-slate-50 rounded-xl font-bold border-2 border-slate-100 outline-none focus:border-emerald-500 focus:bg-white transition-colors" />
                     <input type="text" placeholder="Teléfono" value={client.phone} onChange={e => setClient({...client, phone: e.target.value})} className="p-4 bg-slate-50 rounded-xl font-bold border-2 border-slate-100 outline-none focus:border-emerald-500 focus:bg-white transition-colors" />
                     <div className="col-span-1 md:col-span-2">
                        <input type="email" placeholder="Email" value={client.email} onChange={e => setClient({...client, email: e.target.value})} className="w-full p-4 bg-slate-50 rounded-xl font-bold border-2 border-slate-100 outline-none focus:border-emerald-500 focus:bg-white transition-colors" />
                     </div>
                  </div>
               </div>

               {/* Items */}
               <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                  <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2 text-slate-400">
                    <ShoppingCart size={14} /> Detalle de Compra
                  </h3>
                  <form onSubmit={addItem} className="flex gap-4 mb-6">
                     <div className="flex-1 relative">
                        <input list="parts-list" placeholder="Buscar Repuesto por Código..." value={currentCode} onChange={e => setCurrentCode(e.target.value)} className="w-full p-4 bg-slate-50 rounded-xl font-bold border-2 border-slate-100 outline-none focus:border-emerald-500 focus:bg-white transition-colors" autoFocus />
                        <datalist id="parts-list">{companyParts.map(p => <option key={p.id} value={p.code}>{p.name} - ${p.price}</option>)}</datalist>
                     </div>
                     <input type="number" min="1" value={currentQty} onChange={e => setCurrentQty(parseInt(e.target.value))} className="w-24 p-4 bg-slate-50 rounded-xl font-bold border-2 border-slate-100 outline-none focus:border-emerald-500 focus:bg-white transition-colors" />
                     <button type="submit" className="bg-emerald-600 text-white w-14 rounded-xl flex items-center justify-center hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"><Plus size={24} /></button>
                  </form>
                  
                  {items.length > 0 ? (
                    <div className="space-y-3">
                       {items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100 group">
                             <div>
                                <p className="font-bold text-sm text-slate-800">{item.name}</p>
                                <p className="text-[10px] text-slate-500 font-mono font-bold mt-0.5">{item.code} x {item.qty} unid.</p>
                             </div>
                             <div className="flex items-center gap-6">
                                <p className="font-black text-slate-900">${(item.price * item.qty).toLocaleString()}</p>
                                <button onClick={() => removeItem(idx)} className="text-slate-300 hover:text-red-500 transition-colors p-1"><Trash2 size={18} /></button>
                             </div>
                          </div>
                       ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-xl">
                       <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">El carrito está vacío</p>
                    </div>
                  )}
               </div>
            </div>

            {/* Total / Checkout */}
            <div className="lg:col-span-1">
               <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl sticky top-24">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-6 border-b border-slate-700 pb-4">Resumen</p>
                  
                  <div className="flex justify-between items-center mb-2">
                     <span className="text-sm font-bold text-slate-400">Subtotal</span>
                     <span className="text-sm font-bold">${total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center mb-8">
                     <span className="text-sm font-bold text-slate-400">IVA (21%)</span>
                     <span className="text-sm font-bold">${(total * 0.21).toLocaleString()}</span>
                  </div>

                  <div className="mb-8 pt-6 border-t border-slate-700">
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Final</p>
                     <p className="text-4xl font-black text-white tracking-tight">${(total * 1.21).toLocaleString()}</p>
                  </div>

                  <button 
                    onClick={handleSale}
                    disabled={items.length === 0 || !client.name}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-lg shadow-emerald-900/50 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
                  >
                     Confirmar Venta
                  </button>
               </div>
            </div>
         </div>
      ) : (
         <div className="max-w-2xl mx-auto text-center bg-white p-12 rounded-[2.5rem] shadow-2xl border border-slate-100 mt-10">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
               <CheckCircle2 size={40} />
            </div>
            <h3 className="text-3xl font-black uppercase text-slate-900 leading-none">Venta Exitosa</h3>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-3">Comprobante generado correctamente</p>
            
            <div className="flex justify-center gap-4 mt-10">
               <button onClick={() => setIsPreviewOpen(true)} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-slate-800 transition-all shadow-lg active:scale-95">
                  <Printer size={18} /> Imprimir Factura
               </button>
               <button onClick={resetForm} className="bg-slate-100 text-slate-600 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-slate-200 transition-all active:scale-95">
                  <Plus size={18} /> Nueva Venta
               </button>
            </div>
         </div>
      )}

      <PrintPreviewModal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} title="Factura de Venta">
         {lastSale && currentCompany && (
            <FacturaVentasDocument sale={lastSale} company={currentCompany} />
         )}
      </PrintPreviewModal>
    </div>
  );
};
