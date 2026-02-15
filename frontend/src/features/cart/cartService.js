import { axiosInstance } from '../../services/axiosInstance';

const CART = '/cart';

/**
 * Add a product to the current user's cart.
 * @param {{ productId: string, quantity?: number }} body
 * @returns {Promise<{ id, userId, productId, productName, basePrice, productType, unit, quantity, addedAt, updatedAt }>}
 */
export async function addToCartApi(body) {
  const { data } = await axiosInstance.post(`${CART}/add`, {
    productId: body.productId,
    quantity: body.quantity ?? 1,
  });
  return data?.data ?? data;
}

/**
 * Fetch the current user's cart items.
 * @returns {Promise<Array<{ id, userId, productId, productName, basePrice, productType, unit, quantity, addedAt, updatedAt }>>}
 */
export async function getCartApi() {
  const { data } = await axiosInstance.get(CART);
  const items = data?.data ?? data;
  return Array.isArray(items) ? items : [];
}
