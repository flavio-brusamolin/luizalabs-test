import { SerializedCustomer } from '../../../domain/entities/customer';
import { CustomerProps, UpdateCustomerUseCase } from '../../../domain/use-cases/update-customer';
import { ErrorResponse, HttpRequest, HttpResponse } from '../contracts';
import { error, ok } from '../helpers/http-response-builder';
import { Controller } from './controller';

type RequestBody = CustomerProps;
type ResponseBody = SerializedCustomer | ErrorResponse;

export class UpdateCustomerController implements Controller {
  constructor(private readonly updateCustomerUseCase: UpdateCustomerUseCase) {}

  async handle(httpRequest: HttpRequest<RequestBody>): Promise<HttpResponse<ResponseBody>> {
    const input = {
      ...httpRequest.body,
      customerId: httpRequest.customerId,
    };

    try {
      const customer = await this.updateCustomerUseCase.execute(input);
      return ok(customer.serialize());
    } catch (exception) {
      console.error(exception);
      return error(exception);
    }
  }
}
