import { Role, User, Company, Vehicle, CalendarEvent, Movement } from './types';

// --- LOCATION MAPPING ---
export const LOCATION_MAP: Record<string, string> = {
  'loc_1_pred': 'Predio Sauce Viejo',
  'loc_1_port': 'Puerto Sauce Viejo',
  'loc_1_yard': 'Taller Chapa y Pintura',
  'loc_1_ds': 'DS Store Nation',
  'loc_1_rec': 'Nation Reconquista',
  'loc_1_raf': 'Nation Rafaela',
  'loc_1_par': 'Nation Paraná',
  'loc_1_fin': 'Entrega Final Predio',
  'loc_1_used_sf': 'Usados Santa Fe',
  'loc_1_used_par': 'Usados Paraná',
  'loc_1_used_raf': 'Usados Rafaela',
  'loc_1_used_ros': 'Usados Rosario',
  'loc_2_main': 'Predio Escobar',
  'loc_2_sf': 'Escobar Santa Fe',
  'loc_2_paint': 'Taller Escobar',
  'loc_2_deposit': 'Depósito San Juan',
  'loc_2_used_sf': 'Usados Escobar SF',
  'loc_2_used_par': 'Usados Escobar Paraná',
  'loc_2_used_raf': 'Usados Escobar Rafaela',
  'loc_3_main': 'Zona Franca Uruguay',
};

export const DEFAULT_USED_LOCATION = 'Usados Santa Fe';

// --- ENUMS PARA USADOS ---
export const USED_STATES = {
  INGRESADO: 'INGRESADO',
  CONFIRMADO: 'CONFIRMADO',
  ANULADO: 'ANULADO'
};

export const OPERATION_TYPES = [
  { id: 'PARTE_DE_PAGO', label: 'Toma en parte de pago' },
  { id: 'COMPRA_DIRECTA', label: 'Compra Directa' },
  { id: 'CONSIGNACION', label: 'Consignación' }
];

export const VEHICLE_CONDITIONS = ['Excelente', 'Muy Bueno', 'Bueno', 'Regular', 'A Reparar'];

// --- MOCKS ---

export const MOCK_COMPANIES: Company[] = [
  {
    id: 'comp_1',
    name: 'Nation S.A.',
    locations: [
      { id: 'loc_1_pred', name: LOCATION_MAP['loc_1_pred'], address: 'Ruta 11 km 456, S. Viejo, Santa Fe, Argentina' },
      { id: 'loc_1_used_sf', name: LOCATION_MAP['loc_1_used_sf'], address: 'Belgrano 2667, Santa Fe, Santa Fe, Argentina' },
    ]
  },
  {
    id: 'comp_2',
    name: 'Escobar Automotores',
    locations: [
      { id: 'loc_2_main', name: LOCATION_MAP['loc_2_main'], address: 'Ruta 11 km 456, S. Viejo, Santa Fe, Argentina' },
      { id: 'loc_2_used_sf', name: LOCATION_MAP['loc_2_used_sf'], address: 'Av. Gdor. Freyre 2257, Santa Fe, Santa Fe, Argentina' },
    ]
  }
];

export const MOCK_USERS: User[] = [
  { id: 'u1', username: 'superadmin', name: 'Cesar Global', role: Role.SUPER_ADMIN, email: 'cesar.m@movitrak.global' },
  { id: 'u2', username: 'admin_nation', name: 'German Gerente', role: Role.ADMIN, companyId: 'comp_1', email: 'german.r@nation.com.ar' },
  { id: 'u3', username: 'operador_nation', name: 'Jose Operativo', role: Role.OPERATOR, companyId: 'comp_1', email: 'jose.m@nation.com.ar' },
  { id: 'u7', username: 'usados_nation', name: 'Marcos Usados Nation', role: Role.USED_OPERATOR, companyId: 'comp_1', email: 'marcos.u@nation.com.ar' },
  { id: 'u8', username: 'usados_escobar', name: 'Lucas Usados Escobar', role: Role.USED_OPERATOR, companyId: 'comp_2', email: 'lucas.u@escobar.com.ar' },
  { id: 'u9', username: 'programador_nation', name: 'Ana Programación Nation', role: Role.PROGRAMADOR, companyId: 'comp_1', email: 'ana.p@nation.com.ar' },
  { id: 'u10', username: 'programador_escobar', name: 'Pedro Programación Escobar', role: Role.PROGRAMADOR, companyId: 'comp_2', email: 'pedro.p@escobar.com.ar' },
];

export interface ChatMessage {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  companyId: string;
  timestamp: string;
  isRead: boolean;
}

export const MOCK_CHATS: ChatMessage[] = [];

// --- GENERACION DE MOCKS CALENDARIO ENERO 2026 ---
const generateJan2026Events = (): CalendarEvent[] => {
  const events: CalendarEvent[] = [];
  const hours = ['08:00', '09:30', '11:00', '14:00', '16:00'];
  const locations = ['loc_1_pred']; // Forzando Predio para 0km
  
  for (let i = 1; i <= 31; i++) {
    const dayStr = i < 10 ? `0${i}` : `${i}`;
    const date = `2026-01-${dayStr}`;
    
    // Entre 2 y 5 eventos por día para mayor densidad
    const count = Math.floor(Math.random() * 4) + 2;
    for (let j = 0; j < count; j++) {
      events.push({
        id: `EVT-JAN-${i}-${j}`,
        vehicleVin: `VIN${10000 + (i * 10) + j}AR`,
        date,
        time: hours[j % hours.length],
        destinationId: 'loc_1_pred',
        status: 'PROGRAMADO',
        createdBy: 'u9'
      });
    }
  }
  return events;
};

const generateJan2026Movements = (): Movement[] => {
  const movs: Movement[] = [];
  const origins = ['loc_1_port'];
  
  // 3 Movimientos por semana aprox
  for (let i = 1; i <= 31; i += 2) {
    const dayStr = i < 10 ? `0${i}` : `${i}`;
    movs.push({
      id: `MOV-JAN-${i}`,
      date: `2026-01-${dayStr}T10:00:00Z`,
      originId: origins[0],
      destinationId: 'loc_1_pred',
      transporter: 'Logística Central Nation',
      vehicleVins: [`VIN${10000 + i}AR`, `VIN${10001 + i}AR`],
      status: 'PENDING',
      createdBy: 'u2'
    });
  }
  return movs;
};

export const MOCK_CALENDAR_EVENTS: CalendarEvent[] = generateJan2026Events();
export const MOCK_MOVEMENTS: Movement[] = generateJan2026Movements();

export const BRANDS = ['Toyota', 'Ford', 'Volkswagen', 'Peugeot', 'Fiat', 'Chevrolet', 'Honda', 'Hyundai', 'Jeep', 'Renault'];
export const MODELS: Record<string, string[]> = {
  'Toyota': ['Hilux', 'Corolla', 'Yaris', 'Etios', 'SW4'],
  'Ford': ['Ranger', 'Maverick', 'Territory', 'Transit', 'Focus', 'Ecosport'],
  'Volkswagen': ['Amarok', 'Taos', 'Polo', 'Virtus', 'Gol', 'T-Cross'],
  'Peugeot': ['208', '2008', 'Partner', 'Expert', '3008'],
  'Fiat': ['Cronos', 'Toro', 'Fiorino', 'Strada', 'Mobi'],
  'Chevrolet': ['S10', 'Cruze', 'Onix', 'Tracker'],
  'Honda': ['Civic', 'HR-V', 'CR-V'],
  'Hyundai': ['Tucson', 'Creta'],
  'Jeep': ['Renegade', 'Compass'],
  'Renault': ['Sandero', 'Kwid', 'Alaskan', 'Kangoo']
};
export const COLORS = ['Blanco', 'Plata', 'Gris Oscuro', 'Negro', 'Rojo', 'Azul', 'Beige', 'Gris Plata'];

export const generateMockVehicles = (): Vehicle[] => {
  const vehicles: Vehicle[] = [];
  const baseDate = new Date();
  for (let i = 0; i < 200; i++) { // Mas stock para cubrir todo el calendario
    const brand = BRANDS[Math.floor(Math.random() * BRANDS.length)];
    const model = MODELS[brand][Math.floor(Math.random() * (MODELS[brand]?.length || 1))];
    const isNew = true; // Solo generamos 0km para el calendario logístico restaurado
    const entryDate = new Date(baseDate);
    entryDate.setDate(baseDate.getDate() - Math.floor(Math.random() * 30));

    vehicles.push({
      vin: `VIN${10000 + i}AR`,
      brand,
      model,
      year: 2024,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      type: 'NEW',
      locationId: 'loc_1_port', 
      entryDate: entryDate.toISOString(),
      preDeliveryConfirmed: false, 
      status: 'AVAILABLE',
      isLocked: false,
    });
  }
  return vehicles;
};

export const RESOURCES = {
  es: {
    translation: {
      "dashboard": "Tablero de Control",
      "used_vehicles": "Usados",
      "used_reception": "Planilla de recepción de usados",
      "logistics": "Logística",
      "calendar": "Calendario Logístico",
      "vehicle_query": "Consulta Vehículo",
      "pdi_sheet": "Planilla PDI",
      "travel_sheet": "Planilla Viajes",
      "movements": "Movimientos",
      "transfer_vehicles": "Traslado Vehículos",
      "confirm_movement": "Confirmar Movimiento",
      "audit_logs": "Auditoría",
      "programming": "Programación Unidades 0km",
      "logout": "Cerrar Sesión",
      "welcome": "Bienvenido",
    }
  }
};