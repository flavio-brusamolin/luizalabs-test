import { Product } from '../../../domain/entities/product';
import { GetFavoritesUseCase } from '../../../domain/use-cases/get-favorites';
import { ErrorResponse, HttpRequest, HttpResponse } from '../contracts';
import { error, ok } from '../helpers/http-response-builder';
import { Controller } from './controller';

type ResponseBody = Product[] | ErrorResponse;

export class GetFavoritesController implements Controller {
  constructor(private readonly getFavoritesUseCase: GetFavoritesUseCase) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse<ResponseBody>> {
    try {
      const favoriteProducts = await this.getFavoritesUseCase.execute(httpRequest.customerId);
      return ok(favoriteProducts);
    } catch (exception) {
      console.error(exception);
      return error(exception);
    }
  }
}
