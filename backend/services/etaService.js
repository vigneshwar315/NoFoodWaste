const axios = require('axios');
const { haversineDistance } = require('./geoService');

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const AVG_SPEED_KMH = 30; // Average urban speed for fallback

/**
 * Calculate ETA between two coordinate pairs using Google Maps Directions API.
 * Falls back to Haversine + average speed if API fails.
 *
 * @param {[number,number]} origin - [longitude, latitude]
 * @param {[number,number]} destination - [longitude, latitude]
 * @returns {{ etaSeconds: number, etaMinutes: number, distanceKm: number, source: string }}
 */
const calculateETA = async (origin, destination) => {
  // Google Maps uses lat,lng order (opposite of GeoJSON)
  const originStr = `${origin[1]},${origin[0]}`;
  const destStr = `${destination[1]},${destination[0]}`;

  try {
    if (!GOOGLE_MAPS_API_KEY) throw new Error('No API key');

    const url = `https://maps.googleapis.com/maps/api/directions/json`;
    const response = await axios.get(url, {
      params: {
        origin: originStr,
        destination: destStr,
        key: GOOGLE_MAPS_API_KEY,
        departure_time: 'now',
        traffic_model: 'best_guess',
      },
      timeout: 5000,
    });

    const data = response.data;
    if (data.status !== 'OK' || !data.routes?.length) {
      throw new Error(`Google Maps returned: ${data.status}`);
    }

    const leg = data.routes[0].legs[0];
    const etaSeconds = leg.duration_in_traffic?.value || leg.duration?.value;
    const distanceKm = leg.distance.value / 1000;

    return {
      etaSeconds,
      etaMinutes: Math.ceil(etaSeconds / 60),
      distanceKm: parseFloat(distanceKm.toFixed(2)),
      source: 'google_maps',
    };
  } catch (err) {
    console.warn(`⚠️ Google Maps ETA failed (${err.message}), using Haversine fallback`);
    return haversineFallback(origin, destination);
  }
};

/**
 * Haversine fallback: straight-line × 1.3 road correction ÷ average speed
 */
const haversineFallback = (origin, destination) => {
  const distanceStraightKm = haversineDistance(origin, destination);
  const distanceKm = distanceStraightKm * 1.3; // road correction factor
  const etaSeconds = Math.round((distanceKm / AVG_SPEED_KMH) * 3600);

  return {
    etaSeconds,
    etaMinutes: Math.ceil(etaSeconds / 60),
    distanceKm: parseFloat(distanceKm.toFixed(2)),
    source: 'haversine_fallback',
  };
};

/**
 * Check if ETA fits within remaining food-safe window
 * @param {number} etaSeconds
 * @param {Date} expiresAt
 * @returns {{ feasible: boolean, remainingSeconds: number, marginSeconds: number }}
 */
const checkFeasibility = (etaSeconds, expiresAt) => {
  const now = Date.now();
  const remainingSeconds = Math.max(0, Math.floor((new Date(expiresAt) - now) / 1000));
  // Add 15 min buffer for handover/setup at hunger spot
  const feasible = etaSeconds + 900 < remainingSeconds;
  const marginSeconds = remainingSeconds - etaSeconds;

  return { feasible, remainingSeconds, marginSeconds };
};

module.exports = { calculateETA, checkFeasibility };
