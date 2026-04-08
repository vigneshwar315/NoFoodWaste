const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  acceptDelivery,
  rejectDelivery,
  confirmPickup,
  startTransit,
  completeDelivery,
  failDelivery,
  getMyDeliveries,
  getDeliveryById,
  updateLocation,
  getAllDeliveries,
} = require('../controllers/deliveryController');

// Driver actions
router.post('/accept', protect, authorize('driver'), acceptDelivery);
router.post('/reject', protect, authorize('driver'), rejectDelivery);
router.post('/pickup', protect, authorize('driver'), upload.single('photo'), confirmPickup);
router.post('/transit', protect, authorize('driver'), startTransit);
router.post('/complete', protect, authorize('driver', 'volunteer'), upload.single('photo'), completeDelivery);
router.post('/fail', protect, authorize('driver'), failDelivery);

// Location update (driver)
router.put('/location', protect, authorize('driver'), updateLocation);

// View
router.get('/my', protect, authorize('driver', 'volunteer'), getMyDeliveries);
router.get('/all', protect, authorize('admin', 'employee'), getAllDeliveries);
router.get('/:id', protect, getDeliveryById);

module.exports = router;
