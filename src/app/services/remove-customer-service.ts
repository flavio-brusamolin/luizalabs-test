import { CustomerId } from '../../domain/entities/customer';
import { RemoveCustomerUseCase } from '../../domain/use-cases/remove-customer';
import { RemoveCustomerRepository } from '../contracts/database';

export class RemoveCustomerService implements RemoveCustomerUseCase {
  constructor(private readonly removeCustomerRepository: RemoveCustomerRepository) {}

  async execute(customerId: CustomerId): Promise<void> {
    console.log(`Removing customer ${customerId}`);
    await this.removeCustomerRepository.removeCustomer(customerId);
  }
}
