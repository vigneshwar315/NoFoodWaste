import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../hooks/useSocket';
import StatusBadge from '../../components/StatusBadge';
import toast from 'react-hot-toast';
import { GoogleMap, MarkerF, DirectionsRenderer } from '@react-google-maps/api';
import { useGoogleMaps } from '../../context/GoogleMapsContext';

import {
  getMyDeliveries,
  acceptDelivery,
  rejectDelivery,
  confirmPickup,
  startTransit,
  completeDelivery,
  failDelivery,
  updateLocation,
} from '../../services/deliveryService';
import {
  Truck, CheckCircle, XCircle, LogOut, Navigation, MapPin,
  Camera, Package, RefreshCw, AlertTriangle, Power
} from 'lucide-react';




export default function DriverDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [deliveries, setDeliveries] = useState([]);
  const [activeDelivery, setActiveDelivery] = useState(null);
  const [driverPos, setDriverPos] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const locationIntervalRef = useRef(null);
  const [completeForm, setCompleteForm] = useState({ quantity: '', condition: 'good', remarks: '' });
  const [pickupPhoto, setPickupPhoto] = useState(null);
  const [deliveryPhoto, setDeliveryPhoto] = useState(null);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  // ── Fleet Tracking (Always Online) ─────────────────────────────────────────
  const [isTrackingEnabled, setIsTrackingEnabled] = useState(() => {
    return localStorage.getItem('driver_tracking') === 'true';
  });

  const toggleTracking = () => {
    const newState = !isTrackingEnabled;
    setIsTrackingEnabled(newState);
    localStorage.setItem('driver_tracking', newState.toString());
    if (newState) toast.success('📡 You are now online and tracking is active!');
    else toast('📴 You are now offline. Tracking stopped.', { icon: '🛑' });
  };

  // ── Google Maps — loaded once at app root via GoogleMapsProvider ─────
  const { isLoaded } = useGoogleMaps();
  const [directions, setDirections] = useState(null);
  const [mapRef, setMapRef] = useState(null);


  const refresh = useCallback(async () => {
    try {
      const res = await getMyDeliveries();
      const all = res.data.deliveries || [];
      setDeliveries(all);
      const active = all.find((d) => ['assigned', 'accepted', 'picked_up', 'in_transit'].includes(d.status));
      setActiveDelivery(active || null);
    } catch (_) {}
  }, []);

  useEffect(() => { refresh(); }, []);

  // Real-time location sharing when delivery is active OR user manually enabled Fleet Tracking
  useEffect(() => {
    const hasActiveDelivery = activeDelivery && ['accepted', 'picked_up', 'in_transit'].includes(activeDelivery.status);
    
    // Stop tracking entirely if not explicitly online AND no active delivery exists
    if (!hasActiveDelivery && !isTrackingEnabled) {
      if (locationIntervalRef.current) clearInterval(locationIntervalRef.current);
      return;
    }

    const shareLocation = () => {
      if (!navigator.geolocation) return;
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        const pos = [coords.latitude, coords.longitude];
        setDriverPos(pos);
        updateLocation([coords.longitude, coords.latitude]).catch(() => {});
      });
    };

    shareLocation();
    locationIntervalRef.current = setInterval(shareLocation, 10000); // every 10s
    return () => clearInterval(locationIntervalRef.current);
  }, [activeDelivery?.status, isTrackingEnabled]);

  // Fetch turn-by-turn route from Google Maps Directions API.
  // Route switches automatically based on delivery status:
  //   accepted          → driver’s live position → pickup address
  //   picked_up/in_transit → pickup → hunger spot (final destination)
  useEffect(() => {
    if (!isLoaded || !activeDelivery) { setDirections(null); return; }
    const status = activeDelivery.status;
    const pickupCoords = getPickupCoords();
    const destCoords   = getDestCoords();
    let origin = null, destination = null;

    if (status === 'accepted' && driverPos) {
      origin      = { lat: driverPos[0], lng: driverPos[1] };
      if (pickupCoords) destination = { lat: pickupCoords[0], lng: pickupCoords[1] };
    } else if (['picked_up', 'in_transit'].includes(status)) {
      if (pickupCoords) origin      = { lat: pickupCoords[0], lng: pickupCoords[1] };
      if (destCoords)   destination = { lat: destCoords[0],   lng: destCoords[1]   };
    }
    if (!origin || !destination || !window.google) return;

    new window.google.maps.DirectionsService().route(
      { origin, destination, travelMode: window.google.maps.TravelMode.DRIVING },
      (result, status) => {
        if (status === 'OK') {
          setDirections(result);
          // Zoom map to show the full route
          if (mapRef) {
            const bounds = new window.google.maps.LatLngBounds();
            result.routes[0].overview_path.forEach((p) => bounds.extend(p));
            mapRef.fitBounds(bounds, { padding: 50 });
          }
        } else {
          setDirections(null);
        }
      }
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, driverPos?.[0], driverPos?.[1], activeDelivery?._id, activeDelivery?.status]);

  // Socket — new assignment notification
  useSocket({
    rooms: [`driver_${user?._id}`],
    listeners: {
      driverAssigned: (data) => {
        toast.success('🚚 New delivery assigned to you!', { duration: 6000 });
        refresh();
      },
    },
  });

  const handleAccept = async () => {
    if (!activeDelivery) return;
    setLoading(true);
    try {
      await acceptDelivery(activeDelivery._id);
      toast.success('Delivery accepted!');
      refresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!activeDelivery || !rejectReason) return toast.error('Reason required');
    setLoading(true);
    try {
      const res = await rejectDelivery(activeDelivery._id, rejectReason);
      toast.success(res.data.message);
      setShowRejectModal(false);
      setRejectReason('');
      refresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePickup = async () => {
    if (!activeDelivery) return;
    setLoading(true);
    try {
      await confirmPickup(activeDelivery._id, pickupPhoto);
      toast.success('✅ Pickup confirmed!');
      setPickupPhoto(null);
      refresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  const handleStartTransit = async () => {
    setLoading(true);
    try {
      await startTransit(activeDelivery._id);
      toast.success('🚗 Now in transit!');
      refresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!completeForm.quantity) return toast.error('Enter quantity delivered');
    setLoading(true);
    try {
      await completeDelivery(activeDelivery._id, {
        photo: deliveryPhoto,
        quantityDelivered: completeForm.quantity,
        foodCondition: completeForm.condition,
        remarks: completeForm.remarks,
      });
      toast.success('🎉 Delivery completed!');
      setShowCompleteModal(false);
      setDeliveryPhoto(null);
      refresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  const getPickupCoords = () => {
    const coords = activeDelivery?.donation?.pickupLocation?.coordinates;
    return coords && coords[0] !== 0 ? [coords[1], coords[0]] : null;
  };

  const getDestCoords = () => {
    const coords = activeDelivery?.hungerSpot?.location?.coordinates
      || activeDelivery?.donation?.hungerSpot?.location?.coordinates;
    return coords && coords[0] !== 0 ? [coords[1], coords[0]] : null;
  };

  const formatTime = (t) => t ? new Date(t).toLocaleString('en-IN') : '—';


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-600 text-white px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-black">Driver Dashboard</h1>
            <p className="text-white/70 text-xs">{user?.name} · {user?.vehicleType || 'Driver'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Tracker Toggle */}
          <button
            onClick={toggleTracking}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold transition-all shadow-sm ${
              isTrackingEnabled 
                ? 'bg-green-500 hover:bg-green-600 text-white shadow-green-500/30' 
                : 'bg-white/20 hover:bg-white/30 text-white/90'
            }`}
          >
            <Power size={14} className={isTrackingEnabled ? "animate-pulse" : ""} />
            {isTrackingEnabled ? 'Online' : 'Go Online'}
          </button>
          
          <button onClick={refresh} className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors ml-2">
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
        <div className="flex">
          {['Active Delivery', 'History'].map((tab, i) => (
            <button key={tab} onClick={() => setActiveTab(i)}
              className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === i ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* TAB 0: Active Delivery */}
        {activeTab === 0 && (
          <>
            {!activeDelivery ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                <div className="text-5xl mb-4">🚗</div>
                <h3 className="font-bold text-gray-700 text-lg mb-2">No Active Delivery</h3>
                <p className="text-gray-400">You'll be notified when a delivery is assigned to you.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Info Panel */}
                <div className="space-y-4">
                  {/* Status Card */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-bold text-gray-800">Current Delivery</h2>
                      <StatusBadge status={activeDelivery.status} size="lg" />
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-2">
                        <MapPin size={16} className="text-orange-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-semibold text-gray-700">Pickup</div>
                          <div className="text-gray-500">{activeDelivery.donation?.pickupAddress || '—'}</div>
                          <div className="text-gray-400 text-xs">Donor: {activeDelivery.donation?.donor?.name} · {activeDelivery.donation?.donor?.phone}</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Navigation size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-semibold text-gray-700">Deliver To</div>
                          <div className="text-gray-500">{activeDelivery.hungerSpot?.name || activeDelivery.donation?.hungerSpot?.name || '—'}</div>
                          <div className="text-gray-400 text-xs">{activeDelivery.hungerSpot?.address || activeDelivery.donation?.hungerSpot?.address || ''}</div>
                        </div>
                      </div>
                      <div className="border-t border-gray-50 pt-2">
                        <div className="text-gray-500">Quantity: <span className="font-bold text-gray-700">{activeDelivery.donation?.exactQuantity || activeDelivery.donation?.quantity} plates</span></div>
                        <div className="text-gray-500">Food: <span className="font-bold text-gray-700 capitalize">{activeDelivery.donation?.foodType || '—'}</span></div>
                        {activeDelivery.etaSeconds && (
                          <div className="text-gray-500">ETA: <span className="font-bold text-gray-700">{Math.ceil(activeDelivery.etaSeconds / 60)} min</span></div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
                    <h3 className="font-bold text-gray-700 mb-1">Actions</h3>

                    {activeDelivery.status === 'assigned' && (
                      <div className="flex gap-3">
                        <button onClick={handleAccept} disabled={loading}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                          <CheckCircle size={16} /> Accept
                        </button>
                        <button onClick={() => setShowRejectModal(true)} disabled={loading}
                          className="flex-1 bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 py-2.5 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2">
                          <XCircle size={16} /> Reject
                        </button>
                      </div>
                    )}

                    {activeDelivery.status === 'accepted' && (
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-gray-500 font-semibold block mb-1">Upload Pickup Photo (optional)</label>
                          <input type="file" accept="image/*" onChange={(e) => setPickupPhoto(e.target.files[0])}
                            className="w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-orange-50 file:text-orange-600 file:font-semibold hover:file:bg-orange-100" />
                        </div>
                        <button onClick={handlePickup} disabled={loading}
                          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                          <Camera size={16} /> Confirm Pickup
                        </button>
                      </div>
                    )}

                    {activeDelivery.status === 'picked_up' && (
                      <button onClick={handleStartTransit} disabled={loading}
                        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2.5 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                        <Navigation size={16} /> Start Transit
                      </button>
                    )}

                    {activeDelivery.status === 'in_transit' && (
                      <button onClick={() => setShowCompleteModal(true)}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2">
                        <Package size={16} /> Complete Delivery
                      </button>
                    )}
                  </div>
                </div>

                {/* Live Map — Google Maps with automatic turn-by-turn routing */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" style={{ height: 420 }}>
                  <div className="px-4 py-3 border-b border-gray-50 flex items-center gap-2">
                    <Navigation size={16} className="text-orange-500" />
                    <span className="font-semibold text-gray-700 text-sm">Live Map</span>
                    {directions && (
                      <span className="ml-2 text-xs text-blue-500 font-semibold">
                        {activeDelivery.status === 'accepted' ? '🧭 Route to Pickup' : '🚚 Route to Delivery'}
                      </span>
                    )}
                    {driverPos && <span className="ml-auto text-xs text-green-500 font-semibold">● Sharing Location</span>}
                  </div>
                  {!isLoaded ? (
                    <div className="flex items-center justify-center" style={{ height: 'calc(100% - 49px)' }}>
                      <div className="animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent" />
                    </div>
                  ) : (
                    <GoogleMap
                      mapContainerStyle={{ height: 'calc(100% - 49px)', width: '100%' }}
                      center={
                        driverPos
                          ? { lat: driverPos[0], lng: driverPos[1] }
                          : getPickupCoords()
                            ? { lat: getPickupCoords()[0], lng: getPickupCoords()[1] }
                            : { lat: 13.0827, lng: 80.2707 }
                      }
                      zoom={13}
                      onLoad={(map) => setMapRef(map)}
                      options={{ fullscreenControl: false, streetViewControl: false, mapTypeControl: false }}
                    >
                      {/* Road-following route from Google Directions API */}
                      {directions && (
                        <DirectionsRenderer
                          directions={directions}
                          options={{
                            suppressMarkers: false,
                            polylineOptions: {
                              strokeColor: activeDelivery.status === 'accepted' ? '#f97316' : '#16a34a',
                              strokeWeight: 5,
                              strokeOpacity: 0.85,
                            },
                          }}
                        />
                      )}
                      {/* Fallback markers before a route is fetched */}
                      {!directions && driverPos && (
                        <MarkerF
                          position={{ lat: driverPos[0], lng: driverPos[1] }}
                          icon={{ url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png' }}
                        />
                      )}
                      {!directions && getPickupCoords() && (
                        <MarkerF
                          position={{ lat: getPickupCoords()[0], lng: getPickupCoords()[1] }}
                          icon={{ url: 'https://maps.google.com/mapfiles/ms/icons/orange-dot.png' }}
                        />
                      )}
                      {!directions && getDestCoords() && (
                        <MarkerF
                          position={{ lat: getDestCoords()[0], lng: getDestCoords()[1] }}
                          icon={{ url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png' }}
                        />
                      )}
                    </GoogleMap>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* TAB 1: History */}
        {activeTab === 1 && (
          <div className="space-y-3">
            {deliveries.filter((d) => ['delivered', 'failed', 'rejected'].includes(d.status)).length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 text-gray-400">No delivery history yet</div>
            ) : (
              deliveries.filter((d) => ['delivered', 'failed', 'rejected'].includes(d.status)).map((d) => (
                <div key={d._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
                  <StatusBadge status={d.status} size="lg" />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-700">{d.donation?.donor?.name} — {d.donation?.exactQuantity || d.donation?.quantity} plates</div>
                    <div className="text-sm text-gray-400">{formatTime(d.deliveryTime || d.createdAt)}</div>
                  </div>
                  {d.quantityDelivered && <span className="text-sm text-green-600 font-semibold">{d.quantityDelivered} delivered</span>}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <h3 className="font-bold text-gray-800 mb-4">Reject Delivery</h3>
            <textarea rows={3} value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Reason for rejection..." className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red-400 resize-none mb-4" />
            <div className="flex gap-3">
              <button onClick={() => setShowRejectModal(false)} className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-xl text-sm font-semibold hover:bg-gray-50">Cancel</button>
              <button onClick={handleReject} disabled={loading} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl text-sm font-semibold disabled:opacity-60">
                {loading ? 'Processing...' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Complete Delivery Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md space-y-4">
            <h3 className="font-bold text-gray-800">Complete Delivery</h3>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Quantity Delivered (plates)</label>
              <input type="number" value={completeForm.quantity} onChange={(e) => setCompleteForm({ ...completeForm, quantity: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-400" placeholder="e.g. 50" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Food Condition</label>
              <select value={completeForm.condition} onChange={(e) => setCompleteForm({ ...completeForm, condition: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-400">
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Remarks</label>
              <textarea rows={2} value={completeForm.remarks} onChange={(e) => setCompleteForm({ ...completeForm, remarks: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-400 resize-none" placeholder="Any notes..." />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Delivery Proof Photo (optional)</label>
              <input type="file" accept="image/*" onChange={(e) => setDeliveryPhoto(e.target.files[0])}
                className="w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-green-50 file:text-green-600 file:font-semibold hover:file:bg-green-100" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowCompleteModal(false)} className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-xl text-sm font-semibold hover:bg-gray-50">Cancel</button>
              <button onClick={handleComplete} disabled={loading} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl text-sm font-semibold disabled:opacity-60">
                {loading ? 'Submitting...' : '🎉 Complete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
