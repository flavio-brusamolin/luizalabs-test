import { Handler } from '../../../interfaces/amqp/handlers/handler';
import { RemovedProductHandler } from '../../../interfaces/amqp/handlers/removed-product-handler';
import { PurgeRemovedProductService } from '../../../app/services/purge-removed-product-service';
import { buildCustomerRepository, buildProductCache } from '../infra';

export const buildRemovedProductHandler = (): Handler => {
  const customerRepository = buildCustomerRepository();
  const productCache = buildProductCache();
  const purgeRemovedProductService = new PurgeRemovedProductService(customerRepository, productCache);
  return new RemovedProductHandler(purgeRemovedProductService);
};
