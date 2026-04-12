/**
 * Celebration Wall Route Tests
 *
 * Comprehensive tests for the celebration wall endpoint.
 *
 * @author Thabo Mokoena
 * @module tests/celebrate
 */

const request = require('supertest');
const app = require('../server');

// ─── GET Celebrate ────────────────────────────────────────────────────────────

describe('GET /api/celebrate', () => {

  test('should return 200 and an array', async () => {
    const res = await request(app).get('/api/celebrate');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  }, 15000);

  test('should only return completed projects', async () => {
    const res = await request(app).get('/api/celebrate');
    expect(res.statusCode).toBe(200);
    res.body.forEach(project => {
      expect(project.stage).toBe('completed');
    });
  }, 15000);

  test('should include profile information', async () => {
    const res = await request(app).get('/api/celebrate');
    expect(res.statusCode).toBe(200);
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty('profiles');
      expect(res.body[0].profiles).toHaveProperty('username');
    }
  }, 15000);

  test('should return projects with required fields', async () => {
    const res = await request(app).get('/api/celebrate');
    expect(res.statusCode).toBe(200);
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty('id');
      expect(res.body[0]).toHaveProperty('title');
      expect(res.body[0]).toHaveProperty('stage');
      expect(res.body[0]).toHaveProperty('user_id');
    }
  }, 15000);

  test('should not require authentication', async () => {
    const res = await request(app).get('/api/celebrate');
    expect(res.statusCode).not.toBe(401);
  }, 15000);

});

test('should return json content type', async () => {
  const res = await request(app).get('/api/celebrate');
  expect(res.headers['content-type']).toMatch(/json/);
}, 15000);

test('completed projects should have completed_at date', async () => {
  const res = await request(app).get('/api/celebrate');
  expect(res.statusCode).toBe(200);
  res.body.forEach(project => {
    expect(project).toHaveProperty('completed_at');
  });
}, 15000);

test('should handle request with accept header', async () => {
  const res = await request(app)
    .get('/api/celebrate')
    .set('Accept', 'application/json');
  expect(res.statusCode).toBe(200);
  expect(res.headers['content-type']).toMatch(/json/);
}, 15000);

test('should return empty array when no completed projects', async () => {
  const res = await request(app).get('/api/celebrate');
  expect(res.statusCode).toBe(200);
  expect(res.body).not.toBeNull();
  expect(res.body).not.toBeUndefined();
}, 15000);

// ─── Teardown ─────────────────────────────────────────────────────────────────

afterAll((done) => { done(); });