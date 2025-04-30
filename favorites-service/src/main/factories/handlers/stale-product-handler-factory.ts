import { UpdateStaleProductService } from '../../../app/services/update-stale-product-service';
import { Handler } from '../../../interfaces/amqp/handlers/handler';
import { StaleProductHandler } from '../../../interfaces/amqp/handlers/stale-product-handler';
import { buildMessageQueueClient, buildProductApiClient, buildProductCache } from '../infra';

export const buildStaleProductHandler = (): Handler => {
  const productApiClient = buildProductApiClient();
  const messageQueueClient = buildMessageQueueClient();
  const productCache = buildProductCache();
  const updateStaleProductService = new UpdateStaleProductService(productApiClient, messageQueueClient, productCache);
  return new StaleProductHandler(updateStaleProductService);
};
