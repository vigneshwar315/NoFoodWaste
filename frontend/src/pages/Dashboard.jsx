import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Users, UserPlus, LayoutDashboard } from 'lucide-react';

const roleConfig = {
  admin: { icon: '👑', color: 'from-teal-600 to-teal-800', label: 'Admin Dashboard', desc: 'Full system control' },
  employee: { icon: '👨‍💼', color: 'from-blue-500 to-blue-700', label: 'Employee Dashboard', desc: 'Manage donation requests' },
  driver: { icon: '🚗', color: 'from-orange-500 to-amber-600', label: 'Driver Dashboard', desc: 'View and accept deliveries' },
  volunteer: { icon: '🤝', color: 'from-green-500 to-emerald-700', label: 'Volunteer Dashboard', desc: 'Assist with food distribution' },
  donor: { icon: '❤️', color: 'from-rose-500 to-pink-600', label: 'Donor Dashboard', desc: 'Track your donations' },
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const cfg = roleConfig[user?.role] || roleConfig.donor;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className={`bg-gradient-to-r ${cfg.color} text-white px-6 py-5 flex items-center justify-between shadow-lg`}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl">
            {cfg.icon}
          </div>
          <div>
            <h1 className="text-xl font-black">{cfg.label}</h1>
            <p className="text-white/75 text-sm">{cfg.desc}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="font-semibold text-sm">{user?.name}</div>
            <div className="text-white/70 text-xs capitalize">{user?.role}</div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-3 py-2 rounded-xl text-sm font-medium transition-colors"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Welcome card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-8 text-center">
          <div className="text-6xl mb-4">{cfg.icon}</div>
          <h2 className="text-2xl font-black text-gray-800 mb-2">Welcome, {user?.name}! 👋</h2>
          <p className="text-gray-400 mb-1">Role: <span className="font-semibold text-gray-600 capitalize">{user?.role}</span></p>
          {!user?.isVerified && (
            <div className="mt-4 inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-2 rounded-full text-sm">
              ⏳ Your account is pending admin verification
            </div>
          )}
          {user?.isVerified && (
            <div className="mt-4 inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-full text-sm">
              ✅ Account verified and active
            </div>
          )}
        </div>

        {/* Quick Actions by role */}
        <h3 className="text-lg font-bold text-gray-700 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Admin quick actions */}
          {user?.role === 'admin' && (
            <>
              <Link to="/admin/users" className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:border-teal-300 card-hover text-center">
                <div className="text-3xl mb-3">👥</div>
                <div className="font-bold text-teal-800">User Management</div>
                <p className="text-gray-400 text-sm mt-1">View, verify, block users</p>
              </Link>
              <Link to="/admin/register-user" className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:border-orange-300 card-hover text-center">
                <div className="text-3xl mb-3">➕</div>
                <div className="font-bold text-orange-600">Register Driver/Employee</div>
                <p className="text-gray-400 text-sm mt-1">Create new login credentials</p>
              </Link>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center opacity-60 cursor-not-allowed">
                <div className="text-3xl mb-3">📊</div>
                <div className="font-bold text-gray-600">Analytics Dashboard</div>
                <p className="text-gray-400 text-sm mt-1">Coming soon</p>
              </div>
            </>
          )}

          {/* Volunteer / Driver actions */}
          {(user?.role === 'volunteer' || user?.role === 'driver') && (
            <>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center opacity-60 cursor-not-allowed">
                <div className="text-3xl mb-3">📦</div>
                <div className="font-bold text-gray-600">Assigned Deliveries</div>
                <p className="text-gray-400 text-sm mt-1">Coming soon</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center opacity-60 cursor-not-allowed">
                <div className="text-3xl mb-3">🗺️</div>
                <div className="font-bold text-gray-600">Live Map</div>
                <p className="text-gray-400 text-sm mt-1">Coming soon</p>
              </div>
            </>
          )}

          {/* Donor actions */}
          {user?.role === 'donor' && (
            <>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center opacity-60 cursor-not-allowed">
                <div className="text-3xl mb-3">🍱</div>
                <div className="font-bold text-gray-600">New Donation</div>
                <p className="text-gray-400 text-sm mt-1">Coming soon</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center opacity-60 cursor-not-allowed">
                <div className="text-3xl mb-3">📜</div>
                <div className="font-bold text-gray-600">My Donations</div>
                <p className="text-gray-400 text-sm mt-1">Coming soon</p>
              </div>
            </>
          )}

          {/* Employee actions */}
          {user?.role === 'employee' && (
            <>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center opacity-60 cursor-not-allowed">
                <div className="text-3xl mb-3">📞</div>
                <div className="font-bold text-gray-600">Create Donation Request</div>
                <p className="text-gray-400 text-sm mt-1">Coming soon</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center opacity-60 cursor-not-allowed">
                <div className="text-3xl mb-3">📋</div>
                <div className="font-bold text-gray-600">Active Requests</div>
                <p className="text-gray-400 text-sm mt-1">Coming soon</p>
              </div>
            </>
          )}

          {/* Home link always */}
          <Link to="/" className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:border-gray-300 card-hover text-center">
            <div className="text-3xl mb-3">🏠</div>
            <div className="font-bold text-gray-600">Back to Home</div>
            <p className="text-gray-400 text-sm mt-1">Visit the landing page</p>
          </Link>
        </div>

        {/* Profile info */}
        <div className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-bold text-gray-700 mb-4">Your Profile</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {[
              { label: 'Name', value: user?.name },
              { label: 'Role', value: user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) },
              { label: 'Username', value: user?.username || '—' },
              { label: 'Phone', value: user?.phone || '—' },
              { label: 'Email', value: user?.email || '—' },
              { label: 'Verified', value: user?.isVerified ? '✅ Yes' : '⏳ Pending' },
            ].map((f) => (
              <div key={f.label} className="flex items-center justify-between py-2 border-b border-gray-50">
                <span className="text-gray-400 font-medium">{f.label}</span>
                <span className="text-gray-700 font-semibold">{f.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
