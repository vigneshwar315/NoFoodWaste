import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../hooks/useSocket';
import StatusBadge from '../../components/StatusBadge';
import toast from 'react-hot-toast';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getDonationStats, getAllDonations } from '../../services/donationService';
import {
  getAllDeliveries, getHungerSpots, createHungerSpot, deleteHungerSpot,
  getDailyDonors, createDailyDonor, deleteDailyDonor, triggerDailyDonor,
} from '../../services/deliveryService';
import { authAPI, adminAPI } from '../../services/api';
import {
  Shield, LogOut, RefreshCw, MapPin, Truck, Package, Users,
  TrendingUp, PlusCircle, Trash2, Zap, BarChart3, Navigation,
  UserPlus, Search, ShieldCheck, UserCheck, UserX, Eye, EyeOff
} from 'lucide-react';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const driverIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
});

const TABS = ['Overview', 'Live Map', 'Donations', 'Hunger Spots', 'Daily Donors', 'Register Team', 'Users'];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [stats, setStats] = useState({});
  const [total, setTotal] = useState(0);
  const [todayCount, setTodayCount] = useState(0);
  const [donations, setDonations] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [hungerSpots, setHungerSpots] = useState([]);
  const [dailyDonors, setDailyDonors] = useState([]);
  const [spotForm, setSpotForm] = useState({ name: '', address: '', lng: '', lat: '', capacity: '', contactName: '', contactPhone: '' });
  const [dailyForm, setDailyForm] = useState({ name: '', phone: '', address: '', scheduleTime: '', avgQuantity: '', foodType: 'veg' });
  const [showSpotModal, setShowSpotModal] = useState(false);
  const [showDailyModal, setShowDailyModal] = useState(false);

  // ── Register Team state ────────────────────────────────────────────────────
  const [regRole, setRegRole] = useState('driver');
  const [regLoading, setRegLoading] = useState(false);
  const [showRegPass, setShowRegPass] = useState(false);
  const [regForm, setRegForm] = useState({
    name: '', email: '', phone: '', username: '', password: '',
    vehicleType: '', licenseNumber: '', employeeId: '', department: '',
  });

  // ── Users tab state ────────────────────────────────────────────────────────
  const [allUsers, setAllUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userStats, setUserStats] = useState({});
  const [filterRole, setFilterRole] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [userPage, setUserPage] = useState(1);
  const [userTotalPages, setUserTotalPages] = useState(1);

  const refresh = useCallback(async () => {
    try {
      const [sRes, dRes, delRes, hRes, ddRes] = await Promise.allSettled([
        getDonationStats(),
        getAllDonations(),
        getAllDeliveries(),
        getHungerSpots(),
        getDailyDonors(),
      ]);
      if (sRes.status === 'fulfilled') {
        setStats(sRes.value.data.stats || {});
        setTotal(sRes.value.data.total || 0);
        setTodayCount(sRes.value.data.todayCount || 0);
      }
      if (dRes.status === 'fulfilled') setDonations(dRes.value.data.donations || []);
      if (delRes.status === 'fulfilled') setDeliveries(delRes.value.data.deliveries || []);
      if (hRes.status === 'fulfilled') setHungerSpots(hRes.value.data.spots || []);
      if (ddRes.status === 'fulfilled') setDailyDonors(ddRes.value.data.donors || []);
    } catch (_) {}
  }, []);

  const fetchUsers = useCallback(async (role = filterRole, page = userPage) => {
    try {
      setUsersLoading(true);
      const params = { page, limit: 15 };
      if (role) params.role = role;
      const { data } = await adminAPI.getUsers(params);
      setAllUsers(data.users || []);
      setUserTotalPages(data.pages || 1);
    } catch (_) {}
    finally { setUsersLoading(false); }
  }, [filterRole, userPage]);

  const fetchUserStats = useCallback(async () => {
    try {
      const { data } = await adminAPI.getStats();
      setUserStats(data.stats || {});
    } catch (_) {}
  }, []);

  useEffect(() => { refresh(); fetchUserStats(); }, []);
  useEffect(() => { if (activeTab === 6) { fetchUsers(filterRole, userPage); } }, [activeTab, filterRole, userPage]);

  useSocket({
    rooms: [],
    listeners: {
      newDonationRequest: () => { refresh(); toast('📞 New donation request!', { icon: '🍱' }); },
      noDriverAvailable: (data) => { toast.error(`No driver available!`); refresh(); },
      deliveryStatusUpdate: () => { refresh(); },
    },
  });

  const handleCreateSpot = async (e) => {
    e.preventDefault();
    try {
      await createHungerSpot({
        name: spotForm.name, address: spotForm.address,
        coordinates: [parseFloat(spotForm.lng), parseFloat(spotForm.lat)],
        capacity: parseInt(spotForm.capacity) || 0,
        contactName: spotForm.contactName, contactPhone: spotForm.contactPhone,
      });
      toast.success('Hunger spot created');
      setShowSpotModal(false);
      setSpotForm({ name: '', address: '', lng: '', lat: '', capacity: '', contactName: '', contactPhone: '' });
      refresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleCreateDailyDonor = async (e) => {
    e.preventDefault();
    try {
      await createDailyDonor({
        ...dailyForm,
        avgQuantity: parseInt(dailyForm.avgQuantity),
      });
      toast.success('Daily donor added');
      setShowDailyModal(false);
      setDailyForm({ name: '', phone: '', address: '', scheduleTime: '', avgQuantity: '', foodType: 'veg' });
      refresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleTrigger = async (id) => {
    try {
      await triggerDailyDonor(id);
      toast.success('Manual trigger sent');
      refresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const activeDrivers = deliveries.filter((d) => ['accepted', 'picked_up', 'in_transit'].includes(d.status));
  const formatTime = (t) => t ? new Date(t).toLocaleString('en-IN') : '—';

  // Register team handler
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!regForm.name || !regForm.username || !regForm.password) return toast.error('Name, username and password required');
    if (regForm.password.length < 6) return toast.error('Password must be at least 6 characters');
    setRegLoading(true);
    try {
      const payload = {
        name: regForm.name, username: regForm.username, password: regForm.password, role: regRole,
        ...(regForm.email && { email: regForm.email }),
        ...(regForm.phone && { phone: regForm.phone }),
        ...(regRole === 'driver' ? { vehicleType: regForm.vehicleType, licenseNumber: regForm.licenseNumber }
          : { employeeId: regForm.employeeId, department: regForm.department }),
      };
      const { data } = await authAPI.registerUser(payload);
      toast.success(`${regRole.charAt(0).toUpperCase() + regRole.slice(1)} account created!`);
      setRegForm({ name: '', email: '', phone: '', username: '', password: '', vehicleType: '', licenseNumber: '', employeeId: '', department: '' });
      fetchUserStats();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setRegLoading(false); }
  };

  // Users tab handlers
  const handleToggleBlock = async (id) => {
    try {
      const { data } = await adminAPI.toggleBlock(id);
      toast.success(data.message);
      fetchUsers();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleVerifyUser = async (id) => {
    try {
      await adminAPI.verifyUser(id);
      toast.success('User verified!');
      fetchUsers();
    } catch (_) { toast.error('Failed'); }
  };

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Delete ${name}? This cannot be undone.`)) return;
    try {
      await adminAPI.deleteUser(id);
      toast.success('Deleted');
      fetchUsers();
      fetchUserStats();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const roleBadge = {
    admin: 'bg-teal-100 text-teal-700', employee: 'bg-blue-100 text-blue-700',
    driver: 'bg-orange-100 text-orange-700', volunteer: 'bg-green-100 text-green-700', donor: 'bg-rose-100 text-rose-700',
  };
  const roleIcon = { admin: '👑', employee: '👨‍💼', driver: '🚗', volunteer: '🤝', donor: '❤️' };

  const filteredUsers = userSearch
    ? allUsers.filter((u) =>
        u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.username?.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.phone?.includes(userSearch)
      )
    : allUsers;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-800 text-white px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-black">Admin Dashboard</h1>
            <p className="text-white/70 text-xs">Full System Control</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={refresh} className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors">
            <RefreshCw size={16} />
          </button>
          <button onClick={() => { logout(); navigate('/'); }}
            className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-sm transition-colors">
            <LogOut size={15} /> Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="max-w-6xl mx-auto flex gap-0 overflow-x-auto">
          {TABS.map((tab, i) => (
            <button key={tab} onClick={() => setActiveTab(i)}
              className={`px-5 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
                activeTab === i ? 'border-teal-600 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* TAB 0: Overview */}
        {activeTab === 0 && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { label: 'Total', value: total, icon: Package, color: 'bg-gray-50 text-gray-700', iconColor: 'text-gray-500' },
                { label: 'Today', value: todayCount, icon: TrendingUp, color: 'bg-blue-50 text-blue-700', iconColor: 'text-blue-500' },
                { label: 'Delivered', value: stats.delivered || 0, icon: CheckCircle2, color: 'bg-green-50 text-green-700', iconColor: 'text-green-500' },
                { label: 'Active', value: (stats.assigned || 0) + (stats.picked || 0) + (stats.in_transit || 0), icon: Truck, color: 'bg-orange-50 text-orange-700', iconColor: 'text-orange-500' },
                { label: 'Pending', value: stats.pending_verification || 0, icon: BarChart3, color: 'bg-yellow-50 text-yellow-700', iconColor: 'text-yellow-500' },
              ].map((s) => {
                const Icon = s.icon || BarChart3;
                return (
                  <div key={s.label} className={`${s.color} rounded-2xl p-5 border border-white/50`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold uppercase tracking-wide opacity-70">{s.label}</span>
                      <Icon size={16} className={s.iconColor} />
                    </div>
                    <div className="text-3xl font-black">{s.value}</div>
                  </div>
                );
              })}
            </div>

            {/* Quick Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-bold text-gray-700 mb-3 text-sm">Status Breakdown</h3>
                <div className="space-y-2">
                  {Object.entries(stats).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between text-sm">
                      <StatusBadge status={status} />
                      <span className="font-bold text-gray-700">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-bold text-gray-700 mb-3 text-sm">Active Drivers</h3>
                <div className="space-y-2">
                  {activeDrivers.length === 0 ? <p className="text-gray-400 text-sm">No active drivers</p> : activeDrivers.slice(0, 5).map((d) => (
                    <div key={d._id} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="font-semibold text-gray-700">{d.driver?.name}</span>
                      <StatusBadge status={d.status} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-bold text-gray-700 mb-3 text-sm">Hunger Spots</h3>
                {hungerSpots.slice(0, 4).map((s) => (
                  <div key={s._id} className="text-sm text-gray-600 mb-1.5">
                    <span className="font-semibold">{s.name}</span> · Cap: {s.capacity}
                  </div>
                ))}
                {hungerSpots.length === 0 && <p className="text-gray-400 text-sm">No hunger spots yet</p>}
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: Live Map */}
        {activeTab === 1 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
              <Navigation size={16} className="text-teal-500" />
              <span className="font-bold text-gray-700">Live Driver Map</span>
              <span className="ml-2 text-xs text-gray-400">{activeDrivers.length} active driver(s)</span>
            </div>
            <div style={{ height: 520 }}>
              <MapContainer center={[13.0827, 80.2707]} zoom={11} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' />
                {activeDrivers.map((delivery) => {
                  const coords = delivery.driver?.currentLocation?.coordinates;
                  if (!coords || coords[0] === 0) return null;
                  return (
                    <Marker key={delivery._id} position={[coords[1], coords[0]]} icon={driverIcon}>
                      <Popup>
                        <div className="text-sm">
                          <div className="font-bold">{delivery.driver?.name}</div>
                          <div>{delivery.driver?.phone}</div>
                          <StatusBadge status={delivery.status} />
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
                {hungerSpots.filter((s) => s.isActive).map((spot) => (
                  <Marker key={spot._id} position={[spot.location.coordinates[1], spot.location.coordinates[0]]}>
                    <Popup>
                      <div className="text-sm">
                        <div className="font-bold">{spot.name}</div>
                        <div className="text-gray-500">{spot.address}</div>
                        <div>Cap: {spot.capacity} · Occ: {spot.currentOccupancy}</div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>
        )}

        {/* TAB 2: Donations */}
        {activeTab === 2 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50 font-bold text-gray-700">All Donations ({donations.length})</div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['Donor', 'Qty', 'Status', 'Driver', 'Hunger Spot', 'Created'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {donations.map((d) => (
                    <tr key={d._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-gray-800">{d.donor?.name}</div>
                        <div className="text-gray-400 text-xs">{d.donor?.phone}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{d.exactQuantity || d.quantity}</td>
                      <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
                      <td className="px-4 py-3 text-gray-600">{d.assignedDriver?.name || '—'}</td>
                      <td className="px-4 py-3 text-gray-600">{d.hungerSpot?.name || '—'}</td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{formatTime(d.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: Hunger Spots */}
        {activeTab === 3 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-gray-700">Hunger Spots ({hungerSpots.length})</h2>
              <button onClick={() => setShowSpotModal(true)}
                className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
                <PlusCircle size={16} /> Add Spot
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {hungerSpots.map((spot) => (
                <div key={spot._id} className={`bg-white rounded-2xl border shadow-sm p-5 ${spot.isActive ? 'border-gray-100' : 'border-gray-100 opacity-60'}`}>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-gray-800">{spot.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${spot.isActive ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400'}`}>
                      {spot.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex items-start gap-1.5 text-sm text-gray-500 mb-3">
                    <MapPin size={13} className="mt-0.5 flex-shrink-0" />
                    {spot.address}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Cap: <span className="font-bold text-gray-700">{spot.capacity}</span></span>
                    {spot.contactPhone && <span className="text-gray-400 text-xs">{spot.contactPhone}</span>}
                  </div>
                  <button onClick={async () => { if (confirm('Delete this spot?')) { await deleteHungerSpot(spot._id); refresh(); toast.success('Deleted'); } }}
                    className="mt-3 flex items-center gap-1 text-red-500 hover:text-red-700 text-xs font-semibold transition-colors">
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              ))}
              {hungerSpots.length === 0 && (
                <div className="col-span-3 bg-white rounded-2xl p-10 text-center border border-gray-100 text-gray-400">No hunger spots yet. Add one!</div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: Daily Donors */}
        {activeTab === 4 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-gray-700">Daily Donors ({dailyDonors.length})</h2>
              <button onClick={() => setShowDailyModal(true)}
                className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
                <PlusCircle size={16} /> Add Daily Donor
              </button>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['Name', 'Phone', 'Schedule', 'Avg Qty', 'Auto', 'Last Triggered', ''].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {dailyDonors.map((d) => (
                    <tr key={d._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold text-gray-800">{d.name}</td>
                      <td className="px-4 py-3 text-gray-600">{d.phone}</td>
                      <td className="px-4 py-3 font-mono text-gray-700">{d.scheduleTime}</td>
                      <td className="px-4 py-3 text-gray-700">{d.avgQuantity}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${d.autoCreate ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400'}`}>
                          {d.autoCreate ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{formatTime(d.lastTriggered)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleTrigger(d._id)}
                            className="flex items-center gap-1 bg-teal-50 text-teal-600 border border-teal-100 hover:bg-teal-100 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors">
                            <Zap size={11} /> Trigger
                          </button>
                          <button onClick={async () => { if (confirm('Delete?')) { await deleteDailyDonor(d._id); refresh(); } }}
                            className="text-red-400 hover:text-red-600">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {dailyDonors.length === 0 && (
                    <tr><td colSpan={7} className="px-4 py-10 text-center text-gray-400">No daily donors yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: Register Team */}
        {activeTab === 5 && (
          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              <h2 className="text-xl font-black text-gray-800">Register New Team Member</h2>
              <p className="text-gray-400 text-sm mt-1">Create login credentials for drivers and employees</p>
            </div>

            {/* Role Selector */}
            <div className="flex gap-4 mb-6">
              {[{ value: 'driver', label: '🚗 Driver', active: 'border-orange-400 bg-orange-50' }, { value: 'employee', label: '👨‍💼 Employee', active: 'border-blue-400 bg-blue-50' }].map((r) => (
                <button key={r.value} type="button" onClick={() => setRegRole(r.value)}
                  className={`flex-1 p-4 rounded-2xl border-2 font-bold text-gray-700 transition-all ${
                    regRole === r.value ? r.active + ' shadow-md' : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}>
                  {r.label}
                  {regRole === r.value && <span className="ml-2 text-xs bg-white/60 px-2 py-0.5 rounded-full">Selected</span>}
                </button>
              ))}
            </div>

            <form onSubmit={handleRegister}>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[{ key: 'name', label: 'Full Name *', placeholder: 'Full name', type: 'text' },
                    { key: 'username', label: 'Username *', placeholder: 'Login username', type: 'text' },
                    { key: 'phone', label: 'Mobile Number', placeholder: 'Optional', type: 'tel' },
                    { key: 'email', label: 'Email', placeholder: 'Optional', type: 'email' },
                  ].map((f) => (
                    <div key={f.key}>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{f.label}</label>
                      <input type={f.type} placeholder={f.placeholder} value={regForm[f.key]}
                        onChange={(e) => setRegForm({ ...regForm, [f.key]: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-teal-400" />
                    </div>
                  ))}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password *</label>
                  <div className="relative">
                    <input type={showRegPass ? 'text' : 'password'} placeholder="Min. 6 characters" value={regForm.password}
                      onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-teal-400 pr-10" />
                    <button type="button" onClick={() => setShowRegPass(!showRegPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showRegPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Driver fields */}
                {regRole === 'driver' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Vehicle Type</label>
                      <select value={regForm.vehicleType} onChange={(e) => setRegForm({ ...regForm, vehicleType: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-teal-400">
                        <option value="">Select vehicle</option>
                        <option>2-Wheeler</option>
                        <option>3-Wheeler</option>
                        <option>4-Wheeler (Car)</option>
                        <option>Van / Tempo</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">License Number</label>
                      <input type="text" placeholder="e.g. TN01AB1234" value={regForm.licenseNumber}
                        onChange={(e) => setRegForm({ ...regForm, licenseNumber: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-teal-400" />
                    </div>
                  </div>
                )}

                {/* Employee fields */}
                {regRole === 'employee' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Employee ID</label>
                      <input type="text" placeholder="e.g. EMP-001" value={regForm.employeeId}
                        onChange={(e) => setRegForm({ ...regForm, employeeId: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-teal-400" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Department</label>
                      <select value={regForm.department} onChange={(e) => setRegForm({ ...regForm, department: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-teal-400">
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
                  ✅ Admin-created accounts are auto-verified and can login immediately.
                </p>

                <button type="submit" disabled={regLoading}
                  className="w-full bg-teal-700 hover:bg-teal-800 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2">
                  {regLoading
                    ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : <><UserPlus size={18} /> Create {regRole.charAt(0).toUpperCase() + regRole.slice(1)} Account</>
                  }
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 6: Users */}
        {activeTab === 6 && (
          <div className="space-y-4">
            {/* User stats bar */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {[
                { label: 'Drivers', value: userStats.totalDrivers, icon: '🚗' },
                { label: 'Active', value: userStats.activeDrivers, icon: '✅' },
                { label: 'Volunteers', value: userStats.totalVolunteers, icon: '🤝' },
                { label: 'Employees', value: userStats.totalEmployees, icon: '👨‍💼' },
                { label: 'Donors', value: userStats.totalDonors, icon: '❤️' },
                { label: 'Blocked', value: userStats.blockedUsers, icon: '🚫' },
              ].map((s) => (
                <div key={s.label} className="bg-white border border-gray-100 rounded-xl p-3 text-center shadow-sm">
                  <div className="text-xl mb-0.5">{s.icon}</div>
                  <div className="text-xl font-black text-gray-800">{s.value ?? '—'}</div>
                  <div className="text-xs text-gray-400 font-medium">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Search by name, username, phone…"
                  value={userSearch} onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-teal-400" />
              </div>
              <select value={filterRole} onChange={(e) => { setFilterRole(e.target.value); setUserPage(1); }}
                className="w-full sm:w-44 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-teal-400">
                <option value="">All Roles</option>
                <option value="employee">Employee</option>
                <option value="driver">Driver</option>
                <option value="volunteer">Volunteer</option>
                <option value="donor">Donor</option>
                <option value="admin">Admin</option>
              </select>
              <button onClick={() => fetchUsers(filterRole, userPage)}
                className="flex items-center gap-2 border border-gray-200 text-gray-600 hover:border-teal-400 hover:text-teal-600 px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
                <RefreshCw size={14} /> Refresh
              </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {usersLoading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="animate-spin rounded-full h-10 w-10 border-4 border-teal-500 border-t-transparent" />
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <div className="text-4xl mb-2">🔍</div>
                  <p className="font-medium">No users found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        {['User', 'Role', 'Contact', 'Status', 'Joined', 'Actions'].map((h) => (
                          <th key={h} className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredUsers.map((u) => (
                        <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                                {u.name?.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-semibold text-gray-800">{u.name}</div>
                                <div className="text-gray-400 text-xs">{u.username || '—'}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${roleBadge[u.role]}`}>
                              {roleIcon[u.role]} {u.role}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-sm">
                            <div className="text-gray-600">{u.phone || '—'}</div>
                            <div className="text-gray-400 text-xs">{u.email || ''}</div>
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex flex-col gap-1">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                                u.isBlocked ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                              }`}>
                                {u.isBlocked ? '🚫 Blocked' : '✅ Active'}
                              </span>
                              {!u.isVerified && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-600">
                                  ⏳ Unverified
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-5 py-3 text-xs text-gray-400">
                            {new Date(u.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="px-5 py-3">
                            {u.role !== 'admin' && (
                              <div className="flex items-center gap-1.5">
                                {!u.isVerified && (
                                  <button onClick={() => handleVerifyUser(u._id)} title="Verify"
                                    className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition-colors">
                                    <ShieldCheck size={15} />
                                  </button>
                                )}
                                <button onClick={() => handleToggleBlock(u._id)} title={u.isBlocked ? 'Unblock' : 'Block'}
                                  className={`p-1.5 rounded-lg transition-colors ${
                                    u.isBlocked ? 'text-green-600 hover:bg-green-50' : 'text-orange-500 hover:bg-orange-50'
                                  }`}>
                                  {u.isBlocked ? <UserCheck size={15} /> : <UserX size={15} />}
                                </button>
                                <button onClick={() => handleDeleteUser(u._id, u.name)} title="Delete"
                                  className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors">
                                  <Trash2 size={15} />
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
            {userTotalPages > 1 && (
              <div className="flex justify-center gap-2">
                <button onClick={() => setUserPage((p) => Math.max(1, p - 1))} disabled={userPage === 1}
                  className="px-4 py-2 text-sm rounded-xl border border-gray-200 disabled:opacity-40 hover:border-teal-400 transition-colors">← Prev</button>
                <span className="px-4 py-2 text-sm text-gray-500">Page {userPage} of {userTotalPages}</span>
                <button onClick={() => setUserPage((p) => Math.min(userTotalPages, p + 1))} disabled={userPage === userTotalPages}
                  className="px-4 py-2 text-sm rounded-xl border border-gray-200 disabled:opacity-40 hover:border-teal-400 transition-colors">Next →</button>
              </div>
            )}
          </div>
        )}
      </div>


      {/* Add Hunger Spot Modal */}
      {showSpotModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <h3 className="font-bold text-gray-800 mb-4">Add Hunger Spot</h3>
            <form onSubmit={handleCreateSpot} className="space-y-3">
              {[
                { key: 'name', label: 'Name', placeholder: 'e.g. Rajiv Gandhi Shelter' },
                { key: 'address', label: 'Address', placeholder: 'Full address' },
                { key: 'lng', label: 'Longitude', placeholder: 'e.g. 80.2707', type: 'number' },
                { key: 'lat', label: 'Latitude', placeholder: 'e.g. 13.0827', type: 'number' },
                { key: 'capacity', label: 'Capacity (plates)', placeholder: 'e.g. 100', type: 'number' },
                { key: 'contactName', label: 'Contact Name', placeholder: 'Optional' },
                { key: 'contactPhone', label: 'Contact Phone', placeholder: 'Optional' },
              ].map((f) => (
                <div key={f.key}>
                  <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">{f.label}</label>
                  <input type={f.type || 'text'} step="any" value={spotForm[f.key]}
                    onChange={(e) => setSpotForm({ ...spotForm, [f.key]: e.target.value })}
                    placeholder={f.placeholder}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-teal-400"
                    required={!['contactName', 'contactPhone'].includes(f.key)} />
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowSpotModal(false)} className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-xl text-sm font-semibold hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-xl text-sm font-semibold">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Daily Donor Modal */}
      {showDailyModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <h3 className="font-bold text-gray-800 mb-4">Add Daily Donor</h3>
            <form onSubmit={handleCreateDailyDonor} className="space-y-3">
              {[
                { key: 'name', label: 'Name', placeholder: 'Restaurant / Hostel name' },
                { key: 'phone', label: 'Phone', placeholder: '10-digit mobile', type: 'tel' },
                { key: 'address', label: 'Address', placeholder: 'Pickup address' },
                { key: 'scheduleTime', label: 'Schedule Time (HH:MM)', placeholder: 'e.g. 13:00', type: 'time' },
                { key: 'avgQuantity', label: 'Average Quantity (plates)', placeholder: 'e.g. 100', type: 'number' },
              ].map((f) => (
                <div key={f.key}>
                  <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">{f.label}</label>
                  <input type={f.type || 'text'} value={dailyForm[f.key]}
                    onChange={(e) => setDailyForm({ ...dailyForm, [f.key]: e.target.value })}
                    placeholder={f.placeholder}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-teal-400"
                    required />
                </div>
              ))}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">Food Type</label>
                <select value={dailyForm.foodType} onChange={(e) => setDailyForm({ ...dailyForm, foodType: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-teal-400">
                  <option value="veg">Vegetarian</option>
                  <option value="non-veg">Non-Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowDailyModal(false)} className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-xl text-sm font-semibold hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-xl text-sm font-semibold">Add Donor</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Needed for stats card — inline because we can't import normally without adding to comp
function CheckCircle2(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
