import { AddCustomerService } from '../../../app/services/add-customer-service';
import { CustomerRepository } from '../../../infra/database/customer-repository';
import { AddCustomerController } from '../../../interfaces/http/controllers/add-customer-controller';
import { Controller } from '../../../interfaces/http/controllers/controller';

export const buildAddCustomerController = (): Controller => {
  const customerRepository = new CustomerRepository();
  const addCustomerService = new AddCustomerService(customerRepository, customerRepository);
  return new AddCustomerController(addCustomerService);
};
