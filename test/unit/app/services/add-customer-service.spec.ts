import { AddCustomerRepository, LoadCustomerByEmailRepository } from '../../../../src/app/contracts/database';
import { PublishCreatedCustomerQueue } from '../../../../src/app/contracts/queue';
import { AddCustomerService } from '../../../../src/app/services/add-customer-service';
import { Customer } from '../../../../src/domain/entities/customer';
import { EmailAlreadyRegisteredError } from '../../../../src/domain/errors';
import { AddCustomerInput } from '../../../../src/domain/use-cases/add-customer';

jest.mock('../../../../src/domain/entities/customer', () => ({
  Customer: jest.fn().mockImplementation(({ name, email }) => ({
    name,
    email,
    customerId: 'fixed_customer_id',
    apiKey: 'fixed_api_key',
    favorites: [],
  })),
}));

const makeFakeInput = (): AddCustomerInput => ({
  name: 'any_input_name',
  email: 'any_input_email',
});

const fakeCustomer = new Customer({
  name: 'any_customer_name',
  email: 'any_customer_email',
});

const makeLoadCustomerByEmailRepository = (): LoadCustomerByEmailRepository => {
  class LoadCustomerByEmailRepositoryStub implements LoadCustomerByEmailRepository {
    async loadCustomerByEmail(_email: string): Promise<Customer> {
      return null;
    }
  }

  return new LoadCustomerByEmailRepositoryStub();
};

const makeAddCustomerRepository = (): AddCustomerRepository => {
  class AddCustomerRepositoryStub implements AddCustomerRepository {
    async addCustomer(_customer: Customer): Promise<Customer> {
      return fakeCustomer;
    }
  }

  return new AddCustomerRepositoryStub();
};

const makePublishCreatedCustomerQueue = (): PublishCreatedCustomerQueue => {
  class PublishCreatedCustomerQueueStub implements PublishCreatedCustomerQueue {
    publishCreatedCustomer(_customer: Customer): void {}
  }

  return new PublishCreatedCustomerQueueStub();
};

interface SutTypes {
  addCustomerService: AddCustomerService;
  loadCustomerByEmailRepositoryStub: LoadCustomerByEmailRepository;
  addCustomerRepositoryStub: AddCustomerRepository;
  publishCreatedCustomerQueueStub: PublishCreatedCustomerQueue;
}

const makeSut = (): SutTypes => {
  const loadCustomerByEmailRepositoryStub = makeLoadCustomerByEmailRepository();
  const addCustomerRepositoryStub = makeAddCustomerRepository();
  const publishCreatedCustomerQueueStub = makePublishCreatedCustomerQueue();

  const addCustomerService = new AddCustomerService(
    loadCustomerByEmailRepositoryStub,
    addCustomerRepositoryStub,
    publishCreatedCustomerQueueStub
  );

  return {
    addCustomerService,
    loadCustomerByEmailRepositoryStub,
    addCustomerRepositoryStub,
    publishCreatedCustomerQueueStub,
  };
};

describe('AddCustomerService', () => {
  describe('#execute', () => {
    it('should call LoadCustomerByEmailRepository with correct values', async () => {
      const { addCustomerService, loadCustomerByEmailRepositoryStub } = makeSut();
      const loadCustomerByEmailSpy = jest.spyOn(loadCustomerByEmailRepositoryStub, 'loadCustomerByEmail');

      const customerInput = makeFakeInput();
      await addCustomerService.execute(customerInput);

      expect(loadCustomerByEmailSpy).toHaveBeenCalledWith(customerInput.email);
    });

    it('should throw a EmailAlreadyRegisteredError when the input email is already in use', async () => {
      const { addCustomerService, loadCustomerByEmailRepositoryStub } = makeSut();
      jest.spyOn(loadCustomerByEmailRepositoryStub, 'loadCustomerByEmail').mockResolvedValueOnce(fakeCustomer);

      const customerInput = makeFakeInput();
      const promise = addCustomerService.execute(customerInput);

      await expect(promise).rejects.toThrow(EmailAlreadyRegisteredError);
    });

    it('should call AddCustomerRepository with correct values', async () => {
      const { addCustomerService, addCustomerRepositoryStub } = makeSut();
      const addCustomerSpy = jest.spyOn(addCustomerRepositoryStub, 'addCustomer');

      const customerInput = makeFakeInput();
      await addCustomerService.execute(customerInput);

      const newCustomer = new Customer({ ...customerInput });
      expect(addCustomerSpy).toHaveBeenCalledWith(newCustomer);
    });

    it('should call PublishCreatedCustomerQueue with correct values', async () => {
      const { addCustomerService, publishCreatedCustomerQueueStub } = makeSut();
      const publishCreatedCustomerSpy = jest.spyOn(publishCreatedCustomerQueueStub, 'publishCreatedCustomer');

      const customerInput = makeFakeInput();
      await addCustomerService.execute(customerInput);

      expect(publishCreatedCustomerSpy).toHaveBeenCalledWith(fakeCustomer);
    });

    it('should return the created customer', async () => {
      const { addCustomerService } = makeSut();

      const customerInput = makeFakeInput();
      const createdCustomer = await addCustomerService.execute(customerInput);

      expect(createdCustomer).toEqual(fakeCustomer);
    });
  });
});
