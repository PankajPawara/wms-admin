import api from './axios';

export const getOrders = async () => {
  return await api.get('/orders');
};

export const getOrderById = async (id) => {
  return await api.get(`/orders/${id}`);
};
