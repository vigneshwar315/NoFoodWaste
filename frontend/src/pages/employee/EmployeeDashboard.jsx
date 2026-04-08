import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../hooks/useSocket';
import StatusBadge from '../../components/StatusBadge';
import toast from 'react-hot-toast';
import {
  getPendingVerifications,
  verifyDonation,
  approveDonation,
  rejectDonation,
  getAllDonations,
  getDonationStats,
  manualAssign,
} from '../../services/donationService';
import { getAllDeliveries } from '../../services/deliveryService';
import {
  Phone, CheckCircle, XCircle, AlertTriangle, Clock, MapPin,
  LogOut, Users, TrendingUp, Package, Truck, RefreshCw, ChevronRight
} from 'lucide-react';

const TABS = ['Pending Requests', 'Verification Panel', 'Active Donations', 'All Donations'];

export default function EmployeeDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [pending, setPending] = useState([]);
  const [allDonations, setAllDonations] = useState([]);
  const [activeDeliveries, setActiveDeliveries] = useState([]);
  const [stats, setStats] = useState({});
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [verifyForm, setVerifyForm] = useState({
    foodType: 'veg', exactQuantity: '', preparedAt: '',
    pickupAddress: '', lng: '', lat: '', verificationNotes: '', foodDescription: '',
  });
  const [verifyResult, setVerifyResult] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  const refreshPending = useCallback(async () => {
    try {
      const res = await getPendingVerifications();
      setPending(res.data.donations || []);
    } catch (_) {}
  }, []);

  const refreshStats = useCallback(async () => {
    try {
      const res = await getDonationStats();
      setStats(res.data.stats || {});
    } catch (_) {}
  }, []);

  const refreshAll = useCallback(async () => {
    try {
      const res = await getAllDonations();
      setAllDonations(res.data.donations || []);
    } catch (_) {}
  }, []);

  const refreshActiveDeliveries = useCallback(async () => {
    try {
      const res = await getAllDeliveries('accepted');
      setActiveDeliveries(res.data.deliveries || []);
    } catch (_) {}
  }, []);

  useEffect(() => {
    refreshPending();
    refreshStats();
    refreshAll();
    refreshActiveDeliveries();
  }, []);

  // Socket.io — listen for new donations
  useSocket({
    rooms: [],
    listeners: {
      newDonationRequest: (data) => {
        toast(`📞 New donation request! Qty: ${data.quantity} plates`, { icon: '🍱' });
        refreshPending();
        refreshStats();
      },
      verificationPending: () => { refreshPending(); },
      noDriverAvailable: (data) => {
        toast.error(`⚠️ No driver available for donation ${data.donationId}`);
        refreshAll();
      },
    },
  });

  // Join employee room on mount
  useEffect(() => {
    const { io } = require('socket.io-client');
    // Handled via useSocket, just emit join
  }, []);

  const handleVerify = async () => {
    if (!selected) return;
    if (!verifyForm.exactQuantity || !verifyForm.preparedAt) {
      return toast.error('Quantity and preparation time are required');
    }
    setLoading(true);
    try {
      const res = await verifyDonation({
        donationId: selected._id,
        foodType: verifyForm.foodType,
        exactQuantity: Number(verifyForm.exactQuantity),
        preparedAt: verifyForm.preparedAt,
        pickupAddress: verifyForm.pickupAddress,
        pickupLocation: verifyForm.lng && verifyForm.lat
          ? { coordinates: [parseFloat(verifyForm.lng), parseFloat(verifyForm.lat)] }
          : undefined,
        verificationNotes: verifyForm.verificationNotes,
        foodDescription: verifyForm.foodDescription,
      });
      setVerifyResult(res.data);
      if (res.data.etaWarning) {
        toast.error('⚠️ ETA exceeds food expiry window!', { duration: 6000 });
      } else {
        toast.success('✅ Donation verified');
      }
      refreshPending();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (force = false) => {
    if (!selected) return;
    setLoading(true);
    try {
      const res = await approveDonation({ donationId: selected._id, forceApprove: force });
      toast.success(res.data.message);
      setSelected(null);
      setVerifyResult(null);
      refreshPending();
      refreshAll();
      refreshStats();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Approval failed');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selected || !rejectReason.trim()) return toast.error('Please provide a reason');
    setLoading(true);
    try {
      await rejectDonation({ donationId: selected._id, reason: rejectReason });
      toast.success('Donation rejected');
      setShowRejectModal(false);
      setSelected(null);
      setVerifyResult(null);
      setRejectReason('');
      refreshPending();
      refreshAll();
      refreshStats();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Rejection failed');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (t) => t ? new Date(t).toLocaleString('en-IN') : '—';
  const formatMins = (s) => s ? `${Math.ceil(s / 60)} min` : '—';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-black">Employee Dashboard</h1>
            <p className="text-white/70 text-xs">Donation Verification & Management</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium hidden sm:block">{user?.name}</span>
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-sm transition-colors"
          >
            <LogOut size={15} /> Logout
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="max-w-6xl mx-auto flex gap-6 overflow-x-auto text-sm">
          {[
            { label: 'Pending', value: stats.pending_verification || 0, color: 'text-yellow-600', icon: '⏳' },
            { label: 'Validated', value: stats.validated || 0, color: 'text-indigo-600', icon: '✅' },
            { label: 'Assigned', value: stats.assigned || 0, color: 'text-purple-600', icon: '🚚' },
            { label: 'Delivered', value: stats.delivered || 0, color: 'text-green-600', icon: '🎉' },
            { label: 'Rejected', value: (stats.rejected || 0) + (stats.expired || 0), color: 'text-red-600', icon: '❌' },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-2 whitespace-nowrap">
              <span>{s.icon}</span>
              <span className="text-gray-500">{s.label}:</span>
              <span className={`font-bold ${s.color}`}>{s.value}</span>
            </div>
          ))}
          <button onClick={() => { refreshPending(); refreshStats(); refreshAll(); }} className="ml-auto flex items-center gap-1 text-gray-400 hover:text-blue-600 transition-colors">
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="max-w-6xl mx-auto flex gap-0">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === i
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
              {i === 0 && pending.length > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                  {pending.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* TAB 0: Pending Requests */}
        {activeTab === 0 && (
          <div className="space-y-3">
            {pending.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                <div className="text-4xl mb-3">🎉</div>
                <p className="text-gray-500 font-medium">No pending verification requests</p>
              </div>
            ) : (
              pending.map((d) => (
                <div key={d._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 hover:border-blue-200 transition-colors">
                  <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-yellow-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-gray-800">{d.donor?.name}</span>
                      <span className="text-gray-400 text-sm">{d.donor?.phone}</span>
                      <StatusBadge status={d.status} />
                      {d.isScheduled && <span className="text-xs bg-green-50 text-green-600 border border-green-200 rounded-full px-2 py-0.5">Scheduled</span>}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {d.quantity} plates • Received {formatTime(d.createdAt)}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelected(d);
                      setVerifyResult(null);
                      setVerifyForm({
                        foodType: 'veg', exactQuantity: d.quantity, preparedAt: '',
                        pickupAddress: d.pickupAddress || '', lng: d.pickupLocation?.coordinates[0] || '',
                        lat: d.pickupLocation?.coordinates[1] || '', verificationNotes: '', foodDescription: d.foodDescription || '',
                      });
                      setActiveTab(1);
                    }}
                    className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
                  >
                    Verify <ChevronRight size={15} />
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 1: Verification Panel */}
        {activeTab === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Select Donation */}
            <div className="space-y-3">
              <h2 className="font-bold text-gray-700 text-sm uppercase tracking-wide">Select Request to Verify</h2>
              {pending.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 text-gray-400">No pending requests</div>
              ) : (
                pending.map((d) => (
                  <button
                    key={d._id}
                    onClick={() => {
                      setSelected(d);
                      setVerifyResult(null);
                      setVerifyForm({
                        foodType: 'veg', exactQuantity: d.quantity, preparedAt: '',
                        pickupAddress: d.pickupAddress || '', lng: '', lat: '', verificationNotes: '', foodDescription: '',
                      });
                    }}
                    className={`w-full text-left bg-white rounded-2xl border p-4 transition-all ${
                      selected?._id === d._id ? 'border-blue-500 shadow-md' : 'border-gray-100 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold text-gray-800">{d.donor?.name} — {d.donor?.phone}</div>
                    <div className="text-sm text-gray-500">{d.quantity} plates · {formatTime(d.createdAt)}</div>
                  </button>
                ))
              )}
            </div>

            {/* Right: Verification Form */}
            <div className="space-y-4">
              {selected ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-bold text-gray-800">Verify: {selected.donor?.name}</h2>
                    <StatusBadge status={selected.status} />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Food Type</label>
                      <select value={verifyForm.foodType} onChange={(e) => setVerifyForm({ ...verifyForm, foodType: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400">
                        <option value="veg">Vegetarian</option>
                        <option value="non-veg">Non-Vegetarian</option>
                        <option value="vegan">Vegan</option>
                        <option value="mixed">Mixed</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Exact Quantity (plates)</label>
                      <input type="number" min="30" value={verifyForm.exactQuantity}
                        onChange={(e) => setVerifyForm({ ...verifyForm, exactQuantity: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                        placeholder="e.g. 50" />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Preparation Time</label>
                    <input type="datetime-local" value={verifyForm.preparedAt}
                      onChange={(e) => setVerifyForm({ ...verifyForm, preparedAt: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Food Description</label>
                    <input type="text" value={verifyForm.foodDescription}
                      onChange={(e) => setVerifyForm({ ...verifyForm, foodDescription: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                      placeholder="e.g. Biryani + Dal + Rice" />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Pickup Address</label>
                    <input type="text" value={verifyForm.pickupAddress}
                      onChange={(e) => setVerifyForm({ ...verifyForm, pickupAddress: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                      placeholder="Full address" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Longitude</label>
                      <input type="number" step="any" value={verifyForm.lng}
                        onChange={(e) => setVerifyForm({ ...verifyForm, lng: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                        placeholder="e.g. 80.2707" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Latitude</label>
                      <input type="number" step="any" value={verifyForm.lat}
                        onChange={(e) => setVerifyForm({ ...verifyForm, lat: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                        placeholder="e.g. 13.0827" />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Verification Notes</label>
                    <textarea rows={2} value={verifyForm.verificationNotes}
                      onChange={(e) => setVerifyForm({ ...verifyForm, verificationNotes: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400 resize-none"
                      placeholder="Notes from the verification call..." />
                  </div>

                  <button
                    onClick={handleVerify} disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-2.5 rounded-xl font-semibold text-sm transition-colors"
                  >
                    {loading ? 'Calculating ETA & Verifying...' : '📞 Submit Verification'}
                  </button>

                  {/* ETA Result */}
                  {verifyResult && (
                    <div className={`rounded-2xl border p-4 ${verifyResult.etaWarning ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                      <div className="flex items-center gap-2 mb-3">
                        {verifyResult.etaWarning
                          ? <AlertTriangle className="w-5 h-5 text-red-500" />
                          : <CheckCircle className="w-5 h-5 text-green-500" />}
                        <span className={`font-bold ${verifyResult.etaWarning ? 'text-red-700' : 'text-green-700'}`}>
                          {verifyResult.etaWarning ? '⚠️ ETA Exceeds Expiry Window!' : '✅ Feasible Delivery'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Clock size={14} /> ETA: <span className="font-bold">{formatMins(verifyResult.etaSeconds)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <MapPin size={14} /> Spot: <span className="font-bold truncate">{verifyResult.nearestHungerSpot?.name || 'None found'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Truck size={14} /> Driver: <span className="font-bold">{verifyResult.nearestDriver?.name || 'None found'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Clock size={14} /> Remaining: <span className="font-bold">{formatMins(verifyResult.expiryInfo?.remainingMinutes * 60)}</span>
                        </div>
                      </div>

                      {/* Approve / Reject buttons */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleApprove(false)} disabled={loading}
                          className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white py-2 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle size={16} /> Approve
                        </button>
                        {verifyResult.etaWarning && (
                          <button
                            onClick={() => handleApprove(true)} disabled={loading}
                            className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white py-2 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-1.5"
                          >
                            <AlertTriangle size={16} /> Force Approve
                          </button>
                        )}
                        <button
                          onClick={() => setShowRejectModal(true)} disabled={loading}
                          className="flex-1 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 py-2 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-1.5"
                        >
                          <XCircle size={16} /> Reject
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                  <p className="text-gray-400">Select a pending request from the left to verify</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: Active Donations */}
        {activeTab === 2 && (
          <div className="space-y-3">
            {['assigned', 'picked', 'in_transit'].map((status) => {
              const items = allDonations.filter((d) => d.status === status);
              if (!items.length) return null;
              return (
                <div key={status}>
                  <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">{status.replace('_', ' ')}</h3>
                  {items.map((d) => (
                    <div key={d._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-2 flex items-center gap-4">
                      <StatusBadge status={d.status} size="lg" />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800">{d.donor?.name}</div>
                        <div className="text-sm text-gray-500">{d.exactQuantity || d.quantity} plates · {d.pickupAddress || '—'}</div>
                      </div>
                      <div className="text-sm text-gray-500">
                        Driver: <span className="font-semibold text-gray-700">{d.assignedDriver?.name || '—'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
            {allDonations.filter((d) => ['assigned', 'picked', 'in_transit'].includes(d.status)).length === 0 && (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 text-gray-400">No active donations right now</div>
            )}
          </div>
        )}

        {/* TAB 3: All Donations */}
        {activeTab === 3 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Donor', 'Quantity', 'Status', 'Driver', 'Created'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {allDonations.map((d) => (
                  <tr key={d._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-gray-800">{d.donor?.name}</div>
                      <div className="text-gray-400 text-xs">{d.donor?.phone}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{d.exactQuantity || d.quantity} plates</td>
                    <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
                    <td className="px-4 py-3 text-gray-600">{d.assignedDriver?.name || '—'}</td>
                    <td className="px-4 py-3 text-gray-400">{formatTime(d.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {allDonations.length === 0 && (
              <div className="p-12 text-center text-gray-400">No donations yet</div>
            )}
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <h3 className="font-bold text-gray-800 mb-4">Reject Donation</h3>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Reason for rejection..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red-400 resize-none mb-4"
            />
            <div className="flex gap-3">
              <button onClick={() => setShowRejectModal(false)} className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleReject} disabled={loading} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-60">
                {loading ? 'Rejecting...' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
