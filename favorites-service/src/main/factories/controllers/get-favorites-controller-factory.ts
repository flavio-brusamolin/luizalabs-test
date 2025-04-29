import { GetFavoritesService } from '../../../app/services/get-favorites-service';
import { ProductCache } from '../../../infra/cache/product-cache';
import { CustomerRepository } from '../../../infra/database/customer-repository';
import { AmqpProvider } from '../../../infra/queue/amqp-provider';
import { MessageQueueClient } from '../../../infra/queue/message-queue-client';
import { Controller } from '../../../interfaces/http/controllers/controller';
import { GetFavoritesController } from '../../../interfaces/http/controllers/get-favorites-controller';

export const buildGetFavoritesController = (): Controller => {
  const customerRepository = new CustomerRepository();
  const productCache = new ProductCache();
  const messageQueueClient = new MessageQueueClient(new AmqpProvider());
  const getFavoritesService = new GetFavoritesService(customerRepository, productCache, messageQueueClient);
  return new GetFavoritesController(getFavoritesService);
};
