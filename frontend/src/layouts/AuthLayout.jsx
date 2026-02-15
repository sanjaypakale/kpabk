import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';

/**
 * Layout for auth-related pages (login, etc.). Minimal wrapper; full-screen centering
 * is handled by the login page. Outlet renders child route (e.g. LoginPage).
 */
export function AuthLayout() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <Outlet />
    </Box>
  );
}

export default AuthLayout;
