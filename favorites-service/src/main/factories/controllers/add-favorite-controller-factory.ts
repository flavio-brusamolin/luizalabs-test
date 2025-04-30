import { AddFavoriteService } from '../../../app/services/add-favorite-service';
import { Controller } from '../../../interfaces/http/controllers/controller';
import { AddFavoriteController } from '../../../interfaces/http/controllers/add-favorite-controller';
import { buildCustomerRepository, buildMessageQueueClient, buildProductApiClient, buildProductCache } from '../infra';

export const buildAddFavoriteController = (): Controller => {
  const customerRepository = buildCustomerRepository();
  const productCache = buildProductCache();
  const productApiClient = buildProductApiClient();
  const messageQueueClient = buildMessageQueueClient();

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
