import { AuthenticationFailedError } from '../../domain/errors/authentication-failed-error';
import {
  AuthenticateCustomerUseCase,
  AuthenticateCustomerInput,
  AccessToken,
} from '../../domain/use-cases/authenticate-customer';
import { LoadCustomerByApiKeyRepository } from '../contracts/database';
import { EncryptToken } from '../contracts/token';

export class AuthenticateCustomerService implements AuthenticateCustomerUseCase {
  constructor(
    private readonly loadCustomerByApiKeyRepository: LoadCustomerByApiKeyRepository,
    private readonly encryptToken: EncryptToken
  ) {}

  async execute({ apiKey }: AuthenticateCustomerInput): Promise<AccessToken> {
    const customer = await this.loadCustomerByApiKeyRepository.loadCustomerByApiKey(apiKey);
    if (!customer) {
      throw new AuthenticationFailedError();
    }

    const accessToken = await this.encryptToken.encrypt(customer.customerId);
    return { accessToken };
  }
}
