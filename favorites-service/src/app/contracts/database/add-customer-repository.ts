import { Customer } from '../../../domain/entities/customer';

export interface AddCustomerRepository {
  addCustomer: (customer: Customer) => Promise<Customer>;
}
