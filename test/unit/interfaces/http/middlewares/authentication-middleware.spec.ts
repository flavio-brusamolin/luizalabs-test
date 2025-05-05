import { AuthenticationMiddleware } from '../../../../../src/interfaces/http/middlewares/authentication-middleware';
import { ValidateCustomerAuthenticationUseCase } from '../../../../../src/domain/use-cases/validate-customer-authentication';
import { HttpRequest } from '../../../../../src/interfaces/http/contracts';
import { ok, error } from '../../../../../src/interfaces/http/helpers/http-response-builder';
import { AuthenticationFailedError } from '../../../../../src/domain/errors';

type RequestHeaders = { authorization?: string; 'x-access-token'?: string };

const makeFakeRequest = (): HttpRequest<any, RequestHeaders> => ({
  headers: {
    authorization: 'Bearer valid_token',
  },
});

const makeValidateCustomerAuthenticationUseCase = (): ValidateCustomerAuthenticationUseCase => {
  class ValidateCustomerAuthenticationUseCaseStub implements ValidateCustomerAuthenticationUseCase {
    async execute(_token: string): Promise<string> {
      return 'valid_customer_id';
    }
  }

  return new ValidateCustomerAuthenticationUseCaseStub();
};

interface SutTypes {
  authenticationMiddleware: AuthenticationMiddleware;
  validateCustomerAuthenticationUseCaseStub: ValidateCustomerAuthenticationUseCase;
}

const makeSut = (): SutTypes => {
  const validateCustomerAuthenticationUseCaseStub = makeValidateCustomerAuthenticationUseCase();
  const authenticationMiddleware = new AuthenticationMiddleware(validateCustomerAuthenticationUseCaseStub);

  return {
    authenticationMiddleware,
    validateCustomerAuthenticationUseCaseStub,
  };
};

describe('AuthenticationMiddleware', () => {
  describe('#handle', () => {
    it('should return a AuthenticationFailedError if no token is provided', async () => {
      const { authenticationMiddleware } = makeSut();

      const httpResponse = await authenticationMiddleware.handle({});

      expect(httpResponse).toEqual(error(new AuthenticationFailedError()));
    });

    it('should call ValidateCustomerAuthenticationUseCase with correct token', async () => {
      const { authenticationMiddleware, validateCustomerAuthenticationUseCaseStub } = makeSut();
      const executeSpy = jest.spyOn(validateCustomerAuthenticationUseCaseStub, 'execute');

      const httpRequest = makeFakeRequest();
      await authenticationMiddleware.handle(httpRequest);

      expect(executeSpy).toHaveBeenCalledWith('valid_token');
    });

    it('should return 200 and the customerId if authentication succeeds', async () => {
      const { authenticationMiddleware } = makeSut();

      const httpRequest = makeFakeRequest();
      const httpResponse = await authenticationMiddleware.handle(httpRequest);

      expect(httpResponse).toEqual(ok({ customerId: 'valid_customer_id' }));
    });

    it('should return the error response if use case throws', async () => {
      const { authenticationMiddleware, validateCustomerAuthenticationUseCaseStub } = makeSut();

      const exception = new AuthenticationFailedError();
      jest.spyOn(validateCustomerAuthenticationUseCaseStub, 'execute').mockRejectedValueOnce(exception);

      const httpRequest = makeFakeRequest();
      const httpResponse = await authenticationMiddleware.handle(httpRequest);

      expect(httpResponse).toEqual(error(exception));
    });
  });
});
