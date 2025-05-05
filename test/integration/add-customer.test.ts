import request from 'supertest';
import { Express } from 'express';
import { createTestApp } from './support/create-test-app';
import { clearDatabase } from './support/database';

const makeFakeCustomer = () => ({
  name: 'Flavio Brito',
  email: 'flavio@mail.com',
});

describe('POST /signup', () => {
  const endpoint = '/api/signup';
  let app: Express;

  beforeAll(async () => {
    app = await createTestApp();
  });

  beforeEach(() => {
    clearDatabase();
  });

  it('should successfully register a new customer', async () => {
    const customer = makeFakeCustomer();
    const response = await request(app).post(endpoint).send(customer);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('customerId');
    expect(response.body).toHaveProperty('name', customer.name);
    expect(response.body).toHaveProperty('email', customer.email);
  });

  it('should return a conflict error if email is already in use', async () => {
    const customer = makeFakeCustomer();
    await request(app).post(endpoint).send(customer);

    const response = await request(app).post(endpoint).send(customer);

    expect(response.status).toBe(409);
    expect(response.body.error).toBe('This email is already in use');
  });
});
