/**
 * Middleware Tests
 *
 * Tests for the authentication middleware.
 * Verifies all edge cases of token validation.
 *
 * @author Thabo Mokoena
 * @module tests/middleware
 */

const request = require('supertest');
const app = require('../server');

describe('Auth Middleware', () => {

  test('should return 401 when no authorization header', async () => {
    const res = await request(app)
      .post('/api/auth/logout');
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toMatch(/no token/i);
  });

  test('should return 401 when authorization header has no Bearer', async () => {
    const res = await request(app)
      .post('/api/auth/logout')
      .set('Authorization', 'Basic sometoken');
    expect(res.statusCode).toBe(401);
  });

  test('should return 401 when token is empty string', async () => {
    const res = await request(app)
      .post('/api/auth/logout')
      .set('Authorization', 'Bearer ');
    expect(res.statusCode).toBe(401);
  });

  test('should return 401 on comment delete without token', async () => {
  const res = await request(app)
    .delete('/api/comments/00000000-0000-0000-0000-000000000000');
  expect(res.statusCode).toBe(401);
  expect(res.body.error).toBeDefined();
});

test('should return 401 on project delete without token', async () => {
  const res = await request(app)
    .delete('/api/projects/00000000-0000-0000-0000-000000000000');
  expect(res.statusCode).toBe(401);
  expect(res.body.error).toBeDefined();
});

test('should return 401 on project update without token', async () => {
  const res = await request(app)
    .put('/api/projects/00000000-0000-0000-0000-000000000000')
    .send({ title: 'updated' });
  expect(res.statusCode).toBe(401);
  expect(res.body.error).toBeDefined();
});

test('should return 401 on collab update without token', async () => {
  const res = await request(app)
    .put('/api/collaborations/00000000-0000-0000-0000-000000000000')
    .send({ status: 'accepted' });
  expect(res.statusCode).toBe(401);
  expect(res.body.error).toBeDefined();
});

test('should not return 401 on public routes', async () => {
  const res = await request(app).get('/api/projects');
  expect(res.statusCode).not.toBe(401);
});

test('should not return 401 on celebrate route', async () => {
  const res = await request(app).get('/api/celebrate');
  expect(res.statusCode).not.toBe(401);
});

  test('should return 401 when token is random string', async () => {
    const res = await request(app)
      .post('/api/auth/logout')
      .set('Authorization', 'Bearer randomstring123');
    expect(res.statusCode).toBe(401);
  });

  test('should return 401 when token is expired format', async () => {
    const res = await request(app)
      .post('/api/projects')
      .set('Authorization', 'Bearer expiredtoken.fake.jwt')
      .send({
        title: 'Test',
        description: 'Test description here',
        stage: 'idea'
      });
    expect(res.statusCode).toBe(401);
  });

  test('should return 401 on protected route without token', async () => {
    const res = await request(app)
      .post('/api/milestones')
      .send({ project_id: 'test', title: 'test' });
    expect(res.statusCode).toBe(401);
  });

  test('should return 401 on collaboration route without token', async () => {
    const res = await request(app)
      .get('/api/collaborations/00000000-0000-0000-0000-000000000000');
    expect(res.statusCode).toBe(401);
  });

  test('should return 401 on profile route without token', async () => {
    const res = await request(app)
      .get('/api/profile');
    expect(res.statusCode).toBe(401);
  });

  test('should return 401 on profile update without token', async () => {
    const res = await request(app)
      .put('/api/profile')
      .send({ bio: 'test bio' });
    expect(res.statusCode).toBe(401);
  });

  test('should return 401 on account delete without token', async () => {
    const res = await request(app)
      .delete('/api/profile');
    expect(res.statusCode).toBe(401);
  });

});

afterAll((done) => { done(); });