import { ValidateCustomerAuthenticationService } from '../../../app/services/validate-customer-authentication-service';
import { AuthenticationMiddleware } from '../../../interfaces/http/middlewares/authentication-middleware';
import { Middleware } from '../../../interfaces/http/middlewares/middleware';
import { buildJwtAdapter } from '../infra';

export const buildAuthenticationMiddleware = (): Middleware => {
  const jwtAdapter = buildJwtAdapter();
  const validateCustomerAuthenticationService = new ValidateCustomerAuthenticationService(jwtAdapter);
  return new AuthenticationMiddleware(validateCustomerAuthenticationService);
};
