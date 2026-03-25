import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('nfw_token');
    const savedUser = localStorage.getItem('nfw_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const saveAuth = (token, user) => {
    localStorage.setItem('nfw_token', token);
    localStorage.setItem('nfw_user', JSON.stringify(user));
    setToken(token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('nfw_token');
    localStorage.removeItem('nfw_user');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
  };

  // Generic password login
  const login = async (username, password, role) => {
    const { data } = await authAPI.login({ username, password, role });
    saveAuth(data.token, data.user);
    return data;
  };

  // Volunteer login
  const loginVolunteer = async (username, password) => {
    const { data } = await authAPI.loginVolunteer({ username, password });
    saveAuth(data.token, data.user);
    return data;
  };

  // OTP login for donors
  const sendOTP = async (phone) => {
    const { data } = await authAPI.sendOTP(phone);
    return data;
  };

  const verifyOTP = async (phone, otp) => {
    const { data } = await authAPI.verifyOTP(phone, otp);
    saveAuth(data.token, data.user);
    return data;
  };

  // Volunteer registration
  const registerVolunteer = async (formData) => {
    const { data } = await authAPI.registerVolunteer(formData);
    saveAuth(data.token, data.user);
    return data;
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, loginVolunteer, sendOTP, verifyOTP, registerVolunteer, logout, saveAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

export default AuthContext;
