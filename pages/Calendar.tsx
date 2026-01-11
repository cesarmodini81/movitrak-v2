import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { CalendarEvent, Movement, Vehicle } from '../types';
import { MOCK_CALENDAR_EVENTS, MOCK_MOVEMENTS, LOCATION_MAP } from '../constants';
import { useTranslation } from 'react-i18next';
import { 
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, 
  Info, Package, Truck, Clock
} from 'lucide-react';
import { DayUnitsModal } from '../components/DayUnitsModal';

// Priority Colors Implementation
type Priority = 'URGENTE' | 'MEDIA' | 'NORMAL';

export interface CalendarModalItem {
  vehicle: Vehicle;
  time: string; 
  eventId: string;
  type: 'ENTREGA' | 'DESPACHO';
  priority: Priority;
}

export const CalendarPage: React.FC = () => {
  const { calendarEvents, movements, vehicles } = useApp();
  const { t } = useTranslation();
  
  // FIXED REFERENCE DATE: JAN 10, 2026
  const REFERENCE_DATE = new Date(2026, 0, 10, 12, 0, 0);
  
  // Initialize state to Jan 2026
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1)); 
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // --- Priority Logic ---
  const getPriority = (dateStr: string, timeStr: string): Priority => {
    const eventDate = new Date(`${dateStr}T${timeStr}:00`);
    const diffMs = eventDate.getTime() - REFERENCE_DATE.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < 48) return 'URGENTE'; // Menos de 48h
    if (diffHours <= 72) return 'MEDIA'; // Entre 48h y 72h
    return 'NORMAL'; // Mas de 72h
  };

  const getPriorityColorClass = (priority: Priority) => {
    switch(priority) {
      case 'URGENTE': return 'bg-red-500 text-white border-red-600 shadow-red-200';
      case 'MEDIA': return 'bg-amber-500 text-white border-amber-600 shadow-amber-200';
      case 'NORMAL': return 'bg-emerald-500 text-white border-emerald-600 shadow-emerald-200';
    }
  };

  // --- Data Integration (EXCLUSIVE 0KM) ---
  const allCalendarEvents = useMemo(() => {
    const raw = [...MOCK_CALENDAR_EVENTS, ...calendarEvents];
    return raw.filter(evt => {
      const v = vehicles.find(veh => veh.vin === evt.vehicleVin);
      return v?.type === 'NEW'; // Solo 0km
    });
  }, [calendarEvents, vehicles]);

  const allMovements = useMemo(() => {
    const raw = [...MOCK_MOVEMENTS, ...movements];
    return raw.filter(mov => {
      const v = vehicles.find(veh => veh.vin === mov.vehicleVins[0]);
      return v?.type === 'NEW'; // Solo 0km
    });
  }, [movements, vehicles]);

  const calendarData = useMemo(() => {
    const data: Record<string, { type: 'ENTREGA' | 'DESPACHO', ref: any, vehicle?: Vehicle, priority: Priority }[]> = {};
    
    const addItem = (dateStr: string, item: any) => {
      if (!data[dateStr]) data[dateStr] = [];
      data[dateStr].push(item);
    };

    allCalendarEvents.forEach(evt => {
      const v = vehicles.find(veh => veh.vin === evt.vehicleVin);
      if (v) {
        addItem(evt.date, { 
          type: 'ENTREGA', 
          ref: evt, 
          vehicle: v, 
          priority: getPriority(evt.date, evt.time) 
        });
      }
    });

    allMovements.forEach(mov => {
      const dateStr = new Date(mov.date).toISOString().split('T')[0];
      const v = vehicles.find(veh => veh.vin === mov.vehicleVins[0]); 
      if (v) {
        addItem(dateStr, { 
          type: 'DESPACHO', 
          ref: mov, 
          vehicle: v, 
          priority: getPriority(dateStr, '12:00') 
        });
      }
    });

    return data;
  }, [allCalendarEvents, allMovements, vehicles]);

  // --- Grid Generation ---
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

  const getModalItemsForDate = (dateStr: string): CalendarModalItem[] => {
    const items = calendarData[dateStr] || [];
    return items.map(item => {
      let time = '12:00'; 
      let eventId = 'unknown';

      if (item.type === 'ENTREGA') {
        const evt = item.ref as CalendarEvent;
        time = evt.time;
        eventId = evt.id;
      } else {
        const mov = item.ref as Movement;
        time = new Date(mov.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        eventId = mov.id;
      }

      return {
        vehicle: { ...item.vehicle!, locationId: 'loc_1_pred' } as Vehicle, // Forzar Predio Sauce Viejo
        time,
        eventId,
        type: item.type,
        priority: item.priority
      };
    });
  };

  const monthLabel = currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.20))] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden no-print animate-in fade-in duration-300">
      
      <header className="px-8 py-5 border-b border-slate-200 flex items-center justify-between bg-white shrink-0 z-20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-xl">
            <CalendarIcon size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase italic">
              MOVITRAK LOGISTICS
            </h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
               Centro Control 0KM — Predio Sauce Viejo
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
           <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl border border-slate-100">
              <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))} className="p-2 rounded-lg hover:bg-white hover:shadow-sm text-slate-600 transition-all">
                <ChevronLeft size={20} />
              </button>
              <h2 className="text-lg font-black text-slate-800 capitalize px-4 tracking-tighter w-48 text-center">
                {monthLabel}
              </h2>
              <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))} className="p-2 rounded-lg hover:bg-white hover:shadow-sm text-slate-600 transition-all">
                <ChevronRight size={20} />
              </button>
           </div>
        </div>

        <div className="flex items-center gap-3">
           <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl border border-emerald-100 font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
              <Clock size={14} /> Ref: {REFERENCE_DATE.toLocaleDateString()}
           </div>
        </div>
      </header>

      <div className="flex-1 overflow-hidden flex flex-col min-w-0 bg-white">
        <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50 shrink-0">
          {['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'].map((day, i) => (
            <div key={i} className="py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 grid-rows-6 flex-1 min-h-0">
          {daysInMonth.map((dayObj, idx) => {
            const dateKey = dayObj.date.toISOString().split('T')[0];
            const items = calendarData[dateKey] || [];
            
            // Group by priority for badges
            const urgentCount = items.filter(i => i.priority === 'URGENTE').length;
            const mediumCount = items.filter(i => i.priority === 'MEDIA').length;
            const normalCount = items.filter(i => i.priority === 'NORMAL').length;

            return (
              <div 
                key={idx} 
                onClick={() => setSelectedDate(dateKey)}
                className={`border-b border-r border-slate-100 relative p-3 transition-all hover:bg-slate-50/80 cursor-pointer flex flex-col group
                  ${!dayObj.isCurrentMonth ? 'opacity-20 bg-slate-50/30' : 'bg-white'}
                `}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`inline-flex items-center justify-center w-8 h-8 text-sm font-black rounded-xl border-2 transition-colors ${dayObj.isCurrentMonth ? 'text-slate-800 border-slate-100 bg-slate-50 group-hover:bg-white' : 'text-slate-200 border-transparent'}`}>
                     {dayObj.date.getDate()}
                  </span>
                </div>

                <div className="flex-1 space-y-1 overflow-hidden">
                  {urgentCount > 0 && (
                    <div className="flex items-center gap-1.5 bg-red-500 text-white rounded-lg px-2 py-0.5 border border-red-600 shadow-sm">
                       <span className="text-[10px] font-black">{urgentCount}</span>
                       <span className="text-[8px] font-black uppercase tracking-tighter">URGENTE</span>
                    </div>
                  )}
                  {mediumCount > 0 && (
                    <div className="flex items-center gap-1.5 bg-amber-500 text-white rounded-lg px-2 py-0.5 border border-amber-600 shadow-sm">
                       <span className="text-[10px] font-black">{mediumCount}</span>
                       <span className="text-[8px] font-black uppercase tracking-tighter">MEDIA</span>
                    </div>
                  )}
                  {normalCount > 0 && urgentCount === 0 && (
                    <div className="flex items-center gap-1.5 bg-emerald-500 text-white rounded-lg px-2 py-0.5 border border-emerald-600 shadow-sm">
                       <span className="text-[10px] font-black">{normalCount}</span>
                       <span className="text-[8px] font-black uppercase tracking-tighter">ESTANDAR</span>
                    </div>
                  )}

                  {items.length > 3 && (
                    <div className="text-[9px] font-black text-slate-400 pl-1 pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                       + {items.length - 2} ops más...
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="px-8 py-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-md bg-red-500 shadow-sm shadow-red-500/50"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Crítico (&lt;48h)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-md bg-amber-500 shadow-sm shadow-amber-500/50"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Media (48-72h)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-md bg-emerald-500 shadow-sm shadow-emerald-500/50"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Normal (&gt;72h)</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-slate-500">
             <Info size={14} />
             <span className="text-[9px] font-bold uppercase tracking-widest italic">Prioridad calculada desde 10/01/2026</span>
          </div>
      </div>

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