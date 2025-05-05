import { StaleProductHandler } from '../../../../../src/interfaces/amqp/handlers/stale-product-handler';
import { UpdateStaleProductUseCase } from '../../../../../src/domain/use-cases/update-stale-product';
import { Message } from '../../../../../src/interfaces/amqp/handlers/handler';
import { ProductId } from '../../../../../src/domain/entities/product';

type StaleProductContent = { productId: ProductId };

const makeFakeMessage = (): Message<StaleProductContent> => ({
  content: { productId: 'valid_product_id' },
});

const makeUpdateStaleProductUseCase = (): UpdateStaleProductUseCase => {
  class UpdateStaleProductUseCaseStub implements UpdateStaleProductUseCase {
    async execute(_input: StaleProductContent): Promise<void> {}
  }

  return new UpdateStaleProductUseCaseStub();
};

interface SutTypes {
  staleProductHandler: StaleProductHandler;
  updateStaleProductUseCaseStub: UpdateStaleProductUseCase;
}

const makeSut = (): SutTypes => {
  const updateStaleProductUseCaseStub = makeUpdateStaleProductUseCase();
  const staleProductHandler = new StaleProductHandler(updateStaleProductUseCaseStub);

  return {
    staleProductHandler,
    updateStaleProductUseCaseStub,
  };
};

describe('StaleProductHandler', () => {
  describe('#handle', () => {
    it('should call UpdateStaleProductUseCase with correct values', async () => {
      const { staleProductHandler, updateStaleProductUseCaseStub } = makeSut();
      const executeSpy = jest.spyOn(updateStaleProductUseCaseStub, 'execute');

      const message = makeFakeMessage();
      await staleProductHandler.handle(message);

      expect(executeSpy).toHaveBeenCalledWith(message.content);
    });

    it('should throw if UpdateStaleProductUseCase throws', async () => {
      const { staleProductHandler, updateStaleProductUseCaseStub } = makeSut();

      const exception = new Error('any_error');
      jest.spyOn(updateStaleProductUseCaseStub, 'execute').mockRejectedValueOnce(exception);

      const message = makeFakeMessage();
      const promise = staleProductHandler.handle(message);

      await expect(promise).rejects.toThrow(exception);
    });
  });
});
