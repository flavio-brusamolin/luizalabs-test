import { RemoveCustomerUseCase } from '../../../domain/use-cases/remove-customer';
import { ErrorResponse, HttpRequest, HttpResponse } from '../contracts';
import { error, noContent } from '../helpers/http-response-builder';
import { Controller } from './controller';

type ResponseBody = ErrorResponse;

export class RemoveCustomerController implements Controller {
  constructor(private readonly removeCustomerUseCase: RemoveCustomerUseCase) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse<ResponseBody>> {
    try {
      await this.removeCustomerUseCase.execute(httpRequest.customerId);
      return noContent();
    } catch (exception) {
      console.error(exception);
      return error(exception);
    }
  }
}
