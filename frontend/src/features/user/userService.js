import { axiosInstance } from '../../services/axiosInstance';

const USERS = '/users';

/**
 * User list with pagination.
 * @returns {Promise<{ content: [], page, size, totalElements, totalPages }>}
 */
export const fetchUsersApi = (params = {}) => {
  const { page = 0, size = 20 } = params;
  const query = new URLSearchParams({ page, size });
  return axiosInstance.get(`${USERS}?${query}`).then((res) => res.data);
};

/**
 * User list by role with pagination.
 */
export const fetchUsersByRoleApi = (roleName, params = {}) => {
  const { page = 0, size = 20 } = params;
  const query = new URLSearchParams({ page, size });
  return axiosInstance
    .get(`${USERS}/by-role/${roleName}?${query}`)
    .then((res) => res.data);
};

export const fetchUserByIdApi = (id) =>
  axiosInstance.get(`${USERS}/${id}`).then((res) => res.data);

export const createUserApi = (body) =>
  axiosInstance.post(USERS, body).then((res) => res.data);

export const updateUserApi = (id, body) =>
  axiosInstance.put(`${USERS}/${id}`, body).then((res) => res.data);

export const setUserEnabledApi = (id, enabled) =>
  axiosInstance.patch(`${USERS}/${id}/enabled?enabled=${enabled}`);
