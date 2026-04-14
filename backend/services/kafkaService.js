const { producer } = require('../config/kafka');

let isProducerConnected = false;

/**
 * Connect the global Kafka producer
 */
const connectKafkaProducer = async () => {
  try {
    if (!isProducerConnected) {
      await producer.connect();
      isProducerConnected = true;
      console.log('✅ Kafka Producer connected successfully');
    }
  } catch (err) {
    console.error('❌ Kafka Producer connection error:', err.message);
  }
};

/**
 * Disconnect the producer gracefully
 */
const disconnectKafkaProducer = async () => {
  if (isProducerConnected) {
    await producer.disconnect();
    isProducerConnected = false;
    console.log('🔌 Kafka Producer disconnected');
  }
};

/**
 * Publish real-time driver location event
 * @param {string} driverId - MongoDB Object ID of driver
 * @param {Array<Number>} coordinates - [lng, lat]
 * @param {string} deliveryId - Specific delivery being tracked
 */
const produceLocationEvent = async (driverId, coordinates, deliveryId) => {
  try {
    if (!isProducerConnected) {
      await connectKafkaProducer();
    }

    const eventPayload = {
      driverId: driverId.toString(),
      deliveryId: deliveryId ? deliveryId.toString() : null,
      coordinates,
      timestamp: new Date().toISOString()
    };

    await producer.send({
      topic: 'driver_locations',
      messages: [
        {
          key: driverId.toString(), // ensure all events for this driver go to the same partition
          value: JSON.stringify(eventPayload),
        },
      ],
    });
  } catch (err) {
    console.error('❌ Failed to produce location event to Kafka:', err.message);
    // Silent fail in production: we don't want to crash the request if kafka is briefly down
  }
};

module.exports = {
  connectKafkaProducer,
  disconnectKafkaProducer,
  produceLocationEvent,
};
