import { SendCustomerEmailService } from '../../../app/services/send-customer-email-service';
import { CreatedCustomerHandler } from '../../../interfaces/amqp/handlers/created-customer-handler';
import { Handler } from '../../../interfaces/amqp/handlers/handler';
import { buildEmailProvider } from '../infra';

export const buildCreatedCustomerHandler = (): Handler => {
  const emailProvider = buildEmailProvider();
  const sendCustomerEmailService = new SendCustomerEmailService(emailProvider);
  return new CreatedCustomerHandler(sendCustomerEmailService);
};
