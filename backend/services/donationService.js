const Donation = require('../models/Donation');
const User = require('../models/User');
const DailyDonor = require('../models/DailyDonor');
const { checkQuantityThreshold, checkDuplicateRequest } = require('./validationService');

/**
 * Process incoming Exotel IVR webhook.
 * Exotel calls this endpoint with phone number + quantity (from IVR keypad).
 * Employee receives it in their dashboard for manual verification call.
 */
const createFromWebhook = async ({ phone, quantity, source = 'ivr' }) => {
  // Find or create donor
  let donor = await User.findOne({ phone, role: 'donor' });
  if (!donor) {
    donor = await User.create({
      name: `Donor-${phone.slice(-4)}`,
      phone,
      role: 'donor',
      isVerified: true,
      donorType: 'one-time',
    });
  }

  // Quantity filter (FSSAI / minimum threshold)
  if (!checkQuantityThreshold(quantity)) {
    return {
      success: false,
      reason: 'quantity_too_low',
      message: `Quantity ${quantity} is below minimum 30 plates`,
      donor,
    };
  }

  // Duplicate check
  const isDuplicate = await checkDuplicateRequest(donor._id);
  if (isDuplicate) {
    return {
      success: false,
      reason: 'duplicate_request',
      message: 'A donation request from this number is already being processed',
      donor,
    };
  }

  // Create donation in pending_verification state
  const donation = await Donation.create({
    donor: donor._id,
    quantity,
    status: 'pending_verification',
    source,
    foodDescription: 'Pending verification call from employee',
  });

  // Notify employees via socket
  if (global.io) {
    global.io.to('employees').emit('newDonationRequest', {
      donationId: donation._id,
      donorPhone: phone,
      quantity,
      createdAt: donation.createdAt,
    });
  }

  return { success: true, donation, donor };
};

/**
 * Auto-expire donations where food has already expired
 */
const autoExpireStale = async () => {
  const result = await Donation.updateMany(
    {
      status: { $in: ['pending_verification', 'verified', 'validated'] },
      expiresAt: { $lt: new Date() },
    },
    { $set: { status: 'expired', rejectionReason: 'Food expired — passed 4-hour FSSAI window' } }
  );

  if (result.modifiedCount > 0) {
    console.log(`⏰ Auto-expired ${result.modifiedCount} donations`);
  }

  return result.modifiedCount;
};

/**
 * Create donation from a daily donor schedule trigger
 */
const createFromDailyDonor = async (dailyDonor) => {
  // Check if already created today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const existing = await Donation.findOne({
    dailyDonorId: dailyDonor._id,
    createdAt: { $gte: today },
  });

  if (existing) return { skipped: true, reason: 'already_created_today' };

  let donorUser = dailyDonor.donorUserId;
  if (!donorUser) {
    donorUser = await User.findOne({ phone: dailyDonor.phone, role: 'donor' });
    if (!donorUser) {
      donorUser = await User.create({
        name: dailyDonor.name,
        phone: dailyDonor.phone,
        role: 'donor',
        isVerified: true,
        donorType: 'registered',
        address: dailyDonor.address,
      });
    }
  }

  const donation = await Donation.create({
    donor: donorUser._id,
    quantity: dailyDonor.avgQuantity,
    foodType: dailyDonor.foodType,
    foodDescription: `Scheduled donation from ${dailyDonor.name}`,
    pickupAddress: dailyDonor.address,
    pickupLocation: dailyDonor.location,
    status: 'pending_verification',
    isScheduled: true,
    source: 'scheduled',
    dailyDonorId: dailyDonor._id,
  });

  // Update last triggered
  await DailyDonor.findByIdAndUpdate(dailyDonor._id, { lastTriggered: new Date() });

  if (global.io) {
    global.io.to('employees').emit('newDonationRequest', {
      donationId: donation._id,
      donorPhone: dailyDonor.phone,
      quantity: dailyDonor.avgQuantity,
      isScheduled: true,
      createdAt: donation.createdAt,
    });
  }

  return { success: true, donation };
};

module.exports = { createFromWebhook, autoExpireStale, createFromDailyDonor };
