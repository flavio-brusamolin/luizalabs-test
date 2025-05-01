import { DEFAULT_LIMIT, DEFAULT_PAGE } from '../config/constants';
import { Product } from '../../../domain/entities/product';
import { GetFavoritesUseCase } from '../../../domain/use-cases/get-favorites';
import { ErrorResponse, HttpRequest, HttpResponse } from '../contracts';
import { error, ok } from '../helpers/http-response-builder';
import { Controller } from './controller';

type RequestQuery = { page: number; limit: number };
type ResponseBody = Product[] | ErrorResponse;

export class GetFavoritesController implements Controller {
  constructor(private readonly getFavoritesUseCase: GetFavoritesUseCase) {}

  async handle(httpRequest: HttpRequest<any, any, any, RequestQuery>): Promise<HttpResponse<ResponseBody>> {
    const input = {
      customerId: httpRequest.customerId,
      page: httpRequest.query.page || DEFAULT_PAGE,
      limit: httpRequest.query.limit || DEFAULT_LIMIT,
    };

    try {
      const favoriteProducts = await this.getFavoritesUseCase.execute(input);
      return ok(favoriteProducts);
    } catch (exception) {
      console.error(exception);
      return error(exception);
    }
  }
}
