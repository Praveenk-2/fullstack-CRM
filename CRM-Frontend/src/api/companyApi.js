import api from './axios';

export const companyApi = {
  getCompanies: async () => {
    const response = await api.get('/companies');
    return response.data;
  },
  getCompanyById: async (id) => {
    const response = await api.get(`/companies/${id}`);
    return response.data;
  },
  createCompany: async (companyData) => {
    const response = await api.post('/companies', companyData);
    return response.data;
  },
};
