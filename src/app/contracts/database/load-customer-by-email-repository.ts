import { Customer } from '../../../domain/entities/customer';

export interface LoadCustomerByEmailRepository {
  loadCustomerByEmail: (email: string) => Promise<Customer>;
}
