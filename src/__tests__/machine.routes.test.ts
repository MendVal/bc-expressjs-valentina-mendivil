import request from 'supertest';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { app } from '../app';
import { UserModel } from '../models/user.model';
import { MachineCategory } from '../models/machineCategory.model';
import { Machine } from '../models/machine.model';

const TEST_DB_URI = 'mongodb://bootcamp:bootcamp123@localhost:27017/arcade_test?authSource=admin';

let adminCookies: string[];
let userCookies: string[];
let categoryId: string;

async function extractCookies(res: request.Response): Promise<string[]> {
  return res.headers['set-cookie'] as unknown as string[];
}

beforeAll(async () => {
  await mongoose.connect(TEST_DB_URI);

  const hashedPassword = await bcrypt.hash('Password1', 10);
  await UserModel.create({
    email: 'admin@arcade.com',
    password: hashedPassword,
    name: 'Admin',
    role: 'admin',
  });

  const adminLogin = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: 'admin@arcade.com', password: 'Password1' });
  adminCookies = await extractCookies(adminLogin);

  await request(app)
    .post('/api/v1/auth/register')
    .send({ email: 'user@arcade.com', password: 'Password1', name: 'User' });
  const userLogin = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: 'user@arcade.com', password: 'Password1' });
  userCookies = await extractCookies(userLogin);

  const category = await MachineCategory.create({ name: 'Arcade Clásico' });
  categoryId = category._id.toString();
}, 30000);

afterEach(async () => {
  await Machine.deleteMany({});
});

afterAll(async () => {
  await UserModel.deleteMany({});
  await MachineCategory.deleteMany({});
  await Machine.deleteMany({});
  await mongoose.disconnect();
});

const validMachine = () => ({
  name: 'Pac-Man Cabinet',
  category: categoryId,
  tokenCost: 5,
  location: 'Zona A',
});

describe('Machine Routes — Integration Tests', () => {
  describe('GET /api/v1/machines', () => {
    it('should return 200 with empty data initially', async () => {
      const res = await request(app).get('/api/v1/machines').set('Cookie', adminCookies);
      expect(res.status).toBe(200);
      expect(res.body.data).toEqual([]);
    });
  });

  describe('POST /api/v1/machines', () => {
    it('should return 201 with valid data as admin', async () => {
      const res = await request(app)
        .post('/api/v1/machines')
        .set('Cookie', adminCookies)
        .send(validMachine());
      expect(res.status).toBe(201);
      expect(res.body.name).toBe('Pac-Man Cabinet');
    });

    it('should return 401 without token', async () => {
      const res = await request(app).post('/api/v1/machines').send(validMachine());
      expect(res.status).toBe(401);
    });

    it('should return 403 when a non-admin user tries to create', async () => {
      const res = await request(app)
        .post('/api/v1/machines')
        .set('Cookie', userCookies)
        .send(validMachine());
      expect(res.status).toBe(403);
    });

    it('should return 400 with invalid data', async () => {
      const res = await request(app)
        .post('/api/v1/machines')
        .set('Cookie', adminCookies)
        .send({});
      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/v1/machines/:id', () => {
    it('should return 200 with existing machine', async () => {
      const created = await request(app)
        .post('/api/v1/machines')
        .set('Cookie', adminCookies)
        .send(validMachine());

      const res = await request(app)
        .get(`/api/v1/machines/${created.body._id}`)
        .set('Cookie', adminCookies);
      expect(res.status).toBe(200);
      expect(res.body._id).toBe(created.body._id);
    });

    it('should return 404 with non-existent ID', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const res = await request(app)
        .get(`/api/v1/machines/${fakeId}`)
        .set('Cookie', adminCookies);
      expect(res.status).toBe(404);
    });
  });

  describe('PUT /api/v1/machines/:id', () => {
    it('should return 200 when admin updates', async () => {
      const created = await request(app)
        .post('/api/v1/machines')
        .set('Cookie', adminCookies)
        .send(validMachine());

      const res = await request(app)
        .put(`/api/v1/machines/${created.body._id}`)
        .set('Cookie', adminCookies)
        .send({ status: 'maintenance' });
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('maintenance');
    });

    it('should return 403 when non-admin tries to update', async () => {
      const created = await request(app)
        .post('/api/v1/machines')
        .set('Cookie', adminCookies)
        .send(validMachine());

      const res = await request(app)
        .put(`/api/v1/machines/${created.body._id}`)
        .set('Cookie', userCookies)
        .send({ status: 'maintenance' });
      expect(res.status).toBe(403);
    });
  });

  describe('DELETE /api/v1/machines/:id', () => {
    it('should return 204 when admin deletes', async () => {
      const created = await request(app)
        .post('/api/v1/machines')
        .set('Cookie', adminCookies)
        .send(validMachine());

      const res = await request(app)
        .delete(`/api/v1/machines/${created.body._id}`)
        .set('Cookie', adminCookies);
      expect(res.status).toBe(204);
    });

    it('should return 403 when non-admin tries to delete', async () => {
      const created = await request(app)
        .post('/api/v1/machines')
        .set('Cookie', adminCookies)
        .send(validMachine());

      const res = await request(app)
        .delete(`/api/v1/machines/${created.body._id}`)
        .set('Cookie', userCookies);
      expect(res.status).toBe(403);
    });
  });
});