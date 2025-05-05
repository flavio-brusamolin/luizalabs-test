import request from 'supertest';
import { Express } from 'express';
import { createTestApp } from './support/create-test-app';
import { clearDatabase, getCustomers } from './support/database';

const makeFakeCustomer = () => ({
  name: 'Flavio Brito',
  email: 'flavio@mail.com',
});

describe('POST /signin', () => {
  const endpoint = '/api/signin';
  let app: Express;
  let customerApiKey: string;

  beforeAll(async () => {
    app = await createTestApp();
  });

  beforeEach(async () => {
    clearDatabase();
    const customer = makeFakeCustomer();
    await request(app).post('/api/signup').send(customer);
    const [registeredCustomer] = getCustomers();
    customerApiKey = registeredCustomer.apiKey;
  });

  it('should successfully authenticate a customer', async () => {
    const response = await request(app).post(endpoint).send({ apiKey: customerApiKey });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('accessToken');
  });

  it('should return a unauthorized error if apiKey does not exist', async () => {
    const nonExistentApiKey = crypto.randomUUID();
    const response = await request(app).post(endpoint).send({ apiKey: nonExistentApiKey });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Authentication failed');
  });
});
