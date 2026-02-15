import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { grey } from '@mui/material/colors';
import { selectCartItems, selectCartSubtotal, clearCart } from '../index';
import { PaymentMethodSelector } from '../../../components/payment/PaymentMethodSelector';
import { PaymentButton } from '../../../components/payment/PaymentButton';
import { PaymentSuccessDialog } from '../../../components/payment/PaymentSuccessDialog';
import { PaymentFailureDialog } from '../../../components/payment/PaymentFailureDialog';

const currencyFormat = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const DEFAULT_PAYMENT_METHOD = 'upi';

/**
 * Right-side order summary panel: totals, payment method selector, Make Payment button.
 * Handles Razorpay flow, success/failure dialogs, clearCart on success, redirect to order-success.
 */
export function OrderSummary() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);

  const [paymentMethod, setPaymentMethod] = useState(DEFAULT_PAYMENT_METHOD);
  const [successOpen, setSuccessOpen] = useState(false);
  const [failureOpen, setFailureOpen] = useState(false);
  const [failureMessage, setFailureMessage] = useState('');

  const hasItems = items != null && items.length > 0;

  const handlePaymentSuccess = useCallback(() => {
    dispatch(clearCart());
    setSuccessOpen(true);
  }, [dispatch]);

  const handlePaymentFailure = useCallback((message) => {
    setFailureMessage(message || 'Payment could not be completed.');
    setFailureOpen(true);
  }, []);

  const handleSuccessDialogClose = useCallback(() => {
    setSuccessOpen(false);
    navigate('/order-success', { replace: true });
  }, [navigate]);

  const handleFailureDialogClose = useCallback(() => {
    setFailureOpen(false);
    setFailureMessage('');
  }, []);

  return (
    <Box
      sx={{
        position: { md: 'sticky' },
        top: { md: 24 },
        p: 2.5,
        borderRadius: 2,
        border: '1px solid',
        borderColor: grey[200],
        bgcolor: 'background.paper',
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
      }}
    >
      <Typography variant="subtitle1" fontWeight={600} color="grey.900" gutterBottom>
        Order summary
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Subtotal
        </Typography>
        <Typography variant="body2" fontWeight={600}>
          {currencyFormat.format(subtotal)}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Tax
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Calculated at checkout
        </Typography>
      </Box>
      <Box
        sx={{
          borderTop: '1px solid',
          borderColor: grey[200],
          mt: 1,
          pt: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="subtitle1" fontWeight={700} color="grey.900">
          Total amount
        </Typography>
        <Typography variant="h6" fontWeight={700} color="primary.main">
          {currencyFormat.format(subtotal)}
        </Typography>
      </Box>

      <Box sx={{ mt: 2.5 }}>
        <PaymentMethodSelector
          value={paymentMethod}
          onChange={setPaymentMethod}
          disabled={!hasItems}
        />
      </Box>

      <Box sx={{ mt: 2 }}>
        <PaymentButton
          selectedMethodId={paymentMethod}
          disabled={!hasItems}
          onSuccess={handlePaymentSuccess}
          onFailure={handlePaymentFailure}
        />
      </Box>

      <PaymentSuccessDialog
        open={successOpen}
        onClose={handleSuccessDialogClose}
        onViewOrders={handleSuccessDialogClose}
      />
      <PaymentFailureDialog
        open={failureOpen}
        onClose={handleFailureDialogClose}
        message={failureMessage}
      />
    </Box>
  );
}

export default OrderSummary;
