const request = require('supertest');
const app = require('../server');

describe('Event API', () => {
  let token;
  let eventId;
  const testOrganizer = {
    name: 'Test Organizer',
    email: 'organizer@example.com',
    password: 'password123',
    role: 'organizer'
  };
  const testEvent = {
    title: 'Test Event',
    description: 'This is a test event',
    date: '2023-12-31',
    time: '18:00'
  };

  beforeAll(async () => {
    // Register and login as organizer
    await request(app)
      .post('/api/register')
      .send(testOrganizer);
    
    const res = await request(app)
      .post('/api/login')
      .send({
        email: testOrganizer.email,
        password: testOrganizer.password
      });
    
    token = res.body.token;
  });

  test('Should create a new event', async () => {
    const res = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${token}`)
      .send(testEvent);
    
    expect(res.statusCode).toEqual(201);
    expect(res.body.event).toHaveProperty('id');
    expect(res.body.event.title).toEqual(testEvent.title);
    eventId = res.body.event.id;
  });

  test('Should get all events', async () => {
    const res = await request(app)
      .get('/api/events');
    
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.events)).toBeTruthy();
    expect(res.body.events.length).toBeGreaterThan(0);
  });

  test('Should get event by id', async () => {
    const res = await request(app)
      .get(`/api/events/${eventId}`);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.event).toHaveProperty('id');
    expect(res.body.event.id).toEqual(eventId);
  });

  test('Should update an event', async () => {
    const updatedEvent = {
      title: 'Updated Test Event',
      description: 'This is an updated test event'
    };

    const res = await request(app)
      .put(`/api/events/${eventId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedEvent);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.event.title).toEqual(updatedEvent.title);
  });

  test('Should register for an event', async () => {
    // Register a new attendee
    const testAttendee = {
      name: 'Test Attendee',
      email: 'attendee@example.com',
      password: 'password123',
      role: 'attendee'
    };

    await request(app)
      .post('/api/register')
      .send(testAttendee);
    
    const loginRes = await request(app)
      .post('/api/login')
      .send({
        email: testAttendee.email,
        password: testAttendee.password
      });
    
    const attendeeToken = loginRes.body.token;

    // Register for the event
    const res = await request(app)
      .post(`/api/events/${eventId}/register`)
      .set('Authorization', `Bearer ${attendeeToken}`);
    
    expect(res.statusCode).toEqual(200);
  });

  test('Should delete an event', async () => {
    const res = await request(app)
      .delete(`/api/events/${eventId}`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.statusCode).toEqual(200);
  });
});

// Added extra line