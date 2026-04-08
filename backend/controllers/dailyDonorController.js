const DailyDonor = require('../models/DailyDonor');
const { createFromDailyDonor } = require('../services/donationService');

// ─── GET /api/daily-donors ────────────────────────────────────────────────────
const getDailyDonors = async (req, res) => {
  try {
    const donors = await DailyDonor.find()
      .populate('addedBy', 'name')
      .populate('donorUserId', 'name phone')
      .sort({ createdAt: -1 });
    res.json({ success: true, donors, count: donors.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── POST /api/daily-donors (admin) ──────────────────────────────────────────
const createDailyDonor = async (req, res) => {
  try {
    const { name, phone, address, coordinates, scheduleTime, avgQuantity, foodType, autoCreate, notes } = req.body;

    if (!name || !phone || !address || !scheduleTime || !avgQuantity) {
      return res.status(400).json({
        success: false,
        message: 'name, phone, address, scheduleTime, avgQuantity are required',
      });
    }

    const donor = await DailyDonor.create({
      name,
      phone,
      address,
      location: coordinates ? { type: 'Point', coordinates } : undefined,
      scheduleTime,
      avgQuantity: Number(avgQuantity),
      foodType: foodType || '',
      autoCreate: autoCreate !== false,
      notes: notes || '',
      addedBy: req.user._id,
    });

    res.status(201).json({ success: true, message: 'Daily donor created', donor });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── PUT /api/daily-donors/:id (admin) ───────────────────────────────────────
const updateDailyDonor = async (req, res) => {
  try {
    const allowed = ['name', 'phone', 'address', 'scheduleTime', 'avgQuantity', 'foodType', 'autoCreate', 'isActive', 'notes'];
    const updates = {};
    allowed.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });
    if (req.body.coordinates) updates.location = { type: 'Point', coordinates: req.body.coordinates };

    const donor = await DailyDonor.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!donor) return res.status(404).json({ success: false, message: 'Daily donor not found' });

    res.json({ success: true, message: 'Updated', donor });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── DELETE /api/daily-donors/:id (admin) ────────────────────────────────────
const deleteDailyDonor = async (req, res) => {
  try {
    await DailyDonor.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Daily donor deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── POST /api/daily-donors/:id/trigger (admin) ──────────────────────────────
const triggerManually = async (req, res) => {
  try {
    const donor = await DailyDonor.findById(req.params.id);
    if (!donor) return res.status(404).json({ success: false, message: 'Daily donor not found' });

    const result = await createFromDailyDonor(donor);
    res.json({ success: true, message: 'Manual trigger complete', ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getDailyDonors, createDailyDonor, updateDailyDonor, deleteDailyDonor, triggerManually };
