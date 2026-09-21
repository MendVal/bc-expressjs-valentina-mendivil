import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../app';
import { UserModel } from '../models/user.model';

const TEST_DB_URI = 'mongodb://bootcamp:bootcamp123@localhost:27017/arcade_test?authSource=admin';

async function extractCookies(res: request.Response): Promise<string[]> {
  return res.headers['set-cookie'] as unknown as string[];
}

beforeAll(async () => {
  await mongoose.connect(TEST_DB_URI);
}, 30000);

afterAll(async () => {
  await UserModel.deleteMany({ email: /@authtest\.com$/ });
  await mongoose.disconnect();
});

describe('Auth Routes — Integration Tests', () => {
  describe('POST /api/v1/auth/register', () => {
    it('should return 201 with valid data', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ email: 'flow@authtest.com', password: 'Password1', name: 'Flow User' });
      expect(res.status).toBe(201);
      expect(res.body.email).toBe('flow@authtest.com');
    });

    it('should return 409 when email is already registered', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ email: 'flow@authtest.com', password: 'Password1', name: 'Flow User' });
      expect(res.status).toBe(409);
    });

    it('should return 400 with invalid data', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ email: 'not-an-email', password: '123', name: 'X' });
      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should return 401 with wrong password', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'flow@authtest.com', password: 'WrongPassword1' });
      expect(res.status).toBe(401);
    });
  });

  describe('Full session flow', () => {
    let cookies: string[];

    it('should login and set cookies', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'flow@authtest.com', password: 'Password1' });
      expect(res.status).toBe(200);
      cookies = await extractCookies(res);
    });

    it('should return the current user via GET /me', async () => {
      const res = await request(app).get('/api/v1/auth/me').set('Cookie', cookies);
      expect(res.status).toBe(200);
      expect(res.body.email).toBe('flow@authtest.com');
    });

    it('should return 401 on /me without cookies', async () => {
      const res = await request(app).get('/api/v1/auth/me');
      expect(res.status).toBe(401);
    });

    it('should refresh tokens via POST /refresh', async () => {
      const res = await request(app).post('/api/v1/auth/refresh').set('Cookie', cookies);
      expect(res.status).toBe(200);
      cookies = await extractCookies(res);
    });

    it('should return 401 on /refresh without cookie', async () => {
      const res = await request(app).post('/api/v1/auth/refresh');
      expect(res.status).toBe(401);
    });

    it('should logout successfully', async () => {
      const res = await request(app).post('/api/v1/auth/logout').set('Cookie', cookies);
      expect(res.status).toBe(200);
    });
  });
});