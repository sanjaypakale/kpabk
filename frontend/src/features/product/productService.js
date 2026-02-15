import { axiosInstance } from '../../services/axiosInstance';

const PRODUCTS = '/products';
const CATEGORIES = '/categories';

/**
 * Fetch paginated products with optional filters.
 * @param {Object} params - { page, size, sortBy, sortDir, categoryId, productType, unit, minPrice, maxPrice }
 * @returns {Promise<{ content, page, size, totalElements, totalPages, first, last }>}
 */
export async function fetchProductsApi(params = {}) {
  const {
    page = 0,
    size = 20,
    sortBy = 'name',
    sortDir = 'asc',
    name,
    categoryId,
    productType,
    unit,
    minPrice,
    maxPrice,
    isActive = true,
  } = params;
  const search = new URLSearchParams();
  search.set('page', page);
  search.set('size', size);
  if (sortBy) search.set('sortBy', sortBy);
  if (sortDir) search.set('sortDir', sortDir);
  if (name != null && String(name).trim() !== '') search.set('name', String(name).trim());
  if (categoryId) search.set('categoryId', categoryId);
  if (productType) search.set('productType', productType);
  if (unit) search.set('unit', unit);
  if (minPrice != null && minPrice !== '') search.set('minPrice', minPrice);
  if (maxPrice != null && maxPrice !== '') search.set('maxPrice', maxPrice);
  if (isActive !== undefined) search.set('isActive', isActive);

  const { data } = await axiosInstance.get(`${PRODUCTS}?${search.toString()}`);
  return data?.data ?? data;
}

/**
 * Fetch all categories for filters (active only).
 * @returns {Promise<Array<{ id, name, description, isActive }>>}
 */
export async function fetchCategoriesApi() {
  const { data } = await axiosInstance.get(`${CATEGORIES}?activeOnly=true`);
  const list = data?.data ?? data;
  return Array.isArray(list) ? list : [];
}
