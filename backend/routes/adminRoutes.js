const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUser,
  toggleBlock,
  verifyUser,
  deleteUser,
  getDashboardStats,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// All routes require admin auth
router.use(protect, authorize('admin'));

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.patch('/users/:id/block', toggleBlock);
router.patch('/users/:id/verify', verifyUser);
router.delete('/users/:id', deleteUser);

module.exports = router;
