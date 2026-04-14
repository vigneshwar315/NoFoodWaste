const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID || 'nfw-backend',
  brokers: [process.env.KAFKA_BROKERS || 'localhost:9092'],
  retry: {
    initialRetryTime: 100,
    retries: 8
  }
});

const producer = kafka.producer();
// We define a single consumer group for location tracking
const locationConsumer = kafka.consumer({ groupId: 'location-tracking-group' });

module.exports = {
  kafka,
  producer,
  locationConsumer
};
