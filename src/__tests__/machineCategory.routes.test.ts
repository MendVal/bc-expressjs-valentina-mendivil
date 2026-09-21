import request from 'supertest';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { app } from '../app';
import { UserModel } from '../models/user.model';
import { MachineCategory } from '../models/machineCategory.model';

const TEST_DB_URI = 'mongodb://bootcamp:bootcamp123@localhost:27017/arcade_test?authSource=admin';

let adminCookies: string[];
let userCookies: string[];

async function extractCookies(res: request.Response): Promise<string[]> {
  return res.headers['set-cookie'] as unknown as string[];
}

beforeAll(async () => {
  await mongoose.connect(TEST_DB_URI);

  const hashedPassword = await bcrypt.hash('Password1', 10);
  await UserModel.create({
    email: 'category-admin@arcade.com',
    password: hashedPassword,
    name: 'Category Admin',
    role: 'admin',
  });

  const adminLogin = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: 'category-admin@arcade.com', password: 'Password1' });
  adminCookies = await extractCookies(adminLogin);

  await request(app)
    .post('/api/v1/auth/register')
    .send({ email: 'category-user@arcade.com', password: 'Password1', name: 'Category User' });
  const userLogin = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: 'category-user@arcade.com', password: 'Password1' });
  userCookies = await extractCookies(userLogin);
}, 30000);

afterEach(async () => {
  await MachineCategory.deleteMany({});
});

afterAll(async () => {
  await UserModel.deleteMany({ email: { $in: ['category-admin@arcade.com', 'category-user@arcade.com'] } });
  await mongoose.disconnect();
});

describe('MachineCategory Routes — Integration Tests', () => {
  describe('GET /api/v1/machine-categories', () => {
    it('should return 200 with empty array initially', async () => {
      const res = await request(app)
        .get('/api/v1/machine-categories')
        .set('Cookie', adminCookies);
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });
  });

  describe('POST /api/v1/machine-categories', () => {
    it('should return 201 with valid data as admin', async () => {
      const res = await request(app)
        .post('/api/v1/machine-categories')
        .set('Cookie', adminCookies)
        .send({ name: 'Arcade Clásico' });
      expect(res.status).toBe(201);
      expect(res.body.name).toBe('Arcade Clásico');
    });

    it('should return 403 when a non-admin user tries to create', async () => {
      const res = await request(app)
        .post('/api/v1/machine-categories')
        .set('Cookie', userCookies)
        .send({ name: 'Arcade Clásico' });
      expect(res.status).toBe(403);
    });

    it('should return 400 with invalid data', async () => {
      const res = await request(app)
        .post('/api/v1/machine-categories')
        .set('Cookie', adminCookies)
        .send({});
      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/v1/machine-categories/:id', () => {
    it('should return 200 with existing category', async () => {
      const created = await request(app)
        .post('/api/v1/machine-categories')
        .set('Cookie', adminCookies)
        .send({ name: 'Arcade Clásico' });

      const res = await request(app)
        .get(`/api/v1/machine-categories/${created.body._id}`)
        .set('Cookie', adminCookies);
      expect(res.status).toBe(200);
      expect(res.body._id).toBe(created.body._id);
    });

    it('should return 404 with non-existent ID', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const res = await request(app)
        .get(`/api/v1/machine-categories/${fakeId}`)
        .set('Cookie', adminCookies);
      expect(res.status).toBe(404);
    });
  });

  describe('PUT /api/v1/machine-categories/:id', () => {
    it('should return 200 when admin updates', async () => {
      const created = await request(app)
        .post('/api/v1/machine-categories')
        .set('Cookie', adminCookies)
        .send({ name: 'Arcade Clásico' });

      const res = await request(app)
        .put(`/api/v1/machine-categories/${created.body._id}`)
        .set('Cookie', adminCookies)
        .send({ name: 'Retro Arcade' });
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Retro Arcade');
    });

    it('should return 403 when non-admin tries to update', async () => {
      const created = await request(app)
        .post('/api/v1/machine-categories')
        .set('Cookie', adminCookies)
        .send({ name: 'Arcade Clásico' });

      const res = await request(app)
        .put(`/api/v1/machine-categories/${created.body._id}`)
        .set('Cookie', userCookies)
        .send({ name: 'Retro Arcade' });
      expect(res.status).toBe(403);
    });
  });

  describe('DELETE /api/v1/machine-categories/:id', () => {
    it('should return 204 when admin deletes', async () => {
      const created = await request(app)
        .post('/api/v1/machine-categories')
        .set('Cookie', adminCookies)
        .send({ name: 'Arcade Clásico' });

      const res = await request(app)
        .delete(`/api/v1/machine-categories/${created.body._id}`)
        .set('Cookie', adminCookies);
      expect(res.status).toBe(204);
    });

    it('should return 403 when non-admin tries to delete', async () => {
      const created = await request(app)
        .post('/api/v1/machine-categories')
        .set('Cookie', adminCookies)
        .send({ name: 'Arcade Clásico' });

      const res = await request(app)
        .delete(`/api/v1/machine-categories/${created.body._id}`)
        .set('Cookie', userCookies);
      expect(res.status).toBe(403);
    });
  });
});