
## API Endpoints

### Authentication

- `POST /api/register` - Register a new user
- `POST /api/login` - Login a user
- `GET /api/profile` - Get user profile (requires authentication)

### Events

- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create a new event (requires organizer role)
- `PUT /api/events/:id` - Update an event (requires organizer role)
- `DELETE /api/events/:id` - Delete an event (requires organizer role)
- `POST /api/events/:id/register` - Register for an event (requires authentication)
- `GET /api/user/events` - Get user's registered events (requires authentication)

## Testing

Run the tests with:
# Event Management Platform

Backend System for a Virtual Event Management Platform

## Description

This is a backend system for a virtual event management platform that focuses on user registration, event scheduling, and participant management. The system uses in-memory data structures to store user data and event details.

## Features

- User Authentication (Registration, Login)
- Event Management (Create, Read, Update, Delete)
- Participant Management
- Email Notifications

## Technologies Used

- Node.js
- Express.js
- JWT for Authentication
- Bcrypt for Password Hashing
- Nodemailer for Email Notifications

## Installation

1. Clone the repository


