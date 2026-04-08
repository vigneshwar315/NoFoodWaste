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

  const leftColumnFields = [
    { label: 'Full Name *', key: 'name', type: 'text', placeholder: 'Your full name' },
    { label: 'Mobile Number *', key: 'phone', type: 'tel', placeholder: '10-digit number (e.g. 9876543210)' },
    { label: 'Email Address', key: 'email', type: 'email', placeholder: 'Optional' },
    { label: 'Username *', key: 'username', type: 'text', placeholder: 'Choose a unique username' },
    { label: 'Password *', key: 'password', type: 'password', placeholder: 'Min. 6 characters' },
  ];

  const rightColumnFields = [
    { label: 'Confirm Password *', key: 'confirmPassword', type: 'password', placeholder: 'Repeat password' },
    { label: 'Address', key: 'address', type: 'text', placeholder: 'Your city/area' },
    { label: 'Skills (comma separated)', key: 'skills', type: 'text', placeholder: 'e.g. Driving, Cooking, Logistics' },
    { label: 'Areas Served (comma separated)', key: 'areasServed', type: 'text', placeholder: 'e.g. Koramangala, HSR Layout' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-green-800 to-teal-900 px-4 py-8">
      <div className="w-full max-w-4xl">
        {/* Back Button */}
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-green-600 to-teal-600 px-8 py-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white/20 backdrop-blur">
                <span className="text-2xl">🤝</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Volunteer Registration</h1>
                <p className="text-green-100 text-sm mt-1">Join our community and make a difference</p>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="p-8">
            {/* Two Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-5">
                {leftColumnFields.map((f) => (
                  <div key={f.key}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {f.label}
                    </label>
                    {f.key === 'password' ? (
                      <div className="relative">
                        <input
                          type={showPass ? 'text' : 'password'}
                          placeholder={f.placeholder}
                          value={form[f.key]}
                          onChange={(e) => set(f.key, e.target.value)}
                          className="w-full h-11 px-4 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPass(!showPass)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    ) : (
                      <input
                        type={f.type}
                        placeholder={f.placeholder}
                        value={form[f.key]}
                        onChange={(e) => set(f.key, e.target.value)}
                        className="w-full h-11 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Right Column */}
              <div className="space-y-5">
                {rightColumnFields.map((f) => (
                  <div key={f.key}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {f.label}
                    </label>
                    <input
                      type={f.type}
                      placeholder={f.placeholder}
                      value={form[f.key]}
                      onChange={(e) => set(f.key, e.target.value)}
                      className="w-full h-11 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Info Alert */}
            <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
              <div className="flex items-start gap-3">
                <span className="text-green-600 text-lg">✅</span>
                <div className="flex-1">
                  <p className="text-sm text-green-800">
                    <strong>Note:</strong> After registration, admin will verify your account.
                    You can still access your dashboard while verification is pending.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 h-12 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 disabled:opacity-60 text-white rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <UserPlus size={18} />
                  <span>Create Volunteer Account</span>
                </>
              )}
            </button>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Already have an account?{' '}
                <Link to="/login/volunteer" className="text-green-600 font-semibold hover:text-green-700 hover:underline transition-colors">
                  Login here
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-white/60 text-xs mt-6">
          By registering, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}