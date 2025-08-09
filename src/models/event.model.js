// In-memory event storage
const events = [];

class Event {
  constructor(id, title, description, date, time, organizerId) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.date = date;
    this.time = time;
    this.organizerId = organizerId;
    this.participants = [];
  }

  static findById(id) {
    return events.find(event => event.id === id);
  }

  static create(eventData) {
    events.push(eventData);
    return eventData;
  }

  static update(id, eventData) {
    const index = events.findIndex(event => event.id === id);
    if (index !== -1) {
      events[index] = { ...events[index], ...eventData };
      return events[index];
    }
    return null;
  }

  static delete(id) {
    const index = events.findIndex(event => event.id === id);
    if (index !== -1) {
      const deletedEvent = events[index];
      events.splice(index, 1);
      return deletedEvent;
    }
    return null;
  }

  static getAll() {
    return events;
  }

  static addParticipant(eventId, userId) {
    const event = this.findById(eventId);
    if (event) {
      if (!event.participants.includes(userId)) {
        event.participants.push(userId);
      }
      return event;
    }
    return null;
  }
}

module.exports = Event;

// Added extra line