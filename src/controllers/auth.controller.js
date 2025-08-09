const User = require('../models/user.model');
const { hashPassword, comparePassword, generateToken } = require('../utils/auth');
const { sendRegistrationEmail } = require('../utils/email');
const { v4: uuidv4 } = require('uuid');
const { logger } = require('../utils/logger');

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    logger.info(`Registration attempt for email: ${email}`);

    // Validate input
    if (!name || !email || !password) {
      logger.warn(`Registration failed: Missing required fields for email: ${email}`);
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Check if user already exists
    const existingUser = User.findByEmail(email);
    if (existingUser) {
      logger.warn(`Registration failed: User already exists with email: ${email}`);
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const userId = uuidv4();
    const newUser = new User(
      userId,
      name,
      email,
      hashedPassword,
      role || 'attendee'
    );

    User.create(newUser);
    logger.info(`User created successfully with ID: ${userId}`);

    // Send registration email
    const emailSent = await sendRegistrationEmail(newUser);
    if (emailSent) {
      logger.info(`Registration email sent to: ${email}`);
    } else {
      logger.warn(`Failed to send registration email to: ${email}`);
    }

    // Generate token
    const token = generateToken(userId);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    logger.error(`Registration error: ${error.message}`, { stack: error.stack });
    res.status(500).json({ message: 'Registration failed' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    logger.info(`Login attempt for email: ${email}`);

    // Validate input
    if (!email || !password) {
      logger.warn(`Login failed: Missing email or password for: ${email}`);
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = User.findByEmail(email);
    if (!user) {
      logger.warn(`Login failed: User not found for email: ${email}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      logger.warn(`Login failed: Invalid password for email: ${email}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user.id);
    logger.info(`User logged in successfully: ${email}`);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    logger.error(`Login error: ${error.message}`, { stack: error.stack });
    res.status(500).json({ message: 'Login failed' });
  }
};

const getProfile = (req, res) => {
  try {
    const user = req.user;
    logger.info(`Profile accessed for user ID: ${user.id}`);
    
    res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        registeredEvents: user.registeredEvents
      }
    });
  } catch (error) {
    logger.error(`Get profile error: ${error.message}`, { stack: error.stack });
    res.status(500).json({ message: 'Failed to get profile' });
  }
};

module.exports = {
  register,
  login,
  getProfile
};

// Added extra line