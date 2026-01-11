export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  OPERATOR = 'OPERATOR',
  PROGRAMADOR = 'PROGRAMADOR',
  SELLER = 'SELLER',
  VIEWER = 'VIEWER',
  USED_OPERATOR = 'USED_OPERATOR',
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
}

export interface Location {
  id: string;
  name: string;
  address: string;
}

export interface Vehicle {
  vin: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  type: 'NEW' | 'USED';
  locationId: string;
  entryDate: string; // ISO Date
  
  // PDI / Technical Status
  preDeliveryConfirmed: boolean; // Was pdiConfirmed
  preDeliveryDate?: string;
  preDeliveryUser?: string;
  pdiComment?: string;
  
  // Logistics Status
  status: 'AVAILABLE' | 'IN_TRANSIT' | 'SOLD' | 'MAINTENANCE';
  isLocked: boolean; // True if in a Remito/Movement
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
}