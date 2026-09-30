import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import WorkerRecognition from './components/WorkerRecognition';
import WorkerPerformance from './components/WorkerPerformance';
import Attendance from './components/Attendance';
import ProductionLine from './components/ProductionLine';
import JobSequencing from './components/JobSequencing';
import Inventory from './components/Inventory';
import QualityControl from './components/QualityControl';
import WasteTracking from './components/WasteTracking';
import MachineMaintenance from './components/MachineMaintenance';
import WorkerReporting from './components/WorkerReporting';
import AIInsights from './components/AIInsights';
import ReportsCompliance from './components/ReportsCompliance';
import Chats from './components/Chats';
import Settings from './components/Settings';

/* Worker Portal Components */
import WorkerDashboard from './components/WorkerDashboard';
import WorkerIncidentReport from './components/WorkerIncidentReport';
import WorkerPayment from './components/WorkerPayment';
import WorkerSettings from './components/WorkerSettings';

import './App.css';

const ROLE_PERMISSIONS = {
  admin: [
    '/dashboard',
    '/rewards',
    '/performance',
    '/attendance',
    '/safety',
    '/ai-insights',
    '/reports',
    '/chats',
  ],
  line_manager: [
    '/dashboard',
    '/rewards',
    '/performance',
    '/attendance',
    '/production',
    '/inventory',
  ],
  qc_inspector: [
    '/dashboard',
    '/quality-control',
    '/waste',
  ],
  maintenance_staff: [
    '/dashboard',
    '/machines',
  ],
  worker: [
    '/worker-dashboard',
    '/worker-reporting',
    '/worker-payment',
    '/worker-settings',
  ],
};

function App() {
  const isAuthenticated = () => {
    return localStorage.getItem('user') !== null;
  };

  const getUserRole = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return user?.role || 'admin';
    } catch (e) {
      return 'admin';
    }
  };

  const ProtectedRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/login" />;
  };

  const RoleRestrictedRoute = ({ children, allowedRoles }) => {
    if (!isAuthenticated()) {
      return <Navigate to="/login" />;
    }
    const role = getUserRole();
    if (allowedRoles.includes(role)) {
      return children;
    }
    const allowedPages = ROLE_PERMISSIONS[role] || ['/dashboard'];
    return <Navigate to={allowedPages[0]} />;
  };

  const getHomeRoute = () => {
    const role = getUserRole();
    const allowedPages = ROLE_PERMISSIONS[role] || ['/dashboard'];
    return allowedPages[0];
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* All management roles */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <RoleRestrictedRoute allowedRoles={['admin', 'line_manager', 'qc_inspector', 'maintenance_staff']}>
                <Dashboard />
              </RoleRestrictedRoute>
            </ProtectedRoute>
          }
        />

        {/* Admin + Line Manager */}
        <Route
          path="/rewards"
          element={
            <ProtectedRoute>
              <RoleRestrictedRoute allowedRoles={['admin', 'line_manager']}>
                <WorkerRecognition />
              </RoleRestrictedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/performance"
          element={
            <ProtectedRoute>
              <RoleRestrictedRoute allowedRoles={['admin', 'line_manager']}>
                <WorkerPerformance />
              </RoleRestrictedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/attendance"
          element={
            <ProtectedRoute>
              <RoleRestrictedRoute allowedRoles={['admin', 'line_manager']}>
                <Attendance />
              </RoleRestrictedRoute>
            </ProtectedRoute>
          }
        />

        {/* Line Manager only */}
        <Route
          path="/production"
          element={
            <ProtectedRoute>
              <RoleRestrictedRoute allowedRoles={['line_manager']}>
                <ProductionLine />
              </RoleRestrictedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventory"
          element={
            <ProtectedRoute>
              <RoleRestrictedRoute allowedRoles={['line_manager']}>
                <Inventory />
              </RoleRestrictedRoute>
            </ProtectedRoute>
          }
        />

        {/* QC Inspector only */}
        <Route
          path="/quality-control"
          element={
            <ProtectedRoute>
              <RoleRestrictedRoute allowedRoles={['qc_inspector']}>
                <QualityControl />
              </RoleRestrictedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/waste"
          element={
            <ProtectedRoute>
              <RoleRestrictedRoute allowedRoles={['qc_inspector']}>
                <WasteTracking />
              </RoleRestrictedRoute>
            </ProtectedRoute>
          }
        />

        {/* Maintenance Staff only */}
        <Route
          path="/machines"
          element={
            <ProtectedRoute>
              <RoleRestrictedRoute allowedRoles={['maintenance_staff']}>
                <MachineMaintenance />
              </RoleRestrictedRoute>
            </ProtectedRoute>
          }
        />

        {/* Admin only */}
        <Route
          path="/safety"
          element={
            <ProtectedRoute>
              <RoleRestrictedRoute allowedRoles={['admin']}>
                <WorkerReporting />
              </RoleRestrictedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai-insights"
          element={
            <ProtectedRoute>
              <RoleRestrictedRoute allowedRoles={['admin']}>
                <AIInsights />
              </RoleRestrictedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <RoleRestrictedRoute allowedRoles={['admin']}>
                <ReportsCompliance />
              </RoleRestrictedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/chats"
          element={
            <ProtectedRoute>
              <RoleRestrictedRoute allowedRoles={['admin']}>
                <Chats />
              </RoleRestrictedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <RoleRestrictedRoute allowedRoles={['admin']}>
                <Settings />
              </RoleRestrictedRoute>
            </ProtectedRoute>
          }
        />

        {/* Worker Portal Routes */}
        <Route
          path="/worker-dashboard"
          element={
            <ProtectedRoute>
              <RoleRestrictedRoute allowedRoles={['worker']}>
                <WorkerDashboard />
              </RoleRestrictedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/worker-reporting"
          element={
            <ProtectedRoute>
              <RoleRestrictedRoute allowedRoles={['worker']}>
                <WorkerIncidentReport />
              </RoleRestrictedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/worker-payment"
          element={
            <ProtectedRoute>
              <RoleRestrictedRoute allowedRoles={['worker']}>
                <WorkerPayment />
              </RoleRestrictedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/worker-settings"
          element={
            <ProtectedRoute>
              <RoleRestrictedRoute allowedRoles={['worker']}>
                <WorkerSettings />
              </RoleRestrictedRoute>
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={getHomeRoute()} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
