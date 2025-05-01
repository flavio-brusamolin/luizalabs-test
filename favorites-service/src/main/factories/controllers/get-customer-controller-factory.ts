import { GetCustomerService } from '../../../app/services/get-customer-service';
import { Controller } from '../../../interfaces/http/controllers/controller';
import { GetCustomerController } from '../../../interfaces/http/controllers/get-customer-controller';
import { buildCustomerRepository } from '../infra';

export const buildGetCustomerController = (): Controller => {
  const customerRepository = buildCustomerRepository();
  const getCustomerService = new GetCustomerService(customerRepository);
  return new GetCustomerController(getCustomerService);
};
