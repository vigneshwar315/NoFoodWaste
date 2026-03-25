import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('nfw_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('nfw_token');
      localStorage.removeItem('nfw_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth endpoints
export const authAPI = {
  login: (data) => API.post('/auth/login', data),
  sendOTP: (phone) => API.post('/auth/otp/send', { phone }),
  verifyOTP: (phone, otp) => API.post('/auth/otp/verify', { phone, otp }),
  registerVolunteer: (data) => API.post('/auth/volunteer/register', data),
  loginVolunteer: (data) => API.post('/auth/volunteer/login', data),
  registerUser: (data) => API.post('/auth/admin/register-user', data),
  getMe: () => API.get('/auth/me'),
};

// Admin endpoints
export const adminAPI = {
  getStats: () => API.get('/admin/stats'),
  getUsers: (params) => API.get('/admin/users', { params }),
  getUserById: (id) => API.get(`/admin/users/${id}`),
  updateUser: (id, data) => API.put(`/admin/users/${id}`, data),
  toggleBlock: (id) => API.patch(`/admin/users/${id}/block`),
  verifyUser: (id) => API.patch(`/admin/users/${id}/verify`),
  deleteUser: (id) => API.delete(`/admin/users/${id}`),
};

export default API;
