import request from 'supertest';
import { Express } from 'express';
import { createTestApp } from './support/create-test-app';
import { clearDatabase, getCustomers } from './support/database';
import { DatabaseCustomer } from '../../src/infra/database/database-customer';

const makeFakeCustomer = () => ({
  name: 'Flavio Brito',
  email: 'flavio@mail.com',
});

describe('GET /me', () => {
  const endpoint = '/api/me';
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

  it('should successfully return a customer', async () => {
    const response = await request(app).get(endpoint).set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.customerId).toBe(registeredCustomer.customerId);
    expect(response.body.name).toBe(registeredCustomer.name);
    expect(response.body.email).toBe(registeredCustomer.email);
  });

  it('should return a unauthorized error if authentication fails', async () => {
    const response = await request(app).get(endpoint).set('Authorization', `Bearer invalid_token`);

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Authentication failed');
  });
});
