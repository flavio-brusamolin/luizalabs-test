import { GetCustomerService } from '../../../../src/app/services/get-customer-service';
import { CustomerNotFoundError } from '../../../../src/domain/errors';
import { LoadCustomerByIdRepository } from '../../../../src/app/contracts/database';
import { Customer, CustomerId } from '../../../../src/domain/entities/customer';

const makeFakeInput = (): CustomerId => 'valid_customer_id';

const fakeCustomer = new Customer({
  name: 'any_customer_name',
  email: 'any_customer_email',
});

const makeLoadCustomerByIdRepository = (): LoadCustomerByIdRepository => {
  class LoadCustomerByIdRepositoryStub implements LoadCustomerByIdRepository {
    async loadCustomerById(_customerId: CustomerId): Promise<Customer> {
      return fakeCustomer;
    }
  }

  return new LoadCustomerByIdRepositoryStub();
};

interface SutTypes {
  getCustomerService: GetCustomerService;
  loadCustomerByIdRepositoryStub: LoadCustomerByIdRepository;
}

const makeSut = (): SutTypes => {
  const loadCustomerByIdRepositoryStub = makeLoadCustomerByIdRepository();

  const getCustomerService = new GetCustomerService(loadCustomerByIdRepositoryStub);

  return {
    getCustomerService,
    loadCustomerByIdRepositoryStub,
  };
};

describe('GetCustomerService', () => {
  describe('#execute', () => {
    it('should call LoadCustomerByIdRepository with correct values', async () => {
      const { getCustomerService, loadCustomerByIdRepositoryStub } = makeSut();
      const loadCustomerByIdSpy = jest.spyOn(loadCustomerByIdRepositoryStub, 'loadCustomerById');

      const input = makeFakeInput();
      await getCustomerService.execute(input);

      expect(loadCustomerByIdSpy).toHaveBeenCalledWith(input);
    });

    it('should throw CustomerNotFoundError if customer is not found', async () => {
      const { getCustomerService, loadCustomerByIdRepositoryStub } = makeSut();
      jest.spyOn(loadCustomerByIdRepositoryStub, 'loadCustomerById').mockResolvedValueOnce(null);

      const input = makeFakeInput();
      const promise = getCustomerService.execute(input);

      await expect(promise).rejects.toThrow(CustomerNotFoundError);
    });

    it('should return the customer', async () => {
      const { getCustomerService } = makeSut();

      const input = makeFakeInput();
      const customer = await getCustomerService.execute(input);

      expect(customer).toEqual(fakeCustomer);
    });
  });
});
