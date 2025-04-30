import { Token, AuthenticateCustomerInput, AuthenticateCustomerUseCase } from '../../../domain/use-cases/authenticate-customer';
import { ErrorResponse, HttpRequest, HttpResponse } from '../contracts';
import { error, ok } from '../helpers/http-response-builder';
import { Controller } from './controller';

type RequestBody = AuthenticateCustomerInput;
type ResponseBody = { accessToken: Token } | ErrorResponse;

export class AuthenticateCustomerController implements Controller {
  constructor(private readonly authenticateCustomerUseCase: AuthenticateCustomerUseCase) {}

  async handle(httpRequest: HttpRequest<RequestBody>): Promise<HttpResponse<ResponseBody>> {
    try {
      const accessToken = await this.authenticateCustomerUseCase.execute(httpRequest.body);
      return ok({ accessToken });
    } catch (exception) {
      console.error(exception);
      return error(exception);
    }
  }
}
