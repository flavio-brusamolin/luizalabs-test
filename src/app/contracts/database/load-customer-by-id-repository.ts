import { Customer, CustomerId } from '../../../domain/entities/customer';

export interface LoadCustomerByIdRepository {
  loadCustomerById: (customerId: CustomerId) => Promise<Customer>;
}
