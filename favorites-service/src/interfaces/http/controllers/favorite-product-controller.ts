import { CustomerId } from '../../../domain/entities/customer';
import { Product, ProductId } from '../../../domain/entities/product';
import { FavoriteProductUseCase } from '../../../domain/use-cases/favorite-product';
import { ErrorResponse, HttpRequest, HttpResponse } from '../contracts';
import { created, error } from '../helpers/http-response-builder';
import { Controller } from './controller';

type RequestBody = { productId: ProductId };
type RequestParams = { customerId: CustomerId };
type ResponseBody = Product | ErrorResponse;

export class FavoriteProductController implements Controller {
  constructor(private readonly favoriteProductUseCase: FavoriteProductUseCase) {}

  async handle(httpRequest: HttpRequest<RequestBody, any, RequestParams>): Promise<HttpResponse<ResponseBody>> {
    const input = {
      customerId: httpRequest.params.customerId,
      productId: httpRequest.body.productId,
    };

    try {
      const product = await this.favoriteProductUseCase.execute(input);
      return created(product);
    } catch (exception) {
      console.error(exception);
      return error(exception);
    }
  }
}
