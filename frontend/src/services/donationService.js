import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

// Attach JWT token from localStorage
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('nfw_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Donations
export const getPendingVerifications = () => API.get('/donations/pending-verification');
export const verifyDonation = (data) => API.post('/donations/verify', data);
export const approveDonation = (data) => API.post('/donations/approve', data);
export const rejectDonation = (data) => API.post('/donations/reject', data);
export const getMyDonations = (page = 1) => API.get(`/donations/my?page=${page}`);
export const getDonationById = (id) => API.get(`/donations/${id}`);
export const getAllDonations = (status, page = 1) =>
  API.get(`/donations?${status ? `status=${status}&` : ''}page=${page}`);
export const getDonationStats = () => API.get('/donations/stats');
export const manualAssign = (donationId, driverId) =>
  API.post('/donations/manual-assign', { donationId, driverId });
export const triggerDailyDonor = (dailyDonorId) =>
  API.post('/donations/trigger-daily-donor', { dailyDonorId });

// Webhook (test)
export const testWebhook = (phone, quantity) =>
  API.post('/donations/exotel-webhook', { phone, quantity });

export default API;
