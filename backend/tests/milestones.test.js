/**
 * Milestones Route Tests
 *
 * Tests for milestone creation and retrieval.
 * Written BEFORE implementation (TDD).
 *
 * @author Thabo Mokoena
 * @module tests/milestones
 */

const request = require('supertest');
const app = require('../server');

// ─── GET /api/milestones/:projectId ──────────────────────────────────────────

describe('GET /api/milestones/:projectId', () => {

  test('should return 200 and an array for any project id', async () => {
    const res = await request(app)
      .get('/api/milestones/00000000-0000-0000-0000-000000000000');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  }, 10000);

});

// ─── POST /api/milestones ─────────────────────────────────────────────────────

describe('POST /api/milestones', () => {

  test('should return 401 if no token provided', async () => {
    const res = await request(app)
      .post('/api/milestones')
      .send({
        project_id: '00000000-0000-0000-0000-000000000000',
        title: 'Completed the login page'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBeDefined();
  }, 10000);

  test('should return 401 if token is invalid', async () => {
    const res = await request(app)
      .post('/api/milestones')
      .set('Authorization', 'Bearer faketoken')
      .send({
        project_id: '00000000-0000-0000-0000-000000000000',
        title: 'Completed the login page'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBeDefined();
  }, 10000);

  test('should return 401 if title is missing', async () => {
    const res = await request(app)
      .post('/api/milestones')
      .set('Authorization', 'Bearer faketoken')
      .send({
        project_id: '00000000-0000-0000-0000-000000000000'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBeDefined();
  }, 10000);

  test('should return 401 if project_id is missing', async () => {
    const res = await request(app)
      .post('/api/milestones')
      .set('Authorization', 'Bearer faketoken')
      .send({
        title: 'Completed the login page'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBeDefined();
  }, 10000);

});

// ─── Teardown ─────────────────────────────────────────────────────────────────

afterAll((done) => {
  done();
});