const request = require('supertest');
const app = require('../server');
const { sendEventRegistrationEmail } = require('../utils/email');

// Mock the email service
jest.mock('../utils/email', () => ({
  sendEventRegistrationEmail: jest.fn().mockResolvedValue(true)
}));

describe('Event Registration with Email', () => {
  let organizerToken;
  let attendeeToken;
  let eventId;
  
  const testOrganizer = {
    name: 'Email Test Organizer',
    email: 'email-organizer@example.com',
    password: 'password123',
    role: 'organizer'
  };
  
  const testAttendee = {
    name: 'Email Test Attendee',
    email: 'email-attendee@example.com',
    password: 'password123',
    role: 'attendee'
  };
  
  const testEvent = {
    title: 'Email Test Event',
    description: 'This is a test event for email testing',
    date: '2023-12-31',
    time: '18:00'
  };

  beforeAll(async () => {
    // Register and login as organizer
    await request(app)
      .post('/api/register')
      .send(testOrganizer);
    
    const organizerRes = await request(app)
      .post('/api/login')
      .send({
        email: testOrganizer.email,
        password: testOrganizer.password
      });
    
    organizerToken = organizerRes.body.token;
    
    // Register and login as attendee
    await request(app)
      .post('/api/register')
      .send(testAttendee);
    
    const attendeeRes = await request(app)
      .post('/api/login')
      .send({
        email: testAttendee.email,
        password: testAttendee.password
      });
    
    attendeeToken = attendeeRes.body.token;
    
    // Create an event
    const eventRes = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${organizerToken}`)
      .send(testEvent);
    
    eventId = eventRes.body.event.id;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Should register for an event and send confirmation email', async () => {
    const res = await request(app)
      .post(`/api/events/${eventId}/register`)
      .set('Authorization', `Bearer ${attendeeToken}`);
    
    expect(res.statusCode).toEqual(200);
    expect(sendEventRegistrationEmail).toHaveBeenCalledTimes(1);
    expect(sendEventRegistrationEmail).toHaveBeenCalledWith(
      expect.objectContaining({ email: testAttendee.email }),
      expect.objectContaining({ title: testEvent.title })
    );
  });

  test('Should handle email failure gracefully', async () => {
    // Mock email failure for this test
    sendEventRegistrationEmail.mockRejectedValueOnce(new Error('Email sending failed'));
    
    const res = await request(app)
      .post(`/api/events/${eventId}/register`)
      .set('Authorization', `Bearer ${attendeeToken}`);
    
    // Should still succeed even if email fails
    expect(res.statusCode).toEqual(200);
    expect(sendEventRegistrationEmail).toHaveBeenCalledTimes(1);
  });
});

// Added extra line