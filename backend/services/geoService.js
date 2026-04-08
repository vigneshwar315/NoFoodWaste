const User = require('../models/User');
const HungerSpot = require('../models/HungerSpot');

/**
 * Find the nearest available driver to given coordinates [lng, lat]
 * @param {[number, number]} coordinates - [longitude, latitude]
 * @param {number} maxDistanceKm - search radius in km
 */
const findNearestDriver = async (coordinates, maxDistanceKm = 50) => {
  const driver = await User.findOne({
    role: 'driver',
    isAvailable: true,
    isBlocked: false,
    isVerified: true,
    currentLocation: {
      $near: {
        $geometry: { type: 'Point', coordinates },
        $maxDistance: maxDistanceKm * 1000,
      },
    },
  }).select('-password');

  return driver;
};

/**
 * Find all available drivers sorted by proximity
 */
const findAvailableDrivers = async (coordinates, maxDistanceKm = 50, limit = 10) => {
  const drivers = await User.find({
    role: 'driver',
    isAvailable: true,
    isBlocked: false,
    isVerified: true,
    currentLocation: {
      $near: {
        $geometry: { type: 'Point', coordinates },
        $maxDistance: maxDistanceKm * 1000,
      },
    },
  })
    .select('-password')
    .limit(limit);

  return drivers;
};

/**
 * Find the nearest active hunger spot to given coordinates
 */
const findNearestHungerSpot = async (coordinates, maxDistanceKm = 30) => {
  const spot = await HungerSpot.findOne({
    isActive: true,
    location: {
      $near: {
        $geometry: { type: 'Point', coordinates },
        $maxDistance: maxDistanceKm * 1000,
      },
    },
  });

  return spot;
};

/**
 * Find all hunger spots near given coordinates
 */
const findNearbyHungerSpots = async (coordinates, maxDistanceKm = 30, limit = 5) => {
  const spots = await HungerSpot.find({
    isActive: true,
    location: {
      $near: {
        $geometry: { type: 'Point', coordinates },
        $maxDistance: maxDistanceKm * 1000,
      },
    },
  }).limit(limit);

  return spots;
};

/**
 * Haversine distance between two [lng, lat] coordinate pairs in km
 */
const haversineDistance = (coord1, coord2) => {
  const R = 6371; // Earth radius km
  const [lng1, lat1] = coord1;
  const [lng2, lat2] = coord2;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

module.exports = {
  findNearestDriver,
  findAvailableDrivers,
  findNearestHungerSpot,
  findNearbyHungerSpots,
  haversineDistance,
};
