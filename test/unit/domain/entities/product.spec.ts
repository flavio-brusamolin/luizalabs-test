import { Product } from '../../../../src/domain/entities/product';

const makeFakeInput = () => ({
  productId: 'valid_product_id',
  title: 'valid_product_title',
  image: 'http://valid_image_url.com',
  price: 100,
  reviewScore: 4.5,
});

describe('Product Entity', () => {
  describe('constructor', () => {
    it('should create a product with valid input', () => {
      const input = makeFakeInput();
      const product = new Product(input);

      expect(product.productId).toBe(input.productId);
      expect(product.title).toBe(input.title);
      expect(product.image).toBe(input.image);
      expect(product.price).toBe(input.price);
      expect(product.reviewScore).toBe(input.reviewScore);
    });

    it('should set stale to false by default', () => {
      const input = makeFakeInput();
      const product = new Product(input);

      expect(product.stale).toBe(false);
    });

    it('should allow reviewScore to be undefined', () => {
      const input = makeFakeInput();
      delete input.reviewScore;
      const product = new Product(input);

      expect(product.reviewScore).toBeUndefined();
    });
  });

  describe('markAsStale', () => {
    it('should mark the product as stale', () => {
      const input = makeFakeInput();
      const product = new Product(input);

      product.markAsStale();

      expect(product.stale).toBe(true);
    });
  });
});
