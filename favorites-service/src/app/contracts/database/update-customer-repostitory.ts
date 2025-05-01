import { Customer, CustomerId } from '../../../domain/entities/customer';
import { CustomerProps } from '../../../domain/use-cases/update-customer';

export interface UpdateCustomerRepository {
  updateCustomer: (customerId: CustomerId, customerProps: CustomerProps) => Promise<Customer>;
}
