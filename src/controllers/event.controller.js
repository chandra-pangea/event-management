const Event = require('../models/event.model');
const User = require('../models/user.model');
const { sendEventRegistrationEmail } = require('../utils/email');
const { v4: uuidv4 } = require('uuid');

const createEvent = (req, res) => {
  try {
    const { title, description, date, time } = req.body;
    const organizerId = req.user.id;

    // Validate input
    if (!title || !description || !date || !time) {
      return res.status(400).json({ message: 'Title, description, date, and time are required' });
    }

    // Create event
    const eventId = uuidv4();
    const newEvent = new Event(
      eventId,
      title,
      description,
      date,
      time,
      organizerId
    );

    Event.create(newEvent);

    res.status(201).json({
      message: 'Event created successfully',
      event: newEvent
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Failed to create event' });
  }
};

const getAllEvents = (req, res) => {
  try {
    const events = Event.getAll();
    res.status(200).json({ events });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Failed to get events' });
  }
};

const getEventById = (req, res) => {
  try {
    const { id } = req.params;
    const event = Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json({ event });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ message: 'Failed to get event' });
  }
};

const updateEvent = (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date, time } = req.body;
    const organizerId = req.user.id;

    // Find event
    const event = Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is the organizer
    if (event.organizerId !== organizerId) {
      return res.status(403).json({ message: 'You are not authorized to update this event' });
    }

    // Update event
    const updatedEvent = Event.update(id, {
      title: title || event.title,
      description: description || event.description,
      date: date || event.date,
      time: time || event.time
    });

    res.status(200).json({
      message: 'Event updated successfully',
      event: updatedEvent
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ message: 'Failed to update event' });
  }
};

const deleteEvent = (req, res) => {
  try {
    const { id } = req.params;
    const organizerId = req.user.id;

    // Find event
    const event = Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is the organizer
    if (event.organizerId !== organizerId) {
      return res.status(403).json({ message: 'You are not authorized to delete this event' });
    }

    // Delete event
    Event.delete(id);

    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ message: 'Failed to delete event' });
  }
};

const registerForEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find event
    const event = Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is already registered
    if (event.participants.includes(userId)) {
      return res.status(400).json({ message: 'You are already registered for this event' });
    }

    // Register user for event
    Event.addParticipant(id, userId);

    // Add event to user's registered events
    const user = User.findById(userId);
    if (!user.registeredEvents.includes(id)) {
      user.registeredEvents.push(id);
    }

    // Send confirmation email
    await sendEventRegistrationEmail(user, event);

    res.status(200).json({ message: 'Successfully registered for the event' });
  } catch (error) {
    console.error('Event registration error:', error);
    res.status(500).json({ message: 'Failed to register for event' });
  }
};

const getRegisteredEvents = (req, res) => {
  try {
    const userId = req.user.id;
    const user = User.findById(userId);
    
    const registeredEvents = user.registeredEvents.map(eventId => {
      return Event.findById(eventId);
    }).filter(event => event !== null);

    res.status(200).json({ events: registeredEvents });
  } catch (error) {
    console.error('Get registered events error:', error);
    res.status(500).json({ message: 'Failed to get registered events' });
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  registerForEvent,
  getRegisteredEvents
};

// Added extra line