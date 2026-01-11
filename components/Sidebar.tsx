import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Role } from '../types';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, Calendar, FileCheck, Truck, 
  Search, ShieldAlert, Globe, ChevronDown, ChevronRight,
  ClipboardList, Map, FileText, CalendarPlus, Car, PenTool,
  History
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const Sidebar: React.FC<{ onQueryClick: () => void }> = ({ onQueryClick }) => {
  const { user, language, setLanguage } = useApp();
  const { t } = useTranslation();
  const location = useLocation();
  const [movementsOpen, setMovementsOpen] = useState(true);

  if (!user) return null;

  const isUsedOperator = user.role === Role.USED_OPERATOR;
  const isProgramador = user.role === Role.PROGRAMADOR;
  const isOperator = user.role === Role.OPERATOR;
  const isAdmin = user.role === Role.ADMIN || user.role === Role.SUPER_ADMIN;

  const isActive = (path: string) => location.pathname === path 
    ? 'bg-slate-800 text-white border-l-4 border-accent-500' 
    : 'text-slate-400 hover:bg-slate-800 hover:text-white border-l-4 border-transparent';

  const NavItem = ({ to, icon: Icon, label, onClick }: any) => (
    <Link 
      to={to || '#'} 
      onClick={onClick}
      className={`flex items-center gap-3 px-6 py-3 transition-all ${to && isActive(to)}`}
    >
      <Icon size={18} />
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );

  return (
    <div className="w-64 bg-slate-950 text-white h-screen flex flex-col fixed left-0 top-0 z-40 no-print shadow-xl">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="bg-white p-1.5 rounded-lg">
          <Truck className="text-slate-950" size={24} />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight">MOVITRAK</h1>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none">Logistics Hub</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 space-y-0.5">
        <div className="px-6 py-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest">General</div>
        <NavItem to="/" icon={LayoutDashboard} label={t('dashboard')} />
        
        <button 
          onClick={onQueryClick}
          className="w-full flex items-center gap-3 px-6 py-3 text-slate-400 hover:bg-slate-800 hover:text-white transition-all border-l-4 border-transparent"
        >
          <Search size={18} />
          <span className="text-sm font-medium">{t('vehicle_query')}</span>
        </button>

        {/* --- Sección de Programación y Previsión --- */}
        {(isProgramador || isAdmin) && (
          <div className="mt-6">
            <div className="px-6 py-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest">Planificación</div>
            <NavItem to="/programming" icon={CalendarPlus} label={t('programming')} />
          </div>
        )}

        {/* --- Calendario Logístico (Visible para todos menos Usados) --- */}
        {!isUsedOperator && (
          <NavItem to="/calendar" icon={Calendar} label={t('calendar')} />
        )}

        {/* --- Sección de Usados --- */}
        {isUsedOperator && (
          <div className="mt-6">
            <div className="px-6 py-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest">Usados</div>
            <NavItem to="/used-reception" icon={PenTool} label={t('used_reception')} />
            <NavItem to="/movements" icon={ClipboardList} label={t('transfer_vehicles')} />
          </div>
        )}

        {/* --- Sección Operativa (PDI y Viajes) --- */}
        {(isOperator || isAdmin) && (
          <div className="mt-6">
            <div className="px-6 py-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest">Operativo</div>
            <NavItem to="/pdi" icon={FileCheck} label={t('pdi_sheet')} />
            <div className="bg-slate-900/40 pb-2">
              <NavItem to="/travel-sheet" icon={FileText} label={t('travel_sheet')} />
              <Link 
                to="/historical-travel-sheet" 
                className={`flex items-center gap-3 px-12 py-2 transition-all ${isActive('/historical-travel-sheet')}`}
              >
                <History size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Histórica Viajes</span>
              </Link>
            </div>

            <div className="mt-2">
              <button 
                onClick={() => setMovementsOpen(!movementsOpen)} 
                className="w-full flex items-center justify-between px-6 py-3 text-slate-400 hover:text-white transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Map size={18} />
                  <span className="text-sm font-medium">{t('movements')}</span>
                </div>
                {movementsOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
              {movementsOpen && (
                <div className="bg-slate-900/50 py-1">
                  <NavItem to="/movements" icon={ClipboardList} label={t('transfer_vehicles')} />
                  <NavItem to="/confirm-movements" icon={Truck} label={t('confirm_movement')} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- Configuración de Sistema --- */}
        {isAdmin && (
          <div className="mt-6">
            <div className="px-6 py-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest">Sistema</div>
            <NavItem to="/audit" icon={ShieldAlert} label={t('audit_logs')} />
          </div>
        )}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-2 mb-1">
          <Globe size={14} className="text-slate-500" />
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)} 
            className="bg-transparent border-none focus:ring-0 text-slate-400 text-xs font-medium cursor-pointer outline-none"
          >
            <option value="es" className="text-slate-900">ES (AR)</option>
            <option value="en" className="text-slate-900">EN (US)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
