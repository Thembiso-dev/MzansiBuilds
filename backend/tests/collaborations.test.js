/**
 * Collaborations Route Tests
 *
 * Tests for collaboration request creation and retrieval.
 * Written BEFORE implementation (TDD).
 *
 * @author Thabo Mokoena
 * @module tests/collaborations
 */

const request = require('supertest');
const app = require('../server');

// ─── GET /api/collaborations/:projectId ───────────────────────────────────────

describe('GET /api/collaborations/:projectId', () => {

  test('should return 401 if no token provided', async () => {
    const res = await request(app)
      .get('/api/collaborations/00000000-0000-0000-0000-000000000000');

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBeDefined();
  }, 10000);

  test('should return 401 if token is invalid', async () => {
    const res = await request(app)
      .get('/api/collaborations/00000000-0000-0000-0000-000000000000')
      .set('Authorization', 'Bearer faketoken');

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBeDefined();
  }, 10000);

});

// ─── POST /api/collaborations ─────────────────────────────────────────────────

describe('POST /api/collaborations', () => {

  test('should return 401 if no token provided', async () => {
    const res = await request(app)
      .post('/api/collaborations')
      .send({
        project_id: '00000000-0000-0000-0000-000000000000',
        message: 'I would love to help!'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBeDefined();
  }, 10000);

  test('should return 401 if token is invalid', async () => {
    const res = await request(app)
      .post('/api/collaborations')
      .set('Authorization', 'Bearer faketoken')
      .send({
        project_id: '00000000-0000-0000-0000-000000000000',
        message: 'I would love to help!'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBeDefined();
  }, 10000);

  test('should return 401 if project_id is missing', async () => {
    const res = await request(app)
      .post('/api/collaborations')
      .set('Authorization', 'Bearer faketoken')
      .send({
        message: 'I would love to help!'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBeDefined();
  }, 10000);

});

// ─── PUT /api/collaborations/:id ──────────────────────────────────────────────

describe('PUT /api/collaborations/:id', () => {

  test('should return 401 if no token provided', async () => {
    const res = await request(app)
      .put('/api/collaborations/00000000-0000-0000-0000-000000000000')
      .send({ status: 'accepted' });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBeDefined();
  }, 10000);

  test('should return 401 if token is invalid', async () => {
    const res = await request(app)
      .put('/api/collaborations/00000000-0000-0000-0000-000000000000')
      .set('Authorization', 'Bearer faketoken')
      .send({ status: 'accepted' });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBeDefined();
  }, 10000);

});

// ─── Teardown ─────────────────────────────────────────────────────────────────

afterAll((done) => {
  done();
});