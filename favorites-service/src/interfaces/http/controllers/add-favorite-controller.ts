import { CustomerId } from '../../../domain/entities/customer';
import { Product, ProductId } from '../../../domain/entities/product';
import { AddFavoriteUseCase } from '../../../domain/use-cases/add-favorite';
import { ErrorResponse, HttpRequest, HttpResponse } from '../contracts';
import { created, error } from '../helpers/http-response-builder';
import { Controller } from './controller';

type RequestBody = { productId: ProductId };
type RequestParams = { customerId: CustomerId };
type ResponseBody = Product | ErrorResponse;

export class AddFavoriteController implements Controller {
  constructor(private readonly addFavoriteUseCase: AddFavoriteUseCase) {}

  async handle(httpRequest: HttpRequest<RequestBody, any, RequestParams>): Promise<HttpResponse<ResponseBody>> {
    const input = {
      customerId: httpRequest.customerId,
      productId: httpRequest.body.productId,
    };

    try {
      const product = await this.addFavoriteUseCase.execute(input);
      return created(product);
    } catch (exception) {
      console.error(exception);
      return error(exception);
    }
  }
}
