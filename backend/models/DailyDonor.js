const mongoose = require('mongoose');

const dailyDonorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
    },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0],
      },
    },
    // Scheduled time as "HH:MM" in 24h format, e.g. "12:30"
    scheduleTime: {
      type: String,
      required: [true, 'Schedule time is required'],
      match: [/^\d{2}:\d{2}$/, 'Format must be HH:MM'],
    },
    avgQuantity: {
      type: Number,
      required: [true, 'Average quantity is required'],
      min: [30, 'Minimum quantity must be 30'],
    },
    foodType: {
      type: String,
      enum: ['veg', 'non-veg', 'vegan', 'mixed', ''],
      default: '',
    },
    autoCreate: { type: Boolean, default: true }, // If false, only manual trigger
    isActive: { type: Boolean, default: true },
    lastTriggered: { type: Date, default: null },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Link to the user account of this donor (if they have one)
    donorUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

dailyDonorSchema.index({ location: '2dsphere' });
dailyDonorSchema.index({ isActive: 1 });
dailyDonorSchema.index({ phone: 1 });

module.exports = mongoose.model('DailyDonor', dailyDonorSchema);
