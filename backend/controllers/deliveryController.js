const Delivery = require('../models/Delivery');
const Donation = require('../models/Donation');
const User = require('../models/User');
const { reassignDriver, updateDriverLocation } = require('../services/driverService');

// ─── POST /api/delivery/accept (driver) ───────────────────────────────────────
const acceptDelivery = async (req, res) => {
  try {
    const { deliveryId } = req.body;
    const delivery = await Delivery.findOne({
      _id: deliveryId,
      driver: req.user._id,
      status: 'assigned',
    });

    if (!delivery) return res.status(404).json({ success: false, message: 'Delivery not found or not assigned to you' });

    delivery.status = 'accepted';
    delivery.acceptedAt = new Date();
    await delivery.save();

    if (global.io) {
      global.io.to(`donation_${delivery.donation}`).emit('deliveryStatusUpdate', {
        donationId: delivery.donation,
        deliveryId,
        status: 'accepted',
        driverId: req.user._id,
      });
    }

    res.json({ success: true, message: 'Delivery accepted', delivery });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── POST /api/delivery/reject (driver) ───────────────────────────────────────
const rejectDelivery = async (req, res) => {
  try {
    const { deliveryId, reason } = req.body;
    const delivery = await Delivery.findOne({
      _id: deliveryId,
      driver: req.user._id,
      status: { $in: ['assigned', 'accepted'] },
    });

    if (!delivery) return res.status(404).json({ success: false, message: 'Delivery not found' });

    const result = await reassignDriver(deliveryId, reason);

    res.json({
      success: true,
      message: result.reassigned
        ? `Delivery reassigned to another driver`
        : `No other driver available. Admin notified.`,
      reassigned: result.reassigned,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── POST /api/delivery/pickup (driver) — multer file upload ─────────────────
const confirmPickup = async (req, res) => {
  try {
    const { deliveryId } = req.body;
    const delivery = await Delivery.findOne({
      _id: deliveryId,
      driver: req.user._id,
      status: { $in: ['accepted', 'assigned'] },
    });

    if (!delivery) return res.status(404).json({ success: false, message: 'Delivery not found' });

    const photoPath = req.file ? `/uploads/pickups/${req.file.filename}` : '';

    delivery.status = 'picked_up';
    delivery.pickupTime = new Date();
    delivery.pickupProof = photoPath;
    await delivery.save();

    await Donation.findByIdAndUpdate(delivery.donation, { status: 'picked' });

    if (global.io) {
      global.io.to(`donation_${delivery.donation}`).emit('deliveryStatusUpdate', {
        donationId: delivery.donation,
        deliveryId,
        status: 'picked',
        pickupTime: delivery.pickupTime,
        pickupProof: photoPath,
      });
    }

    res.json({ success: true, message: 'Pickup confirmed', delivery });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── POST /api/delivery/in-transit (driver) ───────────────────────────────────
const startTransit = async (req, res) => {
  try {
    const { deliveryId } = req.body;
    const delivery = await Delivery.findOneAndUpdate(
      { _id: deliveryId, driver: req.user._id, status: 'picked_up' },
      { status: 'in_transit' },
      { new: true }
    );

    if (!delivery) return res.status(404).json({ success: false, message: 'Delivery not found' });

    await Donation.findByIdAndUpdate(delivery.donation, { status: 'in_transit' });

    if (global.io) {
      global.io.to(`donation_${delivery.donation}`).emit('deliveryStatusUpdate', {
        donationId: delivery.donation,
        status: 'in_transit',
      });
    }

    res.json({ success: true, message: 'Now in transit', delivery });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── POST /api/delivery/complete (driver) — multer file upload ────────────────
const completeDelivery = async (req, res) => {
  try {
    const { deliveryId, quantityDelivered, foodCondition, remarks } = req.body;
    const delivery = await Delivery.findOne({
      _id: deliveryId,
      driver: req.user._id,
      status: { $in: ['picked_up', 'in_transit', 'accepted'] },
    });

    if (!delivery) return res.status(404).json({ success: false, message: 'Delivery not found' });

    const photoPath = req.file ? `/uploads/deliveries/${req.file.filename}` : '';

    delivery.status = 'delivered';
    delivery.deliveryTime = new Date();
    delivery.deliveryProof = photoPath;
    delivery.quantityDelivered = quantityDelivered ? Number(quantityDelivered) : null;
    delivery.foodCondition = foodCondition || '';
    delivery.remarks = remarks || '';
    await delivery.save();

    await Donation.findByIdAndUpdate(delivery.donation, { status: 'delivered' });

    // Mark driver as available again
    await User.findByIdAndUpdate(req.user._id, { isAvailable: true });

    if (global.io) {
      global.io.to(`donation_${delivery.donation}`).emit('deliveryStatusUpdate', {
        donationId: delivery.donation,
        deliveryId,
        status: 'delivered',
        deliveryTime: delivery.deliveryTime,
        quantityDelivered: delivery.quantityDelivered,
        foodCondition: delivery.foodCondition,
      });
    }

    res.json({ success: true, message: '🎉 Delivery completed!', delivery });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── POST /api/delivery/fail (driver) ─────────────────────────────────────────
const failDelivery = async (req, res) => {
  try {
    const { deliveryId, reason } = req.body;
    const delivery = await Delivery.findOneAndUpdate(
      { _id: deliveryId, driver: req.user._id },
      { status: 'failed', failureReason: reason || 'Unknown reason' },
      { new: true }
    );

    if (!delivery) return res.status(404).json({ success: false, message: 'Delivery not found' });

    await Donation.findByIdAndUpdate(delivery.donation, { status: 'failed' });
    await User.findByIdAndUpdate(req.user._id, { isAvailable: true });

    res.json({ success: true, message: 'Delivery marked as failed', delivery });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GET /api/delivery/my (driver, volunteer) ─────────────────────────────────
const getMyDeliveries = async (req, res) => {
  try {
    const filter = req.user.role === 'driver'
      ? { driver: req.user._id }
      : { volunteer: req.user._id };

    const deliveries = await Delivery.find(filter)
      .populate({
        path: 'donation',
        populate: [
          { path: 'donor', select: 'name phone' },
          { path: 'hungerSpot', select: 'name address location' },
        ],
      })
      .populate('hungerSpot', 'name address location')
      .sort({ createdAt: -1 });

    res.json({ success: true, deliveries, count: deliveries.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GET /api/delivery/:id ────────────────────────────────────────────────────
const getDeliveryById = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id)
      .populate({
        path: 'donation',
        populate: [
          { path: 'donor', select: 'name phone' },
          { path: 'hungerSpot', select: 'name address location contactName contactPhone' },
        ],
      })
      .populate('driver', 'name phone vehicleType currentLocation')
      .populate('hungerSpot', 'name address location contactName contactPhone');

    if (!delivery) return res.status(404).json({ success: false, message: 'Delivery not found' });
    res.json({ success: true, delivery });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── PUT /api/drivers/location (driver) ──────────────────────────────────────
const updateLocation = async (req, res) => {
  try {
    const { coordinates } = req.body; // [longitude, latitude]
    if (!Array.isArray(coordinates) || coordinates.length !== 2) {
      return res.status(400).json({ success: false, message: 'coordinates: [lng, lat] required' });
    }

    const result = await updateDriverLocation(req.user._id, coordinates);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GET /api/delivery/all (admin) ────────────────────────────────────────────
const getAllDeliveries = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const deliveries = await Delivery.find(filter)
      .populate('driver', 'name phone currentLocation')
      .populate({
        path: 'donation',
        populate: { path: 'donor', select: 'name phone' },
      })
      .populate('hungerSpot', 'name address')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({ success: true, deliveries, count: deliveries.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
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
};
