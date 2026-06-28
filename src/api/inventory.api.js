import api from './axios';

export const getInventory = async ({ page = 1, limit = 50, search = '' }) => {
  const params = { page, limit };
  if (search) params.search = search;
  return await api.get('/inventory', { params });
};

export const getInventoryVersion = async () => {
  return await api.get('/inventory/version');
};

export const importInventory = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return await api.post('/inventory/import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
