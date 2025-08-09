const express = require('express');
const { 
  createEvent, 
  getAllEvents, 
  getEventById, 
  updateEvent, 
  deleteEvent, 
  registerForEvent,
  getRegisteredEvents 
} = require('../controllers/event.controller');
const { authenticate, authorizeOrganizer } = require('../middleware/auth.middleware');

const router = express.Router();

// Public routes
router.get('/events', getAllEvents);
router.get('/events/:id', getEventById);

// Protected routes
router.post('/events', authenticate, authorizeOrganizer, createEvent);
router.put('/events/:id', authenticate, authorizeOrganizer, updateEvent);
router.delete('/events/:id', authenticate, authorizeOrganizer, deleteEvent);
router.post('/events/:id/register', authenticate, registerForEvent);
router.get('/user/events', authenticate, getRegisteredEvents);

module.exports = router;

// Added extra line