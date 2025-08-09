const { sendRegistrationEmail, sendEventRegistrationEmail } = require('../utils/email');
const nodemailer = require('nodemailer');

// Mock nodemailer
jest.mock('nodemailer');

describe('Email Service', () => {
  let mockSendMail;
  
  beforeEach(() => {
    // Create a mock for sendMail function
    mockSendMail = jest.fn().mockResolvedValue({ success: true });
    
    // Mock the createTransport to return our mock transport
    nodemailer.createTransport.mockReturnValue({
      sendMail: mockSendMail
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Should send registration email', async () => {
    const user = {
      id: '123',
      name: 'Test User',
      email: 'test@example.com'
    };

    const result = await sendRegistrationEmail(user);

    expect(result).toBe(true);
    expect(mockSendMail).toHaveBeenCalledTimes(1);
    expect(mockSendMail).toHaveBeenCalledWith(expect.objectContaining({
      to: user.email,
      subject: 'Welcome to Event Management Platform'
    }));
  });

  test('Should send event registration email', async () => {
    const user = {
      id: '123',
      name: 'Test User',
      email: 'test@example.com'
    };

    const event = {
      id: '456',
      title: 'Test Event',
      date: '2023-12-31',
      time: '18:00'
    };

    const result = await sendEventRegistrationEmail(user, event);

    expect(result).toBe(true);
    expect(mockSendMail).toHaveBeenCalledTimes(1);
    expect(mockSendMail).toHaveBeenCalledWith(expect.objectContaining({
      to: user.email,
      subject: `Registration Confirmation: ${event.title}`
    }));
  });

  test('Should handle email sending failure', async () => {
    // Mock a failure
    mockSendMail.mockRejectedValue(new Error('Failed to send email'));

    const user = {
      id: '123',
      name: 'Test User',
      email: 'test@example.com'
    };

    const result = await sendRegistrationEmail(user);

    expect(result).toBe(false);
    expect(mockSendMail).toHaveBeenCalledTimes(1);
  });
});

// Added extra line