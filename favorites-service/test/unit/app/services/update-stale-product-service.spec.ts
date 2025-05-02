import { UpdateStaleProductService } from '../../../../src/app/services/update-stale-product-service';
import { GetProductClient } from '../../../../src/app/contracts/integration';
import { UpdateProductCache } from '../../../../src/app/contracts/cache';
import { PublishRemovedProductQueue } from '../../../../src/app/contracts/queue';
import { Product } from '../../../../src/domain/entities/product';

const makeFakeInput = () => ({
  productId: 'valid_product_id',
});

const fakeProduct = new Product({
  productId: 'any_product_id',
  title: 'any_product_title',
  image: 'http://any_image.com',
  price: 200,
});

const makeGetProductClient = (): GetProductClient => {
  class GetProductClientStub implements GetProductClient {
    async getProduct(_productId: string): Promise<Product> {
      return fakeProduct;
    }
  }

  return new GetProductClientStub();
};

const makePublishRemovedProductQueue = (): PublishRemovedProductQueue => {
  class PublishRemovedProductQueueStub implements PublishRemovedProductQueue {
    async publishRemovedProduct(_productId: string): Promise<void> {}
  }

  return new PublishRemovedProductQueueStub();
};

const makeUpdateProductCache = (): UpdateProductCache => {
  class UpdateProductCacheStub implements UpdateProductCache {
    async updateProduct(_product: Product): Promise<void> {}
  }

  return new UpdateProductCacheStub();
};

interface SutTypes {
  updateStaleProductService: UpdateStaleProductService;
  getProductClientStub: GetProductClient;
  publishRemovedProductQueueStub: PublishRemovedProductQueue;
  updateProductCacheStub: UpdateProductCache;
}

const makeSut = (): SutTypes => {
  const getProductClientStub = makeGetProductClient();
  const publishRemovedProductQueueStub = makePublishRemovedProductQueue();
  const updateProductCacheStub = makeUpdateProductCache();

  const updateStaleProductService = new UpdateStaleProductService(
    getProductClientStub,
    publishRemovedProductQueueStub,
    updateProductCacheStub
  );

  return {
    updateStaleProductService,
    getProductClientStub,
    publishRemovedProductQueueStub,
    updateProductCacheStub,
  };
};

describe('UpdateStaleProductService', () => {
  describe('#execute', () => {
    it('should call GetProductClient with correct values', async () => {
      const { updateStaleProductService, getProductClientStub } = makeSut();
      const getProductSpy = jest.spyOn(getProductClientStub, 'getProduct');

      const input = makeFakeInput();
      await updateStaleProductService.execute(input);

      expect(getProductSpy).toHaveBeenCalledWith(input.productId);
    });

    it('should call PublishRemovedProductQueue if product is not found', async () => {
      const { updateStaleProductService, getProductClientStub, publishRemovedProductQueueStub } = makeSut();

      jest.spyOn(getProductClientStub, 'getProduct').mockResolvedValueOnce(null);
      const publishRemovedProductSpy = jest.spyOn(publishRemovedProductQueueStub, 'publishRemovedProduct');

      const input = makeFakeInput();
      await updateStaleProductService.execute(input);

      expect(publishRemovedProductSpy).toHaveBeenCalledWith(input.productId);
    });

    it('should call UpdateProductCache with correct values if product is found', async () => {
      const { updateStaleProductService, updateProductCacheStub } = makeSut();
      const updateProductSpy = jest.spyOn(updateProductCacheStub, 'updateProduct');

      const input = makeFakeInput();
      await updateStaleProductService.execute(input);

      expect(updateProductSpy).toHaveBeenCalledWith(fakeProduct);
    });
  });
});
