import request from 'supertest';
import { Express } from 'express';
import { createTestApp } from './support/create-test-app';
import { clearDatabase, getCustomers } from './support/database';
import { DatabaseCustomer } from '../../src/infra/database/database-customer';

const makeFakeCustomer = () => ({
  name: 'Flavio Brito',
  email: 'flavio@mail.com',
});

const makeFakeUpdateCustomerParams = () => ({
  name: 'Updated name',
  email: 'updated@mail.com',
});

describe('PATCH /me', () => {
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

  it('should successfully update a customer', async () => {
    const updateCustomerParams = makeFakeUpdateCustomerParams();

    const response = await request(app).patch(endpoint).set('Authorization', `Bearer ${accessToken}`).send(updateCustomerParams);

    expect(response.status).toBe(200);
    expect(response.body.customerId).toBe(registeredCustomer.customerId);
    expect(response.body.name).toBe(updateCustomerParams.name);
    expect(response.body.email).toBe(updateCustomerParams.email);
  });

  it('should return a conflict error if email is already in use', async () => {
    const existingEmail = 'existing@mail.com';

    const existingCustomer = makeFakeCustomer();
    existingCustomer.email = existingEmail;
    await request(app).post('/api/signup').send(existingCustomer);

    const updateCustomerParams = makeFakeUpdateCustomerParams();
    updateCustomerParams.email = existingEmail;

    const response = await request(app).patch(endpoint).set('Authorization', `Bearer ${accessToken}`).send(updateCustomerParams);

    expect(response.status).toBe(409);
    expect(response.body.error).toBe('This email is already in use');
  });

  it('should return a unauthorized error if authentication fails', async () => {
    const updateCustomerParams = makeFakeUpdateCustomerParams();

    const response = await request(app).patch(endpoint).set('Authorization', `Bearer invalid_token`).send(updateCustomerParams);

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Authentication failed');
  });
});
