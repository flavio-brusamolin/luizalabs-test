import { ApiKey, Customer } from '../../../domain/entities/customer';

export interface LoadCustomerByApiKeyRepository {
  loadCustomerByApiKey: (apiKey: ApiKey) => Promise<Customer>;
}
