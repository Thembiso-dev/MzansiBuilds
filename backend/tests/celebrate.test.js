/**
 * Celebration Wall Route Tests
 *
 * Tests for the celebration wall endpoint.
 * Written BEFORE implementation (TDD).
 *
 * @author Thabo Mokoena
 * @module tests/celebrate
 */

const request = require('supertest');
const app = require('../server');

// ─── GET /api/celebrate ───────────────────────────────────────────────────────

describe('GET /api/celebrate', () => {

  test('should return 200 and an array', async () => {
    const res = await request(app)
      .get('/api/celebrate');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  }, 10000);

  test('should only return completed projects', async () => {
    const res = await request(app)
      .get('/api/celebrate');

    expect(res.statusCode).toBe(200);

    res.body.forEach(project => {
      expect(project.stage).toBe('completed');
    });
  }, 10000);

  test('should include profile information', async () => {
    const res = await request(app)
      .get('/api/celebrate');

    expect(res.statusCode).toBe(200);

    if (res.body.length > 0) {
      expect(res.body[0].profiles).toBeDefined();
    }
  }, 10000);

});

// ─── Teardown ─────────────────────────────────────────────────────────────────

afterAll((done) => {
  done();
});