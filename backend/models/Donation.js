const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    createdBy: {
      // Employee or Admin who logged it
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    foodDescription: {
      type: String,
      required: [true, 'Food description is required'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity (number of people) is required'],
      min: [30, 'Minimum donation must feed 30 people'],
    },
    preparedAt: {
      type: Date,
      required: [true, 'Preparation time is required'],
    },
    expiresAt: {
      type: Date, // preparedAt + 4 hours (FSSAI guideline)
    },
    images: [{ type: String }],
    pickupAddress: {
      type: String,
      required: true,
    },
    pickupLocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
    status: {
      type: String,
      enum: [
        'pending',
        'assigned',
        'picked_up',
        'delivered',
        'rejected',
        'expired',
        'cancelled',
      ],
      default: 'pending',
    },
    rejectionReason: {
      type: String,
      default: '',
    },
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
    scheduledFor: {
      type: Date,
      default: null,
    },
    isScheduled: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Auto-compute expiresAt before saving
donationSchema.pre('save', function (next) {
  if (this.isModified('preparedAt') || !this.expiresAt) {
    this.expiresAt = new Date(this.preparedAt.getTime() + 4 * 60 * 60 * 1000);
  }
  next();
});

donationSchema.index({ pickupLocation: '2dsphere' });
donationSchema.index({ status: 1 });
donationSchema.index({ donor: 1 });

module.exports = mongoose.model('Donation', donationSchema);
