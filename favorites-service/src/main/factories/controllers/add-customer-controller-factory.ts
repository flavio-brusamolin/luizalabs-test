import { AddCustomerService } from '../../../app/services/add-customer-service';
import { AddCustomerController } from '../../../interfaces/http/controllers/add-customer-controller';
import { Controller } from '../../../interfaces/http/controllers/controller';
import { buildCustomerRepository } from '../infra';

export const buildAddCustomerController = (): Controller => {
  const customerRepository = buildCustomerRepository();
  const addCustomerService = new AddCustomerService(customerRepository, customerRepository);
  return new AddCustomerController(addCustomerService);
};
