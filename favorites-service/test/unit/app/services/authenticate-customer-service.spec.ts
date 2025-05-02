import { AuthenticateCustomerService } from '../../../../src/app/services/authenticate-customer-service';
import { AuthenticationFailedError } from '../../../../src/domain/errors';
import { LoadCustomerByApiKeyRepository } from '../../../../src/app/contracts/database';
import { EncryptToken } from '../../../../src/app/contracts/token';
import { Customer, CustomerId } from '../../../../src/domain/entities/customer';
import { AuthenticateCustomerInput, Token } from '../../../../src/domain/use-cases/authenticate-customer';

const makeFakeInput = (): AuthenticateCustomerInput => ({
  apiKey: 'any_input_api_key',
});

const fakeCustomer = new Customer({
  name: 'any_customer_name',
  email: 'any_customer_email',
});

const fakeToken = 'encrypted-token';

const makeLoadCustomerByApiKeyRepository = (): LoadCustomerByApiKeyRepository => {
  class LoadCustomerByApiKeyRepositoryStub implements LoadCustomerByApiKeyRepository {
    async loadCustomerByApiKey(_apiKey: string): Promise<Customer> {
      return fakeCustomer;
    }
  }

  return new LoadCustomerByApiKeyRepositoryStub();
};

const makeEncryptToken = (): EncryptToken => {
  class EncryptTokenStub implements EncryptToken {
    async encrypt(_customerId: CustomerId): Promise<Token> {
      return fakeToken;
    }
  }

  return new EncryptTokenStub();
};

interface SutTypes {
  authenticateCustomerService: AuthenticateCustomerService;
  loadCustomerByApiKeyRepositoryStub: LoadCustomerByApiKeyRepository;
  encryptTokenStub: EncryptToken;
}

const makeSut = (): SutTypes => {
  const loadCustomerByApiKeyRepositoryStub = makeLoadCustomerByApiKeyRepository();
  const encryptTokenStub = makeEncryptToken();

  const authenticateCustomerService = new AuthenticateCustomerService(loadCustomerByApiKeyRepositoryStub, encryptTokenStub);

  return {
    authenticateCustomerService,
    loadCustomerByApiKeyRepositoryStub,
    encryptTokenStub,
  };
};

describe('AuthenticateCustomerService', () => {
  describe('#execute', () => {
    it('should call LoadCustomerByApiKeyRepository with correct values', async () => {
      const { authenticateCustomerService, loadCustomerByApiKeyRepositoryStub } = makeSut();
      const loadCustomerByApiKeySpy = jest.spyOn(loadCustomerByApiKeyRepositoryStub, 'loadCustomerByApiKey');

      const input = makeFakeInput();
      await authenticateCustomerService.execute(input);

      expect(loadCustomerByApiKeySpy).toHaveBeenCalledWith(input.apiKey);
    });

    it('should throw AuthenticationFailedError if customer is not found', async () => {
      const { authenticateCustomerService, loadCustomerByApiKeyRepositoryStub } = makeSut();
      jest.spyOn(loadCustomerByApiKeyRepositoryStub, 'loadCustomerByApiKey').mockResolvedValueOnce(null);

      const input = makeFakeInput();
      const promise = authenticateCustomerService.execute(input);

      await expect(promise).rejects.toThrow(AuthenticationFailedError);
    });

    it('should call EncryptToken with correct values', async () => {
      const { authenticateCustomerService, encryptTokenStub } = makeSut();
      const encryptSpy = jest.spyOn(encryptTokenStub, 'encrypt');

      const input = makeFakeInput();
      await authenticateCustomerService.execute(input);

      expect(encryptSpy).toHaveBeenCalledWith(fakeCustomer.customerId);
    });

    it('should return the encrypted token', async () => {
      const { authenticateCustomerService } = makeSut();

      const input = makeFakeInput();
      const token = await authenticateCustomerService.execute(input);

      expect(token).toBe(fakeToken);
    });
  });
});
