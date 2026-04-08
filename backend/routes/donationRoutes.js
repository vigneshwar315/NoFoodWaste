const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
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
} = require('../controllers/donationController');

// Public — Exotel IVR webhook (no auth)
router.post('/exotel-webhook', exotelWebhook);

// Employee + Admin
router.get('/pending-verification', protect, authorize('employee', 'admin'), getPendingVerifications);
router.post('/verify', protect, authorize('employee', 'admin'), handleVerify);
router.post('/approve', protect, authorize('employee', 'admin'), handleApprove);
router.post('/reject', protect, authorize('employee', 'admin'), handleReject);
router.post('/manual-assign', protect, authorize('employee', 'admin'), manualAssign);

// Admin only
router.get('/stats', protect, authorize('admin', 'employee'), getDonationStats);
router.post('/trigger-daily-donor', protect, authorize('admin'), triggerDailyDonor);

// Donor — own donations
router.get('/my', protect, authorize('donor'), getMyDonations);

// All authenticated
router.get('/', protect, authorize('admin', 'employee'), getAllDonations);
router.get('/:id', protect, getDonationById);

module.exports = router;
