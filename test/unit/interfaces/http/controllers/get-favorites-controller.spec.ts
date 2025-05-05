import { GetFavoritesController } from '../../../../../src/interfaces/http/controllers/get-favorites-controller';
import { GetFavoritesUseCase } from '../../../../../src/domain/use-cases/get-favorites';
import { HttpRequest } from '../../../../../src/interfaces/http/contracts';
import { ok, error } from '../../../../../src/interfaces/http/helpers/http-response-builder';
import { Product } from '../../../../../src/domain/entities/product';
import { AuthenticationFailedError } from '../../../../../src/domain/errors';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '../../../../../src/interfaces/http/config/constants';

const fakeProducts: Product[] = [
  new Product({
    productId: 'product_1',
    title: 'Product 1',
    image: 'http://image1.com',
    price: 100,
    reviewScore: 4.5,
  }),
  new Product({
    productId: 'product_2',
    title: 'Product 2',
    image: 'http://image2.com',
    price: 200,
    reviewScore: 4.0,
  }),
];

type GetFavoritesHttpRequest = HttpRequest<any, any, any, { page: number; limit: number }>;

const makeFakeRequest = (): GetFavoritesHttpRequest => ({
  customerId: 'valid_customer_id',
  query: {
    page: 1,
    limit: 10,
  },
});

const makeGetFavoritesUseCase = (): GetFavoritesUseCase => {
  class GetFavoritesUseCaseStub implements GetFavoritesUseCase {
    async execute(_input: any): Promise<Product[]> {
      return fakeProducts;
    }
  }

  return new GetFavoritesUseCaseStub();
};

interface SutTypes {
  getFavoritesController: GetFavoritesController;
  getFavoritesUseCaseStub: GetFavoritesUseCase;
}

const makeSut = (): SutTypes => {
  const getFavoritesUseCaseStub = makeGetFavoritesUseCase();
  const getFavoritesController = new GetFavoritesController(getFavoritesUseCaseStub);

  return {
    getFavoritesController,
    getFavoritesUseCaseStub,
  };
};

describe('GetFavoritesController', () => {
  describe('#handle', () => {
    it('should call GetFavoritesUseCase with correct values', async () => {
      const { getFavoritesController, getFavoritesUseCaseStub } = makeSut();
      const executeSpy = jest.spyOn(getFavoritesUseCaseStub, 'execute');

      const httpRequest = makeFakeRequest();
      await getFavoritesController.handle(httpRequest);

      expect(executeSpy).toHaveBeenCalledWith({
        customerId: httpRequest.customerId,
        page: httpRequest.query.page,
        limit: httpRequest.query.limit,
      });
    });

    it('should return 200 and the list of favorite products on success', async () => {
      const { getFavoritesController } = makeSut();

      const httpRequest = makeFakeRequest();
      const httpResponse = await getFavoritesController.handle(httpRequest);

      expect(httpResponse).toEqual(ok(fakeProducts));
    });

    it('should return the error response if use case throws', async () => {
      const { getFavoritesController, getFavoritesUseCaseStub } = makeSut();

      const exception = new AuthenticationFailedError();
      jest.spyOn(getFavoritesUseCaseStub, 'execute').mockRejectedValueOnce(exception);

      const httpRequest = makeFakeRequest();
      const httpResponse = await getFavoritesController.handle(httpRequest);

      expect(httpResponse).toEqual(error(exception));
    });

    it('should use default page and limit if not provided in query', async () => {
      const { getFavoritesController, getFavoritesUseCaseStub } = makeSut();
      const executeSpy = jest.spyOn(getFavoritesUseCaseStub, 'execute');

      const httpRequest = { customerId: 'valid_customer_id', query: {} } as GetFavoritesHttpRequest;
      await getFavoritesController.handle(httpRequest);

      expect(executeSpy).toHaveBeenCalledWith({
        customerId: httpRequest.customerId,
        page: DEFAULT_PAGE,
        limit: DEFAULT_LIMIT,
      });
    });
  });
});
