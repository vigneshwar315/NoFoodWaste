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
    hungerSpot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'HungerSpot',
      default: null,
    },

    // Timestamps
    assignedAt: { type: Date, default: Date.now },
    acceptedAt: { type: Date, default: null },
    pickupTime: { type: Date, default: null },
    deliveryTime: { type: Date, default: null },
    estimatedDeliveryTime: { type: Date, default: null },

    // Proof
    pickupProof: { type: String, default: '' },
    deliveryProof: { type: String, default: '' },

    // Delivery outcome
    quantityDelivered: { type: Number, default: null },
    foodCondition: {
      type: String,
      enum: ['good', 'fair', 'poor', ''],
      default: '',
    },
    remarks: { type: String, default: '' },
    feedback: { type: String, default: '' },

    // Status
    status: {
      type: String,
      enum: [
        'assigned',     // Driver assigned, awaiting acceptance
        'accepted',     // Driver accepted
        'picked_up',    // Driver picked up food
        'in_transit',   // On the way to hunger spot
        'delivered',    // Delivered successfully
        'failed',       // Failed delivery
        'rejected',     // Driver rejected → triggers reassign
      ],
      default: 'assigned',
    },

    failureReason: { type: String, default: '' },
    driverRejected: { type: Boolean, default: false },
    reassignCount: { type: Number, default: 0 },

    // ETA info
    etaSeconds: { type: Number, default: null },
    distanceKm: { type: Number, default: null },
  },
  { timestamps: true }
);

deliverySchema.index({ status: 1 });
deliverySchema.index({ driver: 1 });
deliverySchema.index({ donation: 1 });

module.exports = mongoose.model('Delivery', deliverySchema);
