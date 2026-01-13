
export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  OPERATOR = 'OPERATOR',
  PROGRAMADOR = 'PROGRAMADOR',
  SELLER = 'SELLER',
  VIEWER = 'VIEWER',
  USED_OPERATOR = 'USED_OPERATOR',
  PARTS_OPERATOR = 'PARTS_OPERATOR', // New Role
}

export interface User {
  id: string;
  username: string;
  name: string;
  role: Role;
  companyId?: string;
  email: string;
}

export interface Company {
  id: string;
  name: string;
  locations: Location[];
  partsAccessCode?: string; // Custom PIN for parts module
}

export interface Location {
  id: string;
  name: string;
  address: string;
}

export interface Vehicle {
  vin: string;
  plate?: string; // Patente para usados
  brand: string;
  model: string;
  year: number;
  color: string;
  km?: number; // Kilometraje para usados
  type: 'NEW' | 'USED';
  locationId: string;
  entryDate: string; // ISO Date
  
  // PDI / Technical Status
  preDeliveryConfirmed: boolean;
  preDeliveryDate?: string;
  preDeliveryUser?: string;
  pdiComment?: string;
  
  // Logistics Status
  status: 'AVAILABLE' | 'IN_TRANSIT' | 'SOLD' | 'MAINTENANCE';
  isLocked: boolean;
  lockReason?: string;
}

export interface CalendarEvent {
  id: string;
  vehicleVin: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  destinationId: string;
  status: 'PROGRAMADO' | 'CUMPLIDO' | 'CANCELADO';
  createdBy: string;
}

export interface Movement {
  id: string;
  date: string;
  originId: string;
  destinationId: string;
  transporter: string;
  driverName?: string;
  vehicleVins: string[];
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  createdBy: string;
  observations?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  username: string;
  action: string;
  details: string;
  severity: 'INFO' | 'WARNING' | 'ERROR';
}

export interface UsedReception {
  id: string;
  vehicleVin: string;
  date: string;
  kmDelivery: number;
  kmReception: number;
  officialDelivery: string;
  officialReception: string;
  licenseNumber: string;
  fuelLevel: number;
  inventory: {
    exterior: Record<string, 'OK' | 'NO' | 'R' | 'F'>;
    interior: Record<string, 'OK' | 'NO' | 'R' | 'F'>;
    accessories: Record<string, 'OK' | 'NO' | 'R' | 'F'>;
  };
  observations: string;
  companyId: string;
  status: 'INGRESADO' | 'CONFIRMADO' | 'ANULADO';
}

export interface ChatMessage {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  companyId: string;
  timestamp: string;
  isRead: boolean;
}

// --- PARTS MODULE INTERFACES ---

export interface Part {
  id: string;
  code: string;
  name: string;
  brand: string;
  modelCompatibility: string[];
  locationInCar: string; // e.g. "Motor delantero", "Baúl"
  photoUrl: string;
  stock: Record<string, number>; // LocationID -> Quantity
  companyId: string;
  price: number;
}

export interface PartTransfer {
  id: string;
  date: string;
  originId: string;
  destinationId: string;
  transporter: string;
  driverName: string;
  truckPlate: string;
  items: { partCode: string; quantity: number; name: string }[];
  status: 'PENDING' | 'COMPLETED';
  createdBy: string;
  companyId: string;
}

export interface PartSale {
  id: string;
  date: string;
  clientName: string;
  clientDni: string;
  clientEmail: string;
  clientPhone: string;
  items: { partCode: string; quantity: number; price: number; name: string }[];
  total: number;
  soldBy: string;
  companyId: string;
}
