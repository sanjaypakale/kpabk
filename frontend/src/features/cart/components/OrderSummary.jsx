import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useRazorpay } from 'react-razorpay';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { grey } from '@mui/material/colors';
import { selectCartItems, selectCartSubtotal } from '../index';
import { getStoredToken } from '../../../services/axiosInstance';
import { OutletSelector } from './OutletSelector';

const currencyFormat = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

/**
 * Order summary panel: totals, outlet selector, single "Place Order & Pay" button.
 * Opens official Razorpay Checkout popup (no custom payment method UI).
 */
export function OrderSummary() {
  const navigate = useNavigate();
  const { Razorpay } = useRazorpay();
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);

  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: /** @type {'success' | 'error' | 'info'} */ ('info'),
  });

  const hasItems = items != null && items.length > 0;
  const [selectedOutletIds, setSelectedOutletIds] = useState([]);

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = (_, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handlePlaceOrderAndPay = async () => {
    if (loading || !hasItems) return;

    if (!selectedOutletIds.length) {
      showSnackbar('Please select at least one outlet before placing the order.', 'error');
      //return;
    }

    const token = getStoredToken();
    if (!token) {
      showSnackbar('Session expired. Please log in again.', 'error');
      window.dispatchEvent(new CustomEvent('auth:logout'));
      navigate('/login', { replace: true });
      return;
    }

    setLoading(true);

    const authConfig = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      // Step 1: Create order from cart
      // Backend expects CreateOrderRequest { outletId, customerId?, items[] }
      // For now, create one order per selected outlet.
      // If multiple outlets are selected, create the first order and ignore the rest (can be extended).
      const outletId = 1;

      const orderPayload = {
        outletId,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity ?? 1,
        })),
      };

      const orderRes = await axios.post('/api/orders', orderPayload, authConfig);
      const orderData = orderRes.data?.data ?? orderRes.data;
      const orderId = orderData?.id;

      if (!orderId) {
        throw new Error('Order creation failed: missing order id');
      }

      // Step 2: Create payment for this order
      const paymentRes = await axios.post(`/api/payments/create/${orderId}`, null, authConfig);
      const paymentData = paymentRes.data?.data ?? paymentRes.data;

      const paymentId = paymentData?.paymentId;
      const razorpayOrderId = paymentData?.razorpayOrderId;
      const amount = paymentData?.amount;
      const currency = paymentData?.currency || 'INR';
      const keyFromApi = paymentData?.razorpayKeyId ?? paymentData?.key;

      if (!paymentId || !razorpayOrderId || amount == null) {
        throw new Error('Payment creation failed: invalid response');
      }

      // For testing: when backend returns "test" (gateway not configured), use VITE_RAZORPAY_KEY so popup opens
      const key =
        keyFromApi && keyFromApi !== 'test'
          ? keyFromApi
          : import.meta.env.VITE_RAZORPAY_KEY || keyFromApi;

      if (!key || key === 'test') {
        setLoading(false);
        showSnackbar(
          'Add VITE_RAZORPAY_KEY=rzp_test_xxxx to .env to open Razorpay for testing.',
          'info'
        );
        return;
      }

      if (!Razorpay) {
        setLoading(false);
        showSnackbar('Payment service not ready. Please try again.', 'error');
        return;
      }

      // Step 3: Open official Razorpay Checkout popup (payment mode selection inside popup)
      const amountInPaise = Math.round(Number(amount) * 100);
      const options = {
        key,
        amount: amountInPaise,
        currency,
        name: 'KPABK Connect',
        description: 'Order Payment',
        order_id: razorpayOrderId,
        handler: async (response) => {
          try {
            await axios.patch(
              `/api/orders/${orderId}/status`,
              { status: 'PAID' },
              authConfig
            );
            showSnackbar('Payment Successful', 'success');
            setLoading(false);
            navigate('/my-orders', { replace: true });
          } catch (err) {
            setLoading(false);
            if (err.response?.status === 401) {
              window.dispatchEvent(new CustomEvent('auth:logout'));
              navigate('/login', { replace: true });
              return;
            }
            showSnackbar('Payment verification failed', 'error');
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            showSnackbar('Payment cancelled', 'info');
          },
        },
        theme: {
          color: '#1976d2',
        },
      };

      try {
        const rzpay = new Razorpay(options);
        rzpay.on('payment.failed', () => {
          setLoading(false);
          showSnackbar('Payment failed', 'error');
        });
        rzpay.open();
      } catch (err) {
        setLoading(false);
        showSnackbar('Unable to open payment window', 'error');
      }
    } catch (err) {
      setLoading(false);
      if (err.response?.status === 401) {
        window.dispatchEvent(new CustomEvent('auth:logout'));
        navigate('/login', { replace: true });
        return;
      }
      const msg =
        err.response?.data?.message ||
        err.message ||
        'An error occurred while starting payment';
      // Distinguish between order and payment creation failures using HTTP status if needed
      if (err.config?.url?.includes('/api/orders')) {
        showSnackbar('Order creation failed', 'error');
      } else if (err.config?.url?.includes('/api/payments/create')) {
        showSnackbar('Payment creation failed', 'error');
      } else {
        showSnackbar(msg, 'error');
      }
    }
  };

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
      <OutletSelector value={selectedOutletIds} onChange={setSelectedOutletIds} disabled={loading} />
      <Box sx={{ mt: 2 }}>
        <Button
          variant="contained"
          fullWidth
          size="large"
          disabled={!hasItems || loading}
          onClick={handlePlaceOrderAndPay}
          startIcon={
            loading ? <CircularProgress size={20} color="inherit" sx={{ color: 'white' }} /> : null
          }
          sx={{
            py: 1.5,
            fontWeight: 600,
            boxShadow: 2,
            '&:hover': { boxShadow: 3 },
            '&.Mui-disabled': { color: 'rgba(255,255,255,0.8)' },
          }}
        >
          {loading ? 'Processing…' : 'Place Order & Pay'}
        </Button>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default OrderSummary;
