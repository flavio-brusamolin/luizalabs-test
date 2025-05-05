import { AddFavoriteService } from '../../../../src/app/services/add-favorite-service';
import { ExistingFavoriteError, ProductNotFoundError } from '../../../../src/domain/errors';
import { Product } from '../../../../src/domain/entities/product';
import { CheckFavoriteRepository, AddFavoriteRepository } from '../../../../src/app/contracts/database';
import { GetProductCache, AddProductCache } from '../../../../src/app/contracts/cache';
import { GetProductClient } from '../../../../src/app/contracts/integration';
import { PublishStaleProductQueue } from '../../../../src/app/contracts/queue';

const makeFakeInput = () => ({
  customerId: 'valid_customer_id',
  productId: 'valid_product_id',
});

const fakeProduct = new Product({
  productId: 'any_product_id',
  title: 'any_product_title',
  image: 'http://any_image.com',
  price: 200,
  reviewScore: 4.2,
});

const makeCheckFavoriteRepository = (): CheckFavoriteRepository => {
  class CheckFavoriteRepositoryStub implements CheckFavoriteRepository {
    async isFavorite(_customerId: string, _productId: string): Promise<boolean> {
      return false;
    }
  }

  return new CheckFavoriteRepositoryStub();
};

const makeGetProductCache = (): GetProductCache => {
  class GetProductCacheStub implements GetProductCache {
    async getProduct(_productId: string): Promise<Product> {
      return null;
    }
  }

  return new GetProductCacheStub();
};

const makeAddFavoriteRepository = (): AddFavoriteRepository => {
  class AddFavoriteRepositoryStub implements AddFavoriteRepository {
    async addFavorite(_customerId: string, _productId: string): Promise<void> {}
  }

  return new AddFavoriteRepositoryStub();
};

const makePublishStaleProductQueue = (): PublishStaleProductQueue => {
  class PublishStaleProductQueueStub implements PublishStaleProductQueue {
    async publishStaleProduct(_productId: string): Promise<void> {}
  }

  return new PublishStaleProductQueueStub();
};

const makeGetProductClient = (): GetProductClient => {
  class GetProductClientStub implements GetProductClient {
    async getProduct(_productId: string): Promise<Product> {
      return fakeProduct;
    }
  }

  return new GetProductClientStub();
};

const makeAddProductCache = (): AddProductCache => {
  class AddProductCacheStub implements AddProductCache {
    async addProduct(_product: Product): Promise<void> {}
  }

  return new AddProductCacheStub();
};

interface SutTypes {
  addFavoriteService: AddFavoriteService;
  checkFavoriteRepositoryStub: CheckFavoriteRepository;
  getProductCacheStub: GetProductCache;
  addFavoriteRepositoryStub: AddFavoriteRepository;
  publishStaleProductQueueStub: PublishStaleProductQueue;
  getProductClientStub: GetProductClient;
  addProductCacheStub: AddProductCache;
}

const makeSut = (): SutTypes => {
  const checkFavoriteRepositoryStub = makeCheckFavoriteRepository();
  const getProductCacheStub = makeGetProductCache();
  const addFavoriteRepositoryStub = makeAddFavoriteRepository();
  const publishStaleProductQueueStub = makePublishStaleProductQueue();
  const getProductClientStub = makeGetProductClient();
  const addProductCacheStub = makeAddProductCache();

  const addFavoriteService = new AddFavoriteService(
    checkFavoriteRepositoryStub,
    getProductCacheStub,
    addFavoriteRepositoryStub,
    publishStaleProductQueueStub,
    getProductClientStub,
    addProductCacheStub
  );

  return {
    addFavoriteService,
    checkFavoriteRepositoryStub,
    getProductCacheStub,
    addFavoriteRepositoryStub,
    publishStaleProductQueueStub,
    getProductClientStub,
    addProductCacheStub,
  };
};

describe('AddFavoriteService', () => {
  describe('#execute', () => {
    it('should call CheckFavoriteRepository with correct values', async () => {
      const { addFavoriteService, checkFavoriteRepositoryStub } = makeSut();
      const checkFavoriteSpy = jest.spyOn(checkFavoriteRepositoryStub, 'isFavorite');

      const input = makeFakeInput();
      await addFavoriteService.execute(input);

      expect(checkFavoriteSpy).toHaveBeenCalledWith(input.customerId, input.productId);
    });

    it('should throw ExistingFavoriteError if product is already favorited', async () => {
      const { addFavoriteService, checkFavoriteRepositoryStub } = makeSut();
      jest.spyOn(checkFavoriteRepositoryStub, 'isFavorite').mockResolvedValueOnce(true);

      const input = makeFakeInput();
      const promise = addFavoriteService.execute(input);

      await expect(promise).rejects.toThrow(ExistingFavoriteError);
    });

    it('should call GetProductCache with correct values', async () => {
      const { addFavoriteService, getProductCacheStub } = makeSut();
      const getProductCacheSpy = jest.spyOn(getProductCacheStub, 'getProduct');

      const input = makeFakeInput();
      await addFavoriteService.execute(input);

      expect(getProductCacheSpy).toHaveBeenCalledWith(input.productId);
    });

    it('should call GetProductClient if product is not in cache', async () => {
      const { addFavoriteService, getProductClientStub } = makeSut();
      const getProductClientSpy = jest.spyOn(getProductClientStub, 'getProduct');

      const input = makeFakeInput();
      await addFavoriteService.execute(input);

      expect(getProductClientSpy).toHaveBeenCalledWith(input.productId);
    });

    it('should throw ProductNotFoundError if product does not exist', async () => {
      const { addFavoriteService, getProductClientStub } = makeSut();
      jest.spyOn(getProductClientStub, 'getProduct').mockResolvedValueOnce(null);

      const input = makeFakeInput();
      const promise = addFavoriteService.execute(input);

      await expect(promise).rejects.toThrow(ProductNotFoundError);
    });

    it('should call AddFavoriteRepository and AddProductCache if product is fetched from API', async () => {
      const { addFavoriteService, addFavoriteRepositoryStub, addProductCacheStub } = makeSut();
      const addFavoriteSpy = jest.spyOn(addFavoriteRepositoryStub, 'addFavorite');
      const addProductCacheSpy = jest.spyOn(addProductCacheStub, 'addProduct');

      const input = makeFakeInput();
      await addFavoriteService.execute(input);

      expect(addFavoriteSpy).toHaveBeenCalledWith(input.customerId, input.productId);
      expect(addProductCacheSpy).toHaveBeenCalledWith(fakeProduct);
    });

    it('should return the product if it is fetched from API', async () => {
      const { addFavoriteService } = makeSut();

      const input = makeFakeInput();
      const product = await addFavoriteService.execute(input);

      expect(product).toEqual(fakeProduct);
    });

    it('should call PublishStaleProductQueue if product is stale in cache', async () => {
      const { addFavoriteService, getProductCacheStub, publishStaleProductQueueStub } = makeSut();

      fakeProduct.markAsStale();
      jest.spyOn(getProductCacheStub, 'getProduct').mockResolvedValueOnce(fakeProduct);
      const publishStaleProductSpy = jest.spyOn(publishStaleProductQueueStub, 'publishStaleProduct');

      const input = makeFakeInput();
      await addFavoriteService.execute(input);

      expect(publishStaleProductSpy).toHaveBeenCalledWith(input.productId);
    });

    it('should call AddFavoriteRepository if product is found in cache', async () => {
      const { addFavoriteService, getProductCacheStub, addFavoriteRepositoryStub } = makeSut();

      jest.spyOn(getProductCacheStub, 'getProduct').mockResolvedValueOnce(fakeProduct);
      const addFavoriteSpy = jest.spyOn(addFavoriteRepositoryStub, 'addFavorite');

      const input = makeFakeInput();
      await addFavoriteService.execute(input);

      expect(addFavoriteSpy).toHaveBeenCalledWith(input.customerId, input.productId);
    });

    it('should return the product if it is found in cache', async () => {
      const { addFavoriteService, getProductCacheStub } = makeSut();
      jest.spyOn(getProductCacheStub, 'getProduct').mockResolvedValueOnce(fakeProduct);

      const input = makeFakeInput();
      const product = await addFavoriteService.execute(input);

      expect(product).toEqual(fakeProduct);
    });
  });
});
