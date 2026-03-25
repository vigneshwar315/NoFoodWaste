import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Eye, EyeOff, UserPlus } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-teal-900 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-700 p-8 text-white text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">🤝</div>
            <h1 className="text-2xl font-black">Register as Volunteer</h1>
            <p className="text-green-100 text-sm mt-1">Join our community and make a difference</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-4">
            {fields.map((f) => (
              <div key={f.key}>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{f.label}</label>
                <input
                  type={f.type}
                  placeholder={f.placeholder}
                  value={form[f.key]}
                  onChange={(e) => set(f.key, e.target.value)}
                  className="form-input"
                />
              </div>
            ))}

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
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password *</label>
              <input
                type="password"
                placeholder="Repeat password"
                value={form.confirmPassword}
                onChange={(e) => set('confirmPassword', e.target.value)}
                className="form-input"
              />
            </div>

            <p className="text-xs text-gray-400 bg-green-50 rounded-lg px-4 py-2">
              ✅ After registration, admin will verify your account. You can still view your dashboard.
            </p>

            <button type="submit" disabled={loading} className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2">
              {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><UserPlus size={18} /> Create Volunteer Account</>}
            </button>

            <div className="text-center pt-2 border-t border-gray-100 space-y-1">
              <p className="text-gray-500 text-sm">Already registered? <Link to="/login/volunteer" className="text-green-600 font-semibold hover:underline">Login here</Link></p>
              <Link to="/login" className="text-orange-500 hover:underline text-sm font-medium block">← Back to Login Portal</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
