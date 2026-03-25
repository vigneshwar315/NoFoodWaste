import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { Search, UserCheck, UserX, Trash2, ShieldCheck, UserPlus } from 'lucide-react';

const roleBadge = {
  admin: 'bg-teal-100 text-teal-700',
  employee: 'bg-blue-100 text-blue-700',
  driver: 'bg-orange-100 text-orange-700',
  volunteer: 'bg-green-100 text-green-700',
  donor: 'bg-rose-100 text-rose-700',
};
const roleIcon = { admin: '👑', employee: '👨‍💼', driver: '🚗', volunteer: '🤝', donor: '❤️' };

export default function UserManagement() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({});

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 15 };
      if (filterRole) params.role = filterRole;
      const { data } = await adminAPI.getUsers(params);
      setUsers(data.users);
      setTotalPages(data.pages);
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await adminAPI.getStats();
      setStats(data.stats);
    } catch {}
  };

  useEffect(() => { fetchUsers(); }, [filterRole, page]);
  useEffect(() => { fetchStats(); }, []);

  const handleToggleBlock = async (id) => {
    try {
      const { data } = await adminAPI.toggleBlock(id);
      toast.success(data.message);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleVerify = async (id) => {
    try {
      await adminAPI.verifyUser(id);
      toast.success('User verified!');
      fetchUsers();
    } catch (err) {
      toast.error('Failed to verify');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete ${name}? This cannot be undone.`)) return;
    try {
      await adminAPI.deleteUser(id);
      toast.success('User deleted');
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  const filtered = search
    ? users.filter((u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.username?.toLowerCase().includes(search.toLowerCase()) ||
        u.phone?.includes(search)
      )
    : users;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-teal-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">👑</span>
          <div>
            <div className="font-bold text-sm">Admin Panel — User Management</div>
            <div className="text-teal-300 text-xs">{user?.name}</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/admin/register-user" className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
            <UserPlus size={16} /> New User
          </Link>
          <Link to="/dashboard" className="text-teal-200 hover:text-white text-sm">Dashboard</Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {[
            { label: 'Drivers', value: stats.totalDrivers, icon: '🚗', color: 'bg-orange-50 border-orange-200' },
            { label: 'Active Drivers', value: stats.activeDrivers, icon: '✅', color: 'bg-green-50 border-green-200' },
            { label: 'Volunteers', value: stats.totalVolunteers, icon: '🤝', color: 'bg-emerald-50 border-emerald-200' },
            { label: 'Employees', value: stats.totalEmployees, icon: '👨‍💼', color: 'bg-blue-50 border-blue-200' },
            { label: 'Donors', value: stats.totalDonors, icon: '❤️', color: 'bg-rose-50 border-rose-200' },
            { label: 'Blocked', value: stats.blockedUsers, icon: '🚫', color: 'bg-red-50 border-red-200' },
          ].map((s) => (
            <div key={s.label} className={`${s.color} border rounded-xl p-4 text-center`}>
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-xl font-black text-gray-800">{s.value ?? '—'}</div>
              <div className="text-xs text-gray-500 font-medium">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, username, phone…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input pl-10"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => { setFilterRole(e.target.value); setPage(1); }}
            className="form-input w-full sm:w-48"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="employee">Employee</option>
            <option value="driver">Driver</option>
            <option value="volunteer">Volunteer</option>
            <option value="donor">Donor</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-orange-500 border-t-transparent" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <div className="text-5xl mb-3">🔍</div>
              <p className="font-medium">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['User', 'Role', 'Contact', 'Status', 'Joined', 'Actions'].map((h) => (
                      <th key={h} className="text-left px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {u.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-800 text-sm">{u.name}</div>
                            <div className="text-gray-400 text-xs">{u.username || '—'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${roleBadge[u.role]}`}>
                          {roleIcon[u.role]} {u.role}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-500">
                        <div>{u.phone || '—'}</div>
                        <div className="text-xs text-gray-400">{u.email || ''}</div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-1">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${u.isBlocked ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                            {u.isBlocked ? '🚫 Blocked' : '✅ Active'}
                          </span>
                          {!u.isVerified && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-600">
                              ⏳ Unverified
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-400">
                        {new Date(u.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-5 py-4">
                        {u.role !== 'admin' && (
                          <div className="flex items-center gap-2">
                            {!u.isVerified && (
                              <button
                                onClick={() => handleVerify(u._id)}
                                title="Verify user"
                                className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition-colors"
                              >
                                <ShieldCheck size={16} />
                              </button>
                            )}
                            <button
                              onClick={() => handleToggleBlock(u._id)}
                              title={u.isBlocked ? 'Unblock' : 'Block'}
                              className={`p-1.5 rounded-lg transition-colors ${u.isBlocked ? 'text-green-600 hover:bg-green-50' : 'text-orange-500 hover:bg-orange-50'}`}
                            >
                              {u.isBlocked ? <UserCheck size={16} /> : <UserX size={16} />}
                            </button>
                            <button
                              onClick={() => handleDelete(u._id, u.name)}
                              title="Delete user"
                              className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 text-sm rounded-lg border border-gray-200 disabled:opacity-40 hover:border-orange-300 transition-colors">← Prev</button>
            <span className="px-4 py-2 text-sm text-gray-500">Page {page} of {totalPages}</span>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 text-sm rounded-lg border border-gray-200 disabled:opacity-40 hover:border-orange-300 transition-colors">Next →</button>
          </div>
        )}
      </div>
    </div>
  );
}
