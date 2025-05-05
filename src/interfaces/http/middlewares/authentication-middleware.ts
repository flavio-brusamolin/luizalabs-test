import { CustomerId } from '../../../domain/entities/customer';
import { AuthenticationFailedError } from '../../../domain/errors';
import { ValidateCustomerAuthenticationUseCase } from '../../../domain/use-cases/validate-customer-authentication';
import { ErrorResponse, HttpRequest, HttpResponse } from '../contracts';
import { error, ok } from '../helpers/http-response-builder';
import { Middleware } from './middleware';

type RequestHeaders = { authorization?: string; 'x-access-token'?: string };
type ResponseBody = { customerId: CustomerId } | ErrorResponse;

export class AuthenticationMiddleware implements Middleware {
  private readonly TOKEN_PREFIX = 'Bearer ';

  constructor(private readonly validateCustomerAuthenticationUseCase: ValidateCustomerAuthenticationUseCase) {}

  async handle({ headers }: HttpRequest<any, RequestHeaders>): Promise<HttpResponse<ResponseBody>> {
    try {
      let token: string = headers?.['x-access-token'] || headers?.authorization;
      if (!token) {
        throw new AuthenticationFailedError();
      }

      if (token.startsWith(this.TOKEN_PREFIX)) {
        [, token] = token.split(this.TOKEN_PREFIX);
      }

      const customerId = await this.validateCustomerAuthenticationUseCase.execute(token);
      return ok({ customerId });
    } catch (exception) {
      console.error(exception);
      return error(exception);
    }
  }
}
