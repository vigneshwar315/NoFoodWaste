const Donation = require('../models/Donation');
const { calculateETA, checkFeasibility } = require('./etaService');
const { findNearestDriver, findNearestHungerSpot } = require('./geoService');
const { validateCoordinates, checkExpiryWindow } = require('./validationService');

/**
 * Employee fills in verified food details and system calculates ETA.
 * Returns ETA info and feasibility warning for employee to see.
 */
const verifyDonation = async (donationId, payload, employeeId) => {
  const {
    foodType,
    exactQuantity,
    preparedAt,
    pickupAddress,
    pickupLocation, // { coordinates: [lng, lat] }
    verificationNotes,
    foodDescription,
  } = payload;

  const donation = await Donation.findById(donationId).populate('donor');
  if (!donation) throw new Error('Donation not found');

  if (!['pending_verification'].includes(donation.status)) {
    throw new Error(`Cannot verify donation in status: ${donation.status}`);
  }

  // Expiry check on preparedAt
  const expiryCheck = checkExpiryWindow(preparedAt, 30);
  if (!expiryCheck.valid) {
    throw new Error(
      `Food is expiring too soon (${expiryCheck.remainingMinutes} min remaining). Cannot accept.`
    );
  }

  const coordinates = pickupLocation?.coordinates || [0, 0];

  // Find nearest driver + hunger spot for ETA calculation
  let etaSeconds = null;
  let etaWarning = false;
  let nearestDriver = null;
  let nearestHungerSpot = null;

  if (validateCoordinates(coordinates)) {
    nearestDriver = await findNearestDriver(coordinates);
    nearestHungerSpot = await findNearestHungerSpot(coordinates);

    if (nearestDriver && nearestHungerSpot) {
      // ETA = pickup → donor location → hunger spot
      const pickupEta = await calculateETA(
        nearestDriver.currentLocation.coordinates,
        coordinates
      );
      const deliveryEta = await calculateETA(coordinates, nearestHungerSpot.location.coordinates);

      etaSeconds = pickupEta.etaSeconds + deliveryEta.etaSeconds;
      const feasibility = checkFeasibility(etaSeconds, expiryCheck.expiresAt);
      etaWarning = !feasibility.feasible;
    }
  }

  // Update donation with verified details
  await Donation.findByIdAndUpdate(donationId, {
    foodType,
    exactQuantity: exactQuantity || donation.quantity,
    preparedAt: new Date(preparedAt),
    pickupAddress,
    pickupLocation: validateCoordinates(coordinates)
      ? { type: 'Point', coordinates }
      : donation.pickupLocation,
    foodDescription: foodDescription || donation.foodDescription,
    verificationNotes,
    verifiedBy: employeeId,
    assignedEmployee: employeeId,
    expiresAt: expiryCheck.expiresAt,
    etaSeconds,
    etaWarning,
    hungerSpot: nearestHungerSpot?._id || null,
    assignedDriver: nearestDriver?._id || null,
    status: 'verified',
  });

  const updatedDonation = await Donation.findById(donationId)
    .populate('donor', 'name phone')
    .populate('verifiedBy', 'name')
    .populate('hungerSpot', 'name address')
    .populate('assignedDriver', 'name phone vehicleType');

  // Emit verificationPending event to employee room
  if (global.io) {
    global.io.to('employees').emit('verificationPending', {
      donation: updatedDonation,
      etaWarning,
      etaSeconds,
    });
  }

  return {
    donation: updatedDonation,
    etaSeconds,
    etaWarning,
    nearestDriver,
    nearestHungerSpot,
    expiryInfo: expiryCheck,
  };
};

/**
 * Employee approves donation (optionally force-approving over ETA warning)
 */
const approveDonation = async (donationId, employeeId, forceApprove = false) => {
  const donation = await Donation.findById(donationId);
  if (!donation) throw new Error('Donation not found');

  if (!['verified'].includes(donation.status)) {
    throw new Error(`Cannot approve donation in status: ${donation.status}`);
  }

  if (donation.etaWarning && !forceApprove) {
    throw new Error('ETA exceeds food expiry window. Use forceApprove=true to override.');
  }

  donation.status = 'validated';
  donation.forceApproved = forceApprove;
  await donation.save();

  if (global.io) {
    global.io.to(`donation_${donationId}`).emit('deliveryStatusUpdate', {
      donationId,
      status: 'validated',
      message: 'Donation approved and ready for driver assignment',
    });
  }

  return donation;
};

/**
 * Employee rejects donation
 */
const rejectDonation = async (donationId, reason, employeeId) => {
  const donation = await Donation.findById(donationId);
  if (!donation) throw new Error('Donation not found');

  if (!['pending_verification', 'verified'].includes(donation.status)) {
    throw new Error(`Cannot reject donation in status: ${donation.status}`);
  }

  donation.status = 'rejected';
  donation.rejectionReason = reason || 'Rejected by employee';
  await donation.save();

  if (global.io) {
    global.io.to(`donation_${donationId}`).emit('deliveryStatusUpdate', {
      donationId,
      status: 'rejected',
      reason,
    });
  }

  return donation;
};

module.exports = { verifyDonation, approveDonation, rejectDonation };
