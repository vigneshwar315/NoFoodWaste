import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Eye, EyeOff, UserPlus, ArrowLeft } from 'lucide-react';

export default function VolunteerRegister() {
  const { registerVolunteer } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', phone: '', email: '', username: '', password: '', confirmPassword: '',
    address: '', skills: '', areasServed: '',
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.username || !form.password) return toast.error('Required fields missing');
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    if (!/^[6-9]\d{9}$/.test(form.phone)) return toast.error('Enter valid 10-digit mobile number');

    try {
      setLoading(true);
      await registerVolunteer({
        name: form.name,
        phone: form.phone,
        email: form.email || undefined,
        username: form.username,
        password: form.password,
        address: form.address,
        skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
        areasServed: form.areasServed.split(',').map((s) => s.trim()).filter(Boolean),
      });
      toast.success('Registration successful! Awaiting admin verification.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { label: 'Full Name *', key: 'name', type: 'text', placeholder: 'Your full name' },
    { label: 'Mobile Number *', key: 'phone', type: 'tel', placeholder: '10-digit number (e.g. 9876543210)' },
    { label: 'Email Address', key: 'email', type: 'email', placeholder: 'Optional' },
    { label: 'Username *', key: 'username', type: 'text', placeholder: 'Choose a unique username' },
    { label: 'Address', key: 'address', type: 'text', placeholder: 'Your city/area' },
    { label: 'Skills (comma separated)', key: 'skills', type: 'text', placeholder: 'e.g. Driving, Cooking, Logistics' },
    { label: 'Areas Served (comma separated)', key: 'areasServed', type: 'text', placeholder: 'e.g. Koramangala, HSR Layout' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-green-800 to-teal-900 px-4 py-12">

      <div className="w-full max-w-lg">

        {/* Back */}
        <Link
          to="/login"
          className="flex items-center gap-2 text-sm text-white/80 hover:text-white mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg px-12 py-12">

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-green-100">
              <span className="text-2xl">🤝</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-semibold text-gray-800 text-center mb-10">
            Register as Volunteer
          </h1>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {fields.map((f) => (
              <div key={f.key}>
                <label className="block text-sm font-medium text-gray-700 mb-2">{f.label}</label>
                <input
                  type={f.type}
                  placeholder={f.placeholder}
                  value={form[f.key]}
                  onChange={(e) => set(f.key, e.target.value)}
                  className="w-full h-13 px-4 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>
            ))}

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={(e) => set('password', e.target.value)}
                  className="w-full h-13 px-4 pr-10 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
              <input
                type="password"
                placeholder="Repeat password"
                value={form.confirmPassword}
                onChange={(e) => set('confirmPassword', e.target.value)}
                className="w-full h-13 px-4 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>

            <p className="text-xs text-gray-400 bg-green-50 rounded-lg px-4 py-2">
              ✅ After registration, admin will verify your account. You can still view your dashboard.
            </p>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-13 bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white rounded-md text-sm font-medium transition flex items-center justify-center gap-2"
            >
              {loading
                ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <><UserPlus size={16} /> Create Volunteer Account</>}
            </button>

            <div className="text-center pt-2 border-t border-gray-100 space-y-1">
              <p className="text-gray-500 text-sm">Already registered? <Link to="/login/volunteer" className="text-green-600 font-semibold hover:underline">Login here</Link></p>
            </div>

          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-white/60 text-sm mt-6">
          Join our community and make a difference
        </p>

      </div>
    </div>
  );
}
