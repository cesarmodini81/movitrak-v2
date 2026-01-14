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
  { id: 'u1', username: 'superadmin', name: 'César Modini', role: Role.SUPER_ADMIN, email: 'cesar.m@movitrak.global' },
  { id: 'u_nat_1', username: 'operador_nation', name: 'José Nation', role: Role.OPERATOR, companyId: 'comp_1', email: 'jose.m@nation.com.ar' },
  { id: 'u_nat_2', username: 'admin_nation', name: 'German Nation', role: Role.ADMIN, companyId: 'comp_1', email: 'german.r@nation.com.ar' },
  { id: 'u_nat_3', username: 'programador_nation', name: 'Jona Técnico Nation', role: Role.PROGRAMADOR, companyId: 'comp_1', email: 'j.tecnico@nation.com.ar' },
  { id: 'u_nat_4', username: 'usados_nation', name: 'Pablo Usados Nation', role: Role.USED_OPERATOR, companyId: 'comp_1', email: 'p.usados@nation.com.ar' },
  { id: 'u_nat_5', username: 'repuestos_nation', name: 'Roberto Repuestos', role: Role.PARTS_OPERATOR, companyId: 'comp_1', email: 'repuestos@nation.com.ar' },
  { id: 'u_esc_1', username: 'operador_escobar', name: 'Joaquin Escobar', role: Role.OPERATOR, companyId: 'comp_2', email: 'joako.f@escobar.com.ar' },
  { id: 'u_esc_2', username: 'admin_escobar', name: 'Pablo Escobar', role: Role.ADMIN, companyId: 'comp_2', email: 'p.gerencia@escobar.com.ar' },
  { id: 'u_esc_3', username: 'programador_escobar', name: 'Ana Técnico Escobar', role: Role.PROGRAMADOR, companyId: 'comp_2', email: 'a.tecnico@escobar.com.ar' },
  { id: 'u_esc_4', username: 'usados_escobar', name: 'Fabian Usados Escobar', role: Role.USED_OPERATOR, companyId: 'comp_2', email: 'f.usados@escobar.com.ar' },
  { id: 'u_esc_5', username: 'repuestos_escobar', name: 'Carlos Repuestos', role: Role.PARTS_OPERATOR, companyId: 'comp_2', email: 'repuestos@escobar.com.ar' },
  { id: 'u_def', username: 'operador', name: 'Invitado Operativo', role: Role.OPERATOR, companyId: 'comp_1', email: 'demo@movitrak.com' },
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

export const generateMockVehicles = (): Vehicle[] => {
  const vehicles: Vehicle[] = [];
  const baseDate = new Date();
  for (let i = 0; i < 100; i++) {
    const isNation = i % 2 === 0;
    const brand = isNation ? 'Toyota' : 'Ford'; 
    const model = MODELS[brand][Math.floor(Math.random() * (MODELS[brand]?.length || 1))];
    const locationId = isNation ? 'loc_1_pred' : 'loc_2_main';
    vehicles.push({
      vin: `8AJH${10000 + i}ARX${Math.floor(Math.random()*90)+10}`,
      brand, model, year: 2024, color: COLORS[Math.floor(Math.random() * 8)],
      type: 'NEW', locationId: locationId, entryDate: baseDate.toISOString(),
      preDeliveryConfirmed: i % 3 === 0, status: 'AVAILABLE', isLocked: false,
    });
  }
  return vehicles;
};

// --- PARTS MOCK GENERATOR ---
const PARTS_TEMPLATES = [
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
  MOCK_COMPANIES.forEach(company => {
    for (let i = 0; i < 50; i++) {
      const template = PARTS_TEMPLATES[i % PARTS_TEMPLATES.length];
      const stockMap: Record<string, number> = {};
      company.locations.forEach(l => {
        stockMap[l.id] = Math.floor(Math.random() * 15);
      });
      parts.push({
        id: `PT-${company.id.slice(-1)}-${i}`,
        code: `RP-${company.name.slice(0,2).toUpperCase()}-${1000 + i}`,
        name: `${template.name} ${company.id === 'comp_1' ? 'Toyota' : 'Ford'} Original`,
        brand: company.id === 'comp_1' ? 'Toyota' : 'Ford',
        modelCompatibility: company.id === 'comp_1' ? ['Hilux', 'Corolla'] : ['Ranger', 'Focus'],
        locationInCar: template.loc,
        photoUrl: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=200&auto=format&fit=crop',
        stock: stockMap,
        companyId: company.id,
        price: template.price + (Math.floor(Math.random() * 5000))
      });
    }
  });
  return parts;
};

export const MOCK_PARTS: Part[] = generateMockParts();

export const MOCK_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: "ev-001",
    vehicleVin: "8AJH10000",
    date: "2026-01-20",
    time: "10:00",
    destinationId: "loc_1_pred",
    status: "PROGRAMADO",
    createdBy: "Sistema"
  },
  {
    id: "ev-002",
    vehicleVin: "8AJH10001",
    date: "2026-01-22",
    time: "14:30",
    destinationId: "loc_1_rec",
    status: "PROGRAMADO",
    createdBy: "Sistema"
  },
  {
    id: "ev-003",
    vehicleVin: "8AJH10002",
    date: "2026-01-25",
    time: "08:00",
    destinationId: "loc_1_sj",
    status: "PROGRAMADO",
    createdBy: "Sistema"
  }
];

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

export const MOCK_EVENTS = [
  // --- NATION S.A. (comp_1) ---
  {
    id: "ev-nat-001",
    companyId: "comp_1",
    title: "Entrega Logística Programada",
    date: "2026-01-11",
    time: "08:30",
    creationDate: "2026-01-05T09:00:00Z",
    type: "MOVEMENT",
    status: "PROGRAMADO",
    details: "PRIORIDAD_ALTA | Despacho urgente para entrega salón",
    vehicleId: "8AJH10000",
    vehicleVin: "8AJH10000",
    destination: "Predio Sauce Viejo",
    destinationId: "loc_1_pred",
    createdBy: "SYSTEM",
    createdById: "system"
  },
  {
    id: "ev-nat-002",
    companyId: "comp_1",
    title: "Entrega Logística Programada",
    date: "2026-01-11",
    time: "10:00",
    creationDate: "2026-01-05T10:00:00Z",
    type: "MOVEMENT",
    status: "PROGRAMADO",
    details: "PRIORIDAD_ALTA | Movimiento inter-sucursal",
    vehicleId: "8AJH10002",
    vehicleVin: "8AJH10002",
    destination: "Depósito San Juan",
    destinationId: "loc_1_sj",
    createdBy: "SYSTEM",
    createdById: "system"
  },
  {
    id: "ev-nat-003",
    companyId: "comp_1",
    title: "Entrega Logística Programada",
    date: "2026-01-12",
    time: "09:00",
    creationDate: "2026-01-06T08:00:00Z",
    type: "MOVEMENT",
    status: "PROGRAMADO",
    details: "PRIORIDAD_MEDIA | Traslado técnico para revisión",
    vehicleId: "8AJH10004",
    vehicleVin: "8AJH10004",
    destination: "Nation Reconquista",
    destinationId: "loc_1_rec",
    createdBy: "SYSTEM",
    createdById: "system"
  },
  {
    id: "ev-nat-004",
    companyId: "comp_1",
    title: "Entrega Logística Programada",
    date: "2026-01-12",
    time: "15:30",
    creationDate: "2026-01-06T11:00:00Z",
    type: "MOVEMENT",
    status: "PROGRAMADO",
    details: "PRIORIDAD_MEDIA | Stock preventivo sucursal",
    vehicleId: "8AJH10006",
    vehicleVin: "8AJH10006",
    destination: "Nation Rafaela",
    destinationId: "loc_1_raf",
    createdBy: "SYSTEM",
    createdById: "system"
  },
  {
    id: "ev-nat-005",
    companyId: "comp_1",
    title: "Entrega Logística Programada",
    date: "2026-01-13",
    time: "11:00",
    creationDate: "2026-01-07T09:30:00Z",
    type: "MOVEMENT",
    status: "PROGRAMADO",
    details: "PRIORIDAD_BAJA | Entrega programada cliente final",
    vehicleId: "8AJH10008",
    vehicleVin: "8AJH10008",
    destination: "Nation Paraná",
    destinationId: "loc_1_par",
    createdBy: "SYSTEM",
    createdById: "system"
  },
  {
    id: "ev-nat-006",
    companyId: "comp_1",
    title: "Entrega Logística Programada",
    date: "2026-01-15",
    time: "08:00",
    creationDate: "2026-01-08T14:00:00Z",
    type: "MOVEMENT",
    status: "PROGRAMADO",
    details: "PRIORIDAD_BAJA | Reposición de inventario",
    vehicleId: "8AJH10010",
    vehicleVin: "8AJH10010",
    destination: "Nation Rosario",
    destinationId: "loc_1_ros",
    createdBy: "SYSTEM",
    createdById: "system"
  },
  {
    id: "ev-nat-007",
    companyId: "comp_1",
    title: "Entrega Logística Programada",
    date: "2026-01-18",
    time: "10:30",
    creationDate: "2026-01-10T10:00:00Z",
    type: "MOVEMENT",
    status: "PROGRAMADO",
    details: "PRIORIDAD_BAJA | Movimiento interno depósito",
    vehicleId: "8AJH10012",
    vehicleVin: "8AJH10012",
    destination: "Depósito San Juan",
    destinationId: "loc_1_sj",
    createdBy: "SYSTEM",
    createdById: "system"
  },
  {
    id: "ev-nat-008",
    companyId: "comp_1",
    title: "Entrega Logística Programada",
    date: "2026-01-20",
    time: "14:00",
    creationDate: "2026-01-12T09:00:00Z",
    type: "MOVEMENT",
    status: "PROGRAMADO",
    details: "PRIORIDAD_BAJA | Alistamiento para salón",
    vehicleId: "8AJH10014",
    vehicleVin: "8AJH10014",
    destination: "Predio Sauce Viejo",
    destinationId: "loc_1_pred",
    createdBy: "SYSTEM",
    createdById: "system"
  },
  {
    id: "ev-nat-009",
    companyId: "comp_1",
    title: "Entrega Logística Programada",
    date: "2026-01-22",
    time: "09:30",
    creationDate: "2026-01-14T08:30:00Z",
    type: "MOVEMENT",
    status: "PROGRAMADO",
    details: "PRIORIDAD_BAJA | Distribución regional",
    vehicleId: "8AJH10016",
    vehicleVin: "8AJH10016",
    destination: "Nation Reconquista",
    destinationId: "loc_1_rec",
    createdBy: "SYSTEM",
    createdById: "system"
  },
  {
    id: "ev-nat-010",
    companyId: "comp_1",
    title: "Entrega Logística Programada",
    date: "2026-01-25",
    time: "17:00",
    creationDate: "2026-01-15T12:00:00Z",
    type: "MOVEMENT",
    status: "PROGRAMADO",
    details: "PRIORIDAD_BAJA | Traslado fin de mes",
    vehicleId: "8AJH10018",
    vehicleVin: "8AJH10018",
    destination: "Nation Rafaela",
    destinationId: "loc_1_raf",
    createdBy: "SYSTEM",
    createdById: "system"
  },
  {
    id: "ev-nat-011",
    companyId: "comp_1",
    title: "Entrega Logística Programada",
    date: "2026-01-28",
    time: "08:15",
    creationDate: "2026-01-18T10:00:00Z",
    type: "MOVEMENT",
    status: "PROGRAMADO",
    details: "PRIORIDAD_BAJA | Operativo entrega masiva",
    vehicleId: "8AJH10020",
    vehicleVin: "8AJH10020",
    destination: "Nation Paraná",
    destinationId: "loc_1_par",
    createdBy: "SYSTEM",
    createdById: "system"
  },
  {
    id: "ev-nat-012",
    companyId: "comp_1",
    title: "Entrega Logística Programada",
    date: "2026-02-02",
    time: "12:00",
    creationDate: "2026-01-20T11:00:00Z",
    type: "MOVEMENT",
    status: "PROGRAMADO",
    details: "PRIORIDAD_BAJA | Inicio operativo febrero",
    vehicleId: "8AJH10022",
    vehicleVin: "8AJH10022",
    destination: "Nation Rosario",
    destinationId: "loc_1_ros",
    createdBy: "SYSTEM",
    createdById: "system"
  },
  {
    id: "ev-nat-013",
    companyId: "comp_1",
    title: "Entrega Logística Programada",
    date: "2026-02-05",
    time: "16:45",
    creationDate: "2026-01-22T09:00:00Z",
    type: "MOVEMENT",
    status: "PROGRAMADO",
    details: "PRIORIDAD_BAJA | Movimiento técnico preventivo",
    vehicleId: "8AJH10024",
    vehicleVin: "8AJH10024",
    destination: "Predio Sauce Viejo",
    destinationId: "loc_1_pred",
    createdBy: "SYSTEM",
    createdById: "system"
  },
  {
    id: "ev-nat-014",
    companyId: "comp_1",
    title: "Entrega Logística Programada",
    date: "2026-02-08",
    time: "10:00",
    creationDate: "2026-01-25T08:00:00Z",
    type: "MOVEMENT",
    status: "PROGRAMADO",
    details: "PRIORIDAD_BAJA | Preparación showroom",
    vehicleId: "8AJH10026",
    vehicleVin: "8AJH10026",
    destination: "Depósito San Juan",
    destinationId: "loc_1_sj",
    createdBy: "SYSTEM",
    createdById: "system"
  },
  {
    id: "ev-nat-015",
    companyId: "comp_1",
    title: "Entrega Logística Programada",
    date: "2026-02-10",
    time: "14:30",
    creationDate: "2026-01-28T14:30:00Z",
    type: "MOVEMENT",
    status: "PROGRAMADO",
    details: "PRIORIDAD_BAJA | Cierre de quincena logística",
    vehicleId: "8AJH10028",
    vehicleVin: "8AJH10028",
    destination: "Nation Reconquista",
    destinationId: "loc_1_rec",
    createdBy: "SYSTEM",
    createdById: "system"
  },

  // --- ESCOBAR AUTOMOTORES (comp_2) ---
  {
    id: "ev-esc-001",
    companyId: "comp_2",
    title: "Entrega Logística Programada",
    date: "2026-01-11",
    time: "09:00",
    creationDate: "2026-01-05T08:30:00Z",
    type: "MOVEMENT",
    status: "PROGRAMADO",
    details: "PRIORIDAD_ALTA | Despacho urgente Escobar Central",
    vehicleId: "8AJH10001",
    vehicleVin: "8AJH10001",
    destination: "Predio Escobar (Central)",
    destinationId: "loc_2_main",
    createdBy: "SYSTEM",
    createdById: "system"
  },
  {
    id: "ev-esc-002",
    companyId: "comp_2",
    title: "Entrega Logística Programada",
    date: "2026-01-11",
    time: "11:30",
    creationDate: "2026-01-05T10:30:00Z",
    type: "MOVEMENT",
    status: "PROGRAMADO",
    details: "PRIORIDAD_ALTA | Stock solicitado sucursal Rosario",
    vehicleId: "8AJH10003",
    vehicleVin: "8AJH10003",
    destination: "Escobar Rosario",
    destinationId: "loc_2_ros",
    createdBy: "SYSTEM",
    createdById: "system"
  },
  {
    id: "ev-esc-003",
    companyId: "comp_2",
    title: "Entrega Logística Programada",
    date: "2026-01-12",
    time: "08:00",
    creationDate: "2026-01-06T09:00:00Z",
    type: "MOVEMENT",
    status: "PROGRAMADO",
    details: "PRIORIDAD_MEDIA | Movimiento preventivo Rafaela",
    vehicleId: "8AJH10005",
    vehicleVin: "8AJH10005",
    destination: "Escobar Rafaela",
    destinationId: "loc_2_raf",
    createdBy: "SYSTEM",
    createdById: "system"
  },
  {
    id: "ev-esc-004",
    companyId: "comp_2",
    title: "Entrega Logística Programada",
    date: "2026-01-12",
    time: "14:00",
    creationDate: "2026-01-06T13:00:00Z",
    type: "MOVEMENT",
    status: "PROGRAMADO",
    details: "PRIORIDAD_MEDIA | Reposición depósito San Juan",
    vehicleId: "8AJH10007",
    vehicleVin: "8AJH10007",
    destination: "Depósito San Juan",
    destinationId: "loc_2_deposit",
    createdBy: "SYSTEM",
    createdById: "system"
  },
  {
    id: "ev-esc-005",
    companyId: "comp_2",
    title: "Entrega Logística Programada",
    date: "2026-01-13",
    time: "10:45",
    creationDate: "2026-01-07T10:00:00Z",
    type: "MOVEMENT",
    status: "PROGRAMADO",
    details: "PRIORIDAD_BAJA | Traslado rutinario Paraná",
    vehicleId: "8AJH10009",
    vehicleVin: "8AJH10009",
    destination: "Escobar Paraná",
    destinationId: "loc_2_par",
    createdBy: "SYSTEM",
    createdById: "system"
  },
  {
    id: "ev-esc-006",
    companyId: "comp_2",
    title: "Entrega Logística Programada",
    date: "2026-01-16",
    time: "09:00",
    creationDate: "2026-01-09T08:00:00Z",
    type: "MOVEMENT",
    status: "PROGRAMADO",
    details: "PRIORIDAD_BAJA | Ingreso stock nuevo Escobar",
    vehicleId: "8AJH10011",
    vehicleVin: "8AJH10011",
    destination: "Predio Escobar (Central)",
    destinationId: "loc_2_main",
    createdBy: "SYSTEM",
    createdById: "system"
  },
  {
    id: "ev-esc-007",
    companyId: "comp_2",
    title: "Entrega Logística Programada",
    date: "2026-01-19",
    time: "11:00",
    creationDate: "2026-01-11T14:00:00Z",
    type: "MOVEMENT",
    status: "PROGRAMADO",
    details: "PRIORIDAD_BAJA | Movimiento técnico",
    vehicleId: "8AJH10013",
    vehicleVin: "8AJH10013",
    destination: "Escobar Rosario",
    destinationId: "loc_2_ros",
    createdBy: "SYSTEM",
    createdById: "system"
  },
  {
    id: "ev-esc-008",
    companyId: "comp_2",
    title: "Entrega Logística Programada",
    date: "2026-01-21",
    time: "15:30",
    creationDate: "2026-01-13T09:00:00Z",
    type: "MOVEMENT",
    status: "PROGRAMADO",
    details: "PRIORIDAD_BAJA | Planilla de viajes semanal",
    vehicleId: "8AJH10015",
    vehicleVin: "8AJH10015",
    destination: "Escobar Rafaela",
    destinationId: "loc_2_raf",
    createdBy: "SYSTEM",
    createdById: "system"
  },
  {
    id: "ev-esc-009",
    companyId: "comp_2",
    title: "Entrega Logística Programada",
    date: "2026-01-24",
    time: "08:45",
    creationDate: "2026-01-15T10:00:00Z",
    type: "MOVEMENT",
    status: "PROGRAMADO",
    details: "PRIORIDAD_BAJA | Distribución Escobar",
    vehicleId: "8AJH10017",
    vehicleVin: "8AJH10017",
    destination: "Depósito San Juan",
    destinationId: "loc_2_deposit",
    createdBy: "SYSTEM",
    createdById: "system"
  },
  {
    id: "ev-esc-010",
    companyId: "comp_2",
    title: "Entrega Logística Programada",
    date: "2026-01-27",
    time: "16:00",
    creationDate: "2026-01-18T11:00:00Z",
    type: "MOVEMENT",
    status: "PROGRAMADO",
    details: "PRIORIDAD_BAJA | Traslado inter-plantas",
    vehicleId: "8AJH10019",
    vehicleVin: "8AJH10019",
    destination: "Escobar Paraná",
    destinationId: "loc_2_par",
    createdBy: "SYSTEM",
    createdById: "system"
  },
  {
    id: "ev-esc-011",
    companyId: "comp_2",
    title: "Entrega Logística Programada",
    date: "2026-01-30",
    time: "10:15",
    creationDate: "2026-01-20T09:00:00Z",
    type: "MOVEMENT",
    status: "PROGRAMADO",
    details: "PRIORIDAD_BAJA | Cierre logística enero",
    vehicleId: "8AJH10021",
    vehicleVin: "8AJH10021",
    destination: "Predio Escobar (Central)",
    destinationId: "loc_2_main",
    createdBy: "SYSTEM",
    createdById: "system"
  },
  {
    id: "ev-esc-012",
    companyId: "comp_2",
    title: "Entrega Logística Programada",
    date: "2026-02-03",
    time: "13:30",
    creationDate: "2026-01-24T12:00:00Z",
    type: "MOVEMENT",
    status: "PROGRAMADO",
    details: "PRIORIDAD_BAJA | Apertura logística febrero",
    vehicleId: "8AJH10023",
    vehicleVin: "8AJH10023",
    destination: "Escobar Rosario",
    destinationId: "loc_2_ros",
    createdBy: "SYSTEM",
    createdById: "system"
  },
  {
    id: "ev-esc-013",
    companyId: "comp_2",
    title: "Entrega Logística Programada",
    date: "2026-02-06",
    time: "09:00",
    creationDate: "2026-01-27T08:30:00Z",
    type: "MOVEMENT",
    status: "PROGRAMADO",
    details: "PRIORIDAD_BAJA | Reubicación de unidades",
    vehicleId: "8AJH10025",
    vehicleVin: "8AJH10025",
    destination: "Escobar Rafaela",
    destinationId: "loc_2_raf",
    createdBy: "SYSTEM",
    createdById: "system"
  },
  {
    id: "ev-esc-014",
    companyId: "comp_2",
    title: "Entrega Logística Programada",
    date: "2026-02-09",
    time: "11:45",
    creationDate: "2026-01-30T10:00:00Z",
    type: "MOVEMENT",
    status: "PROGRAMADO",
    details: "PRIORIDAD_BAJA | Preparación despachos",
    vehicleId: "8AJH10027",
    vehicleVin: "8AJH10027",
    destination: "Depósito San Juan",
    destinationId: "loc_2_deposit",
    createdBy: "SYSTEM",
    createdById: "system"
  },
  {
    id: "ev-esc-015",
    companyId: "comp_2",
    title: "Entrega Logística Programada",
    date: "2026-02-12",
    time: "15:00",
    creationDate: "2026-02-01T09:00:00Z",
    type: "MOVEMENT",
    status: "PROGRAMADO",
    details: "PRIORIDAD_BAJA | Control quincenal",
    vehicleId: "8AJH10029",
    vehicleVin: "8AJH10029",
    destination: "Escobar Paraná",
    destinationId: "loc_2_par",
    createdBy: "SYSTEM",
    createdById: "system"
  }
];
