import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { User, LogOut, ChevronDown, Building2 } from 'lucide-react';

export const TopBar: React.FC = () => {
  const { user, logout, currentCompany } = useApp();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-8 fixed top-0 right-0 left-64 z-30 no-print">
      <div className="flex items-center gap-3 text-slate-600">
        <Building2 className="text-slate-400" size={18} />
        <span className="font-semibold text-sm">{currentCompany?.name}</span>
        {currentCompany?.locations[0] && (
           <span className="text-xs text-slate-400 border-l border-slate-300 pl-3">{currentCompany.locations[0].name}</span>
        )}
      </div>

      <div className="relative" ref={dropdownRef}>
        <button 
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 hover:bg-slate-50 px-2 py-1 rounded-lg transition-colors"
        >
          <div className="text-right hidden md:block">
            <p className="text-xs font-bold text-slate-800 leading-tight">{user.name}</p>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">{user.role}</p>
          </div>
          <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 border border-slate-200">
            <User size={16} />
          </div>
          <ChevronDown size={14} className="text-slate-400" />
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 animate-in fade-in zoom-in-95 duration-100 ring-1 ring-black ring-opacity-5">
            <div className="px-4 py-2 border-b border-slate-100">
              <p className="text-xs font-bold text-slate-900">{user.name}</p>
              <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
            </div>
            <div className="py-1">
               <button 
                onClick={logout}
                className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors"
              >
                <LogOut size={14} />
                Cerrar Sesión
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};