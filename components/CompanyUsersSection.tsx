
import React, { useState } from 'react';
import { Company, User, Role } from '../types';
import { useApp } from '../context/AppContext';
import { X, UserPlus, Shield, Edit2, Check, User as UserIcon, Mail } from 'lucide-react';

interface Props {
  company: Company;
  onClose: () => void;
}

export const CompanyUsersSection: React.FC<Props> = ({ company, onClose }) => {
  const { allUsers, addNewUser, updateUserRole } = useApp();
  const [isAddMode, setIsAddMode] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  
  // Local state for forms
  const [newUser, setNewUser] = useState({ name: '', username: '', role: Role.OPERATOR as Role });
  const [editRole, setEditRole] = useState<Role>(Role.OPERATOR);

  const companyUsers = allUsers.filter(u => u.companyId === company.id);

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.username) return;

    const u: User = {
      id: `u_${Date.now()}`,
      name: newUser.name,
      username: newUser.username,
      role: newUser.role,
      companyId: company.id,
      email: `${newUser.username}@${company.name.toLowerCase().replace(/\s/g, '')}.com`
    };

    addNewUser(u);
    setNewUser({ name: '', username: '', role: Role.OPERATOR });
    setIsAddMode(false);
    
    // Toast simulation
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-8 right-8 bg-slate-900 text-white px-6 py-4 rounded-xl shadow-2xl z-[200] animate-in slide-in-from-bottom duration-300 flex items-center gap-3';
    toast.innerHTML = '<span>Usuario creado exitosamente con clave: <b>1234</b></span>';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const handleUpdateRole = (userId: string) => {
    updateUserRole(userId, editRole);
    setEditingUserId(null);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-[2rem] shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="bg-slate-900 p-8 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">Gestión de Usuarios</h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Empresa: {company.name}</p>
          </div>
          <button onClick={onClose} className="bg-white/10 hover:bg-white/20 p-2 rounded-xl text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
          
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
              <UserIcon size={16} /> Nómina de Personal
            </h3>
            <button 
              onClick={() => setIsAddMode(true)}
              className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg flex items-center gap-2 transition-all active:scale-95"
            >
              <UserPlus size={16} /> Crear Usuario
            </button>
          </div>

          {/* Add User Form */}
          {isAddMode && (
            <div className="mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 animate-in slide-in-from-top-4">
              <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Nombre Completo</label>
                  <input required type="text" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:border-brand-500" placeholder="Ej: Juan Pérez" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Usuario (Login)</label>
                  <input required type="text" value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:border-brand-500" placeholder="Ej: jperez" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Rol / Permisos</label>
                  <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value as Role})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:border-brand-500">
                    <option value={Role.ADMIN}>ADMIN (Gerencia)</option>
                    <option value={Role.OPERATOR}>OPERATOR (Logística)</option>
                    <option value={Role.PROGRAMADOR}>PROGRAMADOR (0KM)</option>
                    <option value={Role.USED_OPERATOR}>USED_OPERATOR (Usados)</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 rounded-xl font-bold text-xs uppercase shadow-md transition-colors">Guardar</button>
                  <button type="button" onClick={() => setIsAddMode(false)} className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold text-xs uppercase transition-colors">Cancelar</button>
                </div>
              </form>
            </div>
          )}

          {/* Users Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                <tr>
                  <th className="p-4">Usuario</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Rol Asignado</th>
                  <th className="p-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {companyUsers.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="p-4">
                      <div className="font-bold text-slate-900 text-sm">{u.name}</div>
                      <div className="text-xs text-slate-400 font-mono">@{u.username}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                        <Mail size={12} /> {u.email}
                      </div>
                    </td>
                    <td className="p-4">
                      {editingUserId === u.id ? (
                        <select 
                          value={editRole} 
                          onChange={(e) => setEditRole(e.target.value as Role)} 
                          className="bg-white border-2 border-brand-500 rounded-lg px-2 py-1 text-xs font-bold outline-none"
                          autoFocus
                        >
                          <option value={Role.ADMIN}>ADMIN</option>
                          <option value={Role.OPERATOR}>OPERATOR</option>
                          <option value={Role.PROGRAMADOR}>PROGRAMADOR</option>
                          <option value={Role.USED_OPERATOR}>USED OP</option>
                        </select>
                      ) : (
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wide border ${
                          u.role === Role.ADMIN ? 'bg-purple-50 text-purple-700 border-purple-100' :
                          u.role === Role.OPERATOR ? 'bg-blue-50 text-blue-700 border-blue-100' :
                          u.role === Role.PROGRAMADOR ? 'bg-amber-50 text-amber-700 border-amber-100' :
                          'bg-emerald-50 text-emerald-700 border-emerald-100'
                        }`}>
                          <Shield size={10} /> {u.role}
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {editingUserId === u.id ? (
                        <div className="flex justify-center gap-2">
                          <button onClick={() => handleUpdateRole(u.id)} className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"><Check size={14} /></button>
                          <button onClick={() => setEditingUserId(null)} className="p-2 bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300 transition-colors"><X size={14} /></button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => { setEditingUserId(u.id); setEditRole(u.role); }}
                          className="p-2 text-slate-300 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all"
                          title="Editar Permisos"
                        >
                          <Edit2 size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
