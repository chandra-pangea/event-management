const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { logger, stream } = require('./utils/logger');
const authRoutes = require('./routes/auth.routes');
const eventRoutes = require('./routes/event.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Add request logging
app.use(morgan('combined', { stream }));

// Routes
app.use('/api', authRoutes);
app.use('/api', eventRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  logger.info('Health check endpoint called');
  res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}\nStack: ${err.stack}`);
  res.status(500).json({ message: 'Something went wrong!' });
});

module.exports = app;

// Added extra line