/**
 * Model Unit Tests
 *
 * Tests for data model functions.
 * Verifies models handle edge cases correctly.
 *
 * @author Thabo Mokoena
 * @module tests/models
 */

const request = require('supertest');
const app = require('../server');

// ─── ProjectModel via API ─────────────────────────────────────────────────────

describe('ProjectModel — getAll', () => {

  test('should return array of projects', async () => {
    const res = await request(app).get('/api/projects');
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.statusCode).toBe(200);
  });

  test('projects should have profiles joined', async () => {
    const res = await request(app).get('/api/projects');
    expect(res.statusCode).toBe(200);
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty('profiles');
    }
  });

});

describe('ProjectModel — getById', () => {

  test('should return null for non-existent id', async () => {
    const res = await request(app)
      .get('/api/projects/00000000-0000-0000-0000-000000000000');
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBeDefined();
  });

  test('should return project for valid id', async () => {
    const allRes = await request(app).get('/api/projects');
    if (allRes.body.length > 0) {
      const id = allRes.body[0].id;
      const res = await request(app).get(`/api/projects/${id}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.id).toBe(id);
    }
  });

});

// ─── CommentModel via API ─────────────────────────────────────────────────────

describe('CommentModel — getByProject', () => {

  test('should return empty array for unknown project', async () => {
    const res = await request(app)
      .get('/api/comments/00000000-0000-0000-0000-000000000000');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('should return comments for real project', async () => {
    const projectsRes = await request(app).get('/api/projects');
    if (projectsRes.body.length > 0) {
      const projectId = projectsRes.body[0].id;
      const res = await request(app)
        .get(`/api/comments/${projectId}`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    }
  });

});

// ─── MilestoneModel via API ───────────────────────────────────────────────────

describe('MilestoneModel — getByProject', () => {

  test('should return empty array for unknown project', async () => {
    const res = await request(app)
      .get('/api/milestones/00000000-0000-0000-0000-000000000000');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('should return milestones for real project', async () => {
    const projectsRes = await request(app).get('/api/projects');
    if (projectsRes.body.length > 0) {
      const projectId = projectsRes.body[0].id;
      const res = await request(app)
        .get(`/api/milestones/${projectId}`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    }
  });

});

// ─── Celebrate via API ────────────────────────────────────────────────────────

describe('Celebrate endpoint', () => {

  test('should only return completed projects', async () => {
    const res = await request(app).get('/api/celebrate');
    expect(res.statusCode).toBe(200);
    res.body.forEach(p => {
      expect(p.stage).toBe('completed');
    });
  });

  test('completed projects should have profiles', async () => {
    const res = await request(app).get('/api/celebrate');
    expect(res.statusCode).toBe(200);
    res.body.forEach(p => {
      expect(p).toHaveProperty('profiles');
    });
  });

});

// ─── Profile via API ──────────────────────────────────────────────────────────

describe('Profile endpoint', () => {

  test('should return 401 without token', async () => {
    const res = await request(app).get('/api/profile');
    expect(res.statusCode).toBe(401);
  });

  test('should return 401 on update without token', async () => {
    const res = await request(app)
      .put('/api/profile')
      .send({ bio: 'test' });
    expect(res.statusCode).toBe(401);
  });

  test('should return 401 on delete without token', async () => {
    const res = await request(app).delete('/api/profile');
    expect(res.statusCode).toBe(401);
  });

  test('should return 404 for unknown profile id', async () => {
    const res = await request(app)
      .get('/api/profile/00000000-0000-0000-0000-000000000000');
    expect(res.statusCode).toBe(404);
  });

});

afterAll((done) => { done(); });