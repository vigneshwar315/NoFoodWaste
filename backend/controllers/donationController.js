const Donation = require('../models/Donation');
const DailyDonor = require('../models/DailyDonor');
const { createFromWebhook, createFromDailyDonor } = require('../services/donationService');
const { verifyDonation, approveDonation, rejectDonation } = require('../services/verificationService');
const { autoAssignDriver } = require('../services/driverService');

// ─── POST /api/donations/exotel-webhook (public) ──────────────────────────────
const exotelWebhook = async (req, res) => {
  try {
    // Exotel sends: CallFrom (phone), digits (quantity from IVR keypad)
    // Also support manual test payload: { phone, quantity }
    const phone =
      req.body.CallFrom ||
      req.body.From ||
      req.body.phone;
    const quantity = parseInt(
      req.body.digits || req.body.Digits || req.body.quantity || '0',
      10
    );

    if (!phone) {
      return res.status(400).json({ success: false, message: 'Phone number is required' });
    }

    const result = await createFromWebhook({ phone, quantity });

    if (!result.success) {
      return res.status(200).json({
        success: false,
        reason: result.reason,
        message: result.message,
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Donation request created and pending employee verification',
      donationId: result.donation._id,
    });
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GET /api/donations/pending-verification (employee, admin) ────────────────
const getPendingVerifications = async (req, res) => {
  try {
    const donations = await Donation.find({ status: 'pending_verification' })
      .populate('donor', 'name phone address donorType')
      .sort({ createdAt: 1 }); // oldest first

    res.json({ success: true, donations, count: donations.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── POST /api/donations/verify (employee, admin) ─────────────────────────────
const handleVerify = async (req, res) => {
  try {
    const { donationId, ...payload } = req.body;
    if (!donationId) return res.status(400).json({ success: false, message: 'donationId required' });

    const result = await verifyDonation(donationId, payload, req.user._id);

    res.json({
      success: true,
      message: result.etaWarning
        ? '⚠️ Donation verified but ETA exceeds food expiry window!'
        : '✅ Donation verified successfully',
      ...result,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ─── POST /api/donations/approve (employee, admin) ────────────────────────────
const handleApprove = async (req, res) => {
  try {
    const { donationId, forceApprove } = req.body;
    if (!donationId) return res.status(400).json({ success: false, message: 'donationId required' });

    const donation = await approveDonation(donationId, req.user._id, !!forceApprove);

    // Auto-assign driver
    let assignmentResult = null;
    try {
      assignmentResult = await autoAssignDriver(donationId);
    } catch (assignErr) {
      console.warn('Auto-assign failed:', assignErr.message);
    }

    res.json({
      success: true,
      message: assignmentResult
        ? `✅ Approved and assigned to driver: ${assignmentResult.driver.name}`
        : '✅ Approved. No driver available yet — will be assigned manually.',
      donation,
      assignment: assignmentResult
        ? { driver: assignmentResult.driver.name, deliveryId: assignmentResult.delivery._id }
        : null,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ─── POST /api/donations/reject (employee, admin) ─────────────────────────────
const handleReject = async (req, res) => {
  try {
    const { donationId, reason } = req.body;
    if (!donationId) return res.status(400).json({ success: false, message: 'donationId required' });

    const donation = await rejectDonation(donationId, reason, req.user._id);

    res.json({ success: true, message: 'Donation rejected', donation });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ─── GET /api/donations/my (donor) ───────────────────────────────────────────
const getMyDonations = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const donations = await Donation.find({ donor: req.user._id })
      .populate('assignedDriver', 'name phone')
      .populate('hungerSpot', 'name address')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Donation.countDocuments({ donor: req.user._id });

    res.json({ success: true, donations, total, page: Number(page) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GET /api/donations/:id ───────────────────────────────────────────────────
const getDonationById = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate('donor', 'name phone address')
      .populate('assignedDriver', 'name phone vehicleType currentLocation')
      .populate('assignedEmployee', 'name')
      .populate('verifiedBy', 'name')
      .populate('hungerSpot', 'name address location contactName contactPhone');

    if (!donation) return res.status(404).json({ success: false, message: 'Donation not found' });

    res.json({ success: true, donation });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GET /api/donations (admin, employee) ─────────────────────────────────────
const getAllDonations = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = status ? { status } : {};
    const skip = (Number(page) - 1) * Number(limit);

    const donations = await Donation.find(filter)
      .populate('donor', 'name phone')
      .populate('assignedDriver', 'name phone')
      .populate('hungerSpot', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Donation.countDocuments(filter);

    res.json({ success: true, donations, total, page: Number(page) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── POST /api/donations/manual-assign (employee, admin) ─────────────────────
const manualAssign = async (req, res) => {
  try {
    const { donationId, driverId } = req.body;
    const { manualAssignDriver } = require('../services/driverService');
    const result = await manualAssignDriver(donationId, driverId, req.user._id);
    res.json({ success: true, message: 'Driver manually assigned', ...result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ─── POST /api/donations/trigger-daily-donor (admin) ─────────────────────────
const triggerDailyDonor = async (req, res) => {
  try {
    const { dailyDonorId } = req.body;
    const donor = await DailyDonor.findById(dailyDonorId);
    if (!donor) return res.status(404).json({ success: false, message: 'Daily donor not found' });

    const result = await createFromDailyDonor(donor);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GET /api/donations/stats (admin) ─────────────────────────────────────────
const getDonationStats = async (req, res) => {
  try {
    const stats = await Donation.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const statsMap = {};
    stats.forEach((s) => { statsMap[s._id] = s.count; });

    const total = await Donation.countDocuments();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = await Donation.countDocuments({ createdAt: { $gte: today } });

    res.json({ success: true, stats: statsMap, total, todayCount });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  exotelWebhook,
  getPendingVerifications,
  handleVerify,
  handleApprove,
  handleReject,
  getMyDonations,
  getDonationById,
  getAllDonations,
  manualAssign,
  triggerDailyDonor,
  getDonationStats,
};
