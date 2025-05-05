import env from './config/env';
import { AmqpProvider } from '../infra/queue/amqp-provider';
import { HttpServer } from '../infra/server/http-server';
import { setupRoutes } from './config/routes';
import { setupQueues } from './config/queues';

class Application {
  private async initMessageQueue(): Promise<void> {
    const amqpProvider = new AmqpProvider();
    await amqpProvider.init(env.amqpConfig);
    setupQueues(amqpProvider);
  }

  private initServer(): void {
    const httpServer = new HttpServer();
    const routes = setupRoutes(httpServer);
    httpServer.docs(routes);
    httpServer.listen(env.serverConfig.port);
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
