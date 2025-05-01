import { Customer } from '../../domain/entities/customer';
import { DatabaseCustomer } from './database-customer';

export default {
  toDatabase(customer: Customer): DatabaseCustomer {
    return {
      customerId: customer.customerId,
      name: customer.name,
      email: customer.email,
      favorites: customer.favorites,
      apiKey: customer.apiKey,
    };
  },

  toEntity(dbCustomer: DatabaseCustomer): Customer {
    return new Customer({
      customerId: dbCustomer.customerId,
      name: dbCustomer.name,
      email: dbCustomer.email,
      favorites: dbCustomer.favorites,
      apiKey: dbCustomer.apiKey,
    });
  },
};
