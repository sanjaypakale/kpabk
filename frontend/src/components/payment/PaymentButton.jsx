import { useState } from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { createOrder, verifyPayment } from '../../features/payment/paymentApi';
import { useRazorpayCheckout } from '../../features/payment/useRazorpayCheckout';
import { PAYMENT_METHODS } from './PaymentMethodSelector';

/**
 * "Make Payment" button: creates order, opens Razorpay, verifies on success.
 * onSuccess: () => void - called after verify success (parent clears cart and redirects).
 * onFailure: (message: string) => void - called on create-order error, Razorpay failure, or verify failure.
 */
export function PaymentButton({ selectedMethodId, disabled, onSuccess, onFailure }) {
  const [loading, setLoading] = useState(false);
  const { openCheckout, isRazorpayLoading, razorpayError } = useRazorpayCheckout();

  const razorpayMethod = PAYMENT_METHODS.find((m) => m.id === selectedMethodId)?.razorpayMethod;

  const handleClick = async () => {
    if (loading || disabled) return;
    setLoading(true);
    try {
      const orderDetails = await createOrder();
      openCheckout(
        orderDetails,
        razorpayMethod,
        async (response) => {
          try {
            const result = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            if (result.success) {
              onSuccess?.();
            } else {
              onFailure?.(result.message || 'Verification failed');
            }
          } catch (err) {
            onFailure?.(err.response?.data?.message || err.message || 'Verification failed');
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          setLoading(false);
          const msg = error?.description || error?.message || 'Payment was not completed';
          onFailure?.(msg);
        }
      );
    } catch (err) {
      setLoading(false);
      onFailure?.(err.response?.data?.message || err.message || 'Could not create order');
    }
  };

  const isDisabled = disabled || loading || isRazorpayLoading;

  return (
    <Button
      variant="contained"
      fullWidth
      size="large"
      disabled={isDisabled}
      onClick={handleClick}
      startIcon={
        loading || isRazorpayLoading ? (
          <CircularProgress size={20} color="inherit" sx={{ color: 'white' }} />
        ) : null
      }
      sx={{
        py: 1.5,
        fontWeight: 600,
        boxShadow: 2,
        '&:hover': { boxShadow: 3 },
        '&.Mui-disabled': { color: 'rgba(255,255,255,0.8)' },
      }}
    >
      {loading || isRazorpayLoading ? 'Opening…' : 'Make payment'}
    </Button>
  );
}

export default PaymentButton;
