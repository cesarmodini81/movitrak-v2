
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Lock, User, AlertCircle, ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { DoubleAuthModal } from '../components/DoubleAuthModal';
import { Role } from '../types';
import { useNavigate } from 'react-router-dom';

export const Login: React.FC = () => {
  const { login, allUsers } = useApp();
  const navigate = useNavigate();
  // Campos vacíos por defecto según requerimiento
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);

    await new Promise(resolve => setTimeout(resolve, 600));

    if (password !== '1234') {
      setError('Credenciales inválidas. Por favor intente de nuevo.');
      setIsLoggingIn(false);
      return;
    }

    const targetUser = allUsers.find(u => u.username === username);

    // 2FA EXCLUSIVAMENTE para SuperAdmin
    if (targetUser?.role === Role.SUPER_ADMIN) {
      setIs2FAModalOpen(true);
      setIsLoggingIn(false);
      return;
    } 

    // Login directo para otros roles (sin 2FA)
    const success = await login(username, password);
    if (success) {
      if (targetUser?.role === Role.PARTS_OPERATOR) {
        navigate('/repuestos');
      } else {
        navigate('/');
      }
    } else {
      setError('El usuario no existe o no tiene permisos de acceso.');
      setIsLoggingIn(false);
    }
  };

  const handleVerify2FA = async (code: string) => {
    setAuthError('');
    if (code === '123456') {
      const success = await login(username, password);
      if (success) {
        setIs2FAModalOpen(false);
        navigate('/');
      } else {
        setAuthError('Error de sistema al validar sesión.');
      }
    } else {
      setAuthError('Código de verificación incorrecto.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center justify-center p-6 font-sans">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md p-12 flex flex-col relative z-10 border-2 border-orange-500 animate-in zoom-in-95 duration-300">
        
        {/* Logo & Tagline */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-1">
            <MapPin className="text-orange-600" size={32} strokeWidth={2.5} />
            <h1 className="text-slate-900 text-4xl font-black tracking-tighter">MOVITRAK</h1>
          </div>
          <p className="text-slate-600 text-sm font-medium italic">Moviéndonos hacia el futuro</p>
        </div>

        {/* Bienvenida */}
        <div className="text-center mb-10">
          <h2 className="text-slate-900 text-4xl font-bold uppercase tracking-tight">BIENVENIDO</h2>
          <p className="text-slate-600 text-lg font-semibold mt-1">GESTIÓN LOGÍSTICA SEGURA</p>
        </div>

        <form onSubmit={handleInitialSubmit} className="space-y-6">
          <div className="space-y-1">
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-900 transition-colors">
                <User size={22} />
              </div>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-900 outline-none transition-all font-semibold text-slate-800"
                placeholder="Nombre de usuario"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-900 transition-colors">
                <Lock size={22} />
              </div>
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-900 outline-none transition-all font-semibold text-slate-800"
                placeholder="Contraseña"
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between px-1">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-blue-900 border-slate-300 rounded focus:ring-blue-900 cursor-pointer"
              />
              <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">Recordarme en este equipo</span>
            </label>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 p-3 rounded-xl flex items-center gap-3 text-red-600 animate-in shake">
              <AlertCircle size={18} className="shrink-0" />
              <p className="text-xs font-bold">{error}</p>
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoggingIn}
            className="w-full bg-blue-900 hover:bg-blue-950 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-3 disabled:opacity-70 text-xl active:scale-95"
          >
            {isLoggingIn ? 'AUTENTICANDO...' : 'INGRESAR AL SISTEMA →'}
          </button>
          
          <div className="text-center mt-4">
            <a href="#" className="text-orange-600 underline font-bold text-sm hover:text-orange-700 transition-colors">¿Olvidó su contraseña?</a>
          </div>
        </form>
      </div>
      
      <div className="mt-8 text-center space-y-1">
        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">© MOVITRAK LOGISTICS v2.8.0</p>
        <p className="text-slate-400 font-medium text-xs">cesarmodini@gmail.com</p>
      </div>

      <DoubleAuthModal 
        isOpen={is2FAModalOpen} 
        onVerify={handleVerify2FA} 
        onCancel={() => setIs2FAModalOpen(false)}
        error={authError}
      />
    </div>
  );
};
