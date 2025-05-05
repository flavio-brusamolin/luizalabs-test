import { SerializedCustomer } from '../../../domain/entities/customer';
import { AddCustomerInput, AddCustomerUseCase } from '../../../domain/use-cases/add-customer';
import { ErrorResponse, HttpRequest, HttpResponse } from '../contracts';
import { created, error } from '../helpers/http-response-builder';
import { Controller } from './controller';

type RequestBody = AddCustomerInput;
type ResponseBody = SerializedCustomer | ErrorResponse;

export class AddCustomerController implements Controller {
  constructor(private readonly addCustomerUseCase: AddCustomerUseCase) {}

  async handle(httpRequest: HttpRequest<RequestBody>): Promise<HttpResponse<ResponseBody>> {
    try {
      const customer = await this.addCustomerUseCase.execute(httpRequest.body);
      return created(customer.serialize());
    } catch (exception) {
      console.error(exception);
      return error(exception);
    }
  }
}
