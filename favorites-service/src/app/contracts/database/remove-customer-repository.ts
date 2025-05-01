import { CustomerId } from '../../../domain/entities/customer';

export interface RemoveCustomerRepository {
  removeCustomer: (customerId: CustomerId) => Promise<void>;
}
