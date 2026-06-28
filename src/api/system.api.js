import api from './axios';

export const getSystemInfo = async () => {
  return await api.get('/system/info');
};

export const getSystemHealth = async () => {
  return await api.get('/system/health');
};
