import { RemoveCustomerService } from '../../../../src/app/services/remove-customer-service';
import { RemoveCustomerRepository } from '../../../../src/app/contracts/database';
import { CustomerId } from '../../../../src/domain/entities/customer';

const makeFakeInput = (): CustomerId => 'valid_customer_id';

const makeRemoveCustomerRepository = (): RemoveCustomerRepository => {
  class RemoveCustomerRepositoryStub implements RemoveCustomerRepository {
    async removeCustomer(_customerId: CustomerId): Promise<void> {}
  }

  return new RemoveCustomerRepositoryStub();
};

interface SutTypes {
  removeCustomerService: RemoveCustomerService;
  removeCustomerRepositoryStub: RemoveCustomerRepository;
}

const makeSut = (): SutTypes => {
  const removeCustomerRepositoryStub = makeRemoveCustomerRepository();

  const removeCustomerService = new RemoveCustomerService(removeCustomerRepositoryStub);

  return {
    removeCustomerService,
    removeCustomerRepositoryStub,
  };
};

describe('RemoveCustomerService', () => {
  describe('#execute', () => {
    it('should call RemoveCustomerRepository with correct values', async () => {
      const { removeCustomerService, removeCustomerRepositoryStub } = makeSut();
      const removeCustomerSpy = jest.spyOn(removeCustomerRepositoryStub, 'removeCustomer');

      const input = makeFakeInput();
      await removeCustomerService.execute(input);

      expect(removeCustomerSpy).toHaveBeenCalledWith(input);
    });
  });
});
