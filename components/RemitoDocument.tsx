
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { Movement, Vehicle, Company, Location } from '../types';

interface Props {
  movement: Movement;
  company: Company;
  vehicles: Vehicle[];
  origin?: Location;
  destination?: Location;
  driverDni?: string;
  truckPlate?: string;
  trailerPlate?: string;
  unitObservations?: Record<string, string>;
}

const styles = StyleSheet.create({
  page: {
    padding: 35,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  watermark: {
    position: 'absolute',
    top: '35%',
    left: '10%',
    fontSize: 65,
    fontWeight: 'black',
    color: '#f0f0f0',
    transform: 'rotate(-45deg)',
    zIndex: -1,
    textTransform: 'uppercase',
    letterSpacing: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 3,
    borderBottomColor: '#000000',
    paddingBottom: 15,
    marginBottom: 20,
  },
  companyBox: {
    width: '40%',
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  companyTag: {
    fontSize: 8,
    color: '#666',
    marginTop: 2,
    textTransform: 'uppercase',
  },
  docCodeBox: {
    width: '20%',
    alignItems: 'center',
  },
  codeR: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 30,
    fontWeight: 'bold',
  },
  codeLabel: {
    fontSize: 6,
    textAlign: 'center',
    marginTop: 5,
    fontWeight: 'bold',
  },
  docDataBox: {
    width: '40%',
    textAlign: 'right',
  },
  remitoTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  remitoNumber: {
    fontSize: 12,
    fontFamily: 'Courier',
    fontWeight: 'bold',
    marginTop: 5,
  },
  dateLabel: {
    fontSize: 8,
    color: '#666',
    marginTop: 5,
  },
  routeSection: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 20,
  },
  card: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#fafafa',
  },
  cardTitle: {
    fontSize: 7,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#9ca3af',
    marginBottom: 5,
  },
  cardText: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  cardSub: {
    fontSize: 8,
    color: '#6b7280',
  },
  transportGrid: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 5,
    marginBottom: 20,
    overflow: 'hidden',
  },
  transportCol: {
    flex: 1,
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
  },
  table: {
    marginTop: 10,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#000000',
    padding: 6,
    color: '#ffffff',
    fontSize: 8,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    padding: 8,
    alignItems: 'flex-start',
  },
  cellIndex: { width: '5%', fontSize: 8, color: '#999' },
  cellVin: { width: '30%', fontSize: 9, fontFamily: 'Courier', fontWeight: 'bold' },
  cellUnit: { width: '40%', fontSize: 9, fontWeight: 'bold' },
  cellObs: { width: '25%', fontSize: 7, fontStyle: 'italic', color: '#4b5563' },
  obsBox: {
    backgroundColor: '#f9fafb',
    padding: 10,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    borderRadius: 5,
    marginBottom: 40,
  },
  obsTitle: {
    fontSize: 7,
    fontWeight: 'bold',
    color: '#9ca3af',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  obsText: {
    fontSize: 9,
    color: '#374151',
  },
  signatureSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  signatureBox: {
    width: '30%',
    borderTopWidth: 1,
    borderTopColor: '#000',
    textAlign: 'center',
    paddingTop: 8,
  },
  signatureText: {
    fontSize: 8,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  legalSection: {
    marginTop: 30,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  legalText: {
    fontSize: 6,
    color: '#9ca3af',
    maxWidth: '70%',
    textAlign: 'justify',
  },
  qrCode: {
    width: 60,
    height: 60,
  },
});

export const RemitoDocument: React.FC<Props> = ({ 
  movement, 
  company, 
  vehicles, 
  origin, 
  destination, 
  driverDni, 
  truckPlate, 
  trailerPlate,
  unitObservations 
}) => {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&bgcolor=ffffff&data=${movement.id}`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.watermark}>{company.name}</Text>

        <View style={styles.header}>
          <View style={styles.companyBox}>
            <Text style={styles.companyName}>{company.name}</Text>
            <Text style={styles.companyTag}>Logística Automotriz Enterprise</Text>
            <Text style={styles.companyTag}>Ruta 11 KM 456 - Santa Fe</Text>
            <Text style={styles.companyTag}>CUIT: 30-71458922-1</Text>
          </View>
          
          <View style={styles.docCodeBox}>
            <View style={styles.codeR}><Text>R</Text></View>
            <Text style={styles.codeLabel}>CÓDIGO 91</Text>
          </View>

          <View style={styles.docDataBox}>
            <Text style={styles.remitoTitle}>REMITO OFICIAL</Text>
            <Text style={styles.remitoNumber}>Nº {movement.id}</Text>
            <Text style={styles.dateLabel}>FECHA EMISIÓN: {new Date(movement.date).toLocaleDateString('es-AR')}</Text>
          </View>
        </View>

        <View style={styles.routeSection}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Punto de Origen / Despacho</Text>
            <Text style={styles.cardText}>{origin?.name || movement.originId}</Text>
            <Text style={styles.cardSub}>{origin?.address || 'Planta Operativa'}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Punto de Arribo / Destino</Text>
            <Text style={styles.cardText}>{destination?.name || movement.destinationId}</Text>
            <Text style={styles.cardSub}>{destination?.address || 'Concesionario Destino'}</Text>
          </View>
        </View>

        <View style={styles.transportGrid}>
          <View style={styles.transportCol}>
            <Text style={styles.cardTitle}>Transportista</Text>
            <Text style={styles.cardText}>{movement.transporter || 'PROPIO'}</Text>
          </View>
          <View style={styles.transportCol}>
            <Text style={styles.cardTitle}>Chofer Responsable</Text>
            <Text style={styles.cardText}>{movement.driverName || '---'}</Text>
            <Text style={styles.cardSub}>DNI: {driverDni || '---'}</Text>
          </View>
          <View style={styles.transportCol}>
            <Text style={styles.cardTitle}>Unidad Traslado</Text>
            <Text style={styles.cardText}>{truckPlate || '---'}</Text>
            <Text style={styles.cardSub}>ACOPLADO: {trailerPlate || '---'}</Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.cellIndex}>#</Text>
            <Text style={styles.cellVin}>VIN / CHASIS</Text>
            <Text style={styles.cellUnit}>UNIDAD / MODELO</Text>
            <Text style={styles.cellObs}>OBSERVACIONES PDI</Text>
          </View>
          
          {vehicles.map((v, i) => (
            <View key={v.vin} style={styles.tableRow}>
              <Text style={styles.cellIndex}>{i + 1}</Text>
              <Text style={styles.cellVin}>{v.vin}</Text>
              <View style={styles.cellUnit}>
                <Text style={{ fontSize: 9 }}>{v.brand} {v.model}</Text>
                <Text style={{ fontSize: 7, color: '#666' }}>{v.color} - {v.year} - {v.type === 'NEW' ? '0KM' : 'USD'}</Text>
              </View>
              <Text style={styles.cellObs}>{unitObservations?.[v.vin] || 'Sin novedades técnicas detectadas.'}</Text>
            </View>
          ))}
        </View>

        {movement.observations && (
          <View style={styles.obsBox}>
            <Text style={styles.obsTitle}>Observaciones Generales de Carga</Text>
            <Text style={styles.obsText}>{movement.observations}</Text>
          </View>
        )}

        <View style={styles.signatureSection}>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureText}>Despacho Origen</Text>
          </View>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureText}>Transportista</Text>
          </View>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureText}>Conformidad Arribo</Text>
          </View>
        </View>

        <View style={styles.legalSection}>
          <View>
            <Text style={styles.legalText}>
              Documento de circulación obligatoria emitido por MOVITRAK Logistics v2.0. La mercadería viaja por cuenta y orden del destinatario. Este remito no acredita propiedad de la unidad, solo su traslado físico para fines operativos o logísticos internos.
            </Text>
            <Text style={[styles.legalText, { marginTop: 5, fontWeight: 'bold' }]}>
              ID TRANSACCIÓN: {movement.id.toUpperCase()} • VALIDACIÓN DIGITAL ACTIVADA
            </Text>
          </View>
          <Image src={qrUrl} style={styles.qrCode} />
        </View>
      </Page>
    </Document>
  );
};
