import { ProductId } from '../../../domain/entities/product';
import { RemoveFavoriteUseCase } from '../../../domain/use-cases/remove-favorite';
import { ErrorResponse, HttpRequest, HttpResponse } from '../contracts';
import { error, noContent } from '../helpers/http-response-builder';
import { Controller } from './controller';

type RequestParams = { productId: ProductId };

export class RemoveFavoriteController implements Controller {
  constructor(private readonly removeFavoriteUseCase: RemoveFavoriteUseCase) {}

  async handle(httpRequest: HttpRequest<any, any, RequestParams>): Promise<HttpResponse<ErrorResponse>> {
    const input = {
      customerId: httpRequest.customerId,
      productId: httpRequest.params.productId,
    };

    try {
      await this.removeFavoriteUseCase.execute(input);
      return noContent();
    } catch (exception) {
      console.error(exception);
      return error(exception);
    }
  }
}
