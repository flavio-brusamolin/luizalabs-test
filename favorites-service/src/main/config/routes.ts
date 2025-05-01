import { HttpServer } from '../../infra/server/http-server';
import {
  AddCustomerSchema,
  AddFavoriteSchema,
  AuthenticateCustomerSchema,
  RemoveFavoriteSchema,
  UpdateCustomerSchema,
} from '../../infra/validation/schemas';
import {
  buildAddCustomerController,
  buildAddFavoriteController,
  buildAuthenticateCustomerController,
  buildGetCustomerController,
  buildGetFavoritesController,
  buildRemoveCustomerController,
  buildRemoveFavoriteController,
  buildUpdateCustomerController,
} from '../factories/controllers';
import { buildAuthenticationMiddleware } from '../factories/middlewares';
import { buildValidationMiddleware } from '../factories/middlewares/validation-middleware-factory';

export const setupRoutes = (httpServer: HttpServer): void => {
  const authenticationMiddleware = buildAuthenticationMiddleware();
  
  // Auth
  httpServer.on('post', '/signup', buildAddCustomerController(), [
    buildValidationMiddleware(AddCustomerSchema)
  ]);

  httpServer.on('post', '/signin', buildAuthenticateCustomerController(), [
    buildValidationMiddleware(AuthenticateCustomerSchema)
  ]);

  // Customer
  httpServer.on('get', '/me', buildGetCustomerController(), [
    authenticationMiddleware
  ]);

  httpServer.on('patch', '/me', buildUpdateCustomerController(), [
    authenticationMiddleware,
    buildValidationMiddleware(UpdateCustomerSchema),
  ]);

  httpServer.on('delete', '/me', buildRemoveCustomerController(), [
    authenticationMiddleware
  ]);

  // Favorites
  httpServer.on('post', '/favorites', buildAddFavoriteController(), [
    authenticationMiddleware,
    buildValidationMiddleware(AddFavoriteSchema),
  ]);

  httpServer.on('get', '/favorites', buildGetFavoritesController(), [
    authenticationMiddleware
  ]);
  
  httpServer.on('delete', '/favorites/:productId', buildRemoveFavoriteController(), [
    authenticationMiddleware,
    buildValidationMiddleware(RemoveFavoriteSchema),
  ]);
};
