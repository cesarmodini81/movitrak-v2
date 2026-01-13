
import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { CalendarEvent, Movement, Vehicle } from '../types';
import { MOCK_CALENDAR_EVENTS, MOCK_MOVEMENTS, LOCATION_MAP } from '../constants';
import { useTranslation } from 'react-i18next';
import { 
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, 
  Info, Package, Truck, Clock, AlertTriangle, CheckCircle, Timer
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
  const { calendarEvents, movements, availableVehicles } = useApp();
  const { t } = useTranslation();
  
  // FIXED REFERENCE DATE: JAN 10, 2026 (Para cálculo de prioridades de los mocks)
  const REFERENCE_DATE = new Date(2026, 0, 10, 12, 0, 0);
  
  // Initialize state to Jan 2026 for Mock Data visibility
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1)); 
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // --- Priority Logic (Time Remaining) ---
  const getPriority = (dateStr: string, timeStr: string): Priority => {
    // Calculamos tiempo restante desde la fecha de referencia hasta el evento
    const eventDate = new Date(`${dateStr}T${timeStr}:00`);
    const diffMs = eventDate.getTime() - REFERENCE_DATE.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    // Si faltan menos de 48hs (o ya pasó), es URGENTE (Rojo)
    if (diffHours < 48) return 'URGENTE';
    // Si faltan entre 48 y 72hs, es MEDIA (Amarillo)
    if (diffHours <= 72) return 'MEDIA';
    // Si faltan más de 72hs, es NORMAL (Verde)
    return 'NORMAL'; 
  };

  // --- Data Integration (EXCLUSIVE 0KM & COMPANY FILTERED) ---
  // Usamos 'availableVehicles' del contexto que ya está filtrado por empresa
  const relevantEvents = useMemo(() => {
    // Combinar mocks estáticos con dinámicos
    const rawEvents = [...MOCK_CALENDAR_EVENTS, ...calendarEvents];
    
    // Filtrar: Solo mostrar eventos de vehículos que el usuario puede ver (0km y de su empresa)
    return rawEvents.filter(evt => {
      // Intentar matchear por VIN completo o parcial (para los mocks estáticos)
      const vehicle = availableVehicles.find(v => v.vin.startsWith(evt.vehicleVin));
      return vehicle && vehicle.type === 'NEW'; 
    });
  }, [calendarEvents, availableVehicles]);

  const relevantMovements = useMemo(() => {
    const raw = [...MOCK_MOVEMENTS, ...movements];
    return raw.filter(mov => {
      const vehicle = availableVehicles.find(v => v.vin === mov.vehicleVins[0]);
      return vehicle && vehicle.type === 'NEW';
    });
  }, [movements, availableVehicles]);

  const calendarData = useMemo(() => {
    const data: Record<string, { type: 'ENTREGA' | 'DESPACHO', ref: any, vehicle?: Vehicle, priority: Priority }[]> = {};
    
    const addItem = (dateStr: string, item: any) => {
      if (!data[dateStr]) data[dateStr] = [];
      data[dateStr].push(item);
    };

    relevantEvents.forEach(evt => {
      // Match vehicle to get location details, filtering strict by available vehicles (company context)
      const v = availableVehicles.find(veh => veh.vin.startsWith(evt.vehicleVin));
      if (v) {
        addItem(evt.date, { 
          type: 'ENTREGA', 
          ref: evt, 
          vehicle: v, 
          priority: getPriority(evt.date, evt.time) 
        });
      }
    });

    relevantMovements.forEach(mov => {
      const dateStr = new Date(mov.date).toISOString().split('T')[0];
      const v = availableVehicles.find(veh => veh.vin === mov.vehicleVins[0]); 
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
  }, [relevantEvents, relevantMovements, availableVehicles]);

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
        // FORCE LOCATION OVERRIDE for 0km Logistics as requested (Predio Sauce Viejo)
        vehicle: { ...item.vehicle!, locationId: 'loc_1_pred' } as Vehicle, 
        time,
        eventId,
        type: item.type,
        priority: item.priority
      };
    });
  };

  const monthLabel = currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.20))] bg-white rounded-[2.5rem] shadow-xl border border-slate-200 overflow-hidden no-print animate-in fade-in duration-300">
      
      {/* Header */}
      <header className="px-10 py-6 border-b border-slate-100 flex items-center justify-between bg-white shrink-0 z-20">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-slate-200">
            <CalendarIcon size={26} strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase italic">
              Calendario 0KM
            </h1>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em] mt-1.5">
               Logística & Programación
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
           <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100 shadow-inner">
              <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))} className="p-3 rounded-xl hover:bg-white hover:shadow-md text-slate-600 transition-all">
                <ChevronLeft size={20} />
              </button>
              <h2 className="text-xl font-black text-slate-800 capitalize px-6 tracking-tighter w-60 text-center">
                {monthLabel}
              </h2>
              <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))} className="p-3 rounded-xl hover:bg-white hover:shadow-md text-slate-600 transition-all">
                <ChevronRight size={20} />
              </button>
           </div>
        </div>

        <div className="flex items-center gap-3">
           <div className="bg-white text-slate-600 px-5 py-3 rounded-xl border border-slate-200 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-sm">
              <Clock size={16} className="text-brand-500" /> 
              <span>Ref: {REFERENCE_DATE.toLocaleDateString()}</span>
           </div>
        </div>
      </header>

      {/* Grid */}
      <div className="flex-1 overflow-hidden flex flex-col min-w-0 bg-white">
        <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50 shrink-0">
          {['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'].map((day, i) => (
            <div key={i} className="py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 grid-rows-6 flex-1 min-h-0">
          {daysInMonth.map((dayObj, idx) => {
            const dateKey = dayObj.date.toISOString().split('T')[0];
            const items = calendarData[dateKey] || [];
            
            // Prioridad Semáforo
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
                  <span className={`inline-flex items-center justify-center w-8 h-8 text-sm font-black rounded-xl border-2 transition-colors ${dayObj.isCurrentMonth ? 'text-slate-800 border-slate-100 bg-slate-50 group-hover:bg-white group-hover:scale-110' : 'text-slate-200 border-transparent'}`}>
                     {dayObj.date.getDate()}
                  </span>
                </div>

                <div className="flex-1 space-y-1.5 overflow-hidden flex flex-col justify-end pb-1">
                  {/* Rojo < 48h */}
                  {urgentCount > 0 && (
                    <div className="flex items-center gap-2 bg-red-500 text-white rounded-lg px-2 py-1 border border-red-600 shadow-md shadow-red-200 animate-in zoom-in duration-300">
                       <span className="text-[10px] font-black">{urgentCount}</span>
                       <span className="text-[8px] font-black uppercase tracking-tighter truncate">URGENTE (&lt;48h)</span>
                    </div>
                  )}
                  {/* Amarillo 48-72h */}
                  {mediumCount > 0 && (
                    <div className="flex items-center gap-2 bg-amber-400 text-white rounded-lg px-2 py-1 border border-amber-500 shadow-md shadow-amber-100 animate-in zoom-in duration-300 delay-75">
                       <span className="text-[10px] font-black">{mediumCount}</span>
                       <span className="text-[8px] font-black uppercase tracking-tighter truncate">ATENCIÓN (72h)</span>
                    </div>
                  )}
                  {/* Verde > 72h */}
                  {normalCount > 0 && urgentCount === 0 && mediumCount === 0 && (
                    <div className="flex items-center gap-2 bg-emerald-500 text-white rounded-lg px-2 py-1 border border-emerald-600 shadow-md shadow-emerald-100 animate-in zoom-in duration-300 delay-100">
                       <span className="text-[10px] font-black">{normalCount}</span>
                       <span className="text-[8px] font-black uppercase tracking-tighter truncate">NORMAL (&gt;72h)</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Legend Footer */}
      <div className="px-10 py-5 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-3 group">
              <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)] group-hover:scale-125 transition-transform"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">Prioridad Alta (&lt;48h)</span>
            </div>
            <div className="flex items-center gap-3 group">
              <div className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.6)] group-hover:scale-125 transition-transform"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">Prioridad Media (48-72h)</span>
            </div>
            <div className="flex items-center gap-3 group">
              <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)] group-hover:scale-125 transition-transform"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">Prioridad Normal (&gt;72h)</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-slate-500 bg-white/5 px-4 py-2 rounded-lg">
             <Timer size={14} className="text-brand-400" />
             <span className="text-[9px] font-bold uppercase tracking-widest">Tiempo calculado desde 10 Ene 2026</span>
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
