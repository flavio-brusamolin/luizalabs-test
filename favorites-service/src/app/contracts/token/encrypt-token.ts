import { CustomerId } from '../../../domain/entities/customer';
import { Token } from '../../../domain/use-cases/authenticate-customer';

export interface EncryptToken {
  encrypt: (customerId: CustomerId) => Promise<Token>;
}
