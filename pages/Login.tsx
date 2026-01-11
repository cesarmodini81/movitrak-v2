import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Lock, User, AlertCircle, ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { DoubleAuthModal } from '../components/DoubleAuthModal';

export const Login: React.FC = () => {
  const { login } = useApp();
  // Pre-filled as requested
  const [username, setUsername] = useState('operador');
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

    // Simulation delay for UX
    await new Promise(resolve => setTimeout(resolve, 600));

    // Hardcoded password check for mock environment
    if (password !== '1234') {
      setError('Credenciales inválidas. (Tip: contraseña es 1234)');
      setIsLoggingIn(false);
      return;
    }

    // 2FA Interception for Super Admin
    if (username === 'superadmin') {
      setIs2FAModalOpen(true);
      setIsLoggingIn(false);
      return;
    } 

    // Regular Login Flow
    const success = await login(username, password);
    if (!success) {
      setError('Usuario no encontrado o sin acceso.');
      setIsLoggingIn(false);
    }
  };

  const handleVerify2FA = async (code: string) => {
    setAuthError('');
    // Mock 2FA Validation
    if (code === '123456') {
      const success = await login(username, password);
      if (success) {
        setIs2FAModalOpen(false);
      } else {
        setAuthError('Error de sistema al iniciar sesión.');
      }
    } else {
      setAuthError('Código de verificación incorrecto.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center justify-center p-6 font-sans">
      
      {/* Main Card */}
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md p-10 flex flex-col relative z-10 animate-in zoom-in-95 duration-300 border-2 border-orange-500">
        
        {/* Logo Section */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="p-1.5 bg-orange-500 rounded-lg shadow-sm">
              <MapPin className="text-white" size={24} strokeWidth={3} />
            </div>
            <h1 className="text-slate-900 text-3xl font-black tracking-tighter">MOVITRAK</h1>
          </div>
          <p className="text-slate-500 text-[10px] font-bold tracking-[0.2em] uppercase">Moviéndonos hacia el futuro</p>
        </div>

        <div className="mb-8 text-center">
          <h2 className="text-slate-900 text-4xl font-bold tracking-tight mb-1">BIENVENIDO</h2>
          <p className="text-slate-600 text-lg font-medium">GESTIÓN LOGÍSTICA SEGURA</p>
        </div>
        
        <form onSubmit={handleInitialSubmit} className="space-y-6">
          {/* User Input */}
          <div className="space-y-1.5">
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors">
                <User size={20} />
              </div>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-slate-400 outline-none transition-all font-bold text-slate-800 text-base placeholder:text-slate-300"
                placeholder="Usuario"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors">
                <Lock size={20} />
              </div>
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-slate-400 outline-none transition-all font-bold text-slate-800 text-base placeholder:text-slate-300"
                placeholder="Contraseña"
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Extra Options */}
          <div className="flex items-center justify-between px-1">
            <label className="flex items-center gap-2 cursor-pointer group select-none">
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-900 focus:ring-blue-900"
              />
              <span className="text-slate-700 font-bold text-xs">Recordarme en este equipo</span>
            </label>
            <a href="#" className="text-xs font-bold text-orange-600 underline hover:text-orange-700">
              ¿Olvidó su contraseña?
            </a>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-3 text-red-600 animate-in shake duration-300">
              <AlertCircle size={18} className="shrink-0" />
              <p className="text-xs font-bold">{error}</p>
            </div>
          )}

          <div className="pt-2">
            <button 
              type="submit" 
              disabled={isLoggingIn}
              className="w-full bg-blue-900 text-white font-black py-4 px-8 rounded-xl shadow-lg hover:bg-blue-950 transition-all flex items-center justify-center gap-3 disabled:opacity-70 text-xl uppercase tracking-tight"
            >
              {isLoggingIn ? 'Autenticando...' : (
                <>
                  INGRESAR AL SISTEMA
                  <ArrowRight size={24} strokeWidth={3} />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Card Security Indicator */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-slate-300">
           <ShieldCheck size={14} />
           <p className="text-[10px] font-bold uppercase tracking-widest">Protección de Datos 256-bit</p>
        </div>
      </div>
      
      {/* Restored Footer Information */}
      <div className="mt-10 text-center space-y-2">
        <p className="text-slate-500 font-bold text-xs tracking-widest uppercase">© MOVITRAK LOGISTICS v2.8.0</p>
        <p className="text-slate-600 font-medium text-xs">cesarmodini@gmail.com</p>
      </div>

      {/* 2FA Modal */}
      <DoubleAuthModal 
        isOpen={is2FAModalOpen} 
        onVerify={handleVerify2FA} 
        onCancel={() => setIs2FAModalOpen(false)}
        error={authError}
      />
    </div>
  );
};
