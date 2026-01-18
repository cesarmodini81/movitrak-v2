
import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Vehicle, Role, CalendarEvent } from '../types';
import { MOCK_EVENTS, MOCK_CALENDAR_EVENTS, LOCATION_MAP } from '../constants';
import { useTranslation } from 'react-i18next';
import { 
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, 
  Clock, Timer, Info, AlertCircle, CheckCircle2
} from 'lucide-react';
import { DayUnitsModal } from '../components/DayUnitsModal';

// Tipos de Prioridad para la lógica de UX
type Priority = 'URGENTE' | 'ALERTA' | 'NORMAL' | 'VENCIDO';

export interface CalendarModalItem {
  vehicle: Vehicle;
  time: string; 
  eventId: string;
  type: 'ENTREGA' | 'DESPACHO';
  priority: Priority;
}

export const CalendarPage: React.FC = () => {
  const { user, currentCompany, availableVehicles } = useApp();
  const { t } = useTranslation();
  
  // FECHA DE REFERENCIA OPERATIVA MOVITRAK: 10 de Enero, 2026 (Simulación de "Hoy")
  const NOW_REF = new Date(2026, 0, 10, 8, 0, 0);
  
  // Estado para la navegación del mes (Fijado en Enero 2026 para visualizar Mocks)
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1)); 
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // --- Lógica de Prioridad Semáforo (Basado en Horas Restantes) ---
  const getPriorityData = (dateStr: string, timeStr: string) => {
    const eventDate = new Date(`${dateStr}T${timeStr}:00`);
    const diffMs = eventDate.getTime() - NOW_REF.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    let color = 'bg-green-500';
    let label = 'en tiempo';
    let priority: Priority = 'NORMAL';
    
    if (diffHours < 0) {
      color = 'bg-red-800';
      label = 'vencido';
      priority = 'VENCIDO';
    } else if (diffHours < 48) {
      color = 'bg-red-600';
      label = 'urgencia alta';
      priority = 'URGENTE';
    } else if (diffHours <= 72) {
      color = 'bg-orange-500';
      label = 'prioridad media';
      priority = 'ALERTA';
    }
    
    return { color, label, hours: diffHours, priority };
  };

  // --- Integración de Mocks y Filtrado por Empresa ---
  const calendarData = useMemo(() => {
    const data: Record<string, { type: 'ENTREGA' | 'DESPACHO', ref: any, vehicle: Vehicle, pData: any }[]> = {};
    
    // Identificar Empresa Activa
    const activeCompId = currentCompany?.id || user?.companyId;

    // 1. Unificar fuentes de mocks (MOCK_EVENTS es prioritario por companyId)
    const combinedMocks = [
      ...MOCK_EVENTS.map(e => ({ ...e, source: 'EX' })),
      ...MOCK_CALENDAR_EVENTS.map(e => ({ 
        ...e, 
        companyId: e.destinationId.startsWith('loc_1') ? 'comp_1' : 'comp_2',
        source: 'BASIC',
        date: e.date,
        time: e.time,
        vehicleId: e.vehicleVin,
        type: 'MOVEMENT'
      }))
    ];

    const filteredMocks = combinedMocks.filter(evt => {
      // SuperAdmin ve todo; Operadores solo su empresa
      if (user?.role === Role.SUPER_ADMIN && !currentCompany) return true;
      const normalizedEvtCompId = evt.companyId.includes('_') ? evt.companyId : evt.companyId.replace('comp', 'comp_');
      return normalizedEvtCompId === activeCompId;
    });

    const addItem = (dateStr: string, item: any) => {
      if (!data[dateStr]) data[dateStr] = [];
      data[dateStr].push(item);
    };

    filteredMocks.forEach(evt => {
      // Vincular con availableVehicles para trazabilidad (Modelo, Color, Estado)
      const vin = evt.vehicleId || (evt as any).vehicleVin;
      const vehicle = availableVehicles.find(v => v.vin.startsWith(vin));
      
      if (vehicle) {
        addItem(evt.date, {
          type: evt.type === 'MOVEMENT' ? 'DESPACHO' : 'ENTREGA',
          ref: evt,
          vehicle,
          pData: getPriorityData(evt.date, evt.time)
        });
      }
    });

    return data;
  }, [currentCompany, user, availableVehicles]);

  // --- Generación del Grid del Mes ---
  const daysInMonth = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    const startPadding = firstDay.getDay(); 
    
    for (let i = 0; i < startPadding; i++) {
      const d = new Date(year, month, 0 - (startPadding - 1) + i);
      days.push({ date: d, isCurrentMonth: false });
    }
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const d = new Date(year, month, i);
      days.push({ date: d, isCurrentMonth: true });
    }
    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      const d = new Date(year, month + 1, i);
      days.push({ date: d, isCurrentMonth: false });
    }
    return days;
  }, [currentDate]);

  // Mapeo para el modal detallado
  const getModalItemsForDate = (dateStr: string): CalendarModalItem[] => {
    const items = calendarData[dateStr] || [];
    return items.map(item => ({
      // Directiva MOVITRAK: 0km siempre se ubican en Predio Sauce Viejo
      vehicle: { ...item.vehicle, locationId: 'loc_1_pred' }, 
      time: item.ref.time,
      eventId: item.ref.id,
      type: item.type,
      priority: item.pData.priority
    }));
  };

  const monthLabel = currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[550px] lg:min-h-[750px] bg-white rounded-[2rem] lg:rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden no-print animate-in fade-in duration-500 pt-20 md:pt-24">
      
      {/* HEADER: UX ENTERPRISE */}
      <header className="px-6 py-4 lg:px-10 lg:py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
        <div className="flex items-center gap-4 lg:gap-6">
          <div className="w-12 h-12 lg:w-16 lg:h-16 bg-slate-950 text-white rounded-xl lg:rounded-2xl flex items-center justify-center shadow-xl shadow-slate-200">
            <CalendarIcon size={24} strokeWidth={2} className="lg:w-8 lg:h-8" />
          </div>
          <div>
            <h1 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
              Calendario Logístico 0KM
            </h1>
            <p className="text-[8px] lg:text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-1 lg:mt-2">
               Trazabilidad Preventiva • Sistema Central MOVITRAK
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
           <div className="flex items-center gap-2 lg:gap-4 bg-white p-2 lg:p-2.5 rounded-2xl border border-slate-200 shadow-sm ring-1 ring-slate-100">
              <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))} className="p-1.5 lg:p-2.5 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-all">
                <ChevronLeft size={20} strokeWidth={3} className="lg:w-6 lg:h-6" />
              </button>
              <h2 className="text-base lg:text-xl font-black text-slate-800 capitalize min-w-[140px] lg:min-w-[200px] text-center tracking-tight">
                {monthLabel}
              </h2>
              <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))} className="p-1.5 lg:p-2.5 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-all">
                <ChevronRight size={20} strokeWidth={3} className="lg:w-6 lg:h-6" />
              </button>
           </div>
        </div>

        <div className="hidden lg:flex items-center gap-4">
           <div className="bg-slate-900 text-white px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2.5 shadow-lg border border-slate-800">
              <Timer size={16} className="text-brand-400" /> 
              <span>Referencia Operativa: 10 ENE 2026</span>
           </div>
        </div>
      </header>

      {/* CALENDAR GRID CORE */}
      <div className="flex-1 flex flex-col min-w-0 bg-white overflow-hidden">
        <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50">
          {['dom', 'lun', 'mar', 'mie', 'jue', 'vie', 'sab'].map((day, i) => (
            <div key={i} className="py-2 lg:py-4 text-center text-[8px] lg:text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 grid-rows-6 flex-1 min-h-0 divide-x divide-y divide-slate-100 border-l border-t border-slate-100">
          {daysInMonth.map((dayObj, idx) => {
            const dateKey = dayObj.date ? dayObj.date.toISOString().split('T')[0] : '';
            const items = dateKey ? calendarData[dateKey] || [] : [];
            
            return (
              <div 
                key={idx} 
                onClick={() => dateKey && setSelectedDate(dateKey)}
                className={`relative p-1 lg:p-3 transition-all hover:bg-slate-50/80 cursor-pointer flex flex-col group
                  ${!dayObj.isCurrentMonth ? 'bg-slate-50/30' : 'bg-white'}
                `}
              >
                <div className="flex justify-between items-start mb-1 lg:mb-3">
                  <span className={`text-[10px] lg:text-xs font-black p-1 lg:p-1.5 rounded-lg transition-colors ${dayObj.isCurrentMonth ? 'text-slate-900 bg-slate-100 group-hover:bg-slate-900 group-hover:text-white' : 'text-slate-200'}`}>
                     {dayObj.date ? dayObj.date.getDate() : ''}
                  </span>
                  {items.length > 0 && (
                    <span className="hidden lg:inline-block text-[9px] font-black text-slate-400 border border-slate-100 px-2 py-0.5 rounded-md bg-white shadow-sm">
                      {items.length} units
                    </span>
                  )}
                  {items.length > 0 && (
                    <div className="lg:hidden w-1.5 h-1.5 rounded-full bg-brand-500"></div>
                  )}
                </div>

                <div className="flex-1 space-y-1 lg:space-y-1.5 overflow-hidden flex flex-col justify-start">
                  {items.slice(0, 3).map((item, i) => (
                    <div 
                      key={i}
                      className="flex items-center gap-1.5 py-1 px-2 rounded hover:bg-slate-50 transition-colors w-full"
                      title={`Quedan ${item.pData.hours} horas – ${item.pData.label}`}
                    >
                       {/* PRIORIDAD PUNTO */}
                       <div className={`w-2 h-2 rounded-full shrink-0 shadow-sm ${item.pData.color}`}></div>
                       
                       <div className="hidden xl:block truncate text-[7.5px] font-black text-slate-700 uppercase tracking-tighter">
                          {item.ref.time} - {item.vehicle.model}
                       </div>
                       
                       {/* Indicador visual móvil */}
                       <div className={`xl:hidden h-1.5 w-full rounded-full ${item.pData.color}`}></div>
                    </div>
                  ))}
                  {items.length > 3 && (
                    <div className="text-[8px] font-black text-slate-400 pl-2 uppercase tracking-widest mt-1 hidden lg:block">
                      + {items.length - 3} pendientes
                    </div>
                  )}
                </div>
                
                {dayObj.isCurrentMonth && items.length > 0 && (
                   <div className="absolute bottom-1 right-1 lg:bottom-2 lg:right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="p-0.5 lg:p-1 bg-slate-900 text-white rounded-md">
                         <Info size={10} />
                      </div>
                   </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* LEGEND FOOTER ENTERPRISE */}
      <footer className="px-6 py-3 lg:px-10 lg:py-5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-4 lg:gap-10">
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="w-2 h-2 lg:w-3 lg:h-3 rounded-full bg-red-800 ring-2 lg:ring-4 ring-red-800/20"></div>
              <span className="text-[8px] lg:text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 italic">Vencido</span>
            </div>
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="w-2 h-2 lg:w-3 lg:h-3 rounded-full bg-red-600 ring-2 lg:ring-4 ring-red-600/20"></div>
              <span className="text-[8px] lg:text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 italic">Crítico (&lt;48h)</span>
            </div>
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="w-2 h-2 lg:w-3 lg:h-3 rounded-full bg-orange-500 ring-2 lg:ring-4 ring-orange-500/20"></div>
              <span className="text-[8px] lg:text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 italic">Atención (48-72h)</span>
            </div>
            <div className="hidden md:flex items-center gap-2 lg:gap-3">
              <div className="w-2 h-2 lg:w-3 lg:h-3 rounded-full bg-green-500 ring-2 lg:ring-4 ring-green-500/20"></div>
              <span className="text-[8px] lg:text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 italic">En Tiempo (&gt;72h)</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-slate-500 bg-white/5 px-4 lg:px-6 py-2 lg:py-2.5 rounded-2xl border border-white/5">
             <div className="flex items-center gap-2">
                <CheckCircle2 size={12} className="text-brand-400 lg:w-[14px]" />
                <span className="text-[7px] lg:text-[8px] font-bold uppercase tracking-widest leading-none">Datos Filtrados por Empresa Activa</span>
             </div>
             <div className="w-px h-3 bg-slate-800 mx-2 hidden lg:block"></div>
             <span className="hidden lg:inline text-[8px] font-bold text-slate-600 uppercase tracking-widest">v2.9.0 STABLE</span>
          </div>
      </footer>

      {selectedDate && (
        <DayUnitsModal 
          isOpen={!!selectedDate} 
          onClose={() => setSelectedDate(null)}
          date={selectedDate} 
          items={getModalItemsForDate(selectedDate)}
        />
      )}
    </div>
  );
};
