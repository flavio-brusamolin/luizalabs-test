import request from 'supertest';
import { Express } from 'express';
import { createTestApp } from './support/create-test-app';
import { clearDatabase, getCustomers } from './support/database';

const makeFakeCustomer = () => ({
  name: 'Flavio Brito',
  email: 'flavio@mail.com',
});

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
    const productIds = ['5db40d1b-6609-4d56-b20e-eb00e53b6299', '6ce6b564-92d3-492a-91ba-ee4e6aee7d87'];
    for (const productId of productIds) {
      await request(app).post(endpoint).set('Authorization', `Bearer ${accessToken}`).send({ productId: productId });
    }

    const response = await request(app).get(endpoint).set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    for (const product of response.body) {
      expect(productIds).toContain(product.productId);
    }
  });

  it('should return a unauthorized error if authentication fails', async () => {
    const response = await request(app).get(endpoint).set('Authorization', `Bearer invalid_token`);

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Authentication failed');
  });
});
