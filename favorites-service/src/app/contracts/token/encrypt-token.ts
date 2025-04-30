import { CustomerId } from '../../../domain/entities/customer';

export interface EncryptToken {
  encrypt: (customerId: CustomerId) => Promise<string>;
}
