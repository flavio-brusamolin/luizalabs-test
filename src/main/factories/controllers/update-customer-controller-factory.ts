import { UpdateCustomerService } from '../../../app/services/update-customer-service';
import { Controller } from '../../../interfaces/http/controllers/controller';
import { UpdateCustomerController } from '../../../interfaces/http/controllers/update-customer-controller';
import { buildCustomerRepository } from '../infra';

export const buildUpdateCustomerController = (): Controller => {
  const customerRepository = buildCustomerRepository();
  const updateCustomerService = new UpdateCustomerService(customerRepository, customerRepository);
  return new UpdateCustomerController(updateCustomerService);
};
