import request from 'supertest';
import { Express } from 'express';
import { createTestApp } from './support/create-test-app';
import { clearDatabase, getCustomers } from './support/database';

const makeFakeCustomer = () => ({
  name: 'Flavio Brito',
  email: 'flavio@mail.com',
});

const makeFakeProductId = () => '5db40d1b-6609-4d56-b20e-eb00e53b6299';

describe('GET /favorites', () => {
  const endpoint = '/api/favorites';
  let app: Express;
  let accessToken: string;

  beforeAll(async () => {
    app = await createTestApp();
  });

  beforeEach(async () => {
    clearDatabase();
    const customer = makeFakeCustomer();
    await request(app).post('/api/signup').send(customer);
    const [registeredCustomer] = getCustomers();
    const apiKey = registeredCustomer.apiKey;
    const response = await request(app).post('/api/signin').send({ apiKey });
    accessToken = response.body.accessToken;
  });

  it('should successfully return customer favorites', async () => {
    const productId = makeFakeProductId();
    await request(app).post(endpoint).set('Authorization', `Bearer ${accessToken}`).send({ productId });

    const response = await request(app).get(endpoint).set('Authorization', `Bearer ${accessToken}`);
    const [favorite] = response.body;

    expect(response.status).toBe(200);
    expect(favorite.productId).toBe(productId);
  });

  it('should return a unauthorized error if authentication fails', async () => {
    const response = await request(app).get(endpoint).set('Authorization', `Bearer invalid_token`);

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Authentication failed');
  });
});
