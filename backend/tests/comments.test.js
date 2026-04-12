/**
 * Comments Route Tests
 *
 * Comprehensive tests for comment creation and retrieval.
 *
 * @author Thabo Mokoena
 * @module tests/comments
 */

const request = require('supertest');
const app = require('../server');

// ─── GET Comments ─────────────────────────────────────────────────────────────

describe('GET /api/comments/:projectId', () => {

  test('should return 200 and array for any project id', async () => {
    const res = await request(app)
      .get('/api/comments/00000000-0000-0000-0000-000000000000');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  }, 15000);

  test('should return empty array for project with no comments', async () => {
    const res = await request(app)
      .get('/api/comments/00000000-0000-0000-0000-000000000000');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  }, 15000);

  test('should return comments with required fields if any exist', async () => {
    const projectsRes = await request(app).get('/api/projects');
    if (projectsRes.body.length > 0) {
      const projectId = projectsRes.body[0].id;
      const res = await request(app).get(`/api/comments/${projectId}`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      if (res.body.length > 0) {
        expect(res.body[0]).toHaveProperty('id');
        expect(res.body[0]).toHaveProperty('content');
        expect(res.body[0]).toHaveProperty('project_id');
        expect(res.body[0]).toHaveProperty('user_id');
      }
    }
  }, 15000);

});

// ─── POST Comment ─────────────────────────────────────────────────────────────

describe('POST /api/comments', () => {

  test('should return 401 if no token provided', async () => {
    const res = await request(app)
      .post('/api/comments')
      .send({
        project_id: '00000000-0000-0000-0000-000000000000',
        content: 'This is a test comment'
      });
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBeDefined();
  }, 15000);

  test('should return 401 if token is invalid', async () => {
    const res = await request(app)
      .post('/api/comments')
      .set('Authorization', 'Bearer faketoken')
      .send({
        project_id: '00000000-0000-0000-0000-000000000000',
        content: 'This is a test comment'
      });
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBeDefined();
  }, 15000);

  test('should return 401 if no auth header', async () => {
    const res = await request(app)
      .post('/api/comments')
      .send({ content: 'test' });
    expect(res.statusCode).toBe(401);
  }, 15000);

  test('should return 401 with malformed auth header', async () => {
    const res = await request(app)
      .post('/api/comments')
      .set('Authorization', 'malformed')
      .send({
        project_id: '00000000-0000-0000-0000-000000000000',
        content: 'test'
      });
    expect(res.statusCode).toBe(401);
  }, 15000);

});

// ─── DELETE Comment ───────────────────────────────────────────────────────────

describe('DELETE /api/comments/:id', () => {

  test('should return 401 if no token provided', async () => {
    const res = await request(app)
      .delete('/api/comments/00000000-0000-0000-0000-000000000000');
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBeDefined();
  }, 15000);

  test('should return 401 if token is invalid', async () => {
    const res = await request(app)
      .delete('/api/comments/00000000-0000-0000-0000-000000000000')
      .set('Authorization', 'Bearer faketoken');
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBeDefined();
  }, 15000);

});

// ─── Teardown ─────────────────────────────────────────────────────────────────

afterAll((done) => { done(); });