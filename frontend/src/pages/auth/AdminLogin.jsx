import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import {
  Eye,
  EyeOff,
  LogIn,
  Shield,
  ArrowLeft
} from 'lucide-react';

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) return toast.error('All fields required');
    try {
      setLoading(true);
      await login(form.username, form.password, 'admin');
      toast.success('Welcome back, Admin!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-900 via-teal-800 to-teal-900 px-4">

      <div className="w-full max-w-lg"> {/* Increased card width */}

        {/* Back */}
        <Link
          to="/login"
          className="flex items-center gap-2 text-sm text-white/80 hover:text-white mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg px-12 py-12"> {/* Increased padding */}

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-teal-100">
              <Shield className="w-7 h-7 text-teal-600" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-semibold text-gray-800 text-center mb-10">
            Sign in
          </h1>

          {/* Form */}
          <form className="space-y-7"> {/* More spacing */}

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                placeholder="Enter username"
                className="w-full h-13 px-4 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>

              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter password"
                  className="w-full h-13 px-4 pr-10 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
                <br></br>
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full h-13 bg-teal-600 hover:bg-teal-700 text-white rounded-md text-sm font-medium transition"
            >
              Sign in
            </button>

          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-white/60 text-sm mt-6">
          Secure access for authorized personnel only
        </p>

      </div >
    </div >);
}