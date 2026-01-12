
import { Role, User, Company, Vehicle, CalendarEvent, Movement, ChatMessage } from './types';

// --- LOCATION MAPPING ---
export const LOCATION_MAP: Record<string, string> = {
  'loc_1_pred': 'Predio Sauce Viejo (Main)',
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
  'loc_2_main': 'Predio Escobar (Central)',
  'loc_2_sf': 'Escobar Santa Fe',
  'loc_2_paint': 'Taller Escobar',
  'loc_2_deposit': 'Depósito San Juan',
  'loc_2_used_sf': 'Usados Escobar SF',
  'loc_2_used_par': 'Usados Escobar Paraná',
  'loc_2_used_raf': 'Usados Escobar Rafaela',
  'loc_3_main': 'Zona Franca Uruguay',
};

export const DEFAULT_USED_LOCATION = 'Usados Santa Fe';

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

export const MOCK_COMPANIES: Company[] = [
  {
    id: 'comp_1',
    name: 'Nation S.A.',
    locations: [
      { id: 'loc_1_pred', name: LOCATION_MAP['loc_1_pred'], address: 'Ruta 11 km 456, S. Viejo, Santa Fe' },
      { id: 'loc_1_port', name: LOCATION_MAP['loc_1_port'], address: 'Puerto Sauce Viejo, Santa Fe' },
      { id: 'loc_1_yard', name: LOCATION_MAP['loc_1_yard'], address: 'Calle Talcahuano 450, Santa Fe' },
      { id: 'loc_1_ds', name: LOCATION_MAP['loc_1_ds'], address: 'Av. Alem 2450, Santa Fe' },
      { id: 'loc_1_rec', name: LOCATION_MAP['loc_1_rec'], address: 'Ruta 11 y Calle 45, Reconquista, SF' },
      { id: 'loc_1_raf', name: LOCATION_MAP['loc_1_raf'], address: 'Av. Brasil 850, Rafaela, SF' },
      { id: 'loc_1_par', name: LOCATION_MAP['loc_1_par'], address: 'Almafuerte 450, Paraná, ER' },
      { id: 'loc_1_used_sf', name: LOCATION_MAP['loc_1_used_sf'], address: 'Belgrano 2667, Santa Fe' },
    ]
  },
  {
    id: 'comp_2',
    name: 'Escobar Automotores',
    locations: [
      { id: 'loc_2_main', name: LOCATION_MAP['loc_2_main'], address: 'Ruta 11 km 456, S. Viejo, Santa Fe' },
      { id: 'loc_2_sf', name: LOCATION_MAP['loc_2_sf'], address: 'Av. Gdor. Freyre 2257, Santa Fe' },
      { id: 'loc_2_paint', name: LOCATION_MAP['loc_2_paint'], address: 'Aristóbulo del Valle 5600, Santa Fe' },
      { id: 'loc_2_deposit', name: LOCATION_MAP['loc_2_deposit'], address: 'Depósito San Juan 120, Santa Fe' },
      { id: 'loc_2_used_sf', name: LOCATION_MAP['loc_2_used_sf'], address: 'Av. Gdor. Freyre 2257, Santa Fe' },
    ]
  }
];

export const MOCK_USERS: User[] = [
  // --- NIVEL GLOBAL ---
  { 
    id: 'u1', 
    username: 'superadmin', 
    name: 'César Modini', 
    role: Role.SUPER_ADMIN, 
    email: 'cesar.m@movitrak.global' 
  },

  // --- NATION S.A. (comp_1) ---
  { 
    id: 'u_nat_1', 
    username: 'operador_nation', 
    name: 'José Nation', 
    role: Role.OPERATOR, 
    companyId: 'comp_1', 
    email: 'jose.m@nation.com.ar' 
  },
  { 
    id: 'u_nat_2', 
    username: 'admin_nation', 
    name: 'German Nation', 
    role: Role.ADMIN, 
    companyId: 'comp_1', 
    email: 'german.r@nation.com.ar' 
  },
  { 
    id: 'u_nat_3', 
    username: 'programador_nation', 
    name: 'Jona Técnico Nation', 
    role: Role.PROGRAMADOR, 
    companyId: 'comp_1', 
    email: 'j.tecnico@nation.com.ar' 
  },
  { 
    id: 'u_nat_4', 
    username: 'usados_nation', 
    name: 'Pablo Usados Nation', 
    role: Role.USED_OPERATOR, 
    companyId: 'comp_1', 
    email: 'p.usados@nation.com.ar' 
  },

  // --- ESCOBAR AUTOMOTORES (comp_2) ---
  { 
    id: 'u_esc_1', 
    username: 'operador_escobar', 
    name: 'Joaquin Escobar', 
    role: Role.OPERATOR, 
    companyId: 'comp_2', 
    email: 'joako.f@escobar.com.ar' 
  },
  { 
    id: 'u_esc_2', 
    username: 'admin_escobar', 
    name: 'Pablo Escobar', 
    role: Role.ADMIN, 
    companyId: 'comp_2', 
    email: 'p.gerencia@escobar.com.ar' 
  },
  { 
    id: 'u_esc_3', 
    username: 'programador_escobar', 
    name: 'Ana Técnico Escobar', 
    role: Role.PROGRAMADOR, 
    companyId: 'comp_2', 
    email: 'a.tecnico@escobar.com.ar' 
  },
  { 
    id: 'u_esc_4', 
    username: 'usados_escobar', 
    name: 'Fabian Usados Escobar', 
    role: Role.USED_OPERATOR, 
    companyId: 'comp_2', 
    email: 'f.usados@escobar.com.ar' 
  },

  // Fallback para neófitos (Login default solicitado)
  { 
    id: 'u_def', 
    username: 'operador', 
    name: 'Invitado Operativo', 
    role: Role.OPERATOR, 
    companyId: 'comp_1', 
    email: 'demo@movitrak.com' 
  },
];

export const BRANDS = ['Toyota', 'Ford', 'Volkswagen', 'Peugeot', 'Fiat', 'Chevrolet', 'Honda', 'Hyundai', 'Jeep', 'Renault', 'Audi', 'BMW', 'Mercedes-Benz'];
export const MODELS: Record<string, string[]> = {
  'Toyota': ['Hilux', 'Corolla', 'Yaris', 'Etios', 'SW4', 'Rav4'],
  'Ford': ['Ranger', 'Maverick', 'Territory', 'Transit', 'Focus', 'Ecosport', 'Mustang'],
  'Volkswagen': ['Amarok', 'Taos', 'Polo', 'Virtus', 'Gol', 'T-Cross', 'Nivus', 'Vento'],
  'Peugeot': ['208', '2008', 'Partner', 'Expert', '3008', '5008'],
  'Fiat': ['Cronos', 'Toro', 'Fiorino', 'Strada', 'Mobi', 'Pulse'],
  'Chevrolet': ['S10', 'Cruze', 'Onix', 'Tracker', 'Equinox', 'Trailblazer'],
  'Honda': ['Civic', 'HR-V', 'CR-V', 'City'],
  'Hyundai': ['Tucson', 'Creta', 'Santa Fe', 'Kona'],
  'Jeep': ['Renegade', 'Compass', 'Commander', 'Grand Cherokee'],
  'Renault': ['Sandero', 'Kwid', 'Alaskan', 'Kangoo', 'Duster', 'Oroch'],
  'Audi': ['A3', 'A4', 'Q3', 'Q5'],
  'BMW': ['Serie 1', 'Serie 3', 'X1', 'X3'],
  'Mercedes-Benz': ['Clase A', 'Clase C', 'GLA', 'GLC']
};
export const COLORS = ['Blanco', 'Plata', 'Gris Oscuro', 'Negro', 'Rojo', 'Azul', 'Beige', 'Gris Plata', 'Blanco Perlado', 'Champagne'];

const generateRandomPlate = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digits = '0123456789';
  if (Math.random() > 0.4) {
    // Formato Mercosur: AF 123 BC
    return `${letters[Math.floor(Math.random()*26)]}${letters[Math.floor(Math.random()*26)]} ${digits[Math.floor(Math.random()*10)]}${digits[Math.floor(Math.random()*10)]}${digits[Math.floor(Math.random()*10)]} ${letters[Math.floor(Math.random()*26)]}${letters[Math.floor(Math.random()*26)]}`;
  } else {
    // Formato Antiguo: ABC 123
    return `${letters[Math.floor(Math.random()*26)]}${letters[Math.floor(Math.random()*26)]}${letters[Math.floor(Math.random()*26)]} ${digits[Math.floor(Math.random()*10)]}${digits[Math.floor(Math.random()*10)]}${digits[Math.floor(Math.random()*10)]}`;
  }
};

export const generateMockVehicles = (): Vehicle[] => {
  const vehicles: Vehicle[] = [];
  const baseDate = new Date();
  
  // --- 100 UNIDADES 0KM (NUEVOS) ---
  for (let i = 0; i < 100; i++) {
    const brand = BRANDS[Math.floor(Math.random() * 10)]; 
    const model = MODELS[brand][Math.floor(Math.random() * (MODELS[brand]?.length || 1))];
    const entryDate = new Date(baseDate);
    entryDate.setDate(baseDate.getDate() - Math.floor(Math.random() * 15));

    // Distribución Determinista de ubicación para coincidir con MOCK EVENTS
    // i par = Nation (comp_1), i impar = Escobar (comp_2)
    const locationId = i % 2 === 0 ? 'loc_1_port' : 'loc_2_main';

    vehicles.push({
      vin: `8AJH${10000 + i}ARX${Math.floor(Math.random()*90)+10}`,
      brand,
      model,
      year: 2024,
      color: COLORS[Math.floor(Math.random() * 8)],
      type: 'NEW',
      locationId: locationId, 
      entryDate: entryDate.toISOString(),
      preDeliveryConfirmed: false, 
      status: 'AVAILABLE',
      isLocked: false,
    });
  }

  // --- 30 UNIDADES USADAS CON PATENTE (NATION) ---
  for (let i = 0; i < 15; i++) {
    const brand = BRANDS[Math.floor(Math.random() * BRANDS.length)];
    const model = MODELS[brand][Math.floor(Math.random() * (MODELS[brand]?.length || 1))];
    const entryDate = new Date(baseDate);
    entryDate.setDate(baseDate.getDate() - Math.floor(Math.random() * 60));

    vehicles.push({
      vin: `USD${5000 + i}NATION`,
      plate: generateRandomPlate(),
      brand,
      model,
      year: 2015 + Math.floor(Math.random() * 9),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      km: 20000 + Math.floor(Math.random() * 120000),
      type: 'USED',
      locationId: 'loc_1_used_sf', 
      entryDate: entryDate.toISOString(),
      preDeliveryConfirmed: true, 
      status: 'AVAILABLE',
      isLocked: false,
    });
  }

  // --- 15 UNIDADES USADAS CON PATENTE (ESCOBAR) ---
  for (let i = 0; i < 15; i++) {
    const brand = BRANDS[Math.floor(Math.random() * BRANDS.length)];
    const model = MODELS[brand][Math.floor(Math.random() * (MODELS[brand]?.length || 1))];
    const entryDate = new Date(baseDate);
    entryDate.setDate(baseDate.getDate() - Math.floor(Math.random() * 60));

    vehicles.push({
      vin: `USD${6000 + i}ESCOBAR`,
      plate: generateRandomPlate(),
      brand,
      model,
      year: 2015 + Math.floor(Math.random() * 9),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      km: 15000 + Math.floor(Math.random() * 100000),
      type: 'USED',
      locationId: 'loc_2_used_sf', 
      entryDate: entryDate.toISOString(),
      preDeliveryConfirmed: true, 
      status: 'AVAILABLE',
      isLocked: false,
    });
  }
  
  return vehicles;
};

// --- CALENDAR MOCKS (ENERO 2026) ---
// Distribuidos por empresa usando los VINs deterministas
// Pares = Nation, Impares = Escobar
const generateMockEvents = () => {
  const events: CalendarEvent[] = [];
  
  // 20 eventos para Nation (Indices pares 0, 2, 4...)
  for (let i = 0; i < 40; i += 2) {
    const day = 5 + (i % 20); // Días 5 al 25 de Enero
    events.push({
      id: `EVT-NAT-${i}`,
      vehicleVin: `8AJH${10000 + i}ARX`, // VIN parcial, se completará dinámicamente en el filtro
      date: `2026-01-${day.toString().padStart(2, '0')}`,
      time: ['09:00', '11:00', '15:30', '17:00'][i % 4],
      destinationId: ['loc_1_ds', 'loc_1_raf', 'loc_1_par', 'loc_1_rec'][i % 4],
      status: 'PROGRAMADO',
      createdBy: 'programador_nation'
    });
  }

  // 20 eventos para Escobar (Indices impares 1, 3, 5...)
  for (let i = 1; i < 41; i += 2) {
    const day = 5 + (i % 20); // Días 5 al 25 de Enero
    events.push({
      id: `EVT-ESC-${i}`,
      vehicleVin: `8AJH${10000 + i}ARX`,
      date: `2026-01-${day.toString().padStart(2, '0')}`,
      time: ['08:30', '10:00', '14:00', '16:30'][i % 4],
      destinationId: ['loc_2_sf', 'loc_2_paint', 'loc_2_deposit'][i % 3],
      status: 'PROGRAMADO',
      createdBy: 'programador_escobar'
    });
  }
  
  return events;
};

export const MOCK_CALENDAR_EVENTS: CalendarEvent[] = generateMockEvents();
export const MOCK_MOVEMENTS: Movement[] = [];
export const MOCK_CHATS: ChatMessage[] = [];

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
      "pdi_confirmed": "PDI Confirmado con éxito",
      "print": "Imprimir Planilla",
    }
  }
};
