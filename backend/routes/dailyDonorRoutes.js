const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getDailyDonors,
  createDailyDonor,
  updateDailyDonor,
  deleteDailyDonor,
  triggerManually,
} = require('../controllers/dailyDonorController');

router.get('/', protect, authorize('admin', 'employee'), getDailyDonors);
router.post('/', protect, authorize('admin'), createDailyDonor);
router.put('/:id', protect, authorize('admin'), updateDailyDonor);
router.delete('/:id', protect, authorize('admin'), deleteDailyDonor);
router.post('/:id/trigger', protect, authorize('admin'), triggerManually);

module.exports = router;
