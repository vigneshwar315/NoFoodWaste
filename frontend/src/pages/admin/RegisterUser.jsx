import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { UserPlus, Eye, EyeOff } from 'lucide-react';

const roles = [
  { value: 'driver', label: '🚗 Driver', color: 'border-orange-400 bg-orange-50', badge: 'bg-orange-100 text-orange-700' },
  { value: 'employee', label: '👨‍💼 Employee', color: 'border-blue-400 bg-blue-50', badge: 'bg-blue-100 text-blue-700' },
];

export default function RegisterUser() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('driver');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', username: '', password: '',
    vehicleType: '', licenseNumber: '', employeeId: '', department: '',
  });

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.username || !form.password) return toast.error('Name, username and password are required');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');

    try {
      setLoading(true);
      const payload = {
        name: form.name,
        username: form.username,
        password: form.password,
        role: selectedRole,
        ...(form.email && { email: form.email }),
        ...(form.phone && { phone: form.phone }),
      };
      if (selectedRole === 'driver') {
        payload.vehicleType = form.vehicleType;
        payload.licenseNumber = form.licenseNumber;
      } else {
        payload.employeeId = form.employeeId;
        payload.department = form.department;
      }

      const { data } = await authAPI.registerUser(payload);
      toast.success(`${data.user.role.charAt(0).toUpperCase() + data.user.role.slice(1)} account created!`);
      setForm({ name: '', email: '', phone: '', username: '', password: '', vehicleType: '', licenseNumber: '', employeeId: '', department: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-teal-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">👑</span>
          <div>
            <div className="font-bold text-sm">Admin Panel</div>
            <div className="text-teal-300 text-xs">{user?.name}</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/admin/users" className="text-teal-200 hover:text-white text-sm transition-colors">User Management →</Link>
          <Link to="/dashboard" className="text-teal-200 hover:text-white text-sm transition-colors">Dashboard</Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-teal-900">Register New User</h1>
          <p className="text-gray-400 mt-1">Create login credentials for drivers and employees</p>
        </div>

        {/* Role Selector */}
        <div className="flex gap-4 mb-8">
          {roles.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => setSelectedRole(r.value)}
              className={`flex-1 p-4 rounded-2xl border-2 font-bold text-gray-700 transition-all ${selectedRole === r.value ? r.color + ' shadow-md' : 'border-gray-200 bg-white hover:border-gray-300'}`}
            >
              {r.label}
              {selectedRole === r.value && (
                <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${r.badge}`}>Selected</span>
              )}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-5">
            {/* Common fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</label>
                <input type="text" placeholder="Full name" value={form.name} onChange={(e) => set('name', e.target.value)} className="form-input" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Username *</label>
                <input type="text" placeholder="Login username" value={form.username} onChange={(e) => set('username', e.target.value)} className="form-input" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mobile Number</label>
                <input type="tel" placeholder="Optional" value={form.phone} onChange={(e) => set('phone', e.target.value)} className="form-input" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                <input type="email" placeholder="Optional" value={form.email} onChange={(e) => set('email', e.target.value)} className="form-input" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password *</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={(e) => set('password', e.target.value)}
                  className="form-input pr-12"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Role-specific fields */}
            {selectedRole === 'driver' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Vehicle Type</label>
                  <select value={form.vehicleType} onChange={(e) => set('vehicleType', e.target.value)} className="form-input">
                    <option value="">Select vehicle</option>
                    <option>2-Wheeler</option>
                    <option>3-Wheeler</option>
                    <option>4-Wheeler (Car)</option>
                    <option>Van / Tempo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">License Number</label>
                  <input type="text" placeholder="e.g. KA01-20231234567" value={form.licenseNumber} onChange={(e) => set('licenseNumber', e.target.value)} className="form-input" />
                </div>
              </div>
            )}
            {selectedRole === 'employee' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Employee ID</label>
                  <input type="text" placeholder="e.g. EMP-001" value={form.employeeId} onChange={(e) => set('employeeId', e.target.value)} className="form-input" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Department</label>
                  <select value={form.department} onChange={(e) => set('department', e.target.value)} className="form-input">
                    <option value="">Select department</option>
                    <option>Operations</option>
                    <option>Logistics</option>
                    <option>Donor Relations</option>
                    <option>Field Support</option>
                    <option>IT</option>
                  </select>
                </div>
              </div>
            )}

            <p className="text-xs text-gray-400 bg-gray-50 rounded-lg px-4 py-2">
              ✅ Admin-created accounts are auto-verified and can login immediately with these credentials.
            </p>

            <button type="submit" disabled={loading} className="w-full bg-teal-700 hover:bg-teal-800 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2">
              {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><UserPlus size={18} /> Create {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Account</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
