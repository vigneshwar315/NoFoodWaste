const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Employee who created/verified this donation
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    assignedEmployee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    // Food details (filled during verification)
    foodDescription: { type: String, default: '' },
    foodType: {
      type: String,
      enum: ['veg', 'non-veg', 'vegan', 'mixed', ''],
      default: '',
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
    },
    exactQuantity: { type: Number, default: null }, // confirmed by employee
    preparedAt: { type: Date, default: null },
    expiresAt: { type: Date, default: null },

    // Location
    pickupAddress: { type: String, default: '' },
    pickupLocation: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] },
    },

    // Images
    images: [{ type: String }],

    // Lifecycle status
    status: {
      type: String,
      enum: [
        'pending_verification', // IVR received, awaiting employee call
        'verified',             // Employee filled details
        'validated',            // ETA OK, approved
        'assigned',             // Driver assigned
        'picked',               // Driver picked up food
        'in_transit',           // En route to hunger spot
        'delivered',            // Successfully delivered
        'failed',               // Could not deliver
        'rejected',             // Rejected (employee / system)
        'expired',              // Food expired before delivery
      ],
      default: 'pending_verification',
    },

    rejectionReason: { type: String, default: '' },
    verificationNotes: { type: String, default: '' },

    // ETA & decision engine
    etaSeconds: { type: Number, default: null },
    etaWarning: { type: Boolean, default: false }, // true if ETA > remainingTime
    forceApproved: { type: Boolean, default: false }, // admin override

    // Assignments
    assignedDriver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    assignedVolunteer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    hungerSpot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'HungerSpot',
      default: null,
    },

    // Daily donor link
    dailyDonorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DailyDonor',
      default: null,
    },
    isScheduled: { type: Boolean, default: false },
    scheduledFor: { type: Date, default: null },

    // Source tracking
    source: {
      type: String,
      enum: ['ivr', 'manual', 'scheduled', 'web'],
      default: 'ivr',
    },
  },
  { timestamps: true }
);

// Auto-compute expiresAt = preparedAt + 4 hours (FSSAI rule)
donationSchema.pre('save', function (next) {
  if (this.preparedAt && (this.isModified('preparedAt') || !this.expiresAt)) {
    this.expiresAt = new Date(this.preparedAt.getTime() + 4 * 60 * 60 * 1000);
  }
  next();
});

donationSchema.index({ pickupLocation: '2dsphere' });
donationSchema.index({ status: 1 });
donationSchema.index({ donor: 1 });
donationSchema.index({ assignedDriver: 1 });
donationSchema.index({ expiresAt: 1 });

module.exports = mongoose.model('Donation', donationSchema);
