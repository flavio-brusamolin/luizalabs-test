import { CustomerRepository } from '../../../src/infra/database/customer-repository';
import { DatabaseCustomer } from '../../../src/infra/database/database-customer';

export function clearDatabase(): void {
  (CustomerRepository as any).customers = [];
}

export function getCustomers(): DatabaseCustomer[] {
  return (CustomerRepository as any).customers;
}
