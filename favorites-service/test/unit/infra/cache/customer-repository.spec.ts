import { CustomerRepository } from '../../../../src/infra/database/customer-repository';
import { Customer } from '../../../../src/domain/entities/customer';
import { ProductId } from '../../../../src/domain/entities/product';

const makeFakeCustomer = (customerId?: string): Customer => {
  return new Customer({
    customerId: customerId ?? 'valid_customer_id',
    name: 'valid_name',
    email: 'valid_email@example.com',
    apiKey: 'valid_api_key',
    favorites: ['product_1', 'product_2'],
  });
};

const makeSut = (): CustomerRepository => {
  return new CustomerRepository();
};

describe('CustomerRepository', () => {
  beforeEach(() => {
    (CustomerRepository as any).customers = [];
  });

  describe('#addCustomer', () => {
    it('should add the customer to repository', async () => {
      const customerRepository = makeSut();

      const customer = makeFakeCustomer();
      const createdCustomer = await customerRepository.addCustomer(customer);

      expect(createdCustomer).toEqual(customer);
      expect((CustomerRepository as any).customers).toHaveLength(1);
    });
  });

  describe('#updateCustomer', () => {
    it('should update an existing customer', async () => {
      const customerRepository = makeSut();

      const customer = makeFakeCustomer();
      const createdCustomer = await customerRepository.addCustomer(customer);

      const updatedCustomerProps = { name: 'updated_name', email: 'updated_email@example.com' };
      const updatedCustomer = await customerRepository.updateCustomer(createdCustomer.customerId, updatedCustomerProps);

      expect(updatedCustomer.name).toBe(updatedCustomerProps.name);
      expect(updatedCustomer.email).toBe(updatedCustomerProps.email);
    });
  });

  describe('#removeCustomer', () => {
    it('should remove the customer from repository', async () => {
      const customerRepository = makeSut();

      const customer = makeFakeCustomer();
      const createdCustomer = await customerRepository.addCustomer(customer);

      await customerRepository.removeCustomer(createdCustomer.customerId);
      const removedCustomer = await customerRepository.loadCustomerById(createdCustomer.customerId);

      expect(removedCustomer).toBeUndefined();
      expect((CustomerRepository as any).customers).toHaveLength(0);
    });
  });

  describe('#loadCustomerById', () => {
    it('should return a customer by ID', async () => {
      const customerRepository = makeSut();

      const customer = makeFakeCustomer();
      const createdCustomer = await customerRepository.addCustomer(customer);

      const loadedCustomer = await customerRepository.loadCustomerById(createdCustomer.customerId);

      expect(loadedCustomer).toEqual(createdCustomer);
    });

    it('should return null if customer is not found', async () => {
      const customerRepository = makeSut();
      const customer = await customerRepository.loadCustomerById('non_existent_id');
      expect(customer).toBeUndefined();
    });
  });

  describe('#loadCustomerByEmail', () => {
    it('should return a customer by email', async () => {
      const customerRepository = makeSut();

      const customer = makeFakeCustomer();
      const createdCustomer = await customerRepository.addCustomer(customer);

      const loadedCustomer = await customerRepository.loadCustomerByEmail(createdCustomer.email);

      expect(loadedCustomer).toEqual(createdCustomer);
    });

    it('should return null if customer is not found', async () => {
      const customerRepository = makeSut();
      const customer = await customerRepository.loadCustomerByEmail('non_existent_email');
      expect(customer).toBeUndefined();
    });
  });

  describe('#loadCustomerByApiKey', () => {
    it('should return a customer by apiKey', async () => {
      const customerRepository = makeSut();

      const customer = makeFakeCustomer();
      const createdCustomer = await customerRepository.addCustomer(customer);

      const loadedCustomer = await customerRepository.loadCustomerByApiKey(createdCustomer.apiKey);

      expect(loadedCustomer).toEqual(createdCustomer);
    });

    it('should return null if customer is not found', async () => {
      const customerRepository = makeSut();
      const customer = await customerRepository.loadCustomerByApiKey('non_existent_api_key');
      expect(customer).toBeUndefined();
    });
  });

  describe('#addFavorite', () => {
    it('should add a product to the customer favorites', async () => {
      const customerRepository = makeSut();

      const customer = makeFakeCustomer();
      const createdCustomer = await customerRepository.addCustomer(customer);

      const productId: ProductId = 'new_product';
      await customerRepository.addFavorite(createdCustomer.customerId, productId);

      const customerFavorites = await customerRepository.getFavorites(createdCustomer.customerId, 1, 10);

      expect(customerFavorites).toContain(productId);
    });

    it('should not add a duplicate favorite product', async () => {
      const customerRepository = makeSut();

      const customer = makeFakeCustomer();
      const createdCustomer = await customerRepository.addCustomer(customer);

      const productId: ProductId = 'product_1';
      await customerRepository.addFavorite(createdCustomer.customerId, productId);

      const customerFavorites = await customerRepository.getFavorites(createdCustomer.customerId, 1, 10);

      expect(customerFavorites).toHaveLength(2);
    });
  });

  describe('#isFavorite', () => {
    it('should return true if the product is a favorite', async () => {
      const customerRepository = makeSut();

      const customer = makeFakeCustomer();
      const createdCustomer = await customerRepository.addCustomer(customer);

      const productId: ProductId = 'product_1';
      const isFavorite = await customerRepository.isFavorite(createdCustomer.customerId, productId);

      expect(isFavorite).toBe(true);
    });

    it('should return false if the product is not a favorite', async () => {
      const customerRepository = makeSut();

      const customer = makeFakeCustomer();
      const createdCustomer = await customerRepository.addCustomer(customer);

      const productId: ProductId = 'non_favorite_product';
      const isFavorite = await customerRepository.isFavorite(createdCustomer.customerId, productId);

      expect(isFavorite).toBe(false);
    });
  });

  describe('#removeFavorite', () => {
    it('should remove a product from customer favorites', async () => {
      const customerRepository = makeSut();

      const customer = makeFakeCustomer();
      const createdCustomer = await customerRepository.addCustomer(customer);

      const productId: ProductId = 'product_1';
      await customerRepository.removeFavorite(createdCustomer.customerId, productId);

      const customerFavorites = await customerRepository.getFavorites(createdCustomer.customerId, 1, 10);

      expect(customerFavorites).not.toContain(productId);
    });
  });

  describe('#purgeFavorite', () => {
    it('should remove a product from all customers favorites', async () => {
      const customerRepository = makeSut();

      const customer1 = makeFakeCustomer();
      const customer2 = makeFakeCustomer('another_customer_id');
      const createdCustomer1 = await customerRepository.addCustomer(customer1);
      const createdCustomer2 = await customerRepository.addCustomer(customer2);

      const productId: ProductId = 'product_1';
      await customerRepository.purgeFavorite(productId);

      const customer1Favorites = await customerRepository.getFavorites(createdCustomer1.customerId, 1, 10);
      const customer2Favorites = await customerRepository.getFavorites(createdCustomer2.customerId, 1, 10);

      expect(customer1Favorites).not.toContain(productId);
      expect(customer2Favorites).not.toContain(productId);
    });
  });
});
