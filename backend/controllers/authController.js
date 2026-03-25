const User = require('../models/User');
const OTP = require('../models/OTP');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// ─── Helper: Generate JWT ────────────────────────────────────────────────────
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// ─── Seed Admin (run once on first launch) ───────────────────────────────────
const seedAdmin = async () => {
  try {
    const exists = await User.findOne({ role: 'admin' });
    if (exists) return;

    await User.create({
      name: process.env.ADMIN_NAME || 'NGO Admin',
      email: process.env.ADMIN_EMAIL || 'admin@nofoodwaste.org',
      phone: process.env.ADMIN_PHONE || '9999999999',
      username: process.env.ADMIN_USERNAME || 'admin',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      role: 'admin',
      isVerified: true,
    });
    console.log('✅ Admin user seeded successfully');
  } catch (err) {
    console.error('❌ Admin seed failed:', err.message);
  }
};

// ─── Login with Username/Password (Admin, Employee, Driver) ──────────────────
const loginWithPassword = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

    // Find user by username or email
    const user = await User.findOne({
      $or: [{ username: username.toLowerCase() }, { email: username.toLowerCase() }],
    }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Role check if provided
    if (role && user.role !== role) {
      return res.status(403).json({ success: false, message: `This account is not registered as a ${role}` });
    }

    if (user.isBlocked) {
      return res.status(403).json({ success: false, message: 'Account is blocked. Contact admin.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

// ─── Send OTP (Donor) ─────────────────────────────────────────────────────────
const sendOTP = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      return res.status(400).json({ success: false, message: 'Valid 10-digit Indian mobile number required' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Invalidate previous OTPs for this phone
    await OTP.updateMany({ phone, isUsed: false }, { isUsed: true });

    // Save new OTP
    await OTP.create({ phone, otp });

    // In production: send via Twilio SMS
    // For dev: return OTP in response
    const response = {
      success: true,
      message: 'OTP sent successfully',
    };

    if (process.env.NODE_ENV === 'development') {
      response.otp = otp; // remove in production
    }

    console.log(`📱 OTP for ${phone}: ${otp}`);
    res.status(200).json(response);
  } catch (error) {
    console.error('OTP send error:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
};

// ─── Verify OTP (Donor Login) ─────────────────────────────────────────────────
const verifyOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ success: false, message: 'Phone and OTP are required' });
    }

    const otpRecord = await OTP.findOne({
      phone,
      otp,
      isUsed: false,
      expiresAt: { $gt: new Date() },
    });

    if (!otpRecord) {
      return res.status(401).json({ success: false, message: 'Invalid or expired OTP' });
    }

    // Mark OTP as used
    otpRecord.isUsed = true;
    await otpRecord.save();

    // Find or create donor
    let user = await User.findOne({ phone, role: 'donor' });

    if (!user) {
      user = await User.create({
        name: `Donor-${phone.slice(-4)}`,
        phone,
        role: 'donor',
        isVerified: true,
        donorType: 'one-time',
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({ success: false, message: 'Account is blocked. Contact admin.' });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'OTP verified. Login successful.',
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error('OTP verify error:', error);
    res.status(500).json({ success: false, message: 'Server error during OTP verification' });
  }
};

// ─── Volunteer Self-Registration ─────────────────────────────────────────────
const registerVolunteer = async (req, res) => {
  try {
    const { name, email, phone, username, password, skills, areasServed, address } = req.body;

    if (!name || !phone || !username || !password) {
      return res.status(400).json({ success: false, message: 'Name, phone, username and password are required' });
    }

    // Check duplicates
    const existing = await User.findOne({
      $or: [
        { username: username.toLowerCase() },
        { phone },
        ...(email ? [{ email: email.toLowerCase() }] : []),
      ],
    });

    if (existing) {
      let field = existing.username === username.toLowerCase() ? 'Username' : existing.phone === phone ? 'Phone' : 'Email';
      return res.status(409).json({ success: false, message: `${field} already in use` });
    }

    const user = await User.create({
      name,
      email: email || undefined,
      phone,
      username: username.toLowerCase(),
      password,
      role: 'volunteer',
      isVerified: false, // Admin must verify
      skills: skills || [],
      areasServed: areasServed || [],
      address: address || '',
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful! Awaiting admin verification.',
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error('Volunteer register error:', error);
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'Username, email, or phone already exists' });
    }
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
};

// ─── Volunteer Login ──────────────────────────────────────────────────────────
const loginVolunteer = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

    const user = await User.findOne({
      $or: [{ username: username.toLowerCase() }, { email: username.toLowerCase() }],
      role: 'volunteer',
    }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (user.isBlocked) {
      return res.status(403).json({ success: false, message: 'Account is blocked. Contact admin.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error('Volunteer login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

// ─── Admin Creates Driver / Employee Account ──────────────────────────────────
const registerByAdmin = async (req, res) => {
  try {
    const { name, email, phone, username, password, role, vehicleType, licenseNumber, employeeId, department } = req.body;

    if (!name || !username || !password || !role) {
      return res.status(400).json({ success: false, message: 'Name, username, password and role are required' });
    }

    if (!['driver', 'employee'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Role must be driver or employee' });
    }

    const existing = await User.findOne({
      $or: [
        { username: username.toLowerCase() },
        ...(phone ? [{ phone }] : []),
        ...(email ? [{ email: email.toLowerCase() }] : []),
      ],
    });

    if (existing) {
      return res.status(409).json({ success: false, message: 'Username, email, or phone already exists' });
    }

    const userData = {
      name,
      email: email || undefined,
      phone: phone || undefined,
      username: username.toLowerCase(),
      password,
      role,
      isVerified: true, // Admin-created accounts are pre-verified
      createdBy: req.user._id,
    };

    if (role === 'driver') {
      userData.vehicleType = vehicleType || '';
      userData.licenseNumber = licenseNumber || '';
    }
    if (role === 'employee') {
      userData.employeeId = employeeId || '';
      userData.department = department || '';
    }

    const user = await User.create(userData);

    res.status(201).json({
      success: true,
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} account created successfully`,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error('Admin register error:', error);
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'Duplicate field value' });
    }
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
};

// ─── Get Current User ─────────────────────────────────────────────────────────
const getMe = async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
};

module.exports = {
  seedAdmin,
  loginWithPassword,
  sendOTP,
  verifyOTP,
  registerVolunteer,
  loginVolunteer,
  registerByAdmin,
  getMe,
};
