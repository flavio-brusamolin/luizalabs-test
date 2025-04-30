import env from '../../config/env';
import { AddFavoriteService } from '../../../app/services/add-favorite-service';
import { ProductApiClient } from '../../../infra/integration/product-api-client';
import { ProductCache } from '../../../infra/cache/product-cache';
import { CustomerRepository } from '../../../infra/database/customer-repository';
import { AmqpProvider } from '../../../infra/queue/amqp-provider';
import { MessageQueueClient } from '../../../infra/queue/message-queue-client';
import { Controller } from '../../../interfaces/http/controllers/controller';
import { AddFavoriteController } from '../../../interfaces/http/controllers/add-favorite-controller';

export const buildAddFavoriteController = (): Controller => {
  const customerRepository = new CustomerRepository();
  const productCache = new ProductCache(env.cacheConfig.staleTime);
  const productApiClient = new ProductApiClient(env.integrationConfig.productApiUrl);
  const messageQueueClient = new MessageQueueClient(new AmqpProvider());

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
