import { CustomerId } from '../../domain/entities/customer';
import { AuthenticationFailedError, CustomerNotFoundError } from '../../domain/errors';
import { Token } from '../../domain/use-cases/authenticate-customer';
import { ValidateCustomerAuthenticationUseCase } from '../../domain/use-cases/validate-customer-authentication';
import { LoadCustomerByIdRepository } from '../contracts/database';
import { DecryptToken } from '../contracts/token/decrypt-token';

export class ValidateCustomerAuthenticationService implements ValidateCustomerAuthenticationUseCase {
  private customerId: CustomerId;

  constructor(
    private readonly decryptToken: DecryptToken,
    private readonly loadCustomerByIdRepository: LoadCustomerByIdRepository
  ) {}

  async execute(token: Token): Promise<CustomerId> {
    try {
      console.log(`Validating token ${token}`);
      this.customerId = await this.decryptToken.decrypt(token);
    } catch (error) {
      console.error(`Invalid token ${token}: ${error}`);
      throw new AuthenticationFailedError();
    }

    // The steps below would be unnecessary if we used a persistent database on disk
    console.log(`Loading customer ${this.customerId}`);
    const customer = await this.loadCustomerByIdRepository.loadCustomerById(this.customerId);

    if (!customer) {
      console.error(`Customer ${this.customerId} not found`);
      throw new CustomerNotFoundError();
    }

    return this.customerId;
  }
}
