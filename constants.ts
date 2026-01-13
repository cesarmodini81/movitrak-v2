
import { Role, User, Company, Vehicle, CalendarEvent, Movement, ChatMessage, Part } from './types';

// --- LOCATION MAPPING ---
export const LOCATION_MAP: Record<string, string> = {
  'loc_1_pred': 'Predio Sauce Viejo',
  'loc_1_port': 'Puerto Sauce Viejo',
  'loc_1_yard': 'Taller Chapa y Pintura',
  'loc_1_ds': 'DS Store Nation',
  'loc_1_rec': 'Nation Reconquista',
  'loc_1_raf': 'Nation Rafaela',
  'loc_1_par': 'Nation Paraná',
  'loc_1_ros': 'Nation Rosario', 
  'loc_1_fin': 'Entrega Final Predio',
  'loc_1_used_sf': 'Usados Santa Fe',
  'loc_1_sj': 'Depósito San Juan', 
  
  'loc_2_main': 'Predio Escobar (Central)',
  'loc_2_sf': 'Escobar Santa Fe',
  'loc_2_paint': 'Taller Escobar',
  'loc_2_deposit': 'Depósito San Juan',
  'loc_2_par': 'Escobar Paraná',
  'loc_2_raf': 'Escobar Rafaela',
  'loc_2_ros': 'Escobar Rosario',
  'loc_2_used_sf': 'Usados Escobar SF',
  
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
    partsAccessCode: '6789',
    locations: [
      { id: 'loc_1_pred', name: LOCATION_MAP['loc_1_pred'], address: 'Ruta 11 km 456' },
      { id: 'loc_1_sj', name: LOCATION_MAP['loc_1_sj'], address: 'San Juan 2500' },
      { id: 'loc_1_rec', name: LOCATION_MAP['loc_1_rec'], address: 'Reconquista' },
      { id: 'loc_1_raf', name: LOCATION_MAP['loc_1_raf'], address: 'Rafaela' },
      { id: 'loc_1_par', name: LOCATION_MAP['loc_1_par'], address: 'Paraná' },
      { id: 'loc_1_ros', name: LOCATION_MAP['loc_1_ros'], address: 'Rosario' },
      { id: 'loc_1_used_sf', name: LOCATION_MAP['loc_1_used_sf'], address: 'Av. López y Planes 4000' }
    ]
  },
  {
    id: 'comp_2',
    name: 'Escobar Automotores',
    partsAccessCode: '6789',
    locations: [
      { id: 'loc_2_main', name: LOCATION_MAP['loc_2_main'], address: 'Central' },
      { id: 'loc_2_deposit', name: LOCATION_MAP['loc_2_deposit'], address: 'San Juan 120' },
      { id: 'loc_2_par', name: LOCATION_MAP['loc_2_par'], address: 'Paraná' },
      { id: 'loc_2_raf', name: LOCATION_MAP['loc_2_raf'], address: 'Rafaela' },
      { id: 'loc_2_ros', name: LOCATION_MAP['loc_2_ros'], address: 'Rosario' },
      { id: 'loc_2_used_sf', name: LOCATION_MAP['loc_2_used_sf'], address: 'Av. Facundo Zuviría 5000' }
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
  // REPUESTOS NATION
  { 
    id: 'u_nat_5', 
    username: 'repuestos_nation', 
    name: 'Roberto Repuestos', 
    role: Role.PARTS_OPERATOR, 
    companyId: 'comp_1', 
    email: 'repuestos@nation.com.ar' 
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
  // REPUESTOS ESCOBAR
  { 
    id: 'u_esc_5', 
    username: 'repuestos_escobar', 
    name: 'Carlos Repuestos', 
    role: Role.PARTS_OPERATOR, 
    companyId: 'comp_2', 
    email: 'repuestos@escobar.com.ar' 
  },

  // Fallback para neófitos
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
  'Volkswagen': ['Amarok', 'Taos', 'Polo', 'Virtus', 'Gol Trend', 'T-Cross', 'Nivus', 'Vento'],
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
  // 60% New Format (AA 000 AA), 40% Old Format (AAA 000)
  if (Math.random() > 0.4) {
    return `${letters[Math.floor(Math.random()*26)]}${letters[Math.floor(Math.random()*26)]} ${digits[Math.floor(Math.random()*10)]}${digits[Math.floor(Math.random()*10)]}${digits[Math.floor(Math.random()*10)]} ${letters[Math.floor(Math.random()*26)]}${letters[Math.floor(Math.random()*26)]}`;
  } else {
    return `${letters[Math.floor(Math.random()*26)]}${letters[Math.floor(Math.random()*26)]}${letters[Math.floor(Math.random()*26)]} ${digits[Math.floor(Math.random()*10)]}${digits[Math.floor(Math.random()*10)]}${digits[Math.floor(Math.random()*10)]}`;
  }
};

export const generateMockVehicles = (): Vehicle[] => {
  const vehicles: Vehicle[] = [];
  const baseDate = new Date();
  
  // 0KM: 100 units split between companies (50 Nation, 50 Escobar)
  for (let i = 0; i < 100; i++) {
    const isNation = i % 2 === 0;
    const brand = isNation ? 'Toyota' : 'Ford'; 
    const model = MODELS[brand][Math.floor(Math.random() * (MODELS[brand]?.length || 1))];
    const entryDate = new Date(baseDate);
    entryDate.setDate(baseDate.getDate() - Math.floor(Math.random() * 15));
    // Even indices: Nation (loc_1), Odd indices: Escobar (loc_2)
    const locationId = isNation ? 'loc_1_pred' : 'loc_2_main';

    vehicles.push({
      vin: `8AJH${10000 + i}ARX${Math.floor(Math.random()*90)+10}`,
      brand,
      model,
      year: 2024,
      color: COLORS[Math.floor(Math.random() * 8)],
      type: 'NEW',
      locationId: locationId, 
      entryDate: entryDate.toISOString(),
      preDeliveryConfirmed: i % 3 === 0, // Some already confirmed 
      status: 'AVAILABLE',
      isLocked: false,
    });
  }

  // --- USED: NATION S.A. (20+ Units) ---
  
  // 1. Specific Request: VW Gol Trend 2020 Blanco
  vehicles.push({
    vin: 'USADO001',
    plate: 'AD 452 KO', // Patente 2020 aprox.
    brand: 'Volkswagen',
    model: 'Gol Trend',
    year: 2020,
    color: 'Blanco',
    km: 85000,
    type: 'USED',
    locationId: 'loc_1_used_sf', 
    entryDate: new Date(baseDate.getTime() - 86400000 * 10).toISOString(),
    preDeliveryConfirmed: true, 
    status: 'AVAILABLE',
    isLocked: false,
  });

  // 2. Random Generation for Nation (25 units)
  for (let i = 0; i < 25; i++) {
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

  // --- USED: ESCOBAR AUTOMOTORES (25 Units) ---
  for (let i = 0; i < 25; i++) {
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

// --- MOCK CALENDAR EVENTS (0KM) ---
// Generates events for Jan 2026, distributed per company.
// LOGIC: Reference Date Jan 10, 2026.
// RED (<48h): Jan 10, 11
// YELLOW (48-72h): Jan 12, 13
// GREEN (>72h): Jan 14+
export const generateMockCalendarEvents = (): CalendarEvent[] => {
  const events: CalendarEvent[] = [];
  const baseYear = 2026;
  const baseMonth = 0; // January

  // Locations for Nation
  const nationLocs = ['loc_1_pred', 'loc_1_rec', 'loc_1_raf', 'loc_1_par'];
  // Locations for Escobar
  const escobarLocs = ['loc_2_main', 'loc_2_par', 'loc_2_raf', 'loc_2_ros'];

  // Create 60 events to ensure population (30 per company)
  for (let i = 0; i < 60; i++) {
    const mockVehicleIndex = i; 
    const isNation = mockVehicleIndex % 2 === 0;
    const vin = `8AJH${10000 + mockVehicleIndex}ARX`; // Matches partial vin of mock vehicles
    
    // Distribute dates to trigger all colors
    // We want days around Jan 10th (Ref)
    // Days 10, 11 -> Urgent (Red)
    // Days 12, 13 -> Warning (Yellow)
    // Days 14+ -> Normal (Green)
    const day = (i % 20) + 1; // Cycle days 1 to 20
    
    events.push({
      id: `EVT_MOCK_${i}`,
      vehicleVin: vin, 
      date: `${baseYear}-01-${day.toString().padStart(2, '0')}`,
      time: `${(9 + (i % 8)).toString().padStart(2, '0')}:00`,
      destinationId: isNation 
        ? nationLocs[i % nationLocs.length] 
        : escobarLocs[i % escobarLocs.length],
      status: 'PROGRAMADO',
      createdBy: 'sys_planner'
    });
  }
  return events;
};

// --- PARTS MOCK GENERATOR ---
const PARTS_CATALOG = [
  { name: 'Pistón Motor', loc: 'Motor Delantero', price: 150000 },
  { name: 'Filtro de Aceite', loc: 'Motor', price: 12000 },
  { name: 'Amortiguador Del.', loc: 'Suspensión', price: 85000 },
  { name: 'Óptica LED Der.', loc: 'Carrocería Frontal', price: 320000 },
  { name: 'Pastillas Freno', loc: 'Frenos', price: 45000 },
  { name: 'Compresor A/C', loc: 'Motor Auxiliares', price: 210000 },
  { name: 'Bomba de Agua', loc: 'Sistema Refrigeración', price: 65000 },
  { name: 'Parabrisas', loc: 'Carrocería', price: 180000 },
  { name: 'Alternador', loc: 'Sistema Eléctrico', price: 250000 },
  { name: 'Kit Embrague', loc: 'Transmisión', price: 190000 }
];

export const generateMockParts = (): Part[] => {
  const parts: Part[] = [];
  // Generate for Nation (comp_1)
  const locsNation = ['loc_1_pred', 'loc_1_sj', 'loc_1_rec', 'loc_1_raf', 'loc_1_par', 'loc_1_ros'];
  // Generate for Escobar (comp_2)
  const locsEscobar = ['loc_2_main', 'loc_2_deposit', 'loc_2_par', 'loc_2_raf', 'loc_2_ros'];

  // 30 parts per company
  [
    { cid: 'comp_1', locs: locsNation, prefix: 'NT' }, 
    { cid: 'comp_2', locs: locsEscobar, prefix: 'ES' }
  ].forEach(companyData => {
    for (let i = 0; i < 30; i++) {
      const template = PARTS_CATALOG[i % PARTS_CATALOG.length];
      const stockMap: Record<string, number> = {};
      
      companyData.locs.forEach(l => {
        stockMap[l] = Math.floor(Math.random() * 20); // 0 to 20 items per branch
      });

      parts.push({
        id: `PT-${companyData.prefix}-${i}`,
        code: `RP${companyData.prefix}${1000 + i}`,
        name: `${template.name} ${i % 2 === 0 ? 'Toyota' : 'Ford'}`,
        brand: i % 2 === 0 ? 'Toyota' : 'Ford',
        modelCompatibility: ['Hilux', 'Ranger', 'Corolla'],
        locationInCar: template.loc,
        photoUrl: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=200&auto=format&fit=crop', // Generic part image
        stock: stockMap,
        companyId: companyData.cid,
        price: template.price + (Math.floor(Math.random() * 1000))
      });
    }
  });

  return parts;
};

export const MOCK_PARTS: Part[] = generateMockParts();
export const MOCK_CALENDAR_EVENTS: CalendarEvent[] = generateMockCalendarEvents();
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
