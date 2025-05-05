import request from 'supertest';
import { Express } from 'express';
import { createTestApp } from './support/create-test-app';
import { clearDatabase, getCustomerById, getCustomers } from './support/database';
import { DatabaseCustomer } from '../../src/infra/database/database-customer';

const makeFakeCustomer = () => ({
  name: 'Flavio Brito',
  email: 'flavio@mail.com',
});

const makeFakeProductId = () => '5db40d1b-6609-4d56-b20e-eb00e53b6299';

describe('DELETE /favorites/{id}', () => {
  const endpoint = '/api/favorites';
  let app: Express;
  let accessToken: string;
  let registeredCustomer: DatabaseCustomer;

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

  it('should successfully remove a favorite', async () => {
    const productId = makeFakeProductId();
    await request(app).post(endpoint).set('Authorization', `Bearer ${accessToken}`).send({ productId });

    const response = await request(app).delete(`${endpoint}/${productId}`).set('Authorization', `Bearer ${accessToken}`);

    const dbCustomer = getCustomerById(registeredCustomer.customerId);

    expect(response.status).toBe(204);
    expect(dbCustomer.favorites).not.toContain(productId);
  });

  it('should return a not found error if favorite does not exist', async () => {
    const productId = crypto.randomUUID();

    const response = await request(app).delete(`${endpoint}/${productId}`).set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Favorite not found');
  });

  it('should return a unauthorized error if authentication fails', async () => {
    const productId = makeFakeProductId();

    const response = await request(app).delete(`${endpoint}/${productId}`).set('Authorization', `Bearer invalid_token`);

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Authentication failed');
  });
});
