import { CustomerRepository } from '../../../infra/database/customer-repository';

export const buildCustomerRepository = (): CustomerRepository => {
  return new CustomerRepository();
};
