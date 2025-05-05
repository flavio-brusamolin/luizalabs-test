import { UpdateCustomerController } from '../../../../../src/interfaces/http/controllers/update-customer-controller';
import { UpdateCustomerUseCase, CustomerProps } from '../../../../../src/domain/use-cases/update-customer';
import { HttpRequest } from '../../../../../src/interfaces/http/contracts';
import { ok, error } from '../../../../../src/interfaces/http/helpers/http-response-builder';
import { Customer } from '../../../../../src/domain/entities/customer';
import { EmailAlreadyRegisteredError } from '../../../../../src/domain/errors';

const fakeCustomerData = { name: 'valid_name', email: 'valid_email@example.com' };
const fakeCustomer = new Customer(fakeCustomerData);

const makeFakeRequest = (): HttpRequest<CustomerProps> => ({
  customerId: 'valid_customer_id',
  body: fakeCustomerData,
});

const makeUpdateCustomerUseCase = (): UpdateCustomerUseCase => {
  class UpdateCustomerUseCaseStub implements UpdateCustomerUseCase {
    async execute(_input: any): Promise<Customer> {
      return fakeCustomer;
    }
  }

  return new UpdateCustomerUseCaseStub();
};

interface SutTypes {
  updateCustomerController: UpdateCustomerController;
  updateCustomerUseCaseStub: UpdateCustomerUseCase;
}

const makeSut = (): SutTypes => {
  const updateCustomerUseCaseStub = makeUpdateCustomerUseCase();
  const updateCustomerController = new UpdateCustomerController(updateCustomerUseCaseStub);

  return {
    updateCustomerController,
    updateCustomerUseCaseStub,
  };
};

describe('UpdateCustomerController', () => {
  describe('#handle', () => {
    it('should call UpdateCustomerUseCase with correct values', async () => {
      const { updateCustomerController, updateCustomerUseCaseStub } = makeSut();
      const executeSpy = jest.spyOn(updateCustomerUseCaseStub, 'execute');

      const httpRequest = makeFakeRequest();
      await updateCustomerController.handle(httpRequest);

      expect(executeSpy).toHaveBeenCalledWith({
        ...httpRequest.body,
        customerId: httpRequest.customerId,
      });
    });

    it('should return 200 and the serialized customer on success', async () => {
      const { updateCustomerController } = makeSut();

      const httpRequest = makeFakeRequest();
      const httpResponse = await updateCustomerController.handle(httpRequest);

      expect(httpResponse).toEqual(ok(fakeCustomer.serialize()));
    });

    it('should return the error response if use case throws', async () => {
      const { updateCustomerController, updateCustomerUseCaseStub } = makeSut();

      const exception = new EmailAlreadyRegisteredError();
      jest.spyOn(updateCustomerUseCaseStub, 'execute').mockRejectedValueOnce(exception);

      const httpRequest = makeFakeRequest();
      const httpResponse = await updateCustomerController.handle(httpRequest);

      expect(httpResponse).toEqual(error(exception));
    });
  });
});
