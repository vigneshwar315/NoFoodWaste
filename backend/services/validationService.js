const Donation = require('../models/Donation');
const User = require('../models/User');

const MIN_QUANTITY = 30;
const DUPLICATE_WINDOW_MINUTES = 30;

/**
 * Check if quantity meets minimum threshold
 */
const checkQuantityThreshold = (quantity) => {
  return quantity >= MIN_QUANTITY;
};

/**
 * Check if a donation request from this donor was already submitted recently
 * (prevents duplicate IVR calls)
 */
const checkDuplicateRequest = async (donorId) => {
  const windowStart = new Date(Date.now() - DUPLICATE_WINDOW_MINUTES * 60 * 1000);
  const existing = await Donation.findOne({
    donor: donorId,
    status: { $in: ['pending_verification', 'verified', 'validated', 'assigned'] },
    createdAt: { $gte: windowStart },
  });
  return !!existing;
};

/**
 * Check FSSAI expiry window: food must not already be past 4h window
 */
const checkExpiryWindow = (preparedAt, bufferMinutes = 30) => {
  const expiresAt = new Date(new Date(preparedAt).getTime() + 4 * 60 * 60 * 1000);
  const now = new Date();
  const remainingMs = expiresAt - now;
  const remainingMinutes = remainingMs / 60000;
  return {
    valid: remainingMinutes > bufferMinutes,
    remainingMinutes: Math.floor(remainingMinutes),
    expiresAt,
  };
};

/**
 * Validate pickup coordinates are non-zero (basic check)
 */
const validateCoordinates = (coordinates) => {
  if (!Array.isArray(coordinates) || coordinates.length !== 2) return false;
  const [lng, lat] = coordinates;
  return (
    typeof lng === 'number' &&
    typeof lat === 'number' &&
    lng !== 0 &&
    lat !== 0 &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
};

module.exports = {
  checkQuantityThreshold,
  checkDuplicateRequest,
  checkExpiryWindow,
  validateCoordinates,
  MIN_QUANTITY,
};
