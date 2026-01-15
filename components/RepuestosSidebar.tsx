
import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, Package, ShoppingCart, ShieldAlert, 
  Settings, LogOut, ArrowRightLeft
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export const RepuestosSidebar: React.FC = () => {
  const { user, logout, currentCompany } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) return null;

  // Función para determinar si la ruta está activa
  const isActive = (path: string) => location.pathname === path
    ? 'bg-slate-800 text-white border-l-4 border-emerald-500 shadow-lg' 
    : 'text-slate-400 hover:bg-slate-800 hover:text-white border-l-4 border-transparent';

  const NavItem = ({ to, icon: Icon, label }: any) => (
    <Link 
      to={to} 
      className={`flex items-center gap-3 px-6 py-4 transition-all ${isActive(to)}`}
    >
      <Icon size={18} />
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-64 bg-slate-950 text-white h-screen flex flex-col fixed left-0 top-0 z-40 no-print shadow-xl">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800 bg-emerald-900/20">
        <div className="bg-emerald-500 p-1.5 rounded-lg text-white">
          <Settings size={24} />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight">REPUESTOS</h1>
          <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest leading-none">Módulo Operativo</p>
        </div>
      </div>

      <div className="p-4 bg-slate-900/50 border-b border-slate-800">
          <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Sucursal Activa</p>
          <p className="text-xs font-bold text-white uppercase truncate">{currentCompany?.name}</p>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 space-y-1">
        <div className="px-6 py-2 text-[10px] font-bold text-slate-700 uppercase tracking-widest">Catálogo & Stock</div>
        <NavItem to="/parts/search" icon={Search} label="Buscador de Piezas" />
        <NavItem to="/parts/stock" icon={Package} label="Control Inventario" />
        <NavItem to="/parts/transfer" icon={ArrowRightLeft} label="Transferencias" />
        
        <div className="px-6 py-2 text-[10px] font-bold text-slate-700 uppercase tracking-widest mt-6">Comercial</div>
        <NavItem to="/parts/sales" icon={ShoppingCart} label="Nueva Venta" />
        
        <div className="px-6 py-2 text-[10px] font-bold text-slate-700 uppercase tracking-widest mt-6">Administración</div>
        <NavItem to="/parts/audit" icon={ShieldAlert} label="Auditoría" />
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all group border border-red-600/20 hover:border-red-600"
        >
          <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};
