const { locationConsumer } = require('../config/kafka');
const User = require('../models/User');
const Delivery = require('../models/Delivery');

// Buffer for batch database writes
let locationBatch = new Map();
let isConsumerRunning = false;

const BATCH_FLUSH_INTERVAL_MS = 5000; // Flush to MongoDB every 5 seconds

/**
 * Flush batched coordinates into MongoDB efficiently using BulkWrite
 */
const flushBatchToDB = async () => {
  if (locationBatch.size === 0) return;

  const operations = [];
  const currentBatch = new Map(locationBatch); // Snapshot the current batch
  locationBatch.clear(); // Free up the main buffer for new incoming messages

  console.log(`📦 Flushing Kafka Location Batch (${currentBatch.size} drivers) to DB...`);

  for (const [driverId, data] of currentBatch.entries()) {
    operations.push({
      updateOne: {
        filter: { _id: driverId },
        update: { $set: { 'currentLocation.coordinates': data.coordinates } }
      }
    });
  }

  try {
    await User.bulkWrite(operations, { ordered: false });
  } catch (err) {
    console.error('❌ Failed to bulk write location updates:', err.message);
  }
};

/**
 * Start the Kafka consumer logic for real-time tracking
 */
const startLocationConsumer = async () => {
  if (isConsumerRunning) return;

  try {
    await locationConsumer.connect();
    await locationConsumer.subscribe({ topic: 'driver_locations', fromBeginning: false });

    console.log('🎧 Kafka Location Consumer listening to "driver_locations" topic...');
    isConsumerRunning = true;

    // Start the periodic MongoDB flusher
    setInterval(flushBatchToDB, BATCH_FLUSH_INTERVAL_MS);

    await locationConsumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        if (!message.value) return;

        try {
          const payload = JSON.parse(message.value.toString());
          const { driverId, coordinates, timestamp } = payload;

          // 1. Instantly buffer for DB Write
          locationBatch.set(driverId, { coordinates, timestamp });

          // 2. Instantly WebSocket emit (if server has global.io)
          if (global.io) {
            // Because our producer didn't lookup deliveryId to save DB lock, we do a fast read here
            const delivery = await Delivery.findOne({
              driver: driverId,
              status: { $in: ['accepted', 'picked_up', 'in_transit'] },
            }).select('_id donation');

            if (delivery) {
              // Tell donor/tracker looking at this specific delivery
              global.io.to(`delivery_${delivery._id}`).emit('locationUpdate', {
                driverId,
                coordinates,
                deliveryId: delivery._id,
                donationId: delivery.donation,
                timestamp: new Date(timestamp),
              });

              // Tell Admins global live-map
              global.io.to('admins').emit('driverLocationUpdate', {
                driverId,
                coordinates,
                deliveryId: delivery._id,
                timestamp: new Date(timestamp),
              });
            } else {
              // Driver is online but has no active delivery.
              global.io.to('admins').emit('driverLocationUpdate', {
                driverId,
                coordinates,
                deliveryId: null,
                timestamp: new Date(timestamp),
              });
            }
          }
        } catch (msgErr) {
          console.error('Error processing Kafka message:', msgErr.message);
        }
      },
    });
  } catch (err) {
    console.error('❌ Kafka Location Consumer failed to start:', err.message);
  }
};

module.exports = { startLocationConsumer };
