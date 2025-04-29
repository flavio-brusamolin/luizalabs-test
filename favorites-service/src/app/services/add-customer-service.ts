import { Customer } from '../../domain/entities/customer';
import { EmailAlreadyRegisteredError } from '../../domain/errors/email-already-registered-error';
import { AddCustomerInput, AddCustomerUseCase } from '../../domain/use-cases/add-customer';
import { AddCustomerRepository, LoadCustomerByEmailRepository } from '../contracts/database';

export class AddCustomerService implements AddCustomerUseCase {
  constructor(
    private readonly loadCustomerByEmailRepository: LoadCustomerByEmailRepository,
    private readonly addCustomerRepository: AddCustomerRepository
  ) {}

  async execute({ name, email }: AddCustomerInput): Promise<Customer> {
    const registeredCustomer = await this.loadCustomerByEmailRepository.loadCustomerByEmail(email);
    if (registeredCustomer) {
      throw new EmailAlreadyRegisteredError();
    }

    const newCustomer = new Customer({ name, email });
    return await this.addCustomerRepository.addCustomer(newCustomer);
  }
}
