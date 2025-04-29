import env from '../config/env';
import { UpdateStaleProductService } from '../../app/services/update-stale-product-service';
import { ProductApiClient } from '../../infra/api/product-api-client';
import { ProductCache } from '../../infra/cache/product-cache';
import { MessageQueueClient } from '../../infra/queue/message-queue-client';
import { Handler } from '../../interfaces/amqp/handlers/handler';
import { StaleProductHandler } from '../../interfaces/amqp/handlers/stale-product-handler';
import { AmqpProvider } from '../../infra/queue/amqp-provider';

export const buildStaleProductHandler = (): Handler => {
  const productApiClient = new ProductApiClient(env.productApiUrl);
  const amqpProvider = new AmqpProvider();
  const messageQueueClient = new MessageQueueClient(amqpProvider);
  const productCache = new ProductCache();
  const updateStaleProductService = new UpdateStaleProductService(productApiClient, messageQueueClient, productCache);
  return new StaleProductHandler(updateStaleProductService);
};
