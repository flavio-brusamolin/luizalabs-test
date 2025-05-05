import { AddCustomerService } from '../../../app/services/add-customer-service';
import { AddCustomerController } from '../../../interfaces/http/controllers/add-customer-controller';
import { Controller } from '../../../interfaces/http/controllers/controller';
import { buildCustomerRepository, buildMessageQueueClient } from '../infra';

export const buildAddCustomerController = (): Controller => {
  const customerRepository = buildCustomerRepository();
  const messageQueueClient = buildMessageQueueClient();
  const addCustomerService = new AddCustomerService(customerRepository, customerRepository, messageQueueClient);
  return new AddCustomerController(addCustomerService);
};
