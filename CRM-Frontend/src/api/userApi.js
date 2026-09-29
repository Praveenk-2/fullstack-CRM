import api from './axios';

export const userApi = {
  getUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },
};
