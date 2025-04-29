import env from './config/env';
import { AmqpProvider } from '../infra/queue/amqp-provider';
import { HttpServer } from '../infra/server/http-server';
import { buildStaleProductHandler, buildRemovedProductHandler } from './factories/handlers';
import { buildAddFavoriteController, buildGetFavoritesController, buildRemoveFavoriteController } from './factories/controllers';

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
    this.httpServer.listen(env.port);
  }

  private setupQueues(): void {
    this.amqpProvider.subscribe('stale-product', buildStaleProductHandler());
    this.amqpProvider.subscribe('removed-product', buildRemovedProductHandler());
  }

  private setupRoutes(): void {
    this.httpServer.on('post', '/customers/:customerId/favorites', buildAddFavoriteController());
    this.httpServer.on('get', '/customers/:customerId/favorites', buildGetFavoritesController());
    this.httpServer.on('delete', '/customers/:customerId/favorites/:productId', buildRemoveFavoriteController());
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
