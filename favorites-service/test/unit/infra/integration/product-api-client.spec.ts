import { ProductApiClient } from '../../../../src/infra/integration/product-api-client';
import { Product } from '../../../../src/domain/entities/product';
import axios from 'axios';

jest.mock('axios', () => {
  const getSpy = jest.fn().mockResolvedValue({
    data: {
      id: 'valid_product_id',
      title: 'valid_product_title',
      price: 100,
      image: 'http://valid_image_url.com',
      brand: 'valid_brand',
      reviewScore: 4.5,
    },
  });

  return {
    create: () => ({ get: getSpy }),
    __getSpy: getSpy,
  };
});

const makeFakeProduct = () => {
  return new Product({
    productId: 'valid_product_id',
    title: 'valid_product_title',
    price: 100,
    image: 'http://valid_image_url.com',
    reviewScore: 4.5,
  });
};

const makeSut = () => {
  const baseURL = 'http://api.example.com';
  const productApiClient = new ProductApiClient(baseURL);
  return {
    productApiClient,
    getSpy: (axios as any).__getSpy,
  };
};

describe('ProductApiClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('#getProduct', () => {
    it('should call external API with the correct URL', async () => {
      const { productApiClient, getSpy } = makeSut();

      await productApiClient.getProduct('valid_product_id');

      expect(getSpy).toHaveBeenCalledWith('/products/valid_product_id');
    });

    it('should return a entity product when the external API returns a valid product', async () => {
      const { productApiClient } = makeSut();

      const product = await productApiClient.getProduct('valid_product_id');

      expect(product).toEqual(makeFakeProduct());
    });

    it('should return null if the external API returns 404', async () => {
      const { productApiClient, getSpy } = makeSut();

      const error = { status: 404, message: 'Product not found' };
      getSpy.mockRejectedValue(error);

      const product = await productApiClient.getProduct('non_existent_product_id');

      expect(product).toBeNull();
    });

    it('should throw if the API returns a non-404 error', async () => {
      const { productApiClient, getSpy } = makeSut();

      const error = { status: 500, message: 'Internal Server Error' };
      getSpy.mockRejectedValue(error);

      const promise = productApiClient.getProduct('any_product_id');

      await expect(promise).rejects.toEqual(error);
    });
  });
});
