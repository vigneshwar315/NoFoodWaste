import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/StatusBadge';
import { getMyDeliveries, acceptDelivery } from '../../services/deliveryService';
import toast from 'react-hot-toast';
import { Heart, LogOut, RefreshCw, MapPin, Package, CheckCircle } from 'lucide-react';

export default function VolunteerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const res = await getMyDeliveries();
      setDeliveries(res.data.deliveries || []);
    } catch (_) {}
  }, []);

  useEffect(() => { refresh(); }, []);

  const handleAccept = async (deliveryId) => {
    setLoading(true);
    try {
      await acceptDelivery(deliveryId);
      toast.success('Delivery accepted!');
      refresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (t) => t ? new Date(t).toLocaleString('en-IN') : '—';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-green-500 to-emerald-700 text-white px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-black">Volunteer Dashboard</h1>
            <p className="text-white/70 text-xs">{user?.name} · Assist Deliveries</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={refresh} className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"><RefreshCw size={16} /></button>
          <button onClick={() => { logout(); navigate('/'); }}
            className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-sm transition-colors">
            <LogOut size={15} /> Logout
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        {!user?.isVerified && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 text-sm text-yellow-700 font-medium">
            ⏳ Your account is pending admin verification. Deliveries will be visible once approved.
          </div>
        )}

        <h2 className="font-bold text-gray-700">My Assigned Deliveries</h2>

        {deliveries.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <div className="text-4xl mb-3">🤝</div>
            <p className="text-gray-500 font-medium">No deliveries assigned yet</p>
            <p className="text-gray-400 text-sm mt-1">The admin will assign you to nearby deliveries</p>
          </div>
        ) : (
          deliveries.map((d) => (
            <div key={d._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <StatusBadge status={d.status} size="lg" />
                <span className="text-xs text-gray-400">{formatTime(d.createdAt)}</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <MapPin size={15} className="text-orange-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-gray-700">Pickup: </span>
                    <span className="text-gray-500">{d.donation?.pickupAddress || '—'}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Package size={15} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-gray-700">Deliver to: </span>
                    <span className="text-gray-500">{d.hungerSpot?.name || d.donation?.hungerSpot?.name || '—'}</span>
                  </div>
                </div>
                <div className="text-gray-500">
                  Quantity: <span className="font-semibold text-gray-700">{d.donation?.exactQuantity || d.donation?.quantity} plates</span>
                </div>
              </div>
              {d.status === 'assigned' && (
                <button onClick={() => handleAccept(d._id)} disabled={loading}
                  className="mt-4 w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl font-semibold text-sm transition-colors disabled:opacity-60">
                  <CheckCircle size={16} /> Accept Delivery
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
