import { HttpServer } from '../../infra/server/http-server';
import { Route } from '../../infra/server/route';
import {
  AddCustomerSchema,
  AddFavoriteSchema,
  AuthenticateCustomerSchema,
  GetFavoritesSchema,
  RemoveFavoriteSchema,
  UpdateCustomerSchema,
} from '../../infra/validation/schemas';
import { Middleware } from '../../interfaces/http/middlewares/middleware';
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

const routes: Route[] = [
  {
    method: 'post',
    path: '/signup',
    controller: buildAddCustomerController(),
    schema: AddCustomerSchema,
    auth: false,
    summary: 'Register customer',
    tag: 'Auth',
    responses: {
      201: { description: 'Customer registered' },
      409: { description: 'Email already registered' },
      500: { description: 'Internal server error' },
    },
  },
  {
    method: 'post',
    path: '/signin',
    controller: buildAuthenticateCustomerController(),
    schema: AuthenticateCustomerSchema,
    auth: false,
    summary: 'Authenticate customer',
    tag: 'Auth',
    responses: {
      200: { description: 'Customer authenticated' },
      401: { description: 'Authentication failed' },
      500: { description: 'Internal server error' },
    },
  },
  {
    method: 'get',
    path: '/me',
    controller: buildGetCustomerController(),
    auth: true,
    summary: 'Get authenticated customer',
    tag: 'Customer',
    responses: {
      200: { description: 'Authenticated customer' },
      401: { description: 'Authentication failed' },
      404: { description: 'Customer not found' },
      500: { description: 'Internal server error' },
    },
  },
  {
    method: 'patch',
    path: '/me',
    controller: buildUpdateCustomerController(),
    schema: UpdateCustomerSchema,
    auth: true,
    summary: 'Update authenticated customer',
    tag: 'Customer',
    responses: {
      200: { description: 'Customer updated' },
      401: { description: 'Authentication failed' },
      404: { description: 'Customer not found' },
      409: { description: 'Email already registered' },
      500: { description: 'Internal server error' },
    },
  },
  {
    method: 'delete',
    path: '/me',
    controller: buildRemoveCustomerController(),
    auth: true,
    summary: 'Remove authenticated customer',
    tag: 'Customer',
    responses: {
      204: { description: 'Customer removed' },
      401: { description: 'Authentication failed' },
      404: { description: 'Customer not found' },
      500: { description: 'Internal server error' },
    },
  },
  {
    method: 'post',
    path: '/favorites',
    controller: buildAddFavoriteController(),
    schema: AddFavoriteSchema,
    auth: true,
    summary: 'Add favorite',
    tag: 'Favorites',
    responses: {
      201: { description: 'Favorite created' },
      401: { description: 'Authentication failed' },
      404: { description: 'Product not found' },
      409: { description: 'Product already favorited' },
      500: { description: 'Internal server error' },
    },
  },
  {
    method: 'get',
    path: '/favorites',
    controller: buildGetFavoritesController(),
    schema: GetFavoritesSchema,
    auth: true,
    summary: 'Get favorites',
    tag: 'Favorites',
    responses: {
      200: { description: 'Customer favorites' },
      401: { description: 'Authentication failed' },
      404: { description: 'Customer not found' },
      500: { description: 'Internal server error' },
    },
  },
  {
    method: 'delete',
    path: '/favorites/:productId',
    controller: buildRemoveFavoriteController(),
    schema: RemoveFavoriteSchema,
    auth: true,
    summary: 'Remove favorite',
    tag: 'Favorites',
    responses: {
      204: { description: 'Favorite removed' },
      401: { description: 'Authentication failed' },
      404: { description: 'Favorite not found' },
      500: { description: 'Internal server error' },
    },
  },
];

export const setupRoutes = (httpServer: HttpServer): Route[] => {
  const authMiddleware = buildAuthenticationMiddleware();

  for (const route of routes) {
    const middlewares: Middleware[] = [];

    if (route.auth) {
      middlewares.push(authMiddleware);
    }

    if (route.schema) {
      middlewares.push(buildValidationMiddleware(route.schema));
    }

    httpServer.on(route.method, route.path, route.controller, middlewares);
  }

  return routes;
};
