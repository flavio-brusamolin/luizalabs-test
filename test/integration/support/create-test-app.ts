import { Express } from 'express';
import { HttpServer } from '../../../src/infra/server/http-server';
import { setupRoutes } from '../../../src/main/config/routes';
import { Product } from '../../../src/domain/entities/product';

jest.mock('../../../src/infra/queue/amqp-provider', () => {
  return {
    AmqpProvider: class {
      async init(): Promise<void> {}
      subscribe(): void {}
      publish(): boolean {
        return true;
      }
    },
  };
});

jest.mock('../../../src/infra/integration/product-api-client', () => {
  return {
    ProductApiClient: class {
      async getProduct(productId: string): Promise<Product> {
        const existentProductId = '5db40d1b-6609-4d56-b20e-eb00e53b6299';

        if (productId === existentProductId) {
          return new Product({
            productId: existentProductId,
            title: 'Test product',
            image: 'http://example.com/image.jpg',
            price: 100,
            reviewScore: 4.5,
          });
        }

        return null;
      }
    },
  };
});

export async function createTestApp(): Promise<Express> {
  const httpServer = new HttpServer();
  setupRoutes(httpServer);
  return httpServer.getApp();
}
