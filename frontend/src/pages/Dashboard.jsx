import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Users, UserPlus, LayoutDashboard, Shield, Briefcase, Car, Heart, Gift } from 'lucide-react';

const roleConfig = {
  admin: { icon: Shield, color: 'from-teal-600 to-teal-800', label: 'Admin Dashboard', desc: 'Full system control' },
  employee: { icon: Briefcase, color: 'from-blue-500 to-blue-700', label: 'Employee Dashboard', desc: 'Manage donation requests' },
  driver: { icon: Car, color: 'from-orange-500 to-amber-600', label: 'Driver Dashboard', desc: 'View and accept deliveries' },
  volunteer: { icon: Heart, color: 'from-green-500 to-emerald-700', label: 'Volunteer Dashboard', desc: 'Assist with food distribution' },
  donor: { icon: Gift, color: 'from-rose-500 to-pink-600', label: 'Donor Dashboard', desc: 'Track your donations' },
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const cfg = roleConfig[user?.role] || roleConfig.donor;
  const RoleIcon = cfg.icon;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className={`bg-gradient-to-r ${cfg.color} text-white px-6 py-5 flex items-center justify-between shadow-lg`}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
            <RoleIcon className="w-6 h-6 text-white" />
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
          <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${cfg.color} flex items-center justify-center`}>
            <RoleIcon className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-black text-gray-800 mb-2">Welcome, {user?.name}! 👋</h2>
          <p className="text-gray-400 mb-1">Role: <span className="font-semibold text-gray-600 capitalize">{user?.role}</span></p>
          {!user?.isVerified && (
            <div className="mt-4 inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-2 rounded-full text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Your account is pending admin verification
            </div>
          )}
          {user?.isVerified && (
            <div className="mt-4 inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-full text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Account verified and active
            </div>
          )}
        </div>

        {/* Quick Actions by role */}
        <h3 className="text-lg font-bold text-gray-700 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Admin quick actions */}
          {user?.role === 'admin' && (
            <>
              <Link to="/admin/users" className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:border-teal-300 card-hover text-center transition-all hover:shadow-lg">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-teal-50 flex items-center justify-center">
                  <Users className="w-6 h-6 text-teal-600" />
                </div>
                <div className="font-bold text-teal-800">User Management</div>
                <p className="text-gray-400 text-sm mt-1">View, verify, block users</p>
              </Link>
              <Link to="/admin/register-user" className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:border-orange-300 card-hover text-center transition-all hover:shadow-lg">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-orange-50 flex items-center justify-center">
                  <UserPlus className="w-6 h-6 text-orange-600" />
                </div>
                <div className="font-bold text-orange-600">Register Driver/Employee</div>
                <p className="text-gray-400 text-sm mt-1">Create new login credentials</p>
              </Link>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center opacity-60 cursor-not-allowed">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gray-50 flex items-center justify-center">
                  <LayoutDashboard className="w-6 h-6 text-gray-400" />
                </div>
                <div className="font-bold text-gray-600">Analytics Dashboard</div>
                <p className="text-gray-400 text-sm mt-1">Coming soon</p>
              </div>
            </>
          )}

          {/* Volunteer / Driver actions */}
          {(user?.role === 'volunteer' || user?.role === 'driver') && (
            <>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center opacity-60 cursor-not-allowed">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-blue-50 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                </div>
                <div className="font-bold text-gray-600">Assigned Deliveries</div>
                <p className="text-gray-400 text-sm mt-1">Coming soon</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center opacity-60 cursor-not-allowed">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-green-50 flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0121 18.382V7.618a1 1 0 01-.447-.894L15 7m0 13V7m0 0L9.553 4.553A1 1 0 009 4.118v.002L15 7z" /></svg>
                </div>
                <div className="font-bold text-gray-600">Live Map</div>
                <p className="text-gray-400 text-sm mt-1">Coming soon</p>
              </div>
            </>
          )}

          {/* Donor actions */}
          {user?.role === 'donor' && (
            <>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center opacity-60 cursor-not-allowed">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-rose-50 flex items-center justify-center">
                  <Gift className="w-6 h-6 text-rose-400" />
                </div>
                <div className="font-bold text-gray-600">New Donation</div>
                <p className="text-gray-400 text-sm mt-1">Coming soon</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center opacity-60 cursor-not-allowed">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-purple-50 flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                </div>
                <div className="font-bold text-gray-600">My Donations</div>
                <p className="text-gray-400 text-sm mt-1">Coming soon</p>
              </div>
            </>
          )}

          {/* Employee actions */}
          {user?.role === 'employee' && (
            <>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center opacity-60 cursor-not-allowed">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-blue-50 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                </div>
                <div className="font-bold text-gray-600">Create Donation Request</div>
                <p className="text-gray-400 text-sm mt-1">Coming soon</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center opacity-60 cursor-not-allowed">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-amber-50 flex items-center justify-center">
                  <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                </div>
                <div className="font-bold text-gray-600">Active Requests</div>
                <p className="text-gray-400 text-sm mt-1">Coming soon</p>
              </div>
            </>
          )}

          {/* Home link always */}
          <Link to="/" className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:border-gray-300 card-hover text-center transition-all hover:shadow-lg">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gray-50 flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            </div>
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
