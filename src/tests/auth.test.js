const request = require('supertest');
const app = require('../server');

describe('Auth API', () => {
  let token;
  const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    role: 'attendee'
  };

  test('Should register a new user', async () => {
    const res = await request(app)
      .post('/api/register')
      .send(testUser);
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user.email).toEqual(testUser.email);
  });

  test('Should login a user', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
  });

  test('Should get user profile', async () => {
    const res = await request(app)
      .get('/api/profile')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user.email).toEqual(testUser.email);
  });
});

// Added extra line