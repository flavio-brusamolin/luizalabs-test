import { RemoveCustomerController } from '../../../../../src/interfaces/http/controllers/remove-customer-controller';
import { RemoveCustomerUseCase } from '../../../../../src/domain/use-cases/remove-customer';
import { HttpRequest } from '../../../../../src/interfaces/http/contracts';
import { noContent, error } from '../../../../../src/interfaces/http/helpers/http-response-builder';
import { CustomerNotFoundError } from '../../../../../src/domain/errors';

const makeFakeRequest = (): HttpRequest => ({
  customerId: 'valid_customer_id',
});

const makeRemoveCustomerUseCase = (): RemoveCustomerUseCase => {
  class RemoveCustomerUseCaseStub implements RemoveCustomerUseCase {
    async execute(_customerId: string): Promise<void> {}
  }

  return new RemoveCustomerUseCaseStub();
};

interface SutTypes {
  removeCustomerController: RemoveCustomerController;
  removeCustomerUseCaseStub: RemoveCustomerUseCase;
}

const makeSut = (): SutTypes => {
  const removeCustomerUseCaseStub = makeRemoveCustomerUseCase();
  const removeCustomerController = new RemoveCustomerController(removeCustomerUseCaseStub);

  return {
    removeCustomerController,
    removeCustomerUseCaseStub,
  };
};

describe('RemoveCustomerController', () => {
  describe('#handle', () => {
    it('should call RemoveCustomerUseCase with correct values', async () => {
      const { removeCustomerController, removeCustomerUseCaseStub } = makeSut();
      const executeSpy = jest.spyOn(removeCustomerUseCaseStub, 'execute');

      const httpRequest = makeFakeRequest();
      await removeCustomerController.handle(httpRequest);

      expect(executeSpy).toHaveBeenCalledWith(httpRequest.customerId);
    });

    it('should return 204 on success', async () => {
      const { removeCustomerController } = makeSut();

      const httpRequest = makeFakeRequest();
      const httpResponse = await removeCustomerController.handle(httpRequest);

      expect(httpResponse).toEqual(noContent());
    });

    it('should return the error response if use case throws', async () => {
      const { removeCustomerController, removeCustomerUseCaseStub } = makeSut();

      const exception = new CustomerNotFoundError();
      jest.spyOn(removeCustomerUseCaseStub, 'execute').mockRejectedValueOnce(exception);

      const httpRequest = makeFakeRequest();
      const httpResponse = await removeCustomerController.handle(httpRequest);

      expect(httpResponse).toEqual(error(exception));
    });
  });
});
