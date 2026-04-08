const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getHungerSpots,
  createHungerSpot,
  updateHungerSpot,
  deleteHungerSpot,
  getNearestHungerSpots,
} = require('../controllers/hungerSpotController');

router.get('/', protect, getHungerSpots);
router.get('/nearest', protect, authorize('employee', 'admin'), getNearestHungerSpots);
router.post('/', protect, authorize('admin'), createHungerSpot);
router.put('/:id', protect, authorize('admin'), updateHungerSpot);
router.delete('/:id', protect, authorize('admin'), deleteHungerSpot);

module.exports = router;
