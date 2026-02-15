import { axiosInstance } from '../../services/axiosInstance';

const OUTLETS = '/outlets';

/**
 * Outlet list with pagination and optional active filter.
 * @returns {Promise<{ content: [], page, size, totalElements, totalPages }>}
 */
export const fetchOutletsApi = (params = {}) => {
  const { page = 0, size = 20, isActive } = params;
  const query = new URLSearchParams({ page, size });
  if (isActive != null) query.set('isActive', isActive);
  return axiosInstance.get(`${OUTLETS}?${query}`).then((res) => res.data);
};

export const fetchOutletByIdApi = (id) =>
  axiosInstance.get(`${OUTLETS}/${id}`).then((res) => res.data);

export const createOutletApi = (body) =>
  axiosInstance.post(OUTLETS, body).then((res) => res.data);

export const updateOutletApi = (id, body) =>
  axiosInstance.put(`${OUTLETS}/${id}`, body).then((res) => res.data);

export const deleteOutletApi = (id) =>
  axiosInstance.delete(`${OUTLETS}/${id}`);

/**
 * Outlet products: GET list. Response shape: { success, data: [] } or array directly.
 */
export const fetchOutletProductsApi = (outletId) =>
  axiosInstance.get(`${OUTLETS}/${outletId}/products`).then((res) => {
    const d = res.data;
    return Array.isArray(d) ? d : (d?.data ?? []);
  });

/**
 * Outlet product by id. productId is UUID (string or object). Response shape: { success, data: {} }
 */
export const fetchOutletProductByIdApi = (outletId, productId) =>
  axiosInstance
    .get(`${OUTLETS}/${outletId}/products/${String(productId)}`)
    .then((res) => res.data?.data ?? res.data);

/**
 * Create or update one outlet product. Body: { productId, outletPrice?, isAvailable?, minimumOrderQuantity?, stockQuantity? }
 */
export const updateOutletProductsApi = (outletId, body) =>
  axiosInstance
    .put(`${OUTLETS}/${outletId}/products`, body)
    .then((res) => res.data?.data ?? res.data);

/**
 * Toggle availability. productId is UUID (string or object).
 */
export const toggleProductAvailabilityApi = (outletId, productId, available) =>
  axiosInstance.patch(
    `${OUTLETS}/${outletId}/products/${String(productId)}/available?available=${available}`
  );
