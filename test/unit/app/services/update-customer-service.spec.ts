import { UpdateCustomerService } from '../../../../src/app/services/update-customer-service';
import { EmailAlreadyRegisteredError } from '../../../../src/domain/errors';
import { LoadCustomerByEmailRepository, UpdateCustomerRepository } from '../../../../src/app/contracts/database';
import { Customer, CustomerId } from '../../../../src/domain/entities/customer';
import { CustomerProps, UpdateCustomerInput } from '../../../../src/domain/use-cases/update-customer';

const makeFakeInput = (): UpdateCustomerInput => ({
  customerId: 'valid_customer_id',
  name: 'updated_name',
  email: 'updated_email@example.com',
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

const makeUpdateCustomerRepository = (): UpdateCustomerRepository => {
  class UpdateCustomerRepositoryStub implements UpdateCustomerRepository {
    async updateCustomer(_customerId: CustomerId, _data: CustomerProps): Promise<Customer> {
      return fakeCustomer;
    }
  }

  return new UpdateCustomerRepositoryStub();
};

interface SutTypes {
  updateCustomerService: UpdateCustomerService;
  loadCustomerByEmailRepositoryStub: LoadCustomerByEmailRepository;
  updateCustomerRepositoryStub: UpdateCustomerRepository;
}

const makeSut = (): SutTypes => {
  const loadCustomerByEmailRepositoryStub = makeLoadCustomerByEmailRepository();
  const updateCustomerRepositoryStub = makeUpdateCustomerRepository();

  const updateCustomerService = new UpdateCustomerService(loadCustomerByEmailRepositoryStub, updateCustomerRepositoryStub);

  return {
    updateCustomerService,
    loadCustomerByEmailRepositoryStub,
    updateCustomerRepositoryStub,
  };
};

describe('UpdateCustomerService', () => {
  describe('#execute', () => {
    it('should call LoadCustomerByEmailRepository with correct values if email is provided', async () => {
      const { updateCustomerService, loadCustomerByEmailRepositoryStub } = makeSut();
      const loadCustomerByEmailSpy = jest.spyOn(loadCustomerByEmailRepositoryStub, 'loadCustomerByEmail');

      const input = makeFakeInput();
      await updateCustomerService.execute(input);

      expect(loadCustomerByEmailSpy).toHaveBeenCalledWith(input.email);
    });

    it('should throw EmailAlreadyRegisteredError if email is already in use by another customer', async () => {
      const { updateCustomerService, loadCustomerByEmailRepositoryStub } = makeSut();

      const anotherFakeCustomer = new Customer({
        customerId: 'another_customer_id',
        name: 'another_customer_name',
        email: 'another_customer_email',
      });
      jest.spyOn(loadCustomerByEmailRepositoryStub, 'loadCustomerByEmail').mockResolvedValueOnce(anotherFakeCustomer);

      const input = makeFakeInput();
      const promise = updateCustomerService.execute(input);

      await expect(promise).rejects.toThrow(EmailAlreadyRegisteredError);
    });

    it('should call UpdateCustomerRepository with correct values', async () => {
      const { updateCustomerService, updateCustomerRepositoryStub } = makeSut();
      const updateCustomerSpy = jest.spyOn(updateCustomerRepositoryStub, 'updateCustomer');

      const input = makeFakeInput();
      await updateCustomerService.execute(input);

      const { customerId, ...data } = input;
      expect(updateCustomerSpy).toHaveBeenCalledWith(input.customerId, data);
    });

    it('should return the updated customer', async () => {
      const { updateCustomerService } = makeSut();

      const input = makeFakeInput();
      const customer = await updateCustomerService.execute(input);

      expect(customer).toEqual(fakeCustomer);
    });
  });
});
