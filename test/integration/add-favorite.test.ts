import request from 'supertest';
import { Express } from 'express';
import { createTestApp } from './support/create-test-app';
import { clearDatabase, getCustomers } from './support/database';
import { DatabaseCustomer } from '../../src/infra/database/database-customer';

const makeFakeCustomer = () => ({
  name: 'Flavio Brito',
  email: 'flavio@mail.com',
});

const makeFakeProductId = () => '5db40d1b-6609-4d56-b20e-eb00e53b6299';

describe('POST /favorites', () => {
  const endpoint = '/api/favorites';
  let app: Express;
  let registeredCustomer: DatabaseCustomer;
  let accessToken: string;

  beforeAll(async () => {
    app = await createTestApp();
  });

  beforeEach(async () => {
    clearDatabase();
    const customer = makeFakeCustomer();
    await request(app).post('/api/signup').send(customer);
    [registeredCustomer] = getCustomers();
    const apiKey = registeredCustomer.apiKey;
    const response = await request(app).post('/api/signin').send({ apiKey });
    accessToken = response.body.accessToken;
  });

  it('should successfully add a favorite', async () => {
    const productId = makeFakeProductId();

    const response = await request(app).post(endpoint).set('Authorization', `Bearer ${accessToken}`).send({ productId });

    expect(response.status).toBe(201);
  });

  it('should return a conflict error if product has already been favorited', async () => {
    const productId = makeFakeProductId();

    await request(app).post(endpoint).set('Authorization', `Bearer ${accessToken}`).send({ productId });
    const response = await request(app).post(endpoint).set('Authorization', `Bearer ${accessToken}`).send({ productId });

    expect(response.status).toBe(409);
    expect(response.body.error).toBe('This product has already been favorited');
  });

  it('should return a not found error if product does not exist', async () => {
    const productId = crypto.randomUUID();

    const response = await request(app).post(endpoint).set('Authorization', `Bearer ${accessToken}`).send({ productId });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Product not found');
  });
});
