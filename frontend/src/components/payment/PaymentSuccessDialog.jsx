import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';

/**
 * Shown after successful payment verification. Single action: go to orders/success.
 */
export function PaymentSuccessDialog({ open, onClose, onViewOrders }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CheckCircleOutline color="success" sx={{ fontSize: 32 }} />
          <span>Payment successful</span>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary">
          Your order has been placed. Thank you for your purchase.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button variant="contained" onClick={onViewOrders} fullWidth>
          View orders
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PaymentSuccessDialog;
