import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { User, Vehicle, Movement, AuditLog, Role, Company, CalendarEvent, UsedReception } from '../types';
import { MOCK_USERS, MOCK_COMPANIES, generateMockVehicles, MOCK_CHATS, ChatMessage } from '../constants';

interface AppContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  vehicles: Vehicle[];
  availableVehicles: Vehicle[];
  companies: Company[];
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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [companies] = useState<Company[]>(MOCK_COMPANIES);
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
    return [];
  }, [vehicles, currentCompany, user]);

  const login = async (u: string, p: string): Promise<boolean> => {
    const foundUser = MOCK_USERS.find(user => user.username === u && p === '1234');
    if (foundUser) {
      setUser(foundUser);
      if (foundUser.role === Role.SUPER_ADMIN) setCurrentCompany(null);
      else if (foundUser.companyId) {
        setCurrentCompany(companies.find(c => c.id === foundUser.companyId) || null);
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setCurrentCompany(null);
  };

  const saveUsedReception = (reception: UsedReception) => {
    setUsedReceptions(prev => [reception, ...prev]);
    addAuditLog('USED_RECEPTION', `Used vehicle received: ${reception.vehicleVin}`);
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
    addAuditLog('TRAVEL_SHEET_ARCHIVE', `Unidades archivadas en histórica: ${vins.join(', ')}`);
  };

  const restoreFromHistorical = (vins: string[]) => {
    setHistoricalTravelSheetList(prev => prev.filter(v => !vins.includes(v)));
    setTravelSheetList(prev => [...new Set([...vins, ...prev])]);
    addAuditLog('TRAVEL_SHEET_RESTORE', `Unidades restauradas a planilla activa: ${vins.join(', ')}`);
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
      user, login, logout, vehicles, availableVehicles, companies, movements, calendarEvents, auditLogs, pdiQueue, travelSheetList, historicalTravelSheetList, usedReceptions,
      addToPdiQueue: (v) => setPdiQueue(p => [...p, v]), clearPdiQueue: () => setPdiQueue([]), 
      removeFromTravelSheet, restoreFromHistorical,
      addAuditLog, updateVehicle, addVehicle, scheduleEvent, createMovement, completeMovement, confirmPDI, saveUsedReception,
      currentCompany, setCurrentCompany, language, setLanguage,
      chatMessages, sendChatMessage, markChatAsRead, activeChatCompanyId, setActiveChatCompanyId
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
