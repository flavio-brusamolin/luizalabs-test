import request from 'supertest';
import { Express } from 'express';
import { createTestApp } from './support/create-test-app';
import { clearDatabase, getCustomerById, getCustomers } from './support/database';
import { DatabaseCustomer } from '../../src/infra/database/database-customer';

const makeFakeCustomer = () => ({
  name: 'Flavio Brito',
  email: 'flavio@mail.com',
});

describe('DELETE /me', () => {
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

  it('should successfully remove a customer', async () => {
    const response = await request(app).delete(endpoint).set('Authorization', `Bearer ${accessToken}`);

    const dbCustomer = getCustomerById(registeredCustomer.customerId);

    expect(response.status).toBe(204);
    expect(dbCustomer).toBeUndefined();
  });

  it('should return a unauthorized error if authentication fails', async () => {
    const response = await request(app).delete(endpoint).set('Authorization', `Bearer invalid_token`);

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Authentication failed');
  });
});
