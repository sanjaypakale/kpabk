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
import { UserListPage, CreateUserPage, UserDetailsPage, EditUserPage } from '../features/user';
import { ProductListPage } from '../features/product';
import DashboardPage from '../pages/DashboardPage';
import CartPage from '../features/cart/pages/CartPage';
import OrdersPage from '../pages/OrdersPage';
import OrderSuccessPage from '../pages/OrderSuccessPage';
import PaymentsPage from '../pages/PaymentsPage';

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
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/payments" element={<PaymentsPage />} />
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin/outlets" element={<OutletListPage />} />
            <Route path="/admin/outlets/new" element={<CreateOutletPage />} />
            <Route path="/admin/outlets/:id" element={<OutletDetailsPage />} />
            <Route path="/admin/outlets/:id/edit" element={<EditOutletPage />} />
            <Route path="/admin/outlets/:id/products" element={<OutletProductsPage />} />
            <Route path="/admin/users" element={<UserListPage />} />
            <Route path="/admin/users/new" element={<CreateUserPage />} />
            <Route path="/admin/users/:id" element={<UserDetailsPage />} />
            <Route path="/admin/users/:id/edit" element={<EditUserPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRoutes;
