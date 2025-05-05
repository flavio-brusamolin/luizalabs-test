import { GetFavoritesService } from '../../../../src/app/services/get-favorites-service';
import { Product } from '../../../../src/domain/entities/product';
import { GetFavoritesRepository } from '../../../../src/app/contracts/database/get-favorites-repository';
import { GetProductCache } from '../../../../src/app/contracts/cache';
import { PublishStaleProductQueue } from '../../../../src/app/contracts/queue';

const makeFakeInput = () => ({
  customerId: 'valid_customer_id',
  page: 1,
  limit: 10,
});

const fakeProduct = new Product({
  productId: 'valid_product_id',
  title: 'any_product_title',
  image: 'http://any_image.com',
  price: 200,
  reviewScore: 4.2,
});

const fakeStaleProduct = new Product({
  productId: 'stale_product_id',
  title: 'any_product_title',
  image: 'http://any_image.com',
  price: 200,
  reviewScore: 4.2,
});

const makeGetFavoritesRepository = (): GetFavoritesRepository => {
  class GetFavoritesRepositoryStub implements GetFavoritesRepository {
    async getFavorites(_customerId: string, _page: number, _limit: number): Promise<string[]> {
      return ['valid_product_id', 'stale_product_id'];
    }
  }

  return new GetFavoritesRepositoryStub();
};

const makeGetProductCache = (): GetProductCache => {
  class GetProductCacheStub implements GetProductCache {
    async getProduct(productId: string): Promise<Product> {
      if (productId === 'valid_product_id') {
        return fakeProduct;
      }

      if (productId === 'stale_product_id') {
        fakeStaleProduct.markAsStale();
        return fakeStaleProduct;
      }
    }
  }

  return new GetProductCacheStub();
};

const makePublishStaleProductQueue = (): PublishStaleProductQueue => {
  class PublishStaleProductQueueStub implements PublishStaleProductQueue {
    async publishStaleProduct(_productId: string): Promise<void> {}
  }

  return new PublishStaleProductQueueStub();
};

interface SutTypes {
  getFavoritesService: GetFavoritesService;
  getFavoritesRepositoryStub: GetFavoritesRepository;
  getProductCacheStub: GetProductCache;
  publishStaleProductQueueStub: PublishStaleProductQueue;
}

const makeSut = (): SutTypes => {
  const getFavoritesRepositoryStub = makeGetFavoritesRepository();
  const getProductCacheStub = makeGetProductCache();
  const publishStaleProductQueueStub = makePublishStaleProductQueue();

  const getFavoritesService = new GetFavoritesService(
    getFavoritesRepositoryStub,
    getProductCacheStub,
    publishStaleProductQueueStub
  );

  return {
    getFavoritesService,
    getFavoritesRepositoryStub,
    getProductCacheStub,
    publishStaleProductQueueStub,
  };
};

describe('GetFavoritesService', () => {
  describe('#execute', () => {
    it('should call GetFavoritesRepository with correct values', async () => {
      const { getFavoritesService, getFavoritesRepositoryStub } = makeSut();
      const getFavoritesSpy = jest.spyOn(getFavoritesRepositoryStub, 'getFavorites');

      const input = makeFakeInput();
      await getFavoritesService.execute(input);

      expect(getFavoritesSpy).toHaveBeenCalledWith(input.customerId, input.page, input.limit);
    });

    it('should call GetProductCache for each product ID', async () => {
      const { getFavoritesService, getProductCacheStub } = makeSut();
      const getProductCacheSpy = jest.spyOn(getProductCacheStub, 'getProduct');

      const input = makeFakeInput();
      await getFavoritesService.execute(input);

      expect(getProductCacheSpy).toHaveBeenCalledWith('valid_product_id');
      expect(getProductCacheSpy).toHaveBeenCalledWith('stale_product_id');
    });

    it('should call PublishStaleProductQueue if product is stale', async () => {
      const { getFavoritesService, publishStaleProductQueueStub } = makeSut();
      const publishStaleProductSpy = jest.spyOn(publishStaleProductQueueStub, 'publishStaleProduct');

      const input = makeFakeInput();
      await getFavoritesService.execute(input);

      expect(publishStaleProductSpy).toHaveBeenCalledWith('stale_product_id');
    });

    it('should return the favorite products', async () => {
      const { getFavoritesService } = makeSut();

      const input = makeFakeInput();
      const products = await getFavoritesService.execute(input);

      expect(products).toEqual([fakeProduct, fakeStaleProduct]);
    });
  });
});
