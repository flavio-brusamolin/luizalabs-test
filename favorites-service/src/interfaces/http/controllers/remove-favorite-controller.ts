import { CustomerId } from '../../../domain/entities/customer';
import { ProductId } from '../../../domain/entities/product';
import { RemoveFavoriteUseCase } from '../../../domain/use-cases/remove-favorite';
import { ErrorResponse, HttpRequest, HttpResponse } from '../contracts';
import { error, noContent } from '../helpers/http-response-builder';
import { Controller } from './controller';

type RequestParams = { customerId: CustomerId; productId: ProductId };

export class RemoveFavoriteController implements Controller {
  constructor(private readonly removeFavoriteUseCase: RemoveFavoriteUseCase) {}

  async handle(httpRequest: HttpRequest<any, any, RequestParams>): Promise<HttpResponse<ErrorResponse>> {
    try {
      await this.removeFavoriteUseCase.execute(httpRequest.params);
      return noContent();
    } catch (exception) {
      console.error(exception);
      return error(exception);
    }
  }
}
