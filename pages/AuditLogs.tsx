
import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const AuditLogs: React.FC = () => {
  const { auditLogs } = useApp();
  const { t } = useTranslation();

  return (
    // PADDING TOP AUMENTADO (pt-20 md:pt-24)
    <div className="space-y-6 pt-20 md:pt-24">
      <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
        <ShieldAlert className="text-brand-600" />
        {t('audit_logs')}
      </h2>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
            <tr>
              <th className="p-4">Timestamp</th>
              <th className="p-4">Usuario</th>
              <th className="p-4">Acción</th>
              <th className="p-4">Detalle</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {auditLogs.map(log => (
              <tr key={log.id} className="hover:bg-slate-50">
                <td className="p-4 font-mono text-slate-500 whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="p-4 font-bold text-slate-700">{log.username}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    log.severity === 'ERROR' ? 'bg-red-100 text-red-700' :
                    log.severity === 'WARNING' ? 'bg-orange-100 text-orange-700' :
                    'bg-blue-50 text-blue-700'
                  }`}>
                    {log.action}
                  </span>
                </td>
                <td className="p-4 text-slate-600">{log.details}</td>
              </tr>
            ))}
            {auditLogs.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-400">Sin registros de auditoría</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
