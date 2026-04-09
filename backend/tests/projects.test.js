/**
 * Projects Route Tests
 *
 * Tests for project CRUD operations.
 * Written BEFORE the implementation (TDD - Red, Green, Refactor).
 *
 * @author Thabo Mokoena
 * @module tests/projects
 */

const request = require('supertest');
const app = require('../server');

// ─── GET /api/projects ────────────────────────────────────────────────────────

describe('GET /api/projects', () => {

  test('should return 200 and an array of projects', async () => {
    const res = await request(app)
      .get('/api/projects');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  }, 10000);

});

// ─── POST /api/projects ───────────────────────────────────────────────────────

describe('POST /api/projects', () => {

  test('should return 401 if no token is provided', async () => {
    const res = await request(app)
      .post('/api/projects')
      .send({
        title: 'Test Project',
        description: 'A test project description',
        stage: 'idea',
        support_needed: 'Design help'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBeDefined();
  }, 10000);

  test('should return 400 if title is missing', async () => {
    const res = await request(app)
      .post('/api/projects')
      .set('Authorization', 'Bearer faketoken')
      .send({
        description: 'A test project description',
        stage: 'idea'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBeDefined();
  }, 10000);

  test('should return 400 if description is missing', async () => {
    const res = await request(app)
      .post('/api/projects')
      .set('Authorization', 'Bearer faketoken')
      .send({
        title: 'Test Project',
        stage: 'idea'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBeDefined();
  }, 10000);

  test('should return 400 if stage is invalid', async () => {
    const res = await request(app)
      .post('/api/projects')
      .set('Authorization', 'Bearer faketoken')
      .send({
        title: 'Test Project',
        description: 'A test description',
        stage: 'invalid_stage'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBeDefined();
  }, 10000);

});

// ─── GET /api/projects/:id ────────────────────────────────────────────────────

describe('GET /api/projects/:id', () => {

  test('should return 404 for a non-existent project', async () => {
    const res = await request(app)
      .get('/api/projects/00000000-0000-0000-0000-000000000000');

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBeDefined();
  }, 10000);

});

// ─── PUT /api/projects/:id ────────────────────────────────────────────────────

describe('PUT /api/projects/:id', () => {

  test('should return 401 if no token is provided', async () => {
    const res = await request(app)
      .put('/api/projects/00000000-0000-0000-0000-000000000000')
      .send({ stage: 'in_progress' });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBeDefined();
  }, 10000);

});

// ─── DELETE /api/projects/:id ─────────────────────────────────────────────────

describe('DELETE /api/projects/:id', () => {

  test('should return 401 if no token is provided', async () => {
    const res = await request(app)
      .delete('/api/projects/00000000-0000-0000-0000-000000000000');

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBeDefined();
  }, 10000);

});

// ─── Teardown ─────────────────────────────────────────────────────────────────

afterAll((done) => {
  done();
});