/**
 * Collaborations Route Tests
 *
 * Comprehensive tests for collaboration requests.
 *
 * @author Thabo Mokoena
 * @module tests/collaborations
 */

const request = require('supertest');
const app = require('../server');

// ─── GET Collaborations ───────────────────────────────────────────────────────

describe('GET /api/collaborations/:projectId', () => {

  test('should return 401 if no token provided', async () => {
    const res = await request(app)
      .get('/api/collaborations/00000000-0000-0000-0000-000000000000');
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBeDefined();
  }, 15000);

  test('should return 401 if token is invalid', async () => {
    const res = await request(app)
      .get('/api/collaborations/00000000-0000-0000-0000-000000000000')
      .set('Authorization', 'Bearer faketoken');
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBeDefined();
  }, 15000);

  test('should return 401 with malformed auth header', async () => {
    const res = await request(app)
      .get('/api/collaborations/00000000-0000-0000-0000-000000000000')
      .set('Authorization', 'malformed');
    expect(res.statusCode).toBe(401);
  }, 15000);

  test('should return 401 with empty bearer token', async () => {
    const res = await request(app)
      .get('/api/collaborations/00000000-0000-0000-0000-000000000000')
      .set('Authorization', 'Bearer ');
    expect(res.statusCode).toBe(401);
  }, 15000);

});

// ─── POST Collaboration ───────────────────────────────────────────────────────

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
  }, 15000);

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
  }, 15000);

  test('should return 401 if no auth header', async () => {
    const res = await request(app)
      .post('/api/collaborations')
      .send({ message: 'test' });
    expect(res.statusCode).toBe(401);
  }, 15000);

  test('should return 401 with malformed auth header', async () => {
    const res = await request(app)
      .post('/api/collaborations')
      .set('Authorization', 'malformed')
      .send({
        project_id: '00000000-0000-0000-0000-000000000000',
        message: 'test'
      });
    expect(res.statusCode).toBe(401);
  }, 15000);

});

// ─── PUT Collaboration ────────────────────────────────────────────────────────

describe('PUT /api/collaborations/:id', () => {

  test('should return 401 if no token provided', async () => {
    const res = await request(app)
      .put('/api/collaborations/00000000-0000-0000-0000-000000000000')
      .send({ status: 'accepted' });
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBeDefined();
  }, 15000);

  test('should return 401 if token is invalid', async () => {
    const res = await request(app)
      .put('/api/collaborations/00000000-0000-0000-0000-000000000000')
      .set('Authorization', 'Bearer faketoken')
      .send({ status: 'accepted' });
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBeDefined();
  }, 15000);

  test('should return 401 with no auth header', async () => {
    const res = await request(app)
      .put('/api/collaborations/00000000-0000-0000-0000-000000000000')
      .send({ status: 'declined' });
    expect(res.statusCode).toBe(401);
  }, 15000);

});

// ─── Teardown ─────────────────────────────────────────────────────────────────

afterAll((done) => { done(); });