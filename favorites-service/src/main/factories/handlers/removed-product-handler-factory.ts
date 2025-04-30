import env from '../../config/env';
import { Handler } from '../../../interfaces/amqp/handlers/handler';
import { RemovedProductHandler } from '../../../interfaces/amqp/handlers/removed-product-handler';
import { ProductCache } from '../../../infra/cache/product-cache';
import { CustomerRepository } from '../../../infra/database/customer-repository';
import { PurgeRemovedProductService } from '../../../app/services/purge-removed-product-service';

export const buildRemovedProductHandler = (): Handler => {
  const customerRepository = new CustomerRepository();
  const productCache = new ProductCache(env.cacheConfig.staleTime);
  const purgeRemovedProductService = new PurgeRemovedProductService(customerRepository, productCache);
  return new RemovedProductHandler(purgeRemovedProductService);
};
