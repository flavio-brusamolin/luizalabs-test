import env from '../../config/env';
import { UpdateStaleProductService } from '../../../app/services/update-stale-product-service';
import { ProductApiClient } from '../../../infra/integration/product-api-client';
import { ProductCache } from '../../../infra/cache/product-cache';
import { MessageQueueClient } from '../../../infra/queue/message-queue-client';
import { Handler } from '../../../interfaces/amqp/handlers/handler';
import { StaleProductHandler } from '../../../interfaces/amqp/handlers/stale-product-handler';
import { AmqpProvider } from '../../../infra/queue/amqp-provider';

export const buildStaleProductHandler = (): Handler => {
  const productApiClient = new ProductApiClient(env.integrationConfig.productApiUrl);
  const messageQueueClient = new MessageQueueClient(new AmqpProvider());
  const productCache = new ProductCache(env.cacheConfig.staleTime);
  const updateStaleProductService = new UpdateStaleProductService(productApiClient, messageQueueClient, productCache);
  return new StaleProductHandler(updateStaleProductService);
};
