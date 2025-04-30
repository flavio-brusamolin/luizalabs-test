import { AuthenticateCustomerService } from '../../../app/services/authenticate-customer-service';
import { AuthenticateCustomerController } from '../../../interfaces/http/controllers/authenticate-customer-controller';
import { Controller } from '../../../interfaces/http/controllers/controller';
import { buildCustomerRepository, buildJwtAdapter } from '../infra';

export const buildAuthenticateCustomerController = (): Controller => {
  const customerRepository = buildCustomerRepository();
  const jwtAdapter = buildJwtAdapter();
  const authenticateCustomerService = new AuthenticateCustomerService(customerRepository, jwtAdapter);
  return new AuthenticateCustomerController(authenticateCustomerService);
};
