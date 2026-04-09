require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const { Server } = require('socket.io');

const connectDB = require('./config/db');
const { seedAdmin } = require('./controllers/authController');
const { startCronJobs } = require('./services/cronService');

// Routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const donationRoutes = require('./routes/donationRoutes');
const deliveryRoutes = require('./routes/deliveryRoutes');
const hungerSpotRoutes = require('./routes/hungerSpotRoutes');
const dailyDonorRoutes = require('./routes/dailyDonorRoutes');

const app = express();
const server = http.createServer(app);

// ─── Socket.io Setup ──────────────────────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT'],
    credentials: true,
  },
});

// Store io globally for use in services/controllers
global.io = io;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// ─── Static Files (uploaded images) ──────────────────────────────────────────
app.use('/uploads', express.static('uploads'));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/hunger-spots', hungerSpotRoutes);
app.use('/api/daily-donors', dailyDonorRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ success: true, message: '🍱 No Food Waste API is running!', version: '2.0.0' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('💥 Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

// ─── Socket.io Events ─────────────────────────────────────────────────────────
io.on('connection', (socket) => {
  console.log(`🔌 Socket connected: ${socket.id}`);

  // Join a specific room (donation, driver, employee group)
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`📌 Socket ${socket.id} joined room: ${roomId}`);
  });

  // Join employee broadcast room
  socket.on('join_employee_room', () => {
    socket.join('employees');
    console.log(`👨‍💼 Employee socket ${socket.id} joined employees room`);
  });

  // Join admin broadcast room (receives real-time driver location updates for live map)
  socket.on('join_admin_room', () => {
    socket.join('admins');
    console.log(`👑 Admin socket ${socket.id} joined admins room`);
  });

  // Join donation-specific room (donor tracking)
  socket.on('join_donation_room', (donationId) => {
    socket.join(`donation_${donationId}`);
    console.log(`🍱 Socket ${socket.id} joined donation room: donation_${donationId}`);
  });

  // Join driver personal room (for assignment notifications)
  socket.on('join_driver_room', (driverId) => {
    socket.join(`driver_${driverId}`);
    console.log(`🚚 Driver socket ${socket.id} joined driver room: driver_${driverId}`);
  });

  // Join delivery tracking room
  socket.on('join_delivery_room', (deliveryId) => {
    socket.join(`delivery_${deliveryId}`);
    console.log(`📍 Socket ${socket.id} joined delivery room: delivery_${deliveryId}`);
  });

  // Driver broadcasts location (via socket, not REST)
  socket.on('driver_location_update', (data) => {
    // data: { driverId, deliveryId, coordinates: [lng, lat] }
    io.to(`delivery_${data.deliveryId}`).emit('locationUpdate', {
      ...data,
      timestamp: new Date(),
    });
  });

  socket.on('disconnect', () => {
    console.log(`🔌 Socket disconnected: ${socket.id}`);
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  await seedAdmin();
  startCronJobs();

  server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🗺️  Google Maps: ${process.env.GOOGLE_MAPS_API_KEY ? '✅ Configured' : '⚠️ Not set — using Haversine fallback'}`);
  });
};

start();
