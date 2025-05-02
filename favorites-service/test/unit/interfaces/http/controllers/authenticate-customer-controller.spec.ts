import { AuthenticateCustomerController } from '../../../../../src/interfaces/http/controllers/authenticate-customer-controller';
import {
  AuthenticateCustomerUseCase,
  AuthenticateCustomerInput,
  Token,
} from '../../../../../src/domain/use-cases/authenticate-customer';
import { HttpRequest } from '../../../../../src/interfaces/http/contracts';
import { ok, error } from '../../../../../src/interfaces/http/helpers/http-response-builder';
import { AuthenticationFailedError } from '../../../../../src/domain/errors';

const fakeAccessToken: Token = 'valid_access_token';

const makeFakeRequest = (): HttpRequest<AuthenticateCustomerInput> => ({
  body: { apiKey: 'valid_api_key' },
});

const makeAuthenticateCustomerUseCase = (): AuthenticateCustomerUseCase => {
  class AuthenticateCustomerUseCaseStub implements AuthenticateCustomerUseCase {
    async execute(_input: AuthenticateCustomerInput): Promise<Token> {
      return fakeAccessToken;
    }
  }

  return new AuthenticateCustomerUseCaseStub();
};

interface SutTypes {
  authenticateCustomerController: AuthenticateCustomerController;
  authenticateCustomerUseCaseStub: AuthenticateCustomerUseCase;
}

const makeSut = (): SutTypes => {
  const authenticateCustomerUseCaseStub = makeAuthenticateCustomerUseCase();
  const authenticateCustomerController = new AuthenticateCustomerController(authenticateCustomerUseCaseStub);

  return {
    authenticateCustomerController,
    authenticateCustomerUseCaseStub,
  };
};

describe('AuthenticateCustomerController', () => {
  describe('#handle', () => {
    it('should call AuthenticateCustomerUseCase with correct values', async () => {
      const { authenticateCustomerController, authenticateCustomerUseCaseStub } = makeSut();
      const executeSpy = jest.spyOn(authenticateCustomerUseCaseStub, 'execute');

      const httpRequest = makeFakeRequest();
      await authenticateCustomerController.handle(httpRequest);

      expect(executeSpy).toHaveBeenCalledWith(httpRequest.body);
    });

    it('should return 200 and the access token on success', async () => {
      const { authenticateCustomerController } = makeSut();

      const httpRequest = makeFakeRequest();
      const httpResponse = await authenticateCustomerController.handle(httpRequest);

      expect(httpResponse).toEqual(ok({ accessToken: fakeAccessToken }));
    });

    it('should return the error response if use case throws', async () => {
      const { authenticateCustomerController, authenticateCustomerUseCaseStub } = makeSut();

      const exception = new AuthenticationFailedError();
      jest.spyOn(authenticateCustomerUseCaseStub, 'execute').mockRejectedValueOnce(exception);

      const httpRequest = makeFakeRequest();
      const httpResponse = await authenticateCustomerController.handle(httpRequest);

      expect(httpResponse).toEqual(error(exception));
    });
  });
});
