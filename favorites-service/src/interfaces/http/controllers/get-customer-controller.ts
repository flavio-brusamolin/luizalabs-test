import { SerializedCustomer } from '../../../domain/entities/customer';
import { GetCustomerUseCase } from '../../../domain/use-cases/get-customer';
import { ErrorResponse, HttpRequest, HttpResponse } from '../contracts';
import { error, ok } from '../helpers/http-response-builder';
import { Controller } from './controller';

type ResponseBody = SerializedCustomer | ErrorResponse;

export class GetCustomerController implements Controller {
  constructor(private readonly getCustomerUseCase: GetCustomerUseCase) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse<ResponseBody>> {
    try {
      const customer = await this.getCustomerUseCase.execute(httpRequest.customerId);
      return ok(customer.serialize());
    } catch (exception) {
      console.error(exception);
      return error(exception);
    }
  }
}
