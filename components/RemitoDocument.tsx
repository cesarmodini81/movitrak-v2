
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { Movement, Vehicle, Company, Location } from '../types';
import { MOCK_COMPANIES, generateMockVehicles, LOCATION_MAP } from '../constants';

interface Props {
  movement?: Movement;
  company?: Company;
  vehicles?: Vehicle[];
  origin?: Location;
  destination?: Location;
  driverDni?: string;
  truckPlate?: string;
  trailerPlate?: string;
  unitObservations?: Record<string, string>;
  preview?: boolean; 
}

// --- MOCKS DE FALLBACK PARA PREVIEW ---
const mockVehicles = generateMockVehicles().slice(0, 4);
const mockCompany = MOCK_COMPANIES[0];
const mockMovement: Movement = {
  id: 'REM-PREVIEW-001',
  date: new Date().toISOString(),
  originId: 'loc_1_pred',
  destinationId: 'loc_1_rec',
  transporter: 'Logística Nation S.A.',
  driverName: 'Carlos Operador',
  vehicleVins: mockVehicles.map(v => v.vin),
  status: 'PENDING',
  createdBy: 'MOVITRAK_PREVIEW',
};

// --- ESTILOS PDF (@react-pdf/renderer) ---
const pdfStyles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', backgroundColor: '#ffffff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', borderBottom: 2, borderColor: '#000', paddingBottom: 15, marginBottom: 25 },
  companyBox: { width: '45%' },
  companyName: { fontSize: 18, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 },
  docTypeBox: { width: '10%', alignItems: 'center' },
  docTitleBox: { width: '45%', textAlign: 'right' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 5 },
  textBold: { fontSize: 11, fontWeight: 'bold' },
  textSmall: { fontSize: 8, color: '#4b5563', textTransform: 'uppercase', marginTop: 2 },
  section: { marginBottom: 20, padding: 12, backgroundColor: '#f3f4f6', border: 1, borderColor: '#d1d5db', borderRadius: 8 },
  row: { flexDirection: 'row', gap: 15 },
  col: { flex: 1 },
  table: { marginTop: 15, marginBottom: 30 },
  tableHeader: { flexDirection: 'row', backgroundColor: '#000000', color: '#ffffff', padding: 8, fontSize: 9, fontWeight: 'bold', textTransform: 'uppercase' },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e5e7eb', padding: 8, fontSize: 10, alignItems: 'center' },
  cellVin: { width: '30%', fontFamily: 'Courier', fontWeight: 'bold' },
  cellDesc: { width: '40%', fontWeight: 'bold' },
  cellObs: { width: '30%', fontStyle: 'italic', fontSize: 8, color: '#374151' },
  footer: { marginTop: 'auto', borderTopWidth: 2, borderTopColor: '#000', paddingTop: 20, flexDirection: 'row', justifyContent: 'space-between' },
  signBox: { width: '30%', borderTopWidth: 1, borderTopColor: '#9ca3af', textAlign: 'center', paddingTop: 8, fontSize: 8, textTransform: 'uppercase', fontWeight: 'bold' },
  legalDisclaimer: { fontSize: 7, color: '#6b7280', marginTop: 40, textAlign: 'justify', lineHeight: 1.4, borderTopWidth: 1, borderTopColor: '#f3f4f6', paddingTop: 10 }
});

// --- SUB-COMPONENTE PDF ---
const PDFVersion: React.FC<Props> = (data) => {
  const m = data.movement || mockMovement;
  const c = data.company || mockCompany;
  const v = data.vehicles || mockVehicles;

  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        <View style={pdfStyles.header}>
          <View style={pdfStyles.companyBox}>
            <Text style={pdfStyles.companyName}>{c.name}</Text>
            <Text style={pdfStyles.textSmall}>Sistema Logístico Centralizado</Text>
            <Text style={pdfStyles.textSmall}>Trazabilidad Operativa 0KM/USD</Text>
          </View>
          <View style={pdfStyles.docTypeBox}>
            <View style={{ border: 2, width: 35, height: 35, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 24, fontWeight: 'bold' }}>R</Text>
            </View>
          </View>
          <View style={pdfStyles.docTitleBox}>
            <Text style={pdfStyles.title}>REMITO OFICIAL</Text>
            <Text style={pdfStyles.textBold}>Nº {m.id}</Text>
            <Text style={pdfStyles.textSmall}>FECHA EMISIÓN: {new Date(m.date).toLocaleDateString('es-AR')}</Text>
          </View>
        </View>

        <View style={pdfStyles.section}>
          <View style={pdfStyles.row}>
            <View style={pdfStyles.col}>
              <Text style={pdfStyles.textSmall}>I. Origen de Despacho</Text>
              <Text style={pdfStyles.textBold}>{data.origin?.name || LOCATION_MAP[m.originId] || m.originId}</Text>
              <Text style={pdfStyles.textSmall}>Identificador: {m.originId}</Text>
            </View>
            <View style={pdfStyles.col}>
              <Text style={pdfStyles.textSmall}>II. Destino Logístico</Text>
              <Text style={pdfStyles.textBold}>{data.destination?.name || LOCATION_MAP[m.destinationId] || m.destinationId}</Text>
              <Text style={pdfStyles.textSmall}>Identificador: {m.destinationId}</Text>
            </View>
          </View>
        </View>

        <View style={{ marginBottom: 20, padding: 10, border: 1, borderColor: '#e5e7eb', borderRadius: 4 }}>
           <View style={pdfStyles.row}>
              <View style={pdfStyles.col}>
                 <Text style={pdfStyles.textSmall}>Transporte</Text>
                 <Text style={pdfStyles.textBold}>{m.transporter || 'UNIDAD PROPIA'}</Text>
              </View>
              <View style={pdfStyles.col}>
                 <Text style={pdfStyles.textSmall}>Chofer Responsable</Text>
                 <Text style={pdfStyles.textBold}>{m.driverName || 'SIN ASIGNAR'}</Text>
              </View>
              <View style={pdfStyles.col}>
                 <Text style={pdfStyles.textSmall}>Dominios (Tractor/Acopl.)</Text>
                 <Text style={pdfStyles.textBold}>{data.truckPlate || '---'} / {data.trailerPlate || '---'}</Text>
              </View>
           </View>
        </View>

        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableHeader}>
            <Text style={pdfStyles.cellVin}>VIN / CHASIS</Text>
            <Text style={pdfStyles.cellDesc}>MODELO / COLOR</Text>
            <Text style={pdfStyles.cellObs}>OBSERVACIONES PDI</Text>
          </View>
          {v.map(unit => (
            <View key={unit.vin} style={pdfStyles.tableRow}>
              <Text style={pdfStyles.cellVin}>{unit.vin}</Text>
              <Text style={pdfStyles.cellDesc}>{unit.brand} {unit.model} ({unit.color})</Text>
              <Text style={pdfStyles.cellObs}>{data.unitObservations?.[unit.vin] || 'Sin novedades técnicas detectadas.'}</Text>
            </View>
          ))}
        </View>

        {m.observations && (
          <View style={{ padding: 10, backgroundColor: '#f9fafb', border: 1, borderColor: '#eee', marginBottom: 20 }}>
             <Text style={pdfStyles.textSmall}>Observaciones Generales de Carga:</Text>
             <Text style={{ fontSize: 9, marginTop: 5 }}>{m.observations}</Text>
          </View>
        )}

        <View style={pdfStyles.footer}>
          <View style={pdfStyles.signBox}><Text>Firma Despacho Origen</Text></View>
          <View style={pdfStyles.signBox}><Text>Firma Transportista</Text></View>
          <View style={pdfStyles.signBox}><Text>Firma Recepción Destino</Text></View>
        </View>

        <Text style={pdfStyles.legalDisclaimer}>
          Documento de circulación obligatoria generado por MOVITRAK Logistics v2.0. La mercadería viaja por cuenta y orden del destinatario. Este remito no acredita propiedad de la unidad, solo su traslado físico. El transportista declara haber revisado las unidades y aceptado las observaciones técnicas aquí descritas. ID Operativo: {m.id}.
        </Text>
      </Page>
    </Document>
  );
};

// --- SUB-COMPONENTE HTML (Preview AI Studio) ---
const HTMLPreview: React.FC<Props> = (data) => {
  const m = data.movement || mockMovement;
  const c = data.company || mockCompany;
  const v = data.vehicles || mockVehicles;

  return (
    <div className="bg-white p-12 w-[210mm] min-h-[297mm] mx-auto font-sans text-slate-900 shadow-2xl border border-slate-200 relative overflow-hidden print:shadow-none print:border-0">
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none -rotate-45">
        <h1 className="text-[120px] font-black uppercase tracking-widest">{c.name}</h1>
      </div>

      <div className="relative z-10">
        <header className="flex justify-between items-start border-b-4 border-slate-900 pb-6 mb-8">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter italic">{c.name}</h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-1">Sistemas Logísticos MOVITRAK</p>
          </div>
          <div className="flex flex-col items-end">
            <div className="border-2 border-slate-900 p-2 w-12 h-12 flex items-center justify-center mb-2">
              <span className="text-3xl font-black">R</span>
            </div>
            <h2 className="text-xl font-black uppercase tracking-tight">Remito Oficial</h2>
            <p className="font-mono font-bold text-lg leading-none">Nº {m.id}</p>
            <p className="text-[10px] font-black text-slate-400 mt-1 uppercase">Fecha: {new Date(m.date).toLocaleDateString()}</p>
          </div>
        </header>

        <div className="grid grid-cols-2 gap-6 mb-10">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">I. Planta Origen</p>
            <p className="font-black text-slate-800 uppercase italic">{data.origin?.name || LOCATION_MAP[m.originId] || m.originId}</p>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">ID: {m.originId}</p>
          </div>
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">II. Sucursal Destino</p>
            <p className="font-black text-slate-800 uppercase italic">{data.destination?.name || LOCATION_MAP[m.destinationId] || m.destinationId}</p>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">ID: {m.destinationId}</p>
          </div>
        </div>

        <div className="bg-slate-900 text-white p-6 rounded-2xl mb-10 grid grid-cols-3 gap-6 shadow-lg shadow-slate-200">
           <div>
              <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Transportista</p>
              <p className="text-xs font-bold uppercase">{m.transporter || 'Unidad Propia'}</p>
           </div>
           <div>
              <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Chofer</p>
              <p className="text-xs font-bold uppercase">{m.driverName || '---'}</p>
           </div>
           <div>
              <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Patentes</p>
              <p className="text-xs font-bold uppercase font-mono">{data.truckPlate || '---'} / {data.trailerPlate || '---'}</p>
           </div>
        </div>

        <div className="mb-12">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-100 border-b-2 border-slate-900">
                <th className="p-3 text-[9px] font-black uppercase tracking-widest">VIN / Chasis</th>
                <th className="p-3 text-[9px] font-black uppercase tracking-widest">Unidad / Modelo</th>
                <th className="p-3 text-[9px] font-black uppercase tracking-widest">Color</th>
                <th className="p-3 text-[9px] font-black uppercase tracking-widest">Novedades PDI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {v.map(item => (
                <tr key={item.vin} className="text-[11px]">
                  <td className="p-3 font-mono font-black tracking-widest text-slate-600">{item.vin}</td>
                  <td className="p-3 font-bold uppercase">{item.brand} {item.model}</td>
                  <td className="p-3 uppercase text-slate-400 font-bold">{item.color}</td>
                  <td className="p-3 italic text-slate-500 font-medium">{data.unitObservations?.[item.vin] || 'S/N.'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <footer className="mt-auto pt-20 flex justify-between gap-10">
           <div className="flex-1 text-center border-t border-slate-300 pt-3">
              <p className="text-[8px] font-black uppercase tracking-widest">Responsable Despacho</p>
           </div>
           <div className="flex-1 text-center border-t border-slate-300 pt-3">
              <p className="text-[8px] font-black uppercase tracking-widest">Transportista</p>
           </div>
           <div className="flex-1 text-center border-t border-slate-300 pt-3">
              <p className="text-[8px] font-black uppercase tracking-widest">Recepción Destino</p>
           </div>
        </footer>

        <div className="mt-20 pt-8 border-t border-slate-100 flex justify-between items-end opacity-60">
           <div className="max-w-md">
              <p className="text-[7px] text-slate-400 font-bold uppercase mb-1 tracking-widest">Control de Trazabilidad</p>
              <p className="text-[6px] text-slate-400 leading-tight uppercase">
                Documento de circulación obligatoria. La firma del transportista implica la aceptación del estado de las unidades. Generado automáticamente por MOVITRAK Logistics v2.0.
              </p>
           </div>
           <div className="bg-slate-50 p-2 border border-slate-100">
              <div className="w-16 h-16 bg-white flex items-center justify-center text-[7px] font-black text-slate-300 text-center">
                 QR VALIDATION<br/>TOKEN ID
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- EXPORT PRINCIPAL DUAL ---
export const RemitoDocument: React.FC<Props> = (props) => {
  if (props.preview || !props.movement) {
    return <HTMLPreview {...props} />;
  }
  return <PDFVersion {...props} />;
};
