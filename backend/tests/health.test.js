/**
 * Health and Server Tests
 *
 * Tests for server health endpoint and 404 handling.
 *
 * @author Thabo Mokoena
 * @module tests/health
 */

const request = require('supertest');
const app = require('../server');

describe('GET /api/health', () => {

  test('should return 200 and status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.message).toBeDefined();
    expect(res.body.timestamp).toBeDefined();
  });

  test('should return a valid timestamp', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    const timestamp = new Date(res.body.timestamp);
    expect(timestamp).toBeInstanceOf(Date);
    expect(isNaN(timestamp.getTime())).toBe(false);
  });

});

describe('404 Handler', () => {

  test('should return 404 for unknown API route', async () => {
    const res = await request(app).get('/api/unknown-route');
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBeDefined();
  });

  test('should return 404 for unknown method', async () => {
    const res = await request(app).patch('/api/unknown');
    expect(res.statusCode).toBe(404);
  });

});

afterAll((done) => { done(); });