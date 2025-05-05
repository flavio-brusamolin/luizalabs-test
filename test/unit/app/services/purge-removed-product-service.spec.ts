import { PurgeRemovedProductService } from '../../../../src/app/services/purge-removed-product-service';
import { PurgeFavoriteRepository } from '../../../../src/app/contracts/database';
import { RemoveProductCache } from '../../../../src/app/contracts/cache';

const makeFakeInput = () => ({
  productId: 'valid_product_id',
});

const makePurgeFavoriteRepository = (): PurgeFavoriteRepository => {
  class PurgeFavoriteRepositoryStub implements PurgeFavoriteRepository {
    async purgeFavorite(_productId: string): Promise<void> {}
  }

  return new PurgeFavoriteRepositoryStub();
};

const makeRemoveProductCache = (): RemoveProductCache => {
  class RemoveProductCacheStub implements RemoveProductCache {
    async removeProduct(_productId: string): Promise<void> {}
  }

  return new RemoveProductCacheStub();
};

interface SutTypes {
  purgeRemovedProductService: PurgeRemovedProductService;
  purgeFavoriteRepositoryStub: PurgeFavoriteRepository;
  removeProductCacheStub: RemoveProductCache;
}

const makeSut = (): SutTypes => {
  const purgeFavoriteRepositoryStub = makePurgeFavoriteRepository();
  const removeProductCacheStub = makeRemoveProductCache();

  const purgeRemovedProductService = new PurgeRemovedProductService(purgeFavoriteRepositoryStub, removeProductCacheStub);

  return {
    purgeRemovedProductService,
    purgeFavoriteRepositoryStub,
    removeProductCacheStub,
  };
};

describe('PurgeRemovedProductService', () => {
  describe('#execute', () => {
    it('should call PurgeFavoriteRepository with correct values', async () => {
      const { purgeRemovedProductService, purgeFavoriteRepositoryStub } = makeSut();
      const purgeFavoriteSpy = jest.spyOn(purgeFavoriteRepositoryStub, 'purgeFavorite');

      const input = makeFakeInput();
      await purgeRemovedProductService.execute(input);

      expect(purgeFavoriteSpy).toHaveBeenCalledWith(input.productId);
    });

    it('should call RemoveProductCache with correct values', async () => {
      const { purgeRemovedProductService, removeProductCacheStub } = makeSut();
      const removeProductSpy = jest.spyOn(removeProductCacheStub, 'removeProduct');

      const input = makeFakeInput();
      await purgeRemovedProductService.execute(input);

      expect(removeProductSpy).toHaveBeenCalledWith(input.productId);
    });
  });
});
