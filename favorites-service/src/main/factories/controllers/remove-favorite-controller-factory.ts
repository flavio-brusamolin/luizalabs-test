import { RemoveFavoriteService } from '../../../app/services/remove-favorite-service';
import { Controller } from '../../../interfaces/http/controllers/controller';
import { RemoveFavoriteController } from '../../../interfaces/http/controllers/remove-favorite-controller';
import { buildCustomerRepository } from '../infra';

export const buildRemoveFavoriteController = (): Controller => {
  const customerRepository = buildCustomerRepository();
  const removeFavoriteService = new RemoveFavoriteService(customerRepository, customerRepository);
  return new RemoveFavoriteController(removeFavoriteService);
};
