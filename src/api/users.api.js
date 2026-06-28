import api from './axios';

export const getUsers = async () => {
  return await api.get('/users');
};

export const createUser = async (userData) => {
  return await api.post('/users', userData);
};

export const updateUserStatus = async (id, status) => {
  return await api.patch(`/users/${id}/status`, { status });
};

export const updateUser = async (id, userData) => {
  return await api.put(`/users/${id}`, userData);
};
