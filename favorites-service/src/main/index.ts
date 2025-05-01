import env from './config/env';
import queues from '../infra/queue/queues';
import { AmqpProvider } from '../infra/queue/amqp-provider';
import { HttpServer } from '../infra/server/http-server';
import { buildStaleProductHandler, buildRemovedProductHandler, buildCreatedCustomerHandler } from './factories/handlers';
import {
  buildAddCustomerController,
  buildAddFavoriteController,
  buildAuthenticateCustomerController,
  buildGetCustomerController,
  buildGetFavoritesController,
  buildRemoveCustomerController,
  buildRemoveFavoriteController,
  buildUpdateCustomerController,
} from './factories/controllers';
import { buildAuthenticationMiddleware } from './factories/middlewares';

class Application {
  private amqpProvider: AmqpProvider;
  private httpServer: HttpServer;

  private async initMessageQueue(): Promise<void> {
    this.amqpProvider = new AmqpProvider();
    await this.amqpProvider.init(env.amqpConfig);
    this.setupQueues();
  }

  private initServer(): void {
    this.httpServer = new HttpServer();
    this.setupRoutes();
    this.httpServer.listen(env.serverConfig.port);
  }

  private setupQueues(): void {
    this.amqpProvider.subscribe(queues.STALE_PRODUCT, buildStaleProductHandler());
    this.amqpProvider.subscribe(queues.REMOVED_PRODUCT, buildRemovedProductHandler());
    this.amqpProvider.subscribe(queues.CREATED_CUSTOMER, buildCreatedCustomerHandler());
  }

  private setupRoutes(): void {
    const authenticationMiddleware = buildAuthenticationMiddleware();
    this.httpServer.on('post', '/signup', buildAddCustomerController());
    this.httpServer.on('post', '/signin', buildAuthenticateCustomerController());
    this.httpServer.on('get', '/me', buildGetCustomerController(), authenticationMiddleware);
    this.httpServer.on('patch', '/me', buildUpdateCustomerController(), authenticationMiddleware);
    this.httpServer.on('delete', '/me', buildRemoveCustomerController(), authenticationMiddleware);
    this.httpServer.on('post', '/favorites', buildAddFavoriteController(), authenticationMiddleware);
    this.httpServer.on('get', '/favorites', buildGetFavoritesController(), authenticationMiddleware);
    this.httpServer.on('delete', '/favorites/:productId', buildRemoveFavoriteController(), authenticationMiddleware);
  }

  async init(): Promise<void> {
    try {
      await this.initMessageQueue();
      this.initServer();
    } catch (error) {
      console.error(error);
    }
  }
}

new Application().init();
