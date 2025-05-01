import { Middleware } from '../../../interfaces/http/middlewares/middleware';
import { JoiAdapter } from '../../../infra/validation/joi-adapter';
import { ValidationMiddleware } from '../../../interfaces/http/middlewares/validation-middleware';
import { RequestSchema } from '../../../infra/validation/request-schema';

export const buildValidationMiddleware = (schema: RequestSchema): Middleware => {
  const joiAdapter = new JoiAdapter(schema);
  return new ValidationMiddleware(joiAdapter);
};
