import { RemoveFavoriteService } from '../../../app/services/remove-favorite-service';
import { CustomerRepository } from '../../../infra/database/customer-repository';
import { Controller } from '../../../interfaces/http/controllers/controller';
import { RemoveFavoriteController } from '../../../interfaces/http/controllers/remove-favorite-controller';

export const buildRemoveFavoriteController = (): Controller => {
  const customerRepository = new CustomerRepository();
  const removeFavoriteService = new RemoveFavoriteService(customerRepository, customerRepository);
  return new RemoveFavoriteController(removeFavoriteService);
};
