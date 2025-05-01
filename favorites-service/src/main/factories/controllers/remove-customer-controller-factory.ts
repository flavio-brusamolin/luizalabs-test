import { RemoveCustomerService } from '../../../app/services/remove-customer-service';
import { Controller } from '../../../interfaces/http/controllers/controller';
import { RemoveCustomerController } from '../../../interfaces/http/controllers/remove-customer-controller';
import { buildCustomerRepository } from '../infra';

export const buildRemoveCustomerController = (): Controller => {
  const customerRepository = buildCustomerRepository();
  const removeCustomerService = new RemoveCustomerService(customerRepository, customerRepository);
  return new RemoveCustomerController(removeCustomerService);
};
