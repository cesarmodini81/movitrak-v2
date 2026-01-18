
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { CalendarPage } from './pages/Calendar';
import { PlanillaLogistica } from './pages/PlanillaLogistica';
import { Movements } from './pages/Movements';
import { ConfirmMovements } from './pages/ConfirmMovements';
import { CancelarMovimientos } from './pages/CancelarMovimientos';
import { HistoricalLogistica } from './pages/HistoricalLogistica';
import { ProgrammingPage } from './pages/Programming';
import { AuditLogs } from './pages/AuditLogs';
import { UsedReceptionPage } from './pages/UsedReception';
import { Layout } from './components/Layout';
import { Role } from './types';
import { StockPage } from './pages/StockPage';

// Parts Pages
import { PartsSearch } from './pages/parts/PartsSearch';
import { PartsStock } from './pages/parts/PartsStock';
import { PartsTransfer } from './pages/parts/PartsTransfer';
import { PartsSales } from './pages/parts/PartsSales';
import { PartsAudit } from './pages/parts/PartsAudit';

const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: Role[] }> = ({ children, allowedRoles }) => {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return <Layout>{children}</Layout>;
};

const AppRoutes: React.FC = () => {
  const { user } = useApp();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      
      {/* Alias para Repuestos */}
      <Route path="/repuestos" element={<ProtectedRoute allowedRoles={[Role.ADMIN, Role.OPERATOR, Role.SUPER_ADMIN, Role.PARTS_OPERATOR]}><Dashboard /></ProtectedRoute>} />
      
      <Route path="/used-reception" element={<ProtectedRoute allowedRoles={[Role.USED_OPERATOR, Role.ADMIN, Role.SUPER_ADMIN]}><UsedReceptionPage /></ProtectedRoute>} />
      <Route path="/programming" element={<ProtectedRoute allowedRoles={[Role.PROGRAMADOR, Role.ADMIN, Role.SUPER_ADMIN]}><ProgrammingPage /></ProtectedRoute>} />
      <Route path="/calendar" element={<ProtectedRoute allowedRoles={[Role.OPERATOR, Role.ADMIN, Role.SUPER_ADMIN, Role.PROGRAMADOR]}><CalendarPage /></ProtectedRoute>} />
      <Route path="/stock" element={<ProtectedRoute allowedRoles={[Role.OPERATOR, Role.ADMIN, Role.SUPER_ADMIN, Role.PROGRAMADOR]}><StockPage /></ProtectedRoute>} />
      
      {/* Planilla Logística Unificada */}
      <Route path="/planilla-logistica" element={<ProtectedRoute allowedRoles={[Role.OPERATOR, Role.ADMIN, Role.SUPER_ADMIN]}><PlanillaLogistica /></ProtectedRoute>} />
      
      {/* Histórica Logística */}
      <Route path="/historica-logistica" element={<ProtectedRoute allowedRoles={[Role.OPERATOR, Role.ADMIN, Role.SUPER_ADMIN]}><HistoricalLogistica /></ProtectedRoute>} />
      
      <Route path="/movements" element={<ProtectedRoute allowedRoles={[Role.OPERATOR, Role.ADMIN, Role.SUPER_ADMIN, Role.USED_OPERATOR]}><Movements /></ProtectedRoute>} />
      <Route path="/confirm-movements" element={<ProtectedRoute allowedRoles={[Role.OPERATOR, Role.ADMIN, Role.SUPER_ADMIN]}><ConfirmMovements /></ProtectedRoute>} />
      <Route path="/movements/cancelar" element={<ProtectedRoute allowedRoles={[Role.OPERATOR, Role.ADMIN, Role.SUPER_ADMIN]}><CancelarMovimientos /></ProtectedRoute>} />
      <Route path="/audit" element={<ProtectedRoute allowedRoles={[Role.ADMIN, Role.SUPER_ADMIN]}><AuditLogs /></ProtectedRoute>} />
      
      {/* Parts Module Routes */}
      <Route path="/parts/search" element={<ProtectedRoute allowedRoles={[Role.ADMIN, Role.OPERATOR, Role.SUPER_ADMIN, Role.PARTS_OPERATOR]}><PartsSearch /></ProtectedRoute>} />
      <Route path="/parts/stock" element={<ProtectedRoute allowedRoles={[Role.ADMIN, Role.OPERATOR, Role.SUPER_ADMIN, Role.PARTS_OPERATOR]}><PartsStock /></ProtectedRoute>} />
      <Route path="/parts/transfer" element={<ProtectedRoute allowedRoles={[Role.ADMIN, Role.OPERATOR, Role.SUPER_ADMIN, Role.PARTS_OPERATOR]}><PartsTransfer /></ProtectedRoute>} />
      <Route path="/parts/sales" element={<ProtectedRoute allowedRoles={[Role.ADMIN, Role.OPERATOR, Role.SUPER_ADMIN, Role.PARTS_OPERATOR]}><PartsSales /></ProtectedRoute>} />
      <Route path="/parts/audit" element={<ProtectedRoute allowedRoles={[Role.ADMIN, Role.OPERATOR, Role.SUPER_ADMIN, Role.PARTS_OPERATOR]}><PartsAudit /></ProtectedRoute>} />
    </Routes>
  );
}

const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AppProvider>
  );
};

export default App;
