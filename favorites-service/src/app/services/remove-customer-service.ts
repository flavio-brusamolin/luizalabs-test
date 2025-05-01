import { CustomerId } from '../../domain/entities/customer';
import { CustomerNotFoundError } from '../../domain/errors';
import { RemoveCustomerUseCase } from '../../domain/use-cases/remove-customer';
import { LoadCustomerByIdRepository, RemoveCustomerRepository } from '../contracts/database';

export class RemoveCustomerService implements RemoveCustomerUseCase {
  constructor(
    private readonly loadCustomerByIdRepository: LoadCustomerByIdRepository,
    private readonly removeCustomerRepository: RemoveCustomerRepository
  ) {}

  async execute(customerId: CustomerId): Promise<void> {
    console.log(`Loading customer ${customerId}`);
    const customer = await this.loadCustomerByIdRepository.loadCustomerById(customerId);

    if (!customer) {
      console.error(`Customer ${customerId} not found`);
      throw new CustomerNotFoundError();
    }

    console.log(`Removing customer ${customerId}`);
    await this.removeCustomerRepository.removeCustomer(customerId);
  }
}
