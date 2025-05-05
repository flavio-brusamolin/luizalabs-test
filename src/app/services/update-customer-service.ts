import { Customer } from '../../domain/entities/customer';
import { EmailAlreadyRegisteredError } from '../../domain/errors';
import { UpdateCustomerInput, UpdateCustomerUseCase } from '../../domain/use-cases/update-customer';
import { LoadCustomerByEmailRepository, UpdateCustomerRepository } from '../contracts/database';

export class UpdateCustomerService implements UpdateCustomerUseCase {
  constructor(
    private readonly loadCustomerByEmailRepository: LoadCustomerByEmailRepository,
    private readonly updateCustomerRepository: UpdateCustomerRepository
  ) {}

  async execute({ customerId, ...customerProps }: UpdateCustomerInput): Promise<Customer> {
    if (customerProps.email) {
      const registeredCustomer = await this.loadCustomerByEmailRepository.loadCustomerByEmail(customerProps.email);
      if (registeredCustomer && registeredCustomer.customerId !== customerId) {
        console.error(`Chosen email ${customerProps.email} is already in use`);
        throw new EmailAlreadyRegisteredError();
      }
    }

    console.log(`Updating customer ${customerId}`);
    return await this.updateCustomerRepository.updateCustomer(customerId, customerProps);
  }
}
