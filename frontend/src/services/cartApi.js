import { axiosInstance } from './axiosInstance';

const CART = '/cart';

/**
 * Unwrap API response. Backend returns { data, message } for success.
 */
function unwrap(data) {
  const value = data?.data ?? data;
  return Array.isArray(value) ? value : value ?? null;
}

/**
 * Fetch current user's cart items.
 * @returns {Promise<Array<{ id, userId, productId, productName, basePrice, productType, unit, quantity, addedAt, updatedAt }>>}
 */
export async function getCart() {
  const { data } = await axiosInstance.get(CART);
  const items = unwrap(data);
  return Array.isArray(items) ? items : [];
}

/**
 * Update cart item quantity. Backend may expose PUT /cart/update with { productId, quantity }.
 * If your backend uses a different contract (e.g. cartItemId), adjust accordingly.
 * @param {{ productId: string, quantity: number }} payload
 * @returns {Promise<unknown>}
 */
export async function updateCartItem(payload) {
  const { data } = await axiosInstance.put(`${CART}/update`, {
    productId: payload.productId,
    quantity: Math.max(1, Number(payload.quantity) || 1),
  });
  return unwrap(data) ?? payload;
}

/**
 * Remove item from cart. Uses backend DELETE /cart/items/{cartItemId}.
 * @param {number} cartItemId - Cart item id (from CartItemResponse.id)
 * @returns {Promise<void>}
 */
export async function deleteCartItem(cartItemId) {
  await axiosInstance.delete(`${CART}/items/${cartItemId}`);
}
