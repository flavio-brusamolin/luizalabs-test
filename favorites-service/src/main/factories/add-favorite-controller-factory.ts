import env from '../config/env';
import { AddFavoriteService } from '../../app/services/add-favorite-service';
import { ProductApiClient } from '../../infra/api/product-api-client';
import { ProductCache } from '../../infra/cache/product-cache';
import { CustomerRepository } from '../../infra/database/customer-repository';
import { AmqpProvider } from '../../infra/queue/amqp-provider';
import { MessageQueueClient } from '../../infra/queue/message-queue-client';
import { Controller } from '../../interfaces/http/controllers/controller';
import { AddFavoriteController } from '../../interfaces/http/controllers/add-favorite-controller';

export const buildAddFavoriteController = (): Controller => {
  const customerRepository = new CustomerRepository();
  const productCache = new ProductCache();
  const productApiClient = new ProductApiClient(env.productApiUrl);
  const amqpProvider = new AmqpProvider();
  const messageQueueClient = new MessageQueueClient(amqpProvider);

  const addFavoriteService = new AddFavoriteService(
    customerRepository,
    productCache,
    customerRepository,
    messageQueueClient,
    productApiClient,
    productCache
  );

  return new AddFavoriteController(addFavoriteService);
};
