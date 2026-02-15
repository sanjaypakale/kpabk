import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, NavLink, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import Dashboard from '@mui/icons-material/Dashboard';
import Storefront from '@mui/icons-material/Storefront';
import Inventory from '@mui/icons-material/Inventory';
import ShoppingCart from '@mui/icons-material/ShoppingCart';
import ShoppingCartOutlined from '@mui/icons-material/ShoppingCartOutlined';
import Payment from '@mui/icons-material/Payment';
import Person from '@mui/icons-material/Person';
import People from '@mui/icons-material/People';
import Logout from '@mui/icons-material/Logout';
import { logoutUser } from '../features/auth/authSlice';
import { getDisplayName, getInitials } from '../utils/authUtils';

const navLinkSx = {
  color: 'inherit',
  textDecoration: 'none',
  '&.active': {
    fontWeight: 600,
    borderBottom: '2px solid',
    borderColor: 'primary.contrastText',
    borderRadius: 0,
  },
};

const adminNavItems = [
  { label: 'Dashboard', to: '/dashboard', icon: Dashboard },
  { label: 'Outlets', to: '/admin/outlets', icon: Storefront },
  { label: 'Users', to: '/admin/users', icon: People },
  { label: 'Products', to: '/admin/products', icon: Inventory },
  { label: 'Orders', to: '/admin/orders', icon: ShoppingCart },
  { label: 'Payments', to: '/admin/payments', icon: Payment },
];

const outletNavItems = [
  { label: 'Dashboard', to: '/dashboard', icon: Dashboard },
  { label: 'Products', to: '/products', icon: Inventory },
  { label: 'Orders', to: '/orders', icon: ShoppingCart },
  { label: 'Payments', to: '/payments', icon: Payment },
];

const PRODUCTS_PATHS = ['/admin/products', '/products'];

/**
 * Shared layout with top AppBar (logo, nav links, profile menu). Renders <Outlet /> for page content.
 * Used for /dashboard and /admin/* routes.
 */
export function DashboardLayout() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { user } = useSelector((state) => state.auth);
  const role = typeof user?.role === 'string' ? user?.role : user?.role;
  const isAdmin = role?.toUpperCase() === 'ADMIN';
  const navItems = isAdmin ? adminNavItems : outletNavItems;

  const displayName = getDisplayName(user);
  const initials = getInitials(displayName);

  const isProductsPage = PRODUCTS_PATHS.some(
    (path) => location.pathname === path || location.pathname.startsWith(`${path}/`)
  );

  const [profileAnchor, setProfileAnchor] = useState(null);
  const [mobileNavAnchor, setMobileNavAnchor] = useState(null);

  const handleProfileOpen = (e) => setProfileAnchor(e.currentTarget);
  const handleProfileClose = () => setProfileAnchor(null);
  const handleMobileNavOpen = (e) => setMobileNavAnchor(e.currentTarget);
  const handleMobileNavClose = () => setMobileNavAnchor(null);

  const handleLogout = () => {
    handleProfileClose();
    dispatch(logoutUser());
    navigate('/login', { replace: true });
  };

  const handleProfileClick = () => {
    handleProfileClose();
  };

  const handleMobileNavClick = (to) => {
    navigate(to);
    handleMobileNavClose();
  };

  const handleCartClick = () => {
    navigate(isAdmin ? '/admin/cart' : '/cart');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
        <Toolbar disableGutters sx={{ px: { xs: 1.5, sm: 2 }, py: 0, minHeight: { xs: 56, md: 64 } }}>
          <Box
            component={RouterLink}
            to="/dashboard"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              color: 'inherit',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '1.125rem',
              mr: { xs: 1, md: 3 },
            }}
          >
            <Box
              component="img"
              src="/kpabk_logo.png"
              alt="KPABK Connect"
              sx={{ height: 36, width: 'auto', display: 'block' }}
            />
            <Typography component="span" variant="h6" sx={{ fontWeight: 600 }}>
              KPABK Connect
            </Typography>
          </Box>

          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flex: 1 }}>
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.to}
                    component={NavLink}
                    to={item.to}
                    startIcon={<Icon fontSize="small" />}
                    sx={{
                      ...navLinkSx,
                      px: 2,
                      py: 1.5,
                      minWidth: 'auto',
                      '&.active': {
                        ...navLinkSx['&.active'],
                        opacity: 1,
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Box>
          )}

          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="Open menu"
              onClick={handleMobileNavOpen}
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, ml: 'auto' }}>
            {isProductsPage && (
              <Tooltip title="Cart" arrow placement="bottom">
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<ShoppingCartOutlined sx={{ fontSize: '1.2rem' }} />}
                  onClick={handleCartClick}
                  aria-label="Open cart"
                  sx={{
                    minWidth: { xs: 40, sm: 'auto' },
                    px: { xs: 1, sm: 1.5 },
                    py: 0.75,
                    borderColor: 'primary.contrastText',
                    color: 'primary.contrastText',
                    '& .MuiButton-startIcon': { mr: { xs: 0, sm: 0.75 } },
                    '&:hover': {
                      borderColor: 'primary.contrastText',
                      bgcolor: 'rgba(255, 255, 255, 0.08)',
                    },
                  }}
                >
                  <Typography
                    component="span"
                    variant="body2"
                    fontWeight={600}
                    sx={{ display: { xs: 'none', sm: 'inline' } }}
                  >
                    Cart
                  </Typography>
                </Button>
              </Tooltip>
            )}
            <Box component="span" sx={{ width: { xs: 12, sm: 24 } }} aria-hidden />
            <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' }, fontWeight: 500 }}>
              {displayName}
            </Typography>
            <IconButton
              onClick={handleProfileOpen}
              size="small"
              sx={{ p: 0.5 }}
              aria-label="Profile menu"
            >
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: 'primary.light',
                  fontSize: '0.875rem',
                }}
              >
                {initials}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={mobileNavAnchor}
        open={Boolean(mobileNavAnchor)}
        onClose={handleMobileNavClose}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        slotProps={{ paper: { sx: { minWidth: 200, mt: 1.5 } } }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <MenuItem key={item.to} onClick={() => handleMobileNavClick(item.to)}>
              <Icon fontSize="small" sx={{ mr: 1.5 }} />
              {item.label}
            </MenuItem>
          );
        })}
      </Menu>

      <Menu
        anchorEl={profileAnchor}
        open={Boolean(profileAnchor)}
        onClose={handleProfileClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{ paper: { sx: { minWidth: 180, mt: 1.5 } } }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle2" fontWeight={600}>
            {displayName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user?.email}
          </Typography>
        </Box>
        <Divider />
        <MenuItem onClick={handleProfileClick}>
          <Person fontSize="small" sx={{ mr: 1.5 }} />
          Profile
        </MenuItem>
        <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
          <Logout fontSize="small" sx={{ mr: 1.5 }} />
          Logout
        </MenuItem>
      </Menu>

      <Outlet />
    </Box>
  );
}

export default DashboardLayout;
