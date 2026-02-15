import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { LoginPage, ProtectedRoute } from '../features/auth';
import {
  OutletListPage,
  OutletDetailsPage,
  CreateOutletPage,
  EditOutletPage,
  OutletProductsPage,
} from '../features/outlet';
import DashboardPage from '../pages/DashboardPage';

/**
 * Application route configuration. Protected routes require authentication.
 * Dashboard and admin routes share the top AppBar via DashboardLayout.
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin/outlets" element={<OutletListPage />} />
            <Route path="/admin/outlets/new" element={<CreateOutletPage />} />
            <Route path="/admin/outlets/:id" element={<OutletDetailsPage />} />
            <Route path="/admin/outlets/:id/edit" element={<EditOutletPage />} />
            <Route path="/admin/outlets/:id/products" element={<OutletProductsPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRoutes;
