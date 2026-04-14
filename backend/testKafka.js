require('dotenv').config();
const { connectKafkaProducer, produceLocationEvent, disconnectKafkaProducer } = require('./services/kafkaService');
const mongoose = require('mongoose');

const runTest = async () => {
  console.log("🚀 Starting Kafka Simulation...");
  await connectKafkaProducer();

  // Generate a fake MongoDB ObjectId for a driver
  const FAKE_DRIVER_ID = new mongoose.Types.ObjectId().toString();
  console.log(`👤 Simulating a moving driver with ID: ${FAKE_DRIVER_ID}`);

  // Base coordinates (Chennai, India)
  let lng = 80.2707;
  let lat = 13.0827;

  // Simulate 5 location pings very quickly
  for (let i = 1; i <= 5; i++) {
    // Modify coordinates slightly to simulate movement
    lng += 0.0010;
    lat += 0.0010;
    
    console.log(`📡 Ping ${i}: Sending [${lng.toFixed(4)}, ${lat.toFixed(4)}] to Kafka -> (No DB Locking!)`);
    await produceLocationEvent(FAKE_DRIVER_ID, [lng, lat], null);
    
    // Tiny delay just to ensure ordering
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  console.log("✅ All 5 pings sent into the Kafka stream!");
  console.log("⏳ Wait exactly 5 seconds, and glance up at your Backend Server logs. You will see LocationConsumer bulk-flush the 5 events into MongoDB!");
  
  await disconnectKafkaProducer();
  process.exit(0);
};

runTest();
