import { ProductCache } from '../../../../src/infra/cache/product-cache';
import { Product } from '../../../../src/domain/entities/product';

const makeFakeProduct = (): Product => {
  return new Product({
    productId: 'valid_product_id',
    title: 'valid_product_title',
    image: 'http://valid_image_url.com',
    price: 100,
    reviewScore: 4.5,
  });
};

const makeSut = () => {
  const staleTime = 1000;
  const productCache = new ProductCache(staleTime);
  return { productCache, staleTime };
};

describe('ProductCache', () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  describe('#addProduct', () => {
    it('should add the product in cache', async () => {
      const { productCache } = makeSut();

      const product = makeFakeProduct();
      await productCache.addProduct(product);

      const cachedProduct = await productCache.getProduct(product.productId);
      expect(cachedProduct).toEqual(product);
    });

    it('should set a stale timer for the product', async () => {
      const { productCache, staleTime } = makeSut();

      jest.useFakeTimers();

      const product = makeFakeProduct();
      await productCache.addProduct(product);

      jest.advanceTimersByTime(staleTime);

      const cachedProduct = await productCache.getProduct(product.productId);
      expect(cachedProduct?.stale).toBe(true);
    });
  });

  describe('#updateProduct', () => {
    it('should update an existing product in the cache', async () => {
      const { productCache } = makeSut();

      const product = makeFakeProduct();
      await productCache.addProduct(product);

      const updatedProduct = new Product({ ...product, title: 'updated_title' });
      await productCache.updateProduct(updatedProduct);

      const cachedProduct = await productCache.getProduct(product.productId);
      expect(cachedProduct?.title).toBe('updated_title');
    });

    it('should reset the stale status when updating a product', async () => {
      const { productCache, staleTime } = makeSut();

      jest.useFakeTimers();

      const product = makeFakeProduct();
      await productCache.addProduct(product);

      jest.advanceTimersByTime(staleTime);

      const cachedProduct = await productCache.getProduct(product.productId);
      expect(cachedProduct?.stale).toBe(true);

      const updatedProduct = new Product({ ...product, title: 'updated_title' });
      await productCache.updateProduct(updatedProduct);

      const cachedUpdatedProduct = await productCache.getProduct(product.productId);
      expect(cachedUpdatedProduct?.stale).toBe(false);
    });
  });

  describe('#getProduct', () => {
    it('should return the product if it exists in cache', async () => {
      const { productCache } = makeSut();

      const product = makeFakeProduct();
      await productCache.addProduct(product);

      const cachedProduct = await productCache.getProduct(product.productId);
      expect(cachedProduct).toEqual(product);
    });

    it('should return undefined if the product does not exist in cache', async () => {
      const { productCache } = makeSut();

      const cachedProduct = await productCache.getProduct('non_existent_product_id');
      expect(cachedProduct).toBeUndefined();
    });
  });

  describe('#removeProduct', () => {
    it('should remove the product from cache', async () => {
      const { productCache } = makeSut();

      const product = makeFakeProduct();
      await productCache.addProduct(product);

      await productCache.removeProduct(product.productId);

      const cachedProduct = await productCache.getProduct(product.productId);
      expect(cachedProduct).toBeUndefined();
    });
  });
});
