import { RemovedProductHandler } from '../../../../../src/interfaces/amqp/handlers/removed-product-handler';
import { PurgeRemovedProductUseCase } from '../../../../../src/domain/use-cases/purge-removed-product';
import { Message } from '../../../../../src/interfaces/amqp/handlers/handler';
import { ProductId } from '../../../../../src/domain/entities/product';

type RemovedProductContent = { productId: ProductId };

const makeFakeMessage = (): Message<RemovedProductContent> => ({
  content: { productId: 'valid_product_id' },
});

const makePurgeRemovedProductUseCase = (): PurgeRemovedProductUseCase => {
  class PurgeRemovedProductUseCaseStub implements PurgeRemovedProductUseCase {
    async execute(_input: RemovedProductContent): Promise<void> {}
  }

  return new PurgeRemovedProductUseCaseStub();
};

interface SutTypes {
  removedProductHandler: RemovedProductHandler;
  purgeRemovedProductUseCaseStub: PurgeRemovedProductUseCase;
}

const makeSut = (): SutTypes => {
  const purgeRemovedProductUseCaseStub = makePurgeRemovedProductUseCase();
  const removedProductHandler = new RemovedProductHandler(purgeRemovedProductUseCaseStub);

  return {
    removedProductHandler,
    purgeRemovedProductUseCaseStub,
  };
};

describe('RemovedProductHandler', () => {
  describe('#handle', () => {
    it('should call PurgeRemovedProductUseCase with correct values', async () => {
      const { removedProductHandler, purgeRemovedProductUseCaseStub } = makeSut();
      const executeSpy = jest.spyOn(purgeRemovedProductUseCaseStub, 'execute');

      const message = makeFakeMessage();
      await removedProductHandler.handle(message);

      expect(executeSpy).toHaveBeenCalledWith(message.content);
    });

    it('should throw if PurgeRemovedProductUseCase throws', async () => {
      const { removedProductHandler, purgeRemovedProductUseCaseStub } = makeSut();

      const exception = new Error('any_error');
      jest.spyOn(purgeRemovedProductUseCaseStub, 'execute').mockRejectedValueOnce(exception);

      const message = makeFakeMessage();
      const promise = removedProductHandler.handle(message);

      await expect(promise).rejects.toThrow(exception);
    });
  });
});
