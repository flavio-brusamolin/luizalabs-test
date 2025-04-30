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
      console.error(`Chosen email ${email} is already in use`);
      throw new EmailAlreadyRegisteredError();
    }

    const newCustomer = new Customer({ name, email });

    console.log(`Adding customer ${name} with ID ${newCustomer.customerId}`);
    return await this.addCustomerRepository.addCustomer(newCustomer);
  }
}
