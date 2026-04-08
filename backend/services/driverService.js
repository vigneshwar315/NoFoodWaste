const Donation = require('../models/Donation');
const Delivery = require('../models/Delivery');
const User = require('../models/User');
const { findNearestDriver } = require('./geoService');
const { calculateETA } = require('./etaService');

/**
 * Auto-assign the nearest available driver after donation is validated
 */
const autoAssignDriver = async (donationId) => {
  const donation = await Donation.findById(donationId).populate('hungerSpot');
  if (!donation) throw new Error('Donation not found');

  if (donation.status !== 'validated') {
    throw new Error(`Cannot assign driver to donation in status: ${donation.status}`);
  }

  const pickup = donation.pickupLocation.coordinates;
  const driver = await findNearestDriver(pickup);

  if (!driver) {
    throw new Error('No available drivers found near pickup location');
  }

  // Calculate ETA for this delivery
  let etaData = { etaSeconds: null, distanceKm: null };
  if (donation.hungerSpot?.location?.coordinates) {
    try {
      etaData = await calculateETA(pickup, donation.hungerSpot.location.coordinates);
    } catch (_) {}
  }

  // Create delivery record
  const delivery = await Delivery.create({
    donation: donationId,
    driver: driver._id,
    hungerSpot: donation.hungerSpot?._id || null,
    estimatedDeliveryTime: etaData.etaSeconds
      ? new Date(Date.now() + etaData.etaSeconds * 1000)
      : null,
    etaSeconds: etaData.etaSeconds,
    distanceKm: etaData.distanceKm,
    status: 'assigned',
  });

  // Update donation status
  await Donation.findByIdAndUpdate(donationId, {
    status: 'assigned',
    assignedDriver: driver._id,
  });

  // Mark driver as unavailable
  await User.findByIdAndUpdate(driver._id, { isAvailable: false });

  // Emit socket events
  if (global.io) {
    global.io.to(`driver_${driver._id}`).emit('driverAssigned', {
      deliveryId: delivery._id,
      donationId,
      pickupAddress: donation.pickupAddress,
      pickupLocation: donation.pickupLocation,
      hungerSpot: donation.hungerSpot,
      etaMinutes: etaData.etaSeconds ? Math.ceil(etaData.etaSeconds / 60) : null,
    });

    global.io.to(`donation_${donationId}`).emit('deliveryStatusUpdate', {
      donationId,
      status: 'assigned',
      driverName: driver.name,
      driverPhone: driver.phone,
    });
  }

  return { delivery, driver };
};

/**
 * Manually assign a specific driver (employee/admin override)
 */
const manualAssignDriver = async (donationId, driverId, assignedBy) => {
  const donation = await Donation.findById(donationId).populate('hungerSpot');
  if (!donation) throw new Error('Donation not found');

  const driver = await User.findOne({ _id: driverId, role: 'driver' });
  if (!driver) throw new Error('Driver not found');

  let etaData = { etaSeconds: null, distanceKm: null };
  if (donation.pickupLocation?.coordinates && donation.hungerSpot?.location?.coordinates) {
    try {
      etaData = await calculateETA(
        donation.pickupLocation.coordinates,
        donation.hungerSpot.location.coordinates
      );
    } catch (_) {}
  }

  // Remove any existing delivery for this donation
  await Delivery.deleteMany({ donation: donationId, status: 'assigned' });

  const delivery = await Delivery.create({
    donation: donationId,
    driver: driverId,
    hungerSpot: donation.hungerSpot?._id || null,
    estimatedDeliveryTime: etaData.etaSeconds
      ? new Date(Date.now() + etaData.etaSeconds * 1000)
      : null,
    etaSeconds: etaData.etaSeconds,
    distanceKm: etaData.distanceKm,
    status: 'assigned',
  });

  await Donation.findByIdAndUpdate(donationId, {
    status: 'assigned',
    assignedDriver: driverId,
  });

  await User.findByIdAndUpdate(driverId, { isAvailable: false });

  if (global.io) {
    global.io.to(`driver_${driverId}`).emit('driverAssigned', {
      deliveryId: delivery._id,
      donationId,
      pickupAddress: donation.pickupAddress,
      pickupLocation: donation.pickupLocation,
      hungerSpot: donation.hungerSpot,
      etaMinutes: etaData.etaSeconds ? Math.ceil(etaData.etaSeconds / 60) : null,
      manualAssignment: true,
    });
  }

  return { delivery, driver };
};

/**
 * Reassign driver when current driver rejects or delays
 */
const reassignDriver = async (deliveryId, reason) => {
  const delivery = await Delivery.findById(deliveryId).populate('donation');
  if (!delivery) throw new Error('Delivery not found');

  const donationId = delivery.donation._id;

  // Mark current driver as available again
  if (delivery.driver) {
    await User.findByIdAndUpdate(delivery.driver, { isAvailable: true });
  }

  // Mark delivery as rejected/failed
  delivery.status = 'rejected';
  delivery.driverRejected = true;
  delivery.failureReason = reason || 'Driver rejected';
  delivery.reassignCount += 1;
  await delivery.save();

  // Reset donation to validated for reassignment
  await Donation.findByIdAndUpdate(donationId, {
    status: 'validated',
    assignedDriver: null,
  });

  // Attempt auto-reassign
  try {
    const result = await autoAssignDriver(donationId);
    return { reassigned: true, ...result };
  } catch (err) {
    // No drivers available
    if (global.io) {
      global.io.to('employees').emit('noDriverAvailable', {
        donationId,
        reason: err.message,
      });
    }
    return { reassigned: false, reason: err.message };
  }
};

/**
 * Update driver's current location and broadcast via Socket.io
 */
const updateDriverLocation = async (driverId, coordinates) => {
  await User.findByIdAndUpdate(driverId, {
    currentLocation: { type: 'Point', coordinates },
  });

  // Find active delivery for this driver
  const delivery = await Delivery.findOne({
    driver: driverId,
    status: { $in: ['accepted', 'picked_up', 'in_transit'] },
  });

  if (global.io && delivery) {
    global.io.to(`delivery_${delivery._id}`).emit('locationUpdate', {
      driverId,
      coordinates,
      deliveryId: delivery._id,
      donationId: delivery.donation,
      timestamp: new Date(),
    });
  }

  return { updated: true, delivery: delivery?._id };
};

module.exports = {
  autoAssignDriver,
  manualAssignDriver,
  reassignDriver,
  updateDriverLocation,
};
