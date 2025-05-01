import { CustomerId } from '../../domain/entities/customer';
import { AuthenticationFailedError } from '../../domain/errors/authentication-failed-error';
import { Token } from '../../domain/use-cases/authenticate-customer';
import { ValidateCustomerAuthenticationUseCase } from '../../domain/use-cases/validate-customer-authentication';
import { DecryptToken } from '../contracts/token/decrypt-token';

export class ValidateCustomerAuthenticationService implements ValidateCustomerAuthenticationUseCase {
  constructor(private readonly decryptToken: DecryptToken) {}

  async execute(token: Token): Promise<CustomerId> {
    try {
      console.log(`Validating token ${token}`);
      return await this.decryptToken.decrypt(token);
    } catch (error) {
      console.error(`Invalid token ${token}: ${error}`);
      throw new AuthenticationFailedError();
    }
  }
}
