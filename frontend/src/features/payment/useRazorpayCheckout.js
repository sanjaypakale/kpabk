import { useCallback } from 'react';
import { useRazorpay } from 'react-razorpay';

/**
 * Razorpay method values supported by the gateway.
 * @type {('upi' | 'card' | 'netbanking' | 'wallet')}
 */
const RAZORPAY_METHODS = ['upi', 'card', 'netbanking', 'wallet'];

/**
 * Opens Razorpay checkout with server order details and optional payment method.
 * @param {Object} orderDetails - From create-order API: { orderId, amount, currency, key, customerName, customerEmail, customerPhone }
 * @param {string} [method] - 'upi' | 'card' | 'netbanking' | 'wallet'
 * @param {(response: { razorpay_payment_id: string, razorpay_order_id: string, razorpay_signature: string }) => void} onSuccess
 * @param {(error?: unknown) => void} onFailure
 */
export function useRazorpayCheckout() {
  const { Razorpay, isLoading: isRazorpayLoading, error: razorpayError } = useRazorpay();

  const openCheckout = useCallback(
    (orderDetails, method, onSuccess, onFailure) => {
      if (!Razorpay || !orderDetails?.orderId || orderDetails.amount == null || !orderDetails.key) {
        onFailure?.(new Error('Razorpay or order details not ready'));
        return;
      }

      const options = {
        key: orderDetails.key,
        amount: Number(orderDetails.amount),
        currency: orderDetails.currency || 'INR',
        name: orderDetails.name || 'KPABK Connect',
        order_id: orderDetails.orderId,
        prefill: {
          name: orderDetails.customerName || '',
          email: orderDetails.customerEmail || '',
          contact: orderDetails.customerPhone || '',
        },
        handler: (response) => {
          onSuccess({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          });
        },
      };

      if (method && RAZORPAY_METHODS.includes(method)) {
        options.method = method;
      }

      options.modal = {
        ondismiss: () => {
          onFailure?.(new Error('Payment cancelled'));
        },
      };

      try {
        const instance = new Razorpay(options);
        instance.on('payment.failed', (response) => {
          onFailure?.(response?.error ?? new Error('Payment failed'));
        });
        instance.open();
      } catch (err) {
        onFailure?.(err);
      }
    },
    [Razorpay]
  );

  return {
    openCheckout,
    isRazorpayLoading,
    razorpayError,
  };
}
