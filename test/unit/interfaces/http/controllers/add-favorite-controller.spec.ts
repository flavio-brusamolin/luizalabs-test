import { AddFavoriteController } from '../../../../../src/interfaces/http/controllers/add-favorite-controller';
import { AddFavoriteUseCase } from '../../../../../src/domain/use-cases/add-favorite';
import { HttpRequest } from '../../../../../src/interfaces/http/contracts';
import { created, error } from '../../../../../src/interfaces/http/helpers/http-response-builder';
import { Product } from '../../../../../src/domain/entities/product';
import { ExistingFavoriteError } from '../../../../../src/domain/errors';

const fakeProduct = new Product({
  productId: 'valid_product_id',
  title: 'valid_product_title',
  image: 'http://valid_image_url.com',
  price: 100,
  reviewScore: 4.5,
});

const makeFakeRequest = (): HttpRequest<{ productId: string }, any, { customerId: string }> => ({
  customerId: 'valid_customer_id',
  body: {
    productId: 'valid_product_id',
  },
});

const makeAddFavoriteUseCase = (): AddFavoriteUseCase => {
  class AddFavoriteUseCaseStub implements AddFavoriteUseCase {
    async execute(_input: any): Promise<Product> {
      return fakeProduct;
    }
  }

  return new AddFavoriteUseCaseStub();
};

interface SutTypes {
  addFavoriteController: AddFavoriteController;
  addFavoriteUseCaseStub: AddFavoriteUseCase;
}

const makeSut = (): SutTypes => {
  const addFavoriteUseCaseStub = makeAddFavoriteUseCase();
  const addFavoriteController = new AddFavoriteController(addFavoriteUseCaseStub);

  return {
    addFavoriteController,
    addFavoriteUseCaseStub,
  };
};

describe('AddFavoriteController', () => {
  describe('#handle', () => {
    it('should call AddFavoriteUseCase with correct values', async () => {
      const { addFavoriteController, addFavoriteUseCaseStub } = makeSut();
      const executeSpy = jest.spyOn(addFavoriteUseCaseStub, 'execute');

      const httpRequest = makeFakeRequest();
      await addFavoriteController.handle(httpRequest);

      expect(executeSpy).toHaveBeenCalledWith({
        customerId: httpRequest.customerId,
        productId: httpRequest.body.productId,
      });
    });

    it('should return 201 and the favorited product on success', async () => {
      const { addFavoriteController } = makeSut();

      const httpRequest = makeFakeRequest();
      const httpResponse = await addFavoriteController.handle(httpRequest);

      expect(httpResponse).toEqual(created(fakeProduct));
    });

    it('should return the error response if use case throws', async () => {
      const { addFavoriteController, addFavoriteUseCaseStub } = makeSut();

      const exception = new ExistingFavoriteError();
      jest.spyOn(addFavoriteUseCaseStub, 'execute').mockRejectedValueOnce(exception);

      const httpRequest = makeFakeRequest();
      const httpResponse = await addFavoriteController.handle(httpRequest);

      expect(httpResponse).toEqual(error(exception));
    });
  });
});
