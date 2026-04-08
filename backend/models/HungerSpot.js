const mongoose = require('mongoose');

const hungerSpotSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Hunger spot name is required'],
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
        required: true,
      },
    },
    capacity: { type: Number, default: 0 },
    currentOccupancy: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    description: { type: String, default: '' },
    contactName: { type: String, default: '' },
    contactPhone: { type: String, default: '' },
  },
  { timestamps: true }
);

hungerSpotSchema.index({ location: '2dsphere' });
hungerSpotSchema.index({ isActive: 1 });

module.exports = mongoose.model('HungerSpot', hungerSpotSchema);
