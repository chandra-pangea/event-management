const nodemailer = require('nodemailer');
const { logger } = require('./logger');

// Create a transporter based on environment
const createTransporter = () => {
  // For testing environment
  if (process.env.NODE_ENV === 'test') {
    logger.debug('Using test email transporter');
    return {
      sendMail: async (mailOptions) => {
        logger.debug('Test email would be sent:', mailOptions);
        return { success: true };
      }
    };
  }
  
  // For development environment without actual sending
  if (process.env.NODE_ENV === 'development' && !process.env.EMAIL_HOST) {
    logger.debug('Using development mock email transporter');
    return {
      sendMail: async (mailOptions) => {
        logger.info('Email mock sent:', mailOptions);
        return { success: true };
      }
    };
  }
  
  // For production or configured development environment
  logger.debug('Using configured SMTP email transporter');
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Get transporter instance
const transporter = createTransporter();

const sendRegistrationEmail = async (user) => {
  try {
    logger.info(`Sending registration email to: ${user.email}`);
    
    const mailOptions = {
      from: '"Event Management" <noreply@eventmanagement.com>',
      to: user.email,
      subject: 'Welcome to Event Management Platform',
      text: `Hello ${user.name},\n\nThank you for registering with our Event Management Platform. You can now log in and start exploring events.\n\nBest regards,\nThe Event Management Team`,
      html: `<p>Hello ${user.name},</p><p>Thank you for registering with our Event Management Platform. You can now log in and start exploring events.</p><p>Best regards,<br>The Event Management Team</p>`
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Registration email sent successfully to: ${user.email}`);
    return true;
  } catch (error) {
    logger.error(`Error sending registration email to ${user.email}: ${error.message}`, { stack: error.stack });
    return false;
  }
};

const sendEventRegistrationEmail = async (user, event) => {
  try {
    logger.info(`Sending event registration email to: ${user.email} for event: ${event.title}`);
    
    const mailOptions = {
      from: '"Event Management" <noreply@eventmanagement.com>',
      to: user.email,
      subject: `Registration Confirmation: ${event.title}`,
      text: `Hello ${user.name},\n\nYou have successfully registered for the event "${event.title}" scheduled on ${event.date} at ${event.time}.\n\nWe look forward to your participation!\n\nBest regards,\nThe Event Management Team`,
      html: `<p>Hello ${user.name},</p><p>You have successfully registered for the event "${event.title}" scheduled on ${event.date} at ${event.time}.</p><p>We look forward to your participation!</p><p>Best regards,<br>The Event Management Team</p>`
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Event registration email sent successfully to: ${user.email} for event: ${event.title}`);
    return true;
  } catch (error) {
    logger.error(`Error sending event registration email to ${user.email}: ${error.message}`, { stack: error.stack });
    return false;
  }
};

module.exports = {
  sendRegistrationEmail,
  sendEventRegistrationEmail
};

// Added extra line