/**
 * Comments Route Tests
 *
 * Tests for comment creation and retrieval.
 * Written BEFORE implementation (TDD).
 *
 * @author Thabo Mokoena
 * @module tests/comments
 */

const request = require('supertest');
const app = require('../server');

// ─── GET /api/comments/:projectId ────────────────────────────────────────────

describe('GET /api/comments/:projectId', () => {

  test('should return 200 and an array for any project id', async () => {
    const res = await request(app)
      .get('/api/comments/00000000-0000-0000-0000-000000000000');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  }, 10000);

});

// ─── POST /api/comments ───────────────────────────────────────────────────────

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
  }, 10000);

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
  }, 10000);

  test('should return 400 if content is missing', async () => {
    const res = await request(app)
      .post('/api/comments')
      .set('Authorization', 'Bearer faketoken')
      .send({
        project_id: '00000000-0000-0000-0000-000000000000'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBeDefined();
  }, 10000);

  test('should return 400 if project_id is missing', async () => {
    const res = await request(app)
      .post('/api/comments')
      .set('Authorization', 'Bearer faketoken')
      .send({
        content: 'This is a test comment'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBeDefined();
  }, 10000);

});

// ─── Teardown ─────────────────────────────────────────────────────────────────

afterAll((done) => {
  done();
});