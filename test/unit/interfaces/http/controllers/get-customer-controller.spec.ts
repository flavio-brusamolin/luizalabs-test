import { GetCustomerController } from '../../../../../src/interfaces/http/controllers/get-customer-controller';
import { GetCustomerUseCase } from '../../../../../src/domain/use-cases/get-customer';
import { HttpRequest } from '../../../../../src/interfaces/http/contracts';
import { ok, error } from '../../../../../src/interfaces/http/helpers/http-response-builder';
import { Customer } from '../../../../../src/domain/entities/customer';
import { CustomerNotFoundError } from '../../../../../src/domain/errors';

const fakeCustomer = new Customer({
  name: 'valid_name',
  email: 'valid_email@example.com',
});

const makeFakeRequest = (): HttpRequest => ({
  customerId: 'valid_customer_id',
});

const makeGetCustomerUseCase = (): GetCustomerUseCase => {
  class GetCustomerUseCaseStub implements GetCustomerUseCase {
    async execute(_customerId: string): Promise<Customer> {
      return fakeCustomer;
    }
  }

  return new GetCustomerUseCaseStub();
};

interface SutTypes {
  getCustomerController: GetCustomerController;
  getCustomerUseCaseStub: GetCustomerUseCase;
}

const makeSut = (): SutTypes => {
  const getCustomerUseCaseStub = makeGetCustomerUseCase();
  const getCustomerController = new GetCustomerController(getCustomerUseCaseStub);

  return {
    getCustomerController,
    getCustomerUseCaseStub,
  };
};

describe('GetCustomerController', () => {
  describe('#handle', () => {
    it('should call GetCustomerUseCase with correct values', async () => {
      const { getCustomerController, getCustomerUseCaseStub } = makeSut();
      const executeSpy = jest.spyOn(getCustomerUseCaseStub, 'execute');

      const httpRequest = makeFakeRequest();
      await getCustomerController.handle(httpRequest);

      expect(executeSpy).toHaveBeenCalledWith(httpRequest.customerId);
    });

    it('should return 200 and the serialized customer on success', async () => {
      const { getCustomerController } = makeSut();

      const httpRequest = makeFakeRequest();
      const httpResponse = await getCustomerController.handle(httpRequest);

      expect(httpResponse).toEqual(ok(fakeCustomer.serialize()));
    });

    it('should return the error response if use case throws', async () => {
      const { getCustomerController, getCustomerUseCaseStub } = makeSut();

      const exception = new CustomerNotFoundError();
      jest.spyOn(getCustomerUseCaseStub, 'execute').mockRejectedValueOnce(exception);

      const httpRequest = makeFakeRequest();
      const httpResponse = await getCustomerController.handle(httpRequest);

      expect(httpResponse).toEqual(error(exception));
    });
  });
});
