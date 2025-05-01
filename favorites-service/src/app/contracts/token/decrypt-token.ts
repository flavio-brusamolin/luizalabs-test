import { CustomerId } from '../../../domain/entities/customer';
import { Token } from '../../../domain/use-cases/authenticate-customer';

export interface DecryptToken {
  decrypt: (token: Token) => Promise<CustomerId>;
}
