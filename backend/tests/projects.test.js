/**
 * Projects Route Tests
 *
 * Comprehensive tests for project CRUD operations.
 *
 * @author Thabo Mokoena
 * @module tests/projects
 */

const request = require('supertest');
const app = require('../server');

// ─── GET All Projects ─────────────────────────────────────────────────────────

describe('GET /api/projects', () => {

  test('should return 200 and an array', async () => {
    const res = await request(app).get('/api/projects');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  }, 15000);

  test('should return projects with required fields', async () => {
    const res = await request(app).get('/api/projects');
    expect(res.statusCode).toBe(200);
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty('id');
      expect(res.body[0]).toHaveProperty('title');
      expect(res.body[0]).toHaveProperty('description');
      expect(res.body[0]).toHaveProperty('stage');
      expect(res.body[0]).toHaveProperty('user_id');
    }
  }, 15000);

  test('should return projects newest first', async () => {
    const res = await request(app).get('/api/projects');
    expect(res.statusCode).toBe(200);
    if (res.body.length > 1) {
      const first = new Date(res.body[0].created_at);
      const second = new Date(res.body[1].created_at);
      expect(first >= second).toBe(true);
    }
  }, 15000);

});

// ─── GET Single Project ───────────────────────────────────────────────────────

describe('GET /api/projects/:id', () => {

  test('should return 404 for non-existent project', async () => {
    const res = await request(app)
      .get('/api/projects/00000000-0000-0000-0000-000000000000');
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBeDefined();
  }, 15000);

  test('should return project with profiles if exists', async () => {
    const allRes = await request(app).get('/api/projects');
    if (allRes.body.length > 0) {
      const id = allRes.body[0].id;
      const res = await request(app).get(`/api/projects/${id}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.id).toBe(id);
      expect(res.body).toHaveProperty('profiles');
    }
  }, 15000);

});

// ─── POST Create Project ──────────────────────────────────────────────────────

describe('POST /api/projects', () => {

  test('should return 401 if no token provided', async () => {
    const res = await request(app)
      .post('/api/projects')
      .send({
        title: 'Test Project',
        description: 'A test project description',
        stage: 'idea'
      });
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBeDefined();
  }, 15000);

  test('should return 401 if token is invalid', async () => {
    const res = await request(app)
      .post('/api/projects')
      .set('Authorization', 'Bearer faketoken')
      .send({
        title: 'Test Project',
        description: 'A test project description',
        stage: 'idea'
      });
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBeDefined();
  }, 15000);

  test('should return 401 if no auth header', async () => {
    const res = await request(app)
      .post('/api/projects')
      .send({ title: 'Test', description: 'Test desc', stage: 'idea' });
    expect(res.statusCode).toBe(401);
  }, 15000);

});

// ─── PUT Update Project ───────────────────────────────────────────────────────

describe('PUT /api/projects/:id', () => {

  test('should return 401 if no token provided', async () => {
    const res = await request(app)
      .put('/api/projects/00000000-0000-0000-0000-000000000000')
      .send({ stage: 'in_progress' });
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBeDefined();
  }, 15000);

  test('should return 401 if token is invalid', async () => {
    const res = await request(app)
      .put('/api/projects/00000000-0000-0000-0000-000000000000')
      .set('Authorization', 'Bearer faketoken')
      .send({ stage: 'in_progress' });
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBeDefined();
  }, 15000);

  test('should return 401 if no auth header on update', async () => {
    const res = await request(app)
      .put('/api/projects/00000000-0000-0000-0000-000000000000')
      .send({ title: 'Updated title' });
    expect(res.statusCode).toBe(401);
  }, 15000);

});

// ─── DELETE Project ───────────────────────────────────────────────────────────

describe('DELETE /api/projects/:id', () => {

  test('should return 401 if no token provided', async () => {
    const res = await request(app)
      .delete('/api/projects/00000000-0000-0000-0000-000000000000');
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBeDefined();
  }, 15000);

  test('should return 401 if token is invalid', async () => {
    const res = await request(app)
      .delete('/api/projects/00000000-0000-0000-0000-000000000000')
      .set('Authorization', 'Bearer faketoken');
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBeDefined();
  }, 15000);

});

// ─── Teardown ─────────────────────────────────────────────────────────────────

afterAll((done) => { done(); });