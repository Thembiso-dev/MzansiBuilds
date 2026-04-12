/**
 * Auth Route Tests
 *
 * Comprehensive tests for user registration, login and logout.
 * Written using TDD — Red, Green, Refactor.
 *
 * @author Thabo Mokoena
 * @module tests/auth
 */

const request = require('supertest');
const app = require('../server');

// ─── Register Tests ───────────────────────────────────────────────────────────

describe('POST /api/auth/register', () => {

  test('should return 400 if email is missing', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ password: 'Test1234!', username: 'testuser' });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  }, 15000);

  test('should return 400 if email is just spaces', async () => {
  const res = await request(app)
    .post('/api/auth/register')
    .send({
      email: '   ',
      password: 'Test1234!',
      username: 'testuser'
    });
  expect(res.statusCode).toBe(400);
  expect(res.body.error).toBeDefined();
}, 15000);

test('should return 400 if username is just spaces', async () => {
  const res = await request(app)
    .post('/api/auth/register')
    .send({
      email: 'test@example.com',
      password: 'Test1234!',
      username: '   '
    });
  expect(res.statusCode).toBe(400);
  expect(res.body.error).toBeDefined();
}, 15000);

test('should return 400 if password is exactly 5 chars', async () => {
  const res = await request(app)
    .post('/api/auth/register')
    .send({
      email: 'test@example.com',
      password: '12345',
      username: 'testuser'
    });
  expect(res.statusCode).toBe(400);
  expect(res.body.error).toBeDefined();
}, 15000);

  test('should return 400 if password is missing', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@example.com', username: 'testuser' });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  }, 15000);

  test('should return 400 if username is missing', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@example.com', password: 'Test1234!' });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  }, 15000);

  test('should return 400 if email format is invalid', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'not-an-email',
        password: 'Test1234!',
        username: 'testuser'
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  }, 15000);

  test('should return 400 if password is too short', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: '123',
        username: 'testuser'
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  }, 15000);

  test('should return 400 if username is too short', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'Test1234!',
        username: 'a'
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  }, 15000);

  test('should return 400 if body is empty', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  }, 15000);

  test('should return 400 if password is null', async () => {
  const res = await request(app)
    .post('/api/auth/register')
    .send({
      email: 'test@example.com',
      password: null,
      username: 'testuser'
    });
  expect(res.statusCode).toBe(400);
  expect(res.body.error).toBeDefined();
}, 15000);

  test('should return 400 if email has spaces', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test @example.com',
        password: 'Test1234!',
        username: 'testuser'
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  }, 15000);

});

// ─── Login Tests ──────────────────────────────────────────────────────────────

describe('POST /api/auth/login', () => {

  test('should return 400 if email is missing', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ password: 'Test1234!' });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  }, 15000);
  
test('should return 400 if password is null', async () => {
  const res = await request(app)
    .post('/api/auth/register')
    .send({
      email: 'test@example.com',
      password: null,
      username: 'testuser'
    });
  expect(res.statusCode).toBe(400);
  expect(res.body.error).toBeDefined();
}, 15000);

  test('should return 400 if email is just spaces', async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({
      email: '   ',
      password: 'Test1234!'
    });
  expect(res.statusCode).toBe(400);
  expect(res.body.error).toBeDefined();
}, 15000);

test('should return 400 if password is just spaces', async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'test@example.com',
      password: '   '
    });
  expect(res.statusCode).toBe(400);
  expect(res.body.error).toBeDefined();
}, 15000);

  test('should return 400 if password is missing', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com' });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  }, 15000);

  test('should return 400 if email format is invalid', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'not-an-email', password: 'Test1234!' });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  }, 15000);

  test('should return 400 if body is empty', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  }, 15000);

  test('should return 401 if credentials are wrong', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'wrong@example.com',
        password: 'WrongPassword!'
      });
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBeDefined();
  }, 15000);

  test('should return 400 if email is empty string', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: '', password: 'Test1234!' });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  }, 15000);

  test('should return 400 if password is empty string', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: '' });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  }, 15000);

});

// ─── Logout Tests ─────────────────────────────────────────────────────────────

describe('POST /api/auth/logout', () => {

  test('should return 401 if no token is provided', async () => {
    const res = await request(app)
      .post('/api/auth/logout');
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBeDefined();
  }, 15000);

  test('should return 401 if token is invalid', async () => {
    const res = await request(app)
      .post('/api/auth/logout')
      .set('Authorization', 'Bearer invalidtoken123');
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBeDefined();
  }, 15000);

  test('should return 401 if authorization header is malformed', async () => {
    const res = await request(app)
      .post('/api/auth/logout')
      .set('Authorization', 'invalidtoken123');
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBeDefined();
  }, 15000);

  test('should return 401 if bearer token is empty', async () => {
    const res = await request(app)
      .post('/api/auth/logout')
      .set('Authorization', 'Bearer ');
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBeDefined();
  }, 15000);

});

// ─── Teardown ─────────────────────────────────────────────────────────────────

afterAll((done) => { done(); });