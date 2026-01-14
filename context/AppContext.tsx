
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { User, Vehicle, Movement, AuditLog, Role, Company, CalendarEvent, UsedReception, ChatMessage, Part, PartTransfer, PartSale } from '../types';
import { MOCK_USERS, MOCK_COMPANIES, generateMockVehicles, MOCK_CHATS, MOCK_PARTS, LOCATION_MAP } from '../constants';

interface AppContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  vehicles: Vehicle[];
  availableVehicles: Vehicle[];
  companies: Company[];
  allUsers: User[];
  movements: Movement[];
  calendarEvents: CalendarEvent[];
  auditLogs: AuditLog[];
  pdiQueue: string[]; 
  travelSheetList: string[];
  historicalTravelSheetList: string[];
  usedReceptions: UsedReception[];
  addToPdiQueue: (vin: string) => void;
  clearPdiQueue: () => void;
  removeFromTravelSheet: (vins: string[]) => void;
  restoreFromHistorical: (vins: string[]) => void;
  addAuditLog: (action: string, details: string, severity?: 'INFO' | 'WARNING' | 'ERROR') => void;
  updateVehicle: (vin: string, updates: Partial<Vehicle>) => void;
  addVehicle: (vehicle: Vehicle) => void;
  scheduleEvent: (event: CalendarEvent) => void;
  createMovement: (mov: Movement) => void;
  completeMovement: (id: string) => void;
  confirmPDI: (vin: string, comment: string) => void;
  saveUsedReception: (reception: UsedReception) => void;
  currentCompany: Company | null;
  setCurrentCompany: (c: Company | null) => void; 
  language: string;
  setLanguage: (lang: string) => void;
  chatMessages: ChatMessage[];
  sendChatMessage: (text: string, companyId: string) => void;
  markChatAsRead: (companyId: string) => void;
  activeChatCompanyId: string | null;
  setActiveChatCompanyId: (id: string | null) => void;
  createCompany: (name: string) => void;
  addNewUser: (user: User) => void;
  updateUserRole: (userId: string, newRole: Role) => void;
  
  // --- PARTS MODULE ---
  isPartsMode: boolean;
  enterPartsMode: (code: string) => boolean;
  exitPartsMode: () => void;
  parts: Part[];
  partTransfers: PartTransfer[];
  partSales: PartSale[];
  updatePartStock: (partId: string, locationId: string, quantity: number) => void;
  createPartTransfer: (transfer: PartTransfer) => void;
  createPartSale: (sale: PartSale) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>(MOCK_USERS);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [companies, setCompanies] = useState<Company[]>(MOCK_COMPANIES);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [pdiQueue, setPdiQueue] = useState<string[]>([]);
  const [travelSheetList, setTravelSheetList] = useState<string[]>([]);
  const [historicalTravelSheetList, setHistoricalTravelSheetList] = useState<string[]>([]);
  const [usedReceptions, setUsedReceptions] = useState<UsedReception[]>([]);
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null);
  const [language, setLanguageState] = useState(localStorage.getItem('language') || 'es');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(MOCK_CHATS);
  const [activeChatCompanyId, setActiveChatCompanyId] = useState<string | null>(null);

  // Parts State
  const [isPartsMode, setIsPartsMode] = useState(false);
  const [parts, setParts] = useState<Part[]>(MOCK_PARTS);
  const [partTransfers, setPartTransfers] = useState<PartTransfer[]>([]);
  const [partSales, setPartSales] = useState<PartSale[]>([]);

  useEffect(() => {
    setVehicles(generateMockVehicles());
  }, []);

  const availableVehicles = useMemo(() => {
    if (!user) return [];
    if (user.role === Role.SUPER_ADMIN && !currentCompany) return vehicles;
    if (currentCompany) {
      const validLocationIds = currentCompany.locations.map(l => l.id);
      let filtered = vehicles.filter(v => validLocationIds.includes(v.locationId));
      if (user.role === Role.USED_OPERATOR) {
        filtered = filtered.filter(v => v.type === 'USED');
      }
      if (user.role === Role.PROGRAMADOR) {
        filtered = filtered.filter(v => v.type === 'NEW');
      }
      return filtered;
    }
    return vehicles;
  }, [vehicles, currentCompany, user]);

  const login = async (u: string, p: string): Promise<boolean> => {
    const foundUser = allUsers.find(user => user.username === u && p === '1234');
    if (foundUser) {
      setUser(foundUser);
      if (foundUser.role === Role.SUPER_ADMIN) setCurrentCompany(null);
      else if (foundUser.companyId) {
        setCurrentCompany(companies.find(c => c.id === foundUser.companyId) || null);
      }
      
      // Activa modo repuestos si el rol es PARTS_OPERATOR
      if (foundUser.role === Role.PARTS_OPERATOR) {
        setIsPartsMode(true);
      } else {
        setIsPartsMode(false);
      }
      
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setCurrentCompany(null);
    setIsPartsMode(false);
  };

  // --- Parts Logic ---

  const enterPartsMode = (code: string): boolean => {
    if (!currentCompany && user?.role !== Role.SUPER_ADMIN) return false;
    
    // SuperAdmin bypass
    if (user?.role === Role.SUPER_ADMIN) {
        setIsPartsMode(true);
        return true;
    }

    const validCode = currentCompany?.partsAccessCode || '6789'; 
    if (code === validCode) {
      setIsPartsMode(true);
      return true;
    }
    return false;
  };

  const exitPartsMode = () => {
    setIsPartsMode(false);
  };

  const updatePartStock = (partId: string, locationId: string, quantity: number) => {
    setParts(prev => prev.map(p => {
      if (p.id === partId) {
        return {
          ...p,
          stock: { ...p.stock, [locationId]: (p.stock[locationId] || 0) + quantity }
        };
      }
      return p;
    }));
  };

  const createPartTransfer = (transfer: PartTransfer) => {
    setPartTransfers(prev => [transfer, ...prev]);
    transfer.items.forEach(item => {
        const part = parts.find(p => p.code === item.partCode);
        if (part) {
            updatePartStock(part.id, transfer.originId, -item.quantity);
            updatePartStock(part.id, transfer.destinationId, item.quantity);
        }
    });
    addAuditLog('PART_TRANSFER', `Transferencia Repuestos ${transfer.id} creada.`);
  };

  const createPartSale = (sale: PartSale) => {
    setPartSales(prev => [sale, ...prev]);
    addAuditLog('PART_SALE', `Venta Repuestos ${sale.id} confirmada: $${sale.total}`);
  };

  const addNewUser = (newUser: User) => {
    setAllUsers(prev => [...prev, newUser]);
    addAuditLog('USER_CREATED', `Usuario creado: ${newUser.username} (${newUser.role})`);
  };

  const updateUserRole = (userId: string, newRole: Role) => {
    setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    addAuditLog('USER_UPDATED', `Rol actualizado para ID ${userId} a ${newRole}`);
  };

  const createCompany = (name: string) => {
    const newId = `comp_${Date.now()}`;
    const slug = name.toLowerCase().replace(/\s+/g, '_');
    
    const newLocations = [
      { id: `${newId}_main`, name: `Predio ${name}`, address: 'Ubicación Central' },
      { id: `${newId}_used`, name: `Usados ${name}`, address: 'Anexo Usados' }
    ];

    const newCompany: Company = {
      id: newId,
      name: name,
      locations: newLocations,
      partsAccessCode: '6789'
    };

    setCompanies(prev => [...prev, newCompany]);

    const defaultUsers: User[] = [
      { id: `u_${slug}_adm`, username: `admin_${slug}`, name: `Admin ${name}`, role: Role.ADMIN, companyId: newId, email: `gerencia@${slug}.com` },
      { id: `u_${slug}_op`, username: `operador_${slug}`, name: `Operador ${name}`, role: Role.OPERATOR, companyId: newId, email: `ops@${slug}.com` },
      { id: `u_${slug}_prog`, username: `programador_${slug}`, name: `Prog ${name}`, role: Role.PROGRAMADOR, companyId: newId, email: `prog@${slug}.com` },
      { id: `u_${slug}_used`, username: `usados_${slug}`, name: `Usados ${name}`, role: Role.USED_OPERATOR, companyId: newId, email: `usados@${slug}.com` },
      { id: `u_${slug}_parts`, username: `repuestos_${slug}`, name: `Repuestos ${name}`, role: Role.PARTS_OPERATOR, companyId: newId, email: `repuestos@${slug}.com` },
    ];

    setAllUsers(prev => [...prev, ...defaultUsers]);
    addAuditLog('COMPANY_CREATED', `Nueva empresa creada: ${name} con usuarios operativos.`);
  };

  const saveUsedReception = (reception: UsedReception) => {
    setUsedReceptions(prev => [reception, ...prev]);
    addAuditLog('USED_RECEPTION', `Ingreso unidad usada: ${reception.vehicleVin}`);
  };

  const addAuditLog = (action: string, details: string, severity: 'INFO' | 'WARNING' | 'ERROR' = 'INFO') => {
    const newLog: AuditLog = { id: Date.now().toString(), timestamp: new Date().toISOString(), userId: user?.id || 'sys', username: user?.username || 'system', action, details, severity };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const updateVehicle = (vin: string, updates: Partial<Vehicle>) => setVehicles(prev => prev.map(v => v.vin === vin ? { ...v, ...updates } : v));
  const addVehicle = (vehicle: Vehicle) => setVehicles(prev => [vehicle, ...prev]);
  const scheduleEvent = (event: CalendarEvent) => setCalendarEvents(prev => [...prev, event]);
  
  const confirmPDI = (vin: string, comment: string) => {
    updateVehicle(vin, { preDeliveryConfirmed: true, preDeliveryDate: new Date().toISOString(), pdiComment: comment });
    if (!travelSheetList.includes(vin)) setTravelSheetList(prev => [...new Set([vin, ...prev])]);
  };

  const removeFromTravelSheet = (vins: string[]) => {
    setTravelSheetList(prev => prev.filter(v => !vins.includes(v)));
    setHistoricalTravelSheetList(prev => [...new Set([...vins, ...prev])]);
    addAuditLog('TRAVEL_SHEET_ARCHIVE', `Unidades archivadas: ${vins.join(', ')}`);
  };

  const restoreFromHistorical = (vins: string[]) => {
    setHistoricalTravelSheetList(prev => prev.filter(v => !vins.includes(v)));
    setTravelSheetList(prev => [...new Set([...vins, ...prev])]);
    addAuditLog('TRAVEL_SHEET_RESTORE', `Unidades restauradas: ${vins.join(', ')}`);
  };

  const createMovement = (mov: Movement) => {
    setMovements(prev => [mov, ...prev]);
    mov.vehicleVins.forEach(vin => updateVehicle(vin, { status: 'IN_TRANSIT', isLocked: true, lockReason: `REMITO_${mov.id}` }));
  };

  const completeMovement = (id: string) => {
    const mov = movements.find(m => m.id === id);
    if (mov) {
      setMovements(prev => prev.map(m => m.id === id ? { ...m, status: 'COMPLETED' } : m));
      mov.vehicleVins.forEach(vin => updateVehicle(vin, { status: 'AVAILABLE', locationId: mov.destinationId, isLocked: false }));
    }
  };

  const sendChatMessage = (text: string, companyId: string) => {
    const newMessage: ChatMessage = { id: `msg_${Date.now()}`, text, senderId: user!.id, senderName: user!.name, companyId, timestamp: new Date().toISOString(), isRead: false };
    setChatMessages(prev => [...prev, newMessage]);
  };

  const markChatAsRead = (companyId: string) => {
    setChatMessages(prev => prev.map(m => m.companyId === companyId && !m.isRead && m.senderId !== user!.id ? { ...m, isRead: true } : m));
  };

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    window.location.reload();
  };

  return (
    <AppContext.Provider value={{
      user, login, logout, vehicles, availableVehicles, companies, allUsers, movements, calendarEvents, auditLogs, pdiQueue, travelSheetList, historicalTravelSheetList, usedReceptions,
      addToPdiQueue: (v) => setPdiQueue(p => [...p, v]), clearPdiQueue: () => setPdiQueue([]), 
      removeFromTravelSheet, restoreFromHistorical,
      addAuditLog, updateVehicle, addVehicle, scheduleEvent, createMovement, completeMovement, confirmPDI, saveUsedReception,
      currentCompany, setCurrentCompany, language, setLanguage,
      chatMessages, sendChatMessage, markChatAsRead, activeChatCompanyId, setActiveChatCompanyId,
      createCompany, addNewUser, updateUserRole,
      isPartsMode, enterPartsMode, exitPartsMode, parts, partTransfers, partSales, updatePartStock, createPartTransfer, createPartSale
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
