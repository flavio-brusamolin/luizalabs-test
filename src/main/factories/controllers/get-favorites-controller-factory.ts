import { GetFavoritesService } from '../../../app/services/get-favorites-service';
import { Controller } from '../../../interfaces/http/controllers/controller';
import { GetFavoritesController } from '../../../interfaces/http/controllers/get-favorites-controller';
import { buildCustomerRepository, buildMessageQueueClient, buildProductCache } from '../infra';

export const buildGetFavoritesController = (): Controller => {
  const customerRepository = buildCustomerRepository();
  const productCache = buildProductCache();
  const messageQueueClient = buildMessageQueueClient();
  const getFavoritesService = new GetFavoritesService(customerRepository, productCache, messageQueueClient);
  return new GetFavoritesController(getFavoritesService);
};
