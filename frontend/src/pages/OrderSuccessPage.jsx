import { Link } from 'react-router-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';

/**
 * Thank-you page shown after successful payment. Cart has been cleared.
 */
export default function OrderSuccessPage() {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          py: 8,
          px: 2,
          textAlign: 'center',
        }}
      >
        <CheckCircleOutline
          sx={{ fontSize: 80, color: 'success.main', mb: 2 }}
          aria-hidden
        />
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Order placed successfully
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Thank you for your purchase. You will receive order details shortly.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button component={Link} to="/orders" variant="contained" size="large">
            View orders
          </Button>
          <Button component={Link} to="/products" variant="outlined" size="large">
            Continue shopping
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
