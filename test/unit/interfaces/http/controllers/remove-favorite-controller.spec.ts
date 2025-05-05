import { RemoveFavoriteController } from '../../../../../src/interfaces/http/controllers/remove-favorite-controller';
import { RemoveFavoriteUseCase } from '../../../../../src/domain/use-cases/remove-favorite';
import { HttpRequest } from '../../../../../src/interfaces/http/contracts';
import { noContent, error } from '../../../../../src/interfaces/http/helpers/http-response-builder';
import { FavoriteNotFoundError } from '../../../../../src/domain/errors';

const makeFakeRequest = (): HttpRequest<any, any, { productId: string }> => ({
  customerId: 'valid_customer_id',
  params: {
    productId: 'valid_product_id',
  },
});

const makeRemoveFavoriteUseCase = (): RemoveFavoriteUseCase => {
  class RemoveFavoriteUseCaseStub implements RemoveFavoriteUseCase {
    async execute(_input: any): Promise<void> {}
  }

  return new RemoveFavoriteUseCaseStub();
};

interface SutTypes {
  removeFavoriteController: RemoveFavoriteController;
  removeFavoriteUseCaseStub: RemoveFavoriteUseCase;
}

const makeSut = (): SutTypes => {
  const removeFavoriteUseCaseStub = makeRemoveFavoriteUseCase();
  const removeFavoriteController = new RemoveFavoriteController(removeFavoriteUseCaseStub);

  return {
    removeFavoriteController,
    removeFavoriteUseCaseStub,
  };
};

describe('RemoveFavoriteController', () => {
  describe('#handle', () => {
    it('should call RemoveFavoriteUseCase with correct values', async () => {
      const { removeFavoriteController, removeFavoriteUseCaseStub } = makeSut();
      const executeSpy = jest.spyOn(removeFavoriteUseCaseStub, 'execute');

      const httpRequest = makeFakeRequest();
      await removeFavoriteController.handle(httpRequest);

      expect(executeSpy).toHaveBeenCalledWith({
        customerId: httpRequest.customerId,
        productId: httpRequest.params.productId,
      });
    });

    it('should return 204 on success', async () => {
      const { removeFavoriteController } = makeSut();

      const httpRequest = makeFakeRequest();
      const httpResponse = await removeFavoriteController.handle(httpRequest);

      expect(httpResponse).toEqual(noContent());
    });

    it('should return the error response if use case throws', async () => {
      const { removeFavoriteController, removeFavoriteUseCaseStub } = makeSut();

      const exception = new FavoriteNotFoundError();
      jest.spyOn(removeFavoriteUseCaseStub, 'execute').mockRejectedValueOnce(exception);

      const httpRequest = makeFakeRequest();
      const httpResponse = await removeFavoriteController.handle(httpRequest);

      expect(httpResponse).toEqual(error(exception));
    });
  });
});
