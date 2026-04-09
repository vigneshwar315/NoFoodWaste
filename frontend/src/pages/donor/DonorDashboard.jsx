import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../hooks/useSocket';
import StatusBadge from '../../components/StatusBadge';
import { getMyDonations, getDonationById } from '../../services/donationService';
import { GoogleMap, MarkerF } from '@react-google-maps/api';
import { useGoogleMaps } from '../../context/GoogleMapsContext';
import toast from 'react-hot-toast';
import { Gift, Phone, LogOut, RefreshCw, MapPin, Clock, Truck, Eye } from 'lucide-react';

export default function DonorDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { isLoaded: mapsLoaded } = useGoogleMaps();
  const [donations, setDonations] = useState([]);
  const [activeDonation, setActiveDonation] = useState(null);
  const [activeDetail, setActiveDetail] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [showTrackModal, setShowTrackModal] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const res = await getMyDonations();
      const all = res.data.donations || [];
      setDonations(all);
      const active = all.find((d) => ['assigned', 'picked', 'in_transit', 'validated'].includes(d.status));
      setActiveDonation(active || null);
    } catch (_) {}
  }, []);

  useEffect(() => { refresh(); }, []);

  const handleTrack = async (donation) => {
    try {
      const res = await getDonationById(donation._id);
      setActiveDetail(res.data.donation);
      setDriverLocation(
        res.data.donation?.assignedDriver?.currentLocation?.coordinates
          ? [res.data.donation.assignedDriver.currentLocation.coordinates[1], res.data.donation.assignedDriver.currentLocation.coordinates[0]]
          : null
      );
      setShowTrackModal(true);
    } catch (_) {}
  };

  // Real-time: listen to active donation room
  useSocket({
    rooms: activeDonation ? [`donation_${activeDonation._id}`] : [],
    listeners: {
      deliveryStatusUpdate: (data) => {
        toast(`🚚 Status: ${data.status}`, { icon: '📦' });
        refresh();
      },
      locationUpdate: (data) => {
        if (data.coordinates) {
          setDriverLocation([data.coordinates[1], data.coordinates[0]]);
        }
      },
    },
  });

  const formatTime = (t) => t ? new Date(t).toLocaleString('en-IN') : '—';
  const getStatusColor = (s) => ({
    pending_verification: 'border-l-yellow-400',
    verified: 'border-l-blue-400',
    validated: 'border-l-indigo-400',
    assigned: 'border-l-purple-400',
    picked: 'border-l-orange-400',
    in_transit: 'border-l-cyan-400',
    delivered: 'border-l-green-500',
    failed: 'border-l-red-400',
    rejected: 'border-l-red-300',
    expired: 'border-l-gray-300',
  }[s] || 'border-l-gray-200');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-black">Donor Dashboard</h1>
            <p className="text-white/70 text-xs">{user?.name} · {user?.phone}</p>
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

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Active Donation Banner */}
        {activeDonation && (
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                <span className="font-bold text-orange-700">Active Donation</span>
              </div>
              <StatusBadge status={activeDonation.status} size="lg" />
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-orange-500" />
                {activeDonation.exactQuantity || activeDonation.quantity} plates ·
                Expires: {formatTime(activeDonation.expiresAt)}
              </div>
              {activeDonation.assignedDriver && (
                <div className="flex items-center gap-2">
                  <Truck size={14} className="text-blue-500" />
                  Driver: <span className="font-semibold">{activeDonation.assignedDriver.name}</span>
                  · {activeDonation.assignedDriver.phone}
                </div>
              )}
              {activeDonation.hungerSpot && (
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-green-500" />
                  Delivering to: <span className="font-semibold">{activeDonation.hungerSpot.name}</span>
                </div>
              )}
            </div>
            {['assigned', 'picked', 'in_transit'].includes(activeDonation.status) && (
              <button onClick={() => handleTrack(activeDonation)}
                className="mt-3 flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
                <MapPin size={15} /> Track Live
              </button>
            )}
          </div>
        )}

        {/* How to Donate */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Phone size={18} className="text-rose-500" /> How to Donate
          </h2>
          <div className="space-y-3">
            {[
              { step: '1', text: 'Call our IVR number and press the quantity (number of plates) when prompted' },
              { step: '2', text: 'Our employee will call you back to verify the food details' },
              { step: '3', text: 'Track your donation live on this dashboard after approval' },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-3">
                <div className="w-7 h-7 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0">
                  {item.step}
                </div>
                <p className="text-gray-600 text-sm pt-1">{item.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-rose-50 border border-rose-100 rounded-xl px-4 py-3 text-sm">
            <span className="font-bold text-rose-600">Minimum donation:</span>
            <span className="text-rose-700"> 30 plates</span>
            <span className="text-gray-500"> · Food must be consumed within 4 hours (FSSAI guideline)</span>
          </div>
        </div>

        {/* Donation History */}
        <div>
          <h2 className="font-bold text-gray-700 mb-3">My Donations ({donations.length})</h2>
          <div className="space-y-3">
            {donations.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center border border-gray-100 text-gray-400">
                No donations yet. Make your first call!
              </div>
            ) : (
              donations.map((d) => (
                <div key={d._id} className={`bg-white rounded-2xl border-l-4 border border-gray-100 shadow-sm p-4 ${getStatusColor(d.status)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-gray-800">
                      {d.exactQuantity || d.quantity} plates · <span className="capitalize text-gray-500">{d.foodType || 'Food'}</span>
                    </div>
                    <StatusBadge status={d.status} />
                  </div>
                  <div className="text-sm text-gray-500 space-y-0.5">
                    <div>{d.pickupAddress || 'Address pending verification'}</div>
                    <div className="text-xs">Created: {formatTime(d.createdAt)}</div>
                    {d.expiresAt && (
                      <div className="text-xs">Expires: {formatTime(d.expiresAt)}</div>
                    )}
                    {d.rejectionReason && (
                      <div className="text-xs text-red-500 mt-1">Reason: {d.rejectionReason}</div>
                    )}
                  </div>
                  {d.assignedDriver && (
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-gray-500">Driver: <span className="font-semibold text-gray-700">{d.assignedDriver.name}</span></span>
                      {['assigned', 'picked', 'in_transit'].includes(d.status) && (
                        <button onClick={() => handleTrack(d)}
                          className="flex items-center gap-1 text-xs bg-blue-50 text-blue-600 border border-blue-100 px-2.5 py-1 rounded-lg font-semibold hover:bg-blue-100 transition-colors">
                          <Eye size={12} /> Track
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Live Track Modal */}
      {showTrackModal && activeDetail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="font-bold text-gray-800">Live Tracking</div>
              <button onClick={() => setShowTrackModal(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">×</button>
            </div>
            <div style={{ height: 320 }}>
              {!mapsLoaded ? (
                <div className="flex items-center justify-center h-full bg-gray-50">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-rose-500 border-t-transparent" />
                </div>
              ) : (
                <GoogleMap
                  mapContainerStyle={{ height: '100%', width: '100%' }}
                  center={
                    driverLocation
                      ? { lat: driverLocation[0], lng: driverLocation[1] }
                      : { lat: 13.0827, lng: 80.2707 }
                  }
                  zoom={14}
                  options={{ fullscreenControl: false, streetViewControl: false, mapTypeControl: false }}
                >
                  {/* Driver marker (blue) */}
                  {driverLocation && (
                    <MarkerF
                      position={{ lat: driverLocation[0], lng: driverLocation[1] }}
                      icon={{ url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png' }}
                      title={`Driver: ${activeDetail.assignedDriver?.name}`}
                    />
                  )}
                  {/* Pickup location marker (orange) */}
                  {activeDetail?.pickupLocation?.coordinates?.[0] !== 0 && (
                    <MarkerF
                      position={{
                        lat: activeDetail.pickupLocation.coordinates[1],
                        lng: activeDetail.pickupLocation.coordinates[0],
                      }}
                      icon={{ url: 'https://maps.google.com/mapfiles/ms/icons/orange-dot.png' }}
                      title="Pickup Location"
                    />
                  )}
                </GoogleMap>
              )}
            </div>
            <div className="px-5 py-4 text-sm text-gray-600 border-t border-gray-50">
              <div className="font-semibold">{activeDetail.assignedDriver?.name}</div>
              <div className="text-gray-400">{activeDetail.assignedDriver?.phone}</div>
              <StatusBadge status={activeDetail.status} size="lg" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
