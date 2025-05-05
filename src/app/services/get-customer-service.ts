import { Customer, CustomerId } from '../../domain/entities/customer';
import { CustomerNotFoundError } from '../../domain/errors';
import { GetCustomerUseCase } from '../../domain/use-cases/get-customer';
import { LoadCustomerByIdRepository } from '../contracts/database';

export class GetCustomerService implements GetCustomerUseCase {
  constructor(private readonly loadCustomerByIdRepository: LoadCustomerByIdRepository) {}

  async execute(customerId: CustomerId): Promise<Customer> {
    console.log(`Loading customer ${customerId}`);
    const customer = await this.loadCustomerByIdRepository.loadCustomerById(customerId);

    if (!customer) {
      console.error(`Customer ${customerId} not found`);
      throw new CustomerNotFoundError();
    }

    return customer;
  }
}
