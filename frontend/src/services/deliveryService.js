import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('nfw_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getMyDeliveries = () => API.get('/delivery/my');
export const getDeliveryById = (id) => API.get(`/delivery/${id}`);
export const getAllDeliveries = (status) =>
  API.get(`/delivery/all${status ? `?status=${status}` : ''}`);
export const acceptDelivery = (deliveryId) => API.post('/delivery/accept', { deliveryId });
export const rejectDelivery = (deliveryId, reason) =>
  API.post('/delivery/reject', { deliveryId, reason });
export const startTransit = (deliveryId) => API.post('/delivery/transit', { deliveryId });
export const failDelivery = (deliveryId, reason) =>
  API.post('/delivery/fail', { deliveryId, reason });

export const confirmPickup = (deliveryId, photo) => {
  const formData = new FormData();
  formData.append('deliveryId', deliveryId);
  if (photo) formData.append('photo', photo);
  return API.post('/delivery/pickup', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const completeDelivery = (deliveryId, { photo, quantityDelivered, foodCondition, remarks }) => {
  const formData = new FormData();
  formData.append('deliveryId', deliveryId);
  formData.append('quantityDelivered', quantityDelivered);
  formData.append('foodCondition', foodCondition);
  formData.append('remarks', remarks || '');
  if (photo) formData.append('photo', photo);
  return API.post('/delivery/complete', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const updateLocation = (coordinates) =>
  API.put('/delivery/location', { coordinates });

// Hunger spots
export const getHungerSpots = () => API.get('/hunger-spots');
export const createHungerSpot = (data) => API.post('/hunger-spots', data);
export const updateHungerSpot = (id, data) => API.put(`/hunger-spots/${id}`, data);
export const deleteHungerSpot = (id) => API.delete(`/hunger-spots/${id}`);

// Daily donors
export const getDailyDonors = () => API.get('/daily-donors');
export const createDailyDonor = (data) => API.post('/daily-donors', data);
export const triggerDailyDonor = (id) => API.post(`/daily-donors/${id}/trigger`);
export const deleteDailyDonor = (id) => API.delete(`/daily-donors/${id}`);

export default API;
