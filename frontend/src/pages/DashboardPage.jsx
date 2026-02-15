import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import { getDisplayName } from '../utils/authUtils';

/**
 * Dashboard main content. Rendered inside DashboardLayout (AppBar is in layout).
 */
export function DashboardPage() {
  const { user } = useSelector((state) => state.auth);
  const role = typeof user?.role === 'string' ? user?.role : user?.role;
  const isAdmin = role?.toUpperCase() === 'ADMIN';
  const displayName = getDisplayName(user);

  return (
    <Container maxWidth="lg" sx={{ py: 3, px: { xs: 2, md: 3 } }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Welcome, {displayName}
        </Typography>
        <Chip
          label={role || 'User'}
          size="small"
          color={isAdmin ? 'primary' : 'secondary'}
          sx={{ fontWeight: 500 }}
        />
      </Box>

      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Dashboard Overview
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Welcome to KPABK Connect. Use the navigation above to access Outlets, Products, Orders, and Payments.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}

export default DashboardPage;
