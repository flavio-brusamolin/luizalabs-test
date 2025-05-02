import { Customer } from '../../../../../src/domain/entities/customer';
import { EmailAlreadyRegisteredError } from '../../../../../src/domain/errors';
import { AddCustomerInput, AddCustomerUseCase } from '../../../../../src/domain/use-cases/add-customer';
import { HttpRequest } from '../../../../../src/interfaces/http/contracts';
import { AddCustomerController } from '../../../../../src/interfaces/http/controllers/add-customer-controller';
import { created, error } from '../../../../../src/interfaces/http/helpers/http-response-builder';

const fakeCustomerData = { name: 'valid_name', email: 'valid_email@example.com' };
const fakeCustomer = new Customer(fakeCustomerData);

const makeFakeRequest = (): HttpRequest<AddCustomerInput> => ({
  body: fakeCustomerData,
});

const makeAddCustomerUseCase = (): AddCustomerUseCase => {
  class AddCustomerUseCaseStub implements AddCustomerUseCase {
    async execute(_input: AddCustomerInput): Promise<Customer> {
      return fakeCustomer;
    }
  }

  return new AddCustomerUseCaseStub();
};

interface SutTypes {
  addCustomerController: AddCustomerController;
  addCustomerUseCaseStub: AddCustomerUseCase;
}

const makeSut = (): SutTypes => {
  const addCustomerUseCaseStub = makeAddCustomerUseCase();
  const addCustomerController = new AddCustomerController(addCustomerUseCaseStub);

  return {
    addCustomerController,
    addCustomerUseCaseStub,
  };
};

describe('AddCustomerController', () => {
  describe('#handle', () => {
    it('should call AddCustomerUseCase with correct values', async () => {
      const { addCustomerController, addCustomerUseCaseStub } = makeSut();
      const executeSpy = jest.spyOn(addCustomerUseCaseStub, 'execute');

      const httpRequest = makeFakeRequest();
      await addCustomerController.handle(httpRequest);

      expect(executeSpy).toHaveBeenCalledWith(httpRequest.body);
    });

    it('should return 201 and the serialized customer on success', async () => {
      const { addCustomerController } = makeSut();

      const httpRequest = makeFakeRequest();
      const httpResponse = await addCustomerController.handle(httpRequest);

      expect(httpResponse).toEqual(created(fakeCustomer.serialize()));
    });

    it('should return the error response if use case throws', async () => {
      const { addCustomerController, addCustomerUseCaseStub } = makeSut();

      const exception = new EmailAlreadyRegisteredError();
      jest.spyOn(addCustomerUseCaseStub, 'execute').mockRejectedValueOnce(exception);

      const httpRequest = makeFakeRequest();
      const httpResponse = await addCustomerController.handle(httpRequest);

      expect(httpResponse).toEqual(error(exception));
    });
  });
});
