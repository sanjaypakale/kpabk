import { axiosInstance } from '../../services/axiosInstance';

const PAYMENT = '/payment';

/**
 * Unwrap API response. Backend may return { data, message }.
 */
function unwrap(responseData) {
  const d = responseData?.data ?? responseData;
  return d ?? null;
}

/**
 * Create a Razorpay order. Backend returns order details for checkout.
 * @returns {Promise<{ orderId: string, amount: number, currency: string, key: string, customerName: string, customerEmail: string, customerPhone: string }>}
 */
export async function createOrder() {
  const { data } = await axiosInstance.post(`${PAYMENT}/create-order`);
  const result = unwrap(data);
  if (!result?.orderId || result.amount == null) {
    throw new Error(result?.message || 'Invalid create-order response');
  }
  return result;
}

/**
 * Verify payment after Razorpay success.
 * @param {{ razorpay_order_id: string, razorpay_payment_id: string, razorpay_signature: string }} payload
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export async function verifyPayment(payload) {
  const { data } = await axiosInstance.post(`${PAYMENT}/verify`, payload);
  const result = unwrap(data) ?? data;
  return {
    success: Boolean(result?.success),
    message: result?.message ?? (result?.success ? 'Payment verified' : 'Verification failed'),
  };
}
