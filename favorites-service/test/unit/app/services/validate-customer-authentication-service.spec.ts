import { ValidateCustomerAuthenticationService } from '../../../../src/app/services/validate-customer-authentication-service';
import { AuthenticationFailedError, CustomerNotFoundError } from '../../../../src/domain/errors';
import { LoadCustomerByIdRepository } from '../../../../src/app/contracts/database';
import { DecryptToken } from '../../../../src/app/contracts/token/decrypt-token';
import { Token } from '../../../../src/domain/use-cases/authenticate-customer';
import { Customer } from '../../../../src/domain/entities/customer';

const makeFakeToken = (): Token => 'valid_token';

const fakeCustomer = new Customer({
  customerId: 'valid_customer_id',
  name: 'valid_customer_name',
  email: 'valid_customer_email@example.com',
});

const makeDecryptToken = (): DecryptToken => {
  class DecryptTokenStub implements DecryptToken {
    async decrypt(_token: Token): Promise<string> {
      return 'valid_customer_id';
    }
  }

  return new DecryptTokenStub();
};

const makeLoadCustomerByIdRepository = (): LoadCustomerByIdRepository => {
  class LoadCustomerByIdRepositoryStub implements LoadCustomerByIdRepository {
    async loadCustomerById(_customerId: string): Promise<Customer> {
      return fakeCustomer;
    }
  }

  return new LoadCustomerByIdRepositoryStub();
};

interface SutTypes {
  validateCustomerAuthenticationService: ValidateCustomerAuthenticationService;
  decryptTokenStub: DecryptToken;
  loadCustomerByIdRepositoryStub: LoadCustomerByIdRepository;
}

const makeSut = (): SutTypes => {
  const decryptTokenStub = makeDecryptToken();
  const loadCustomerByIdRepositoryStub = makeLoadCustomerByIdRepository();

  const validateCustomerAuthenticationService = new ValidateCustomerAuthenticationService(
    decryptTokenStub,
    loadCustomerByIdRepositoryStub
  );

  return {
    validateCustomerAuthenticationService,
    decryptTokenStub,
    loadCustomerByIdRepositoryStub,
  };
};

describe('ValidateCustomerAuthenticationService', () => {
  describe('#execute', () => {
    it('should call DecryptToken with correct values', async () => {
      const { validateCustomerAuthenticationService, decryptTokenStub } = makeSut();
      const decryptSpy = jest.spyOn(decryptTokenStub, 'decrypt');

      const token = makeFakeToken();
      await validateCustomerAuthenticationService.execute(token);

      expect(decryptSpy).toHaveBeenCalledWith(token);
    });

    it('should throw AuthenticationFailedError if DecryptToken throws', async () => {
      const { validateCustomerAuthenticationService, decryptTokenStub } = makeSut();
      jest.spyOn(decryptTokenStub, 'decrypt').mockRejectedValueOnce(new Error());

      const token = makeFakeToken();
      const promise = validateCustomerAuthenticationService.execute(token);

      await expect(promise).rejects.toThrow(AuthenticationFailedError);
    });

    it('should call LoadCustomerByIdRepository with correct values', async () => {
      const { validateCustomerAuthenticationService, loadCustomerByIdRepositoryStub } = makeSut();
      const loadCustomerByIdSpy = jest.spyOn(loadCustomerByIdRepositoryStub, 'loadCustomerById');

      const token = makeFakeToken();
      await validateCustomerAuthenticationService.execute(token);

      expect(loadCustomerByIdSpy).toHaveBeenCalledWith('valid_customer_id');
    });

    it('should throw CustomerNotFoundError if customer is not found', async () => {
      const { validateCustomerAuthenticationService, loadCustomerByIdRepositoryStub } = makeSut();
      jest.spyOn(loadCustomerByIdRepositoryStub, 'loadCustomerById').mockResolvedValueOnce(null);

      const token = makeFakeToken();
      const promise = validateCustomerAuthenticationService.execute(token);

      await expect(promise).rejects.toThrow(CustomerNotFoundError);
    });

    it('should return the customerId if validation succeeds', async () => {
      const { validateCustomerAuthenticationService } = makeSut();

      const token = makeFakeToken();
      const customerId = await validateCustomerAuthenticationService.execute(token);

      expect(customerId).toBe('valid_customer_id');
    });
  });
});
