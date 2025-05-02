import { Customer, CustomerInput } from '../../../../src/domain/entities/customer';
import { RequiredParameterError } from '../../../../src/domain/errors';

const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const makeFakeRequiredInput = (): CustomerInput => ({
  name: 'valid_name',
  email: 'valid_email@example.com',
});

const makeFakeCompleteInput = (): CustomerInput => ({
  ...makeFakeRequiredInput(),
  customerId: 'valid_id',
  favorites: ['valid_product_id'],
  apiKey: 'valid_api_key',
});

describe('Customer Entity', () => {
  describe('constructor', () => {
    it('should create a customer with only required data', () => {
      const requiredInput = makeFakeRequiredInput();
      const customer = new Customer(requiredInput);

      expect(customer.name).toBe(requiredInput.name);
      expect(customer.email).toBe(requiredInput.email);
      expect(customer.customerId).toBeDefined();
      expect(customer.favorites).toBeDefined();
      expect(customer.apiKey).toBeDefined();
    });

    it('should create a customer with all possible data', () => {
      const completeInput = makeFakeCompleteInput();
      const customer = new Customer(completeInput);

      expect(customer.customerId).toBe(completeInput.customerId);
      expect(customer.name).toBe(completeInput.name);
      expect(customer.email).toBe(completeInput.email);
      expect(customer.favorites).toBe(completeInput.favorites);
      expect(customer.apiKey).toBe(completeInput.apiKey);
    });

    it('should generate a valid uuid for customerId if not provided', () => {
      const input = makeFakeRequiredInput();
      const customer = new Customer(input);

      expect(customer.customerId).toMatch(uuidV4Regex);
    });

    it('should generate a valid uuid for apiKey if not provided', () => {
      const input = makeFakeRequiredInput();
      const customer = new Customer(input);

      expect(customer.apiKey).toMatch(uuidV4Regex);
    });

    it('should set an empty favorites array if not provided', () => {
      const input = makeFakeRequiredInput();
      const customer = new Customer(input);

      expect(customer.favorites).toEqual([]);
    });

    it('should throw RequiredParameterError if name is not provided', () => {
      const input = makeFakeRequiredInput();
      delete input.name;

      expect(() => new Customer(input)).toThrow(new RequiredParameterError('name'));
    });

    it('should throw RequiredParameterError if email is not provided', () => {
      const input = makeFakeRequiredInput();
      delete input.email;

      expect(() => new Customer(input)).toThrow(new RequiredParameterError('email'));
    });
  });

  describe('serialize', () => {
    it('should return a serialized customer object', () => {
      const input = makeFakeRequiredInput();
      const customer = new Customer(input);

      expect(customer.serialize()).toEqual({
        customerId: customer.customerId,
        name: customer.name,
        email: customer.email,
      });
    });
  });
});
