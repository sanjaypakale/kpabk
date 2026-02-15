import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme/theme';
import { AppRoutes } from './routes/AppRoutes';
import { useDispatch } from 'react-redux';
import { logoutUser, fetchCurrentUser } from './features/auth';
import { getStoredToken } from './services/axiosInstance';
import { GlobalLoading } from './components/GlobalLoading';

/**
 * Root app component. Theme and routing are set up here.
 * Restores session from token on load; listens for auth:logout (axios 401).
 */
function AppContent() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = getStoredToken();
    if (token) dispatch(fetchCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    const handleLogout = () => dispatch(logoutUser());
    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalLoading />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}

function App() {
  return <AppContent />;
}

export default App;
