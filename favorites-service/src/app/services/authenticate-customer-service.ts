import { AuthenticationFailedError } from '../../domain/errors';
import { AuthenticateCustomerUseCase, AuthenticateCustomerInput, Token } from '../../domain/use-cases/authenticate-customer';
import { LoadCustomerByApiKeyRepository } from '../contracts/database';
import { EncryptToken } from '../contracts/token';

export class AuthenticateCustomerService implements AuthenticateCustomerUseCase {
  constructor(
    private readonly loadCustomerByApiKeyRepository: LoadCustomerByApiKeyRepository,
    private readonly encryptToken: EncryptToken
  ) {}

  async execute({ apiKey }: AuthenticateCustomerInput): Promise<Token> {
    const customer = await this.loadCustomerByApiKeyRepository.loadCustomerByApiKey(apiKey);
    if (!customer) {
      console.error(`Customer not found by apiKey ${apiKey}`);
      throw new AuthenticationFailedError();
    }

    console.log(`Generating token for customer ${customer.customerId}`);
    return await this.encryptToken.encrypt(customer.customerId);
  }
}
