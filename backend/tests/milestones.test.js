/**
 * Milestones Route Tests
 *
 * Comprehensive tests for milestone creation and retrieval.
 *
 * @author Thabo Mokoena
 * @module tests/milestones
 */

const request = require('supertest');
const app = require('../server');

// ─── GET Milestones ───────────────────────────────────────────────────────────

describe('GET /api/milestones/:projectId', () => {

  test('should return 200 and array for any project id', async () => {
    const res = await request(app)
      .get('/api/milestones/00000000-0000-0000-0000-000000000000');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  }, 15000);

  test('should return empty array for project with no milestones', async () => {
    const res = await request(app)
      .get('/api/milestones/00000000-0000-0000-0000-000000000000');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  }, 15000);

  test('should return milestones with required fields if any exist', async () => {
    const projectsRes = await request(app).get('/api/projects');
    if (projectsRes.body.length > 0) {
      const projectId = projectsRes.body[0].id;
      const res = await request(app).get(`/api/milestones/${projectId}`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      if (res.body.length > 0) {
        expect(res.body[0]).toHaveProperty('id');
        expect(res.body[0]).toHaveProperty('title');
        expect(res.body[0]).toHaveProperty('project_id');
      }
    }
  }, 15000);

});

// ─── POST Milestone ───────────────────────────────────────────────────────────

describe('POST /api/milestones', () => {

  test('should return 401 if no token provided', async () => {
    const res = await request(app)
      .post('/api/milestones')
      .send({
        project_id: '00000000-0000-0000-0000-000000000000',
        title: 'Completed login page'
      });
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBeDefined();
  }, 15000);

  test('should return 401 if token is invalid', async () => {
    const res = await request(app)
      .post('/api/milestones')
      .set('Authorization', 'Bearer faketoken')
      .send({
        project_id: '00000000-0000-0000-0000-000000000000',
        title: 'Completed login page'
      });
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBeDefined();
  }, 15000);

  test('should return 401 if no auth header', async () => {
    const res = await request(app)
      .post('/api/milestones')
      .send({ title: 'test milestone' });
    expect(res.statusCode).toBe(401);
  }, 15000);

  test('should return 401 with malformed auth header', async () => {
    const res = await request(app)
      .post('/api/milestones')
      .set('Authorization', 'malformed')
      .send({
        project_id: '00000000-0000-0000-0000-000000000000',
        title: 'test'
      });
    expect(res.statusCode).toBe(401);
  }, 15000);

});

// ─── Teardown ─────────────────────────────────────────────────────────────────

afterAll((done) => { done(); });