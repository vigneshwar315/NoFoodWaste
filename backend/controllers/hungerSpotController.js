const HungerSpot = require('../models/HungerSpot');
const { findNearbyHungerSpots } = require('../services/geoService');

// ─── GET /api/hunger-spots ────────────────────────────────────────────────────
const getHungerSpots = async (req, res) => {
  try {
    const { active } = req.query;
    const filter = active === 'true' ? { isActive: true } : {};
    const spots = await HungerSpot.find(filter)
      .populate('addedBy', 'name')
      .sort({ createdAt: -1 });
    res.json({ success: true, spots, count: spots.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── POST /api/hunger-spots (admin) ─────────────────────────────────────────
const createHungerSpot = async (req, res) => {
  try {
    const { name, address, coordinates, capacity, description, contactName, contactPhone } = req.body;

    if (!name || !address || !coordinates) {
      return res.status(400).json({ success: false, message: 'name, address, coordinates are required' });
    }

    const spot = await HungerSpot.create({
      name,
      address,
      location: { type: 'Point', coordinates },
      capacity: capacity || 0,
      description: description || '',
      contactName: contactName || '',
      contactPhone: contactPhone || '',
      addedBy: req.user._id,
    });

    res.status(201).json({ success: true, message: 'Hunger spot created', spot });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── PUT /api/hunger-spots/:id (admin) ───────────────────────────────────────
const updateHungerSpot = async (req, res) => {
  try {
    const allowed = ['name', 'address', 'capacity', 'currentOccupancy', 'isActive', 'description', 'contactName', 'contactPhone'];
    const updates = {};
    allowed.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    if (req.body.coordinates) {
      updates.location = { type: 'Point', coordinates: req.body.coordinates };
    }

    const spot = await HungerSpot.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!spot) return res.status(404).json({ success: false, message: 'Hunger spot not found' });

    res.json({ success: true, message: 'Updated', spot });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── DELETE /api/hunger-spots/:id (admin) ────────────────────────────────────
const deleteHungerSpot = async (req, res) => {
  try {
    const spot = await HungerSpot.findByIdAndDelete(req.params.id);
    if (!spot) return res.status(404).json({ success: false, message: 'Hunger spot not found' });
    res.json({ success: true, message: 'Hunger spot deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GET /api/hunger-spots/nearest (employee, admin) ─────────────────────────
const getNearestHungerSpots = async (req, res) => {
  try {
    const { lng, lat, radius = 30 } = req.query;
    if (!lng || !lat) {
      return res.status(400).json({ success: false, message: 'lng and lat are required' });
    }
    const spots = await findNearbyHungerSpots(
      [parseFloat(lng), parseFloat(lat)],
      parseFloat(radius)
    );
    res.json({ success: true, spots });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getHungerSpots, createHungerSpot, updateHungerSpot, deleteHungerSpot, getNearestHungerSpots };
