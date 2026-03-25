const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema(
  {
    donation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Donation',
      required: true,
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    volunteer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    pickupTime: { type: Date, default: null },
    deliveryTime: { type: Date, default: null },
    pickupProof: { type: String, default: '' },
    deliveryProof: { type: String, default: '' },
    status: {
      type: String,
      enum: ['assigned', 'in_progress', 'picked_up', 'delivered', 'failed'],
      default: 'assigned',
    },
    feedback: { type: String, default: '' },
    hungerSpot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'HungerSpot',
      default: null,
    },
    estimatedDeliveryTime: { type: Date, default: null },
    failureReason: { type: String, default: '' },
  },
  { timestamps: true }
);

deliverySchema.index({ status: 1 });
deliverySchema.index({ driver: 1 });

module.exports = mongoose.model('Delivery', deliverySchema);
